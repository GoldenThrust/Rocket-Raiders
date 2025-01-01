import type { Route } from "./routes/+types/home";
import Header from "~/components/ui/home/header";
import TestUserIMG from "~/assets/test-user.png";
import { Link } from "react-router";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rocket Raider" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [openMap, setOpenMap] = useState(false);
  const activeMatches = [
    {
      id: "1",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Demon",
      game: "Team DeathMatch",
      players: 5,
      maxPlayers: 8,
      map: "Kria",
    },
    {
      id: "2",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Laughter",
      game: "Free For all",
      players: 2,
      maxPlayers: 10,
      map: "Doom",
    },
    {
      id: "3",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Golden",
      game: "Capture the Flag",
      players: 2,
      maxPlayers: 5,
      map: "Dome",
    },
    {
      id: "4",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Robert",
      game: "Team DeathMatch",
      players: 2,
      maxPlayers: 8,
      map: "Raid",
    },
    {
      id: "5",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Grey",
      game: "Team DeathMatch",
      players: 2,
      maxPlayers: 5,
      map: "Zyder",
    },
    {
      id: "6",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Robert",
      game: "Team DeathMatch",
      players: 2,
      maxPlayers: 8,
      map: "Raid",
    },
    {
      id: "7",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Grey",
      game: "Team DeathMatch",
      players: 2,
      maxPlayers: 5,
      map: "Zyder",
    },
    {
      id: "8",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Robert",
      game: "Team DeathMatch",
      players: 2,
      maxPlayers: 8,
      map: "Raid",
    },
    {
      id: "9",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Grey",
      game: "Team DeathMatch",
      players: 2,
      maxPlayers: 5,
      map: "Zyder",
    },
    {
      id: "10",
      hostImgUrl: TestUserIMG,
      bg: TestUserIMG,
      hostname: "Grey",
      game: "Team DeathMatch",
      players: 2,
      maxPlayers: 5,
      map: "Zyder",
    },
  ];

  return (
    <>
      <Header>
        <Link
          to={"/profile"}
          className="flex flex-row items-center gap-1 font-bold font-serif"
        >
          <span className="h-8 aspect-square rounded-full overflow-hidden">
            <img src={TestUserIMG} alt="" />
          </span>
          <span className="text-white text-xs">John</span>
        </Link>
      </Header>
      <main
        className="flex justify-between text-slate-50 gap-5"
        style={{
          height: "90%",
        }}
      >
        <div className="flex flex-col gap-2 w-1/4">
          <div className="font-mono text-xs font-bold mt-2">Active Match</div>
          <div className="overflow-y-auto flex flex-col gap-5">
            {activeMatches.map((match) => (
              <Link
                to={"/lobby"}
                style={{
                  background: `no-repeat center/100% url(${match.bg}) black`,
                  textShadow: "2px 2px 2px black",
                }}
                className="flex flex-row justify-between h-12 p-2 rounded-lg"
                key={match.id}
              >
                <span className="flex gap-1 items-center text-xs">
                  <span className="w-8 aspect-square rounded-full bg-gray-700 overflow-hidden">
                    <img
                      src={match.hostImgUrl}
                      className="object-contain"
                      alt=""
                    />
                  </span>
                  <span>{match.hostname}</span>
                </span>
                <span className="flex flex-col justify-center gap-2 text-xs">
                  <div>{match.game}</div>
                  <div className="flex justify-end gap-2">
                    <span>
                      {match.players} / {match.maxPlayers}
                    </span>
                    <span>{match.map}</span>
                  </div>
                </span>
              </Link>
            ))}
          </div>

          <input
            type="search"
            placeholder="Search matches..."
            className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
          />
        </div>

        <Link to="/inventories/rocket">
          <img src="/imgs/player.svg" alt="" />
        </Link>
  
        <div className="flex w-1/4">
          <div className="flex flex-col justify-end gap-5 w-full">
            <div className="flex flex-col gap-5 overflow-y-auto h-0 transition-all">
              {[
                "Free For All",
                "Capture the Flag",
                "Team DeathMatch",
                "Free For All",
                // "Capture the Flag",
                // "Team DeathMatch",
                // "Free For All",
                // "Capture the Flag",
                // "Team DeathMatch",
              ].map((text, index) => (
                <div
                  key={index}
                  className="h-14 flex flex-none justify-end items-end p-2 bg-blue-600"
                >
                  {text}
                </div>
              ))}
            </div>
            <div className="h-20 flex flex-none justify-end items-end p-2 bg-blue-600">
              Free For All
            </div>
            <Link to={'/lobby'} className="h-16 flex flex-none justify-center items-center p-2 bg-slate-600 rounded-sm text-xl font-semibold">
              Host Match
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
