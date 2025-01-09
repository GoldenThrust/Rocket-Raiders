import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "~/redux/authenticationSlice";
import matchReducer from "~/redux/matchSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    match: matchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
