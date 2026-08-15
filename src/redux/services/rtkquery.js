import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenManager } from "../../helper/createMMKV";
import { API_BASE_URL, API_IMAGE_URL } from "@env";

export const BASE_URL = API_BASE_URL; //Local
export const IMAGE_URL = API_IMAGE_URL; //Local

export const emptySplitApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    timeout: 60000,
    prepareHeaders: async (headers) => {
      const access_token = tokenManager.getToken();
      if (access_token) {
        headers.set("Authorization", `Bearer ${access_token}`);
      }
      console.log("access_token", access_token);
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});

export const header1 = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const header2 = {
  "Content-Type": "multipart/form-data",
  Accept: "application/json",
};
