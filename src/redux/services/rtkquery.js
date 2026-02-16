import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DataManager } from "../../helper/dataManager";

export const BASE_URL = "http://192.168.3.121:7007/api/v1/"; //Local
export const IMAGE_URL = "http://192.168.3.121:7002/"; //Localß

export const emptySplitApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    timeout: 60000,
    prepareHeaders: async (headers, { getState }) => {
      const access_token = await DataManager.getAccessToken();

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
