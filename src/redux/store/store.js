import { configureStore } from "@reduxjs/toolkit";
import { rootSlice } from "../slices/rootSlice";
import { Api } from "../slices/api";

const store = configureStore({
  reducer: rootSlice,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(Api.middleware),
});

export default store;
