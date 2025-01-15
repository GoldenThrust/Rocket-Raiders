import FormField from "~/components/ui/authentication/Form";
import type { Route } from "./+types/login";
import { ChevronsLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { useAuth } from "~/hooks/auth";
import axios from "axios";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const crypto = data.crypto;

  if (data["c-password"] !== data["password"]) {
    return {
      status: "Error",
      message: "Password do not match",
    };
  }

  try {
    const response = await axios.post(`/auth/reset-password/${crypto}`, {
      password: data.password,
    });

    setTimeout(()=> {
      window.location.href = "/auth/login";
    }, 2000)
    return response.data;
  } catch (error: any) {
    return error?.response?.data;
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const { crypto } = useParams();
  useAuth();

  const formData = [
    {
      type: "password",
      name: "password",
      value: "",
      placeholder: "Password",
    },
    {
      type: "password",
      name: "c-password",
      value: "",
      placeholder: "Confirm Password",
    },
    {
      type: "hidden",
      name: "crypto",
      value: `${crypto}`,
      placeholder: "",
    },
  ];

  return (
    <>
      <nav>
        <Link
          to={"/auth/register"}
          className="flex items-center absolute top-2 left-2"
        >
          <ChevronsLeft />
          Sign Up
        </Link>
      </nav>
      <div>
        <FormField formData={formData} value="Reset Password" />

        {actionData ? (
          actionData.status === "OK" ? (
            <p className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black text-center text-lg font-semibold">
              {actionData.message}. Redirecting in 2 seconds.
            </p>
          ) : (
            <p className="flex justify-center items-center text-red-500">
              {actionData.message}
            </p>
          )
        ) : null}
      </div>
    </>
  );
}
