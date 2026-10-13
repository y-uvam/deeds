import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { AppState } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { print } from 'graphql';
import { API_BASE_URL } from '@env';
import { storage, tokenManager } from '../helper/createMMKV';

const GRAPHQL_URI = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/api\/v1\/?$/, '')}/graphql`
  : 'http://192.168.3.121:7007/graphql';

const CACHE_STORAGE_KEY = 'deeds_apollo_cache_v1';
const QUEUE_STORAGE_KEY = 'deeds_offline_queue_v1';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          keyArgs: false,
          merge(existing = { edges: [] }, incoming, { readField }) {
            const existingEdges = existing?.edges || [];
            const incomingEdges = incoming?.edges || [];
            const map = new Map();
            existingEdges.forEach((edge: any) => {
              const id = readField('_id', edge) || readField('id', edge);
              if (id) map.set(id, edge);
            });
            incomingEdges.forEach((edge: any) => {
              const id = readField('_id', edge) || readField('id', edge);
              if (id) map.set(id, edge);
            });
            return {
              ...incoming,
              edges: Array.from(map.values()),
            };
          },
        },
      },
    },
    Post: {
      keyFields: (item) => (item._id ? ['_id'] : ['id']),
    },
    User: {
      keyFields: (item) => (item._id ? ['_id'] : ['id']),
    },
    Comment: {
      keyFields: (item) => (item._id ? ['_id'] : ['id']),
    },
  },
});

try {
  const cachedData = storage.getString(CACHE_STORAGE_KEY);
  if (cachedData) {
    cache.restore(JSON.parse(cachedData));
  }
} catch {}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const saveCacheToMMKV = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      storage.set(CACHE_STORAGE_KEY, JSON.stringify(cache.extract()));
    } catch {}
  }, 1000);
};

AppState.addEventListener('change', (state) => {
  if (state === 'background' || state === 'inactive') {
    try {
      storage.set(CACHE_STORAGE_KEY, JSON.stringify(cache.extract()));
    } catch {}
  }
});

let isDeviceOnline = true;
const listeners = new Set<(online: boolean) => void>();

NetInfo.fetch().then((state) => {
  isDeviceOnline = Boolean(state.isConnected && (state.isInternetReachable ?? true));
});

NetInfo.addEventListener((state: NetInfoState) => {
  const online = Boolean(state.isConnected && (state.isInternetReachable ?? true));
  if (isDeviceOnline !== online) {
    isDeviceOnline = online;
    listeners.forEach((fn) => fn(online));
    if (online) {
      flushOfflineQueue();
    }
  }
});

export const networkStatus = {
  isOnline: () => isDeviceOnline,
  subscribe: (fn: (online: boolean) => void) => {
    listeners.add(fn);
    fn(isDeviceOnline);
    return () => {
      listeners.delete(fn);
    };
  },
};

interface StoredMutation {
  id: string;
  mutation: string;
  variables?: Record<string, any>;
  optimisticResponse?: any;
}

export const offlineQueue = {
  get: (): StoredMutation[] => {
    try {
      const data = storage.getString(QUEUE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  add: (item: Omit<StoredMutation, 'id'>) => {
    const list = offlineQueue.get();
    const entry: StoredMutation = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    storage.set(QUEUE_STORAGE_KEY, JSON.stringify([...list, entry]));
  },
  remove: (id: string) => {
    const list = offlineQueue.get().filter((i) => i.id !== id);
    storage.set(QUEUE_STORAGE_KEY, JSON.stringify(list));
  },
  count: () => offlineQueue.get().length,
};

let isFlushing = false;
export const flushOfflineQueue = async () => {
  if (isFlushing || !isDeviceOnline || !apolloClient) return;
  const list = offlineQueue.get();
  if (list.length === 0) return;

  isFlushing = true;
  for (const item of list) {
    if (!isDeviceOnline) break;
    try {
      await apolloClient.mutate({
        mutation: gql(item.mutation),
        variables: item.variables,
        context: { isSyncing: true },
      });
      offlineQueue.remove(item.id);
    } catch (err: any) {
      if (err?.networkError) break;
      offlineQueue.remove(item.id);
    }
  }
  isFlushing = false;
  saveCacheToMMKV();
};

const authLink = setContext((_, { headers }) => {
  const token = tokenManager.getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ error, operation }) => {
  if (error) {
    const isAuth =
      (error as any)?.graphQLErrors?.some(
        (e: any) => e.extensions?.code === 'UNAUTHENTICATED' || e.message?.toLowerCase().includes('unauthorized')
      ) || error.message?.toLowerCase().includes('unauthorized');

    if (isAuth) {
      tokenManager.clearToken();
    }
  }
});

const retryLink = new RetryLink({
  delay: { initial: 400, max: 4000, jitter: true },
  attempts: {
    max: 3,
    retryIf: (err, op) => {
      if (op.getContext().isSyncing) return false;
      return Boolean(err);
    },
  },
});

const offlineQueueLink = new ApolloLink((operation, forward) => {
  const ctx = operation.getContext();
  const isMutation = operation.query.definitions.some(
    (def) => def.kind === 'OperationDefinition' && def.operation === 'mutation'
  );

  if (isDeviceOnline || !isMutation || ctx.isSyncing) {
    return forward(operation);
  }

  offlineQueue.add({
    mutation: print(operation.query),
    variables: operation.variables,
    optimisticResponse: ctx.optimisticResponse,
  });

  return new Observable<ApolloLink.Result>((observer) => {
    if (ctx.optimisticResponse) {
      observer.next({ data: ctx.optimisticResponse });
    }
    observer.complete();
  });
});

const httpLink = new HttpLink({ uri: GRAPHQL_URI });

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, retryLink, offlineQueueLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  },
});
