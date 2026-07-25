import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  profileData: undefined,
  isLoggedIn: false,
  loginType: null,
};

const persistedSlice = createSlice({
  name: "persist",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setLoginType: (state, action) => {
      state.loginType = action.payload;
    },
    resetPersistStore: () => initialState,
  },
});

export const {
  setToken,
  resetPersistStore,
  setProfileData,
  setIsLoggedIn,
  setLoginType,
} = persistedSlice.actions;

export default persistedSlice.reducer;
