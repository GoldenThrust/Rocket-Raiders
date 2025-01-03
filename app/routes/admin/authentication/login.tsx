import FormField from "~/components/ui/authentication/Form";
import type { Route } from "./+types/admin/authentication/login";
import { useParams } from "react-router";
import axios from "axios";
import { useAdminAuth } from "~/hooks/auth";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await axios.post("/auth/admin/login", data);
    return response?.data;
  } catch (error: any) {
    console.error("Login error:", error);
    return error?.response?.data;
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  useAdminAuth()
  const { "*": param } = useParams();
  if (actionData && actionData.status === "OK") {
    console.log("User is authenticated");
  }
  const formData = [];

  if (!param) {
    formData.push({
      type: "email",
      name: "email",
      placeholder: "Email",
    });
  } else {
    formData.push({
      type: "hidden",
      name: "crypto",
      value: `${param}`,
    });
  }

  return (
    <>
      <FormField
        formData={formData}
        value={param ? "Login" : "Send Login Link"}
      />

      {actionData ? (
        actionData.status === "OK" ? (
          <p className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black text-center text-lg font-semibold">
            A login link has been sent to your email. Please check your inbox
            (and spam folder) to complete your account setup. The link will
            expire in 1 hours.
          </p>
        ) : (
          <p className="flex justify-center items-center text-red-500">
            {actionData.message}
          </p>
        )
      ) : null}
    </>
  );
}
