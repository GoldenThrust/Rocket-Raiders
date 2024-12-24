// route('/projects/:projectId', './project.tsx')
import FormField from "~/components/ui/authentication/Form";
import type { Route } from "./+types/register";
import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router";
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  return {
    email: formData.get("email")?.toString(),
    username: formData.get("username")?.toString(),
    password: formData.get("password")?.toString(),
  };
}

export default function Register({ actionData }: Route.ComponentProps) {
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
          to={"../login"}
          className="flex items-center absolute top-2 left-2 text-"
        >
          <ChevronsLeft />
          Sign Up
        </Link>
      </nav>
      <div>
        <FormField formData={formData} value="Register" />

        {actionData ? (
          <p>
            {actionData.username}, {actionData.email} and {actionData.password}{" "}
            updated
          </p>
        ) : null}
      </div>
    </>
  );
}
