import FormField from "~/components/ui/authentication/Form";
import type { Route } from "./+types/login";
import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/auth";
import axios from "axios";


export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await axios.post("/auth/login", data);
    return response?.data;
  } catch (error: any) {
    console.error("Login error:", error);
    return error?.response?.data;
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  useAuth();

  if (actionData && actionData.status === "OK") {
    window.location.href = "/";
  }

  const formData = [
    {
      type: "text",
      name: "username",
      placeholder: "Username or Email",
    },
    {
      type: "password",
      name: "password",
      placeholder: "Password",
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
        <FormField formData={formData} value="Login" />
        <div className="flex">
          <Link
            to={"../forgot-password"}
            className="text-sm text-blue-500 justify-self-end m-auto my-2 text-end font-bold "
          >
            Forgot Password?
          </Link>
        </div>

        {actionData && actionData.status !== "OK" ? (
          <p className="flex justify-center items-center text-red-500">
            {actionData.message}
          </p>
        ) : null}
      </div>
    </>
  );
}
