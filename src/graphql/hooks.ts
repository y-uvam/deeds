import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_FEED, LIKE_POST, UNLIKE_POST } from './operations';
import { networkStatus, offlineQueue, flushOfflineQueue } from './client';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(networkStatus.isOnline());

  useEffect(() => {
    const unsub = networkStatus.subscribe(setIsOnline);
    return () => {
      unsub();
    };
  }, []);

  return { isOnline };
};

export const useSyncState = () => {
  const [pendingCount, setPendingCount] = useState(offlineQueue.count());
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    const interval = setInterval(() => {
      setPendingCount(offlineQueue.count());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return {
    pendingCount,
    isOnline,
    flush: flushOfflineQueue,
  };
};

export const useFeed = (limit = 15) => {
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_FEED, {
    variables: { limit },
    notifyOnNetworkStatusChange: true,
  });

  const posts = (data as any)?.feed?.edges || [];
  const pageInfo = (data as any)?.feed?.pageInfo;
  const hasNextPage = Boolean(pageInfo?.hasNextPage);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch({ limit, cursor: null });
    } finally {
      setRefreshing(false);
    }
  }, [refetch, limit]);

  const loadMore = useCallback(() => {
    if (!hasNextPage || loading || refreshing) return;
    fetchMore({
      variables: {
        limit,
        cursor: pageInfo?.endCursor,
      },
    });
  }, [hasNextPage, loading, refreshing, fetchMore, limit, pageInfo?.endCursor]);

  return {
    posts,
    loading,
    refreshing,
    error,
    onRefresh,
    loadMore,
    hasNextPage,
  };
};

export const useOptimisticLike = () => {
  const [likeMutation] = useMutation(LIKE_POST);
  const [unlikeMutation] = useMutation(UNLIKE_POST);

  const toggleLike = async (post: { _id: string; isLiked: boolean; likesCount: number }) => {
    const nextIsLiked = !post.isLiked;
    const nextLikesCount = nextIsLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);

    if (nextIsLiked) {
      return likeMutation({
        variables: { postId: post._id },
        optimisticResponse: {
          likePost: {
            __typename: 'Post',
            _id: post._id,
            isLiked: true,
            likesCount: nextLikesCount,
          },
        },
      });
    }

    return unlikeMutation({
      variables: { postId: post._id },
      optimisticResponse: {
        unlikePost: {
          __typename: 'Post',
          _id: post._id,
          isLiked: false,
          likesCount: nextLikesCount,
        },
      },
    });
  };

  return { toggleLike };
};
