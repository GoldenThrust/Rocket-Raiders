import { Outlet } from "react-router";
import { ChevronsLeft } from "lucide-react";
import { Link, NavLink } from "react-router";
import Header from "~/components/ui/home/header";
import Gun from "~/assets/gun.svg";
import Rocket from "~/assets/rocket.svg";
import Merc from "~/assets/merc.svg";

export default function InventoryLayout() {
  return (
    <>
      <Header>
        <Link
          to={"/"}
          className="flex flex-row items-center gap-1 font-bold font-serif text-white"
        >
          <ChevronsLeft /> Home
        </Link>
      </Header>
      <main className="flex gap-5" style={{
        height: '90%'
      }}>
        <div className="w-1/12 space-y-2">
          <NavLink
            style={({ isActive, isPending, isTransitioning }) => {
              return {
                backgroundColor: isActive ? "rgb(30, 41, 59)" : "",
              };
            }}
            to="./gun"
            className="bg-slate-600 aspect-video p-2 block"
          >
            <img src={Gun} alt="" />
          </NavLink>
          <NavLink
            style={({ isActive, isPending, isTransitioning }) => {
              return {
                backgroundColor: isActive ? "rgb(30, 41, 59)" : "",
              };
            }}
            to="./rocket"
            className="bg-slate-600 aspect-video p-2 block"
          >
            <img src={Rocket} alt="" />
          </NavLink>
          <NavLink
            style={({ isActive, isPending, isTransitioning }) => {
              return {
                backgroundColor: isActive ? "rgb(30, 41, 59)" : "",
              };
            }}
            to="./merc"
            className="bg-slate-600 aspect-video p-2 block"
          >
            <img src={Merc} alt="" />
          </NavLink>
        </div>
        <Outlet />
      </main>
    </>
  );
}
