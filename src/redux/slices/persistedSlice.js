import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  profileData: undefined,
};

const persistedSlice = createSlice({
  name: 'persist',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    resetPersistStore: () => initialState,
  },
});

export const {
  setToken,
  resetPersistStore,
  setProfileData,
} = persistedSlice.actions;

export default persistedSlice.reducer;
