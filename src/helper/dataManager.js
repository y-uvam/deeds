import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataManagersKeys } from "./dataManagersKeys";

export const DataManager = {
  async setAccessToken(token) {
    return await AsyncStorage.setItem(DataManagersKeys.access_token, token);
  },
  async getAccessToken() {
    const token = await AsyncStorage.getItem(DataManagersKeys.access_token);
    return token;
  },

  async setUserDetails(userDetails) {
    return await AsyncStorage.setItem(
      DataManagersKeys.user_Details,
      JSON.stringify(userDetails)
    );
  },

  async getUserDetails() {
    const userDetails = await AsyncStorage.getItem(
      DataManagersKeys.user_Details
    );
    return JSON.parse(userDetails);
  },
  async clearDataManager() {
    await AsyncStorage.removeItem(DataManagersKeys.access_token);
  },
};
