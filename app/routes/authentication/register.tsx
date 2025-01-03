// route('/projects/:projectId', './project.tsx')
import FormField from "~/components/ui/authentication/Form";
import type { Route } from "./+types/register";
import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router";
import axios from "axios";
import { useAuth } from "~/hooks/auth";
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  try {
    const response = await axios.post("/auth/register", data);
    return response.data;
  } catch (error: any) {
    return error?.response?.data;
  }
}

export default function Register({ actionData }: Route.ComponentProps) {
  useAuth()

  const formData = [
    {
      type: "text",
      name: "username",
      value: actionData?.username || "",
      placeholder: "Username",
    },
    {
      type: "email",
      name: "email",
      value: actionData?.email || "",
      placeholder: "Email",
    },
    {
      type: "password",
      name: "password",
      value: actionData?.password || "",
      placeholder: "Password",
    },
  ];

  return (
    <>
      <nav>
        <Link
          to={"/auth/login"}
          className="flex items-center absolute top-2 left-2"
        >
          <ChevronsLeft />
          Sign In
        </Link>
      </nav>
      <div>
        <FormField formData={formData} value="Register" />

        {actionData ? (
          actionData.status === "OK" ? (
            <p className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black text-center text-lg font-semibold">
              An activation link has been sent to your email. Please check your
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
