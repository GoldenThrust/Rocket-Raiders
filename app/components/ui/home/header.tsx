import { Coins, HandCoins, Newspaper, Settings } from "lucide-react";
import type React from "react";
import { Link } from "react-router";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex">
      <div>{children}</div>
      <div className="flex">
        <span><HandCoins className="inline" />1000</span>
        <nav className="flex"><Link to={''}><Newspaper /></Link>
        <Link to={''}><Settings /></Link></nav>
      </div>
    </header>
  );
}
