import axios, { type CancelTokenSource } from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { useNotAuth } from "~/hooks/auth";
import {
  setAuthenticationState,
  setUserData,
} from "~/redux/authenticationSlice";

export default function Logout() {
  useNotAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const logout = async (): Promise<void> => {
      try {
        await axios.get(`/auth/logout`);
        dispatch(setAuthenticationState(false));
        navigate("/auth/login", { replace: true });
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.warn("Logout request canceled.");
        } else {
          console.error("Logout failed:", error);
        }
      }
    };

    logout();
  }, []);
  return (
    <div className="flex justify-center items-center h-screen">Logout</div>
  );
}
