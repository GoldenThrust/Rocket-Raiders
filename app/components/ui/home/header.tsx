import { HandCoins, Newspaper, Settings } from "lucide-react";
import type React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import type { RootState } from "~/store";

export default function Header({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="flex justify-between items-center">
      <div>{children}</div>
      <div className="flex justify-aroun text-xs gap-6 text-white">
        <span className="flex items-center gap-1 font-bold text-yellow-500">
          <HandCoins className="inline" />
          <span>{user?.coin || 0}</span>
        </span>
        <nav className="flex gap-4">
          <Link to={"/"}>
            <Newspaper />
          </Link>
          <Link to={"/settings"}>
            <Settings />
          </Link>
        </nav>
      </div>
    </header>
  );
}
