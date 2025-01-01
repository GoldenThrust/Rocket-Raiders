import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router";
import Header from "~/components/ui/home/header";

export default function Settings() {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-extrabold">
        Coming Soon!!!
      </div>
    </>
  );
}
