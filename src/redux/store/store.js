import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import {rootSlice} from '../slices/rootSlice';
import {Api} from '../services/api';

const store = configureStore({
  reducer: rootSlice,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(Api.middleware),
});

export const persistor = persistStore(store);
export default store;
