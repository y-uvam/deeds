import { Method } from "../services/apiMethod";
import { emptySplitApi, header1 } from "../services/rtkquery";
import { apiEndPoint } from "./apiEndPoint";

export const Api = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    //Auth
    Login: Method.POST(builder, apiEndPoint.login, header1),
    Logout: Method.PATCH(builder, apiEndPoint.logout, header1),
    ForgotPassword: Method.POST(builder, apiEndPoint.forgotpassword, header1),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
} = Api;
