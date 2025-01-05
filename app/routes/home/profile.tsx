import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router";
import Header from "~/components/ui/home/header";
import TestUserIMG from "~/assets/test-user.png";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { convertCamelToTitleCase } from "~/utils/action";
import { hostUrl } from "~/utils/constants";

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formmData = new FormData();
      formmData.append("avatar", file);
      try {
        axios.put("/auth/update-profile", formmData).then((res) => {
          console.log(res.data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const stats = Object.entries(user?.stats || {});

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-4 flex justify-center items-center flex-col">
        <div className="text-3xl font-extrabold font-serif">
          {user?.username}
        </div>
        <div className="relative group">
          <img
            src={`${hostUrl}/${user?.avatar}`}
            alt="User Avatar"
            className="rounded-full w-32 h-32 object-cover"
          />
          <input
            type="file"
            name="avatar"
            id="avatar"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
          />
          <label
            htmlFor="avatar"
            className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            Change Avatar
          </label>
        </div>
        <div className="space-x-2">
          {stats.map(([key, value]: any, index) => (
            <span key={index}>
              {convertCamelToTitleCase(key)}: <b>{value}</b>
            </span>
          ))}
        </div>
        <Link
          to="/auth/logout"
          className="w-32 rounded-md bg-red-500 text-center p-2 text-white hover:bg-red-600"
        >
          Logout
        </Link>
      </div>
    </>
  );
}
