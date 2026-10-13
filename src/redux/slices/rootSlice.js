import {combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Api} from '../services/api';
import persistedReducer from './persistedSlice';
import globalReducer from './globalSlice';

const persistConfig = {
  key: 'persist',
  storage: AsyncStorage,
};

const persistValueReducer = persistReducer(persistConfig, persistedReducer);

export const rootSlice = combineReducers({
  [Api.reducerPath]: Api.reducer,
  persist: persistValueReducer,
  global: globalReducer,
});
