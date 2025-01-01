import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { User, UserState } from "~/types/user";

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
    setUserData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthenticationState, setUserData } = authSlice.actions;

export const user = (state: RootState) => state.auth.user;
export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;
