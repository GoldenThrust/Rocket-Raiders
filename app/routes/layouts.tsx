import { Outlet } from "react-router";
// import { useNotAuth } from "~/hooks/auth";
import type { Route } from "./+types/layouts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rocket Raider" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function HomeLayout() {
  // useNotAuth();

  return (
    <div className="flex flex-col gap-1 h-screen p-3">
      <Outlet />
    </div>
  );
}
