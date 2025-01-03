import { Outlet } from "react-router";
import Logo from "../../assets/logo.svg";
import type { Route } from "./+types/layout";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rocket Raider: authentications" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ProjectLayout() {
  return (
    <div className="w-screen h-screen absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col place-content-center">
      <header>
        <>
          <h1 className="sr-only">Rocket Raider</h1>
          <img
            src={Logo}
            alt="React Router"
            className="block w-1/2 lg:w-1/3 m-auto"
          />
        </>
      </header>
      <Outlet />
    </div>
  );
}
