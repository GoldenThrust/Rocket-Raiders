import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "~/types/user";
import { hostUrl } from "~/utils/constants";

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticationState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserData: (state, action: PayloadAction<any | null>) => {
      const user = action.payload;
      state.user = user;
    },
  },
});

export const { setAuthenticationState, setUserData } = authSlice.actions;

export default authSlice.reducer;
