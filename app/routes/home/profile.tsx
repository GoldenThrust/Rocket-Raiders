import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router";
import Header from "~/components/ui/home/header";
import TestUserIMG from "~/assets/test-user.png";

export default function Profile() {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-1 flex justify-center items-center flex-col">
        <div className="text-3xl font-extrabold font-serif">My Username</div>
        <div className="rounded-full overflow-hidden"><img src={TestUserIMG} alt="" /></div>
        <div className="space-x-2"><span>Total Gameplay: <b>120</b></span><span>Win: <b>100</b></span><span>Loss: <b>20</b></span><span>Total Kills: <b>53</b></span></div>
        <Link to='/auth/logout' className="w-32 rounded-md bg-red-500 text-center p-2">Logout</Link>
      </div>
    </>
  );
}
