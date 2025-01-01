import axios, { type CancelTokenSource } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function Activate() {
  const { crypto } = useParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    let timeout: any = null;

    const activateAccount = async () => {
      try {
        await axios.get(`/auth/activate/${crypto}`, {
          cancelToken: source.token, // Attach cancel token to the request
        });
        timeout = setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (err: any) {
        setError(err?.data?.message || "An error occurred.");
        timeout = setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 2000);
      }
    };
    activateAccount();

    return () => {
      source.cancel();
      clearTimeout(timeout);
    };
  }, [crypto, navigate]);

  return (
    <div className="flex justify-center items-center">
      {error ? (
        <p className="text-red-500 font-bold text-2xl">{error}</p>
      ) : (
        <p className="text-green-500 font-bold text-2xl">
          Account activated successfully. Redirecting in 2 seconds
        </p>
      )}
    </div>
  );
}
