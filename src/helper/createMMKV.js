import { MMKV } from "react-native-mmkv";
import { MMKV_ENCRYPTION_KEY } from "@env";

export const storage = new MMKV({
  id: "secure-app-storage",
  encryptionKey: MMKV_ENCRYPTION_KEY,
});

export const tokenManager = {
  setToken: (token) => {
    storage.set("jwt_token", token);
  },
  getToken: () => {
    return storage.getString("jwt_token");
  },
  clearToken: () => {
    storage.delete("jwt_token");
  },
};
