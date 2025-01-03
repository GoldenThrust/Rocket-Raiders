import FormField from "~/components/ui/authentication/Form";
import type { Route } from "./+types/forgot-password";
import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/auth";
import axios from "axios";
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  try {
    const response = await axios.post("/auth//forgot-password", data);
    return response.data;
  } catch (error: any) {
    return error?.response?.data;
  }
}

export default function ForgotPassWord({ actionData }: Route.ComponentProps) {
  useAuth();
  const formData = [
    {
      type: "text",
      name: "username",
      value: actionData?.username || "",
      placeholder: "Username or Email",
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
        <FormField formData={formData} value="Send Reset Link" />

        {actionData ? (
          actionData.status === "OK" ? (
            <p className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black text-center text-lg font-semibold">
              A Reset Password link has been sent to your email. Please check your
              inbox (and spam folder) to complete your account setup. The link
              will expire in 24 hours.
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
