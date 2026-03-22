import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    loadingOn: state => {
      state.isLoading = true;
    },
    loadingOff: state => {
      state.isLoading = false;
    },
    // setSubscriptionChangeStatus: (state, action) => {
    //   state.subscriptionChangeStatus = action.payload;
    // },
  },
});

export const {
  loadingOn,
  loadingOff,
} = globalSlice.actions;

export default globalSlice.reducer;
