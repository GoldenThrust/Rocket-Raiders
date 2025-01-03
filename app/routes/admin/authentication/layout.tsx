import { Outlet } from "react-router";

export default function ProjectLayout() {
  return (
    <div className="w-screen h-screen absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col place-content-center">
      <Outlet />
    </div>
  );
}
