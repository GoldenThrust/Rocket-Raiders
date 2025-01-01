import axios, { type CancelTokenSource } from "axios";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { setAuthenticationState } from "~/redux/authenticationSlice";

export default function Logout() {
  const source: CancelTokenSource = axios.CancelToken.source();

  useEffect(() => {
    const logout = async (): Promise<void> => {
      try {
        await axios.get(`/auth/logout`, {
          cancelToken: source.token, // Attach cancel token to the request
        });
        setAuthenticationState(false);
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.warn("Logout request canceled.");
        } else {
          console.error("Logout failed:", error);
        }
      }
    };

    logout();

    return () => source.cancel();
  }, []);
  return (
    <div className="flex justify-center items-center h-screen">
      <Navigate to={"/auth/login"} replace={true} />
    </div>
  );
}
