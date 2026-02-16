import { reset, routesConstants } from "../navigation";
import { DataManager } from "./dataManager";
import { showCustomMessage } from "./FlashMessage";
import { validationConstants } from "../utils";
import networkUtils from "./networkUtils";

export const managerApiCall = async (
  initialCall,
  payload,
  onSuccess,
  onFail = () => {}
) => {
  const isConnected = await networkUtils();
  if (isConnected) {
    try {
      const response = await initialCall(payload || "");
      console.log("THe body", payload);

      console.log("Api Response comming:", response);
      if (response?.error?.status === 401) {
        await DataManager.clearDataManager();
        showCustomMessage(response?.error?.data?.message, "danger");
        reset(routesConstants.Login);
      }

      if (response?.data?.success) {
        onSuccess(response.data);
      } else if (
        response?.error &&
        (response?.error?.status === 403 ||
          response?.error?.status === 401 ||
          response?.error?.status === 400)
      ) {
        console.log("Response-->", response);

        onFail(response?.error?.data?.message);
      } else {
        if (response?.error?.status === "FETCH_ERROR") {
          console.log("Error occurred:", response);
          showCustomMessage(validationConstants.noInternet, "danger");
        } else {
          showCustomMessage(response?.error?.data?.message, "danger");
        }
      }
    } catch (err) {
      console.error("Error occurred:", err);

      showCustomMessage("Something went wrong!", "danger");
    } finally {
    }
  } else {
    showCustomMessage(validationConstants.noInternet, "danger");
  }
};
