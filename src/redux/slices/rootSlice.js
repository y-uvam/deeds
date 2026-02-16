import { combineReducers } from "@reduxjs/toolkit";
import { Api } from "./api";

export const rootSlice = combineReducers({
  [Api.reducerPath]: Api.reducer,
});
