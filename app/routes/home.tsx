import type { Route } from "./+types/home";
import Header from "~/components/ui/home/header";
import TestUserIMG from "~/assets/test-user.png";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <div id="home" className="w-screen h-screen">
    <Header><div><img src={TestUserIMG} alt="" /> </div></Header>
  </div>;
}
