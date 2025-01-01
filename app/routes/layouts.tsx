import { Outlet } from "react-router";
import { useNotAuth } from "~/hooks/auth";

export default function HomeLayout() {
  useNotAuth()

  return (
    <div  className="flex flex-col gap-1 h-screen p-3">
      <Outlet />
    </div>
  );
}
