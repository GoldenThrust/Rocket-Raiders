import { ChevronsLeft } from "lucide-react";
import { Link } from "react-router";
import Header from "~/components/ui/home/header";
import TestUserIMG from "~/assets/test-user.png";
import AddUserIMG from "~/assets/add-user.svg";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "dgram";
import { hostUrl } from "~/utils/constants";
import type { CancelTokenSource } from "axios";
import axios from "axios";

export default function Lobby() {
  const [map, setMap] = useState([])
  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    const getMatch = async () => {
      try {
        const response = await axios.get("/game/get-matches", {
          cancelToken: source.token,
        });

        setMap(response?.data?.matches);
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error during auth verification:", error);
        }
      }
    };

    getMatch();

    return () => {
      source.cancel("Component unmounted, request canceled.");
    };
  }, []);


  const teamOne = [
    {
      img: TestUserIMG,
      name: "Smith",
    },
    {
      img: TestUserIMG,
      name: "Slith",
    },
    {
      img: TestUserIMG,
      name: "Corber",
    },
    {
      img: TestUserIMG,
      name: "Darth",
    },
    {
      img: TestUserIMG,
      name: "Klog",
    },
  ];

  const teamTwo = [
    {
      img: TestUserIMG,
      name: "Carter",
    },
    {
      img: TestUserIMG,
      name: "Bab",
    },
    {
      img: TestUserIMG,
      name: "Trio",
    },
    {
      img: TestUserIMG,
      name: "Lowland",
    },
    {
      img: TestUserIMG,
      name: "naps",
    },
  ];

  const friends = [
    {
      img: TestUserIMG,
      name: "Dave",
    },
    {
      img: TestUserIMG,
      name: "Sarah",
    },
    {
      img: TestUserIMG,
      name: "Jeff",
    },
    {
      img: TestUserIMG,
      name: "Gary",
    },
    {
      img: TestUserIMG,
      name: "Karen",
    },
  ];

  return (
    <>
      <Header>
        <Link
          to={"/"}
          className="flex flex-row items-center gap-1 font-bold font-serif text-white"
        >
          <ChevronsLeft /> Leave Game
        </Link>
      </Header>
      <main className="flex" style={{
          height: '90%'
        }}>
        <div className="flex flex-col w-10/12 items-center gap-2">
          <div className="flex flex-col text-white justify-center items-center h-full w-2/3 gap-5">
            <div className="flex place-self-start gap-2">
              {teamOne.map((team, key) => (
                <div
                  key={key}
                  className="relative rounded-full overflow-hidden text-xs font-bold"
                >
                  <img src={team.img} className="w-16"></img>
                  <div
                    className="absolute left-1/2 bottom-1 -translate-x-1/2 opacity-50"
                    style={{
                      textShadow: "1px 1px 1px black",
                    }}
                  >
                    {team.name}
                  </div>
                </div>
              ))}
            </div>
            <span className="text-2xl font-bold font-serif text-red-200" style={{
                      textShadow: "1px 1px 1px black",
                    }}>VS</span>
            <div className="flex place-self-end gap-2">
              {teamTwo.map((team, key) => (
                <div
                  key={key}
                  className="relative rounded-full overflow-hidden text-xs font-bold"
                >
                  <img src={team.img} className="w-16"></img>
                  <div
                    className="absolute left-1/2 bottom-1 -translate-x-1/2 opacity-50"
                    style={{
                      textShadow: "1px 1px 1px black",
                    }}
                  >
                    {team.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-24 justify-around gap-1 w-4/6 overflow-x-auto m-auto">
            {[
              { name: "kria", img: "" },
              { name: "Zyder", img: "" },
              { name: "Raid", img: "" },
              { name: "Doom", img: "" },
              { name: "kria", img: "" },
              { name: "kria", img: "" },
              { name: "Doom", img: "" },
              { name: "kria", img: "" },
              { name: "kria", img: "" },
              { name: "Doom", img: "" },
              { name: "kria", img: "" },
              { name: "kria", img: "" },
              { name: "Doom", img: "" },
              { name: "kria", img: "" },
              { name: "kria", img: "" },
            ].map((map, key) => (
              <div
                style={{
                  background: `no-repeat center/100% url(${map.img}) black`,
                }}
                key={key}
                className="w-32 flex-none text-white overflow-hidden flex justify-center items-end"
              >
                {map.name}
              </div>
            ))}
          </div>
        </div>

        <div className="flex *:w-full flex-col gap-1 justify-end">
          <div className="flex flex-col overflow-auto items-end gap-2 ">
            {/* {friends.map((friend, key) => (
              <div
                key={key}
                className="relative flex flex-none overflow-hidden rounded-lg text-xs font-bold w-12"
              >
                <img src={friend.img} alt={friend.name}></img>
                <div
                  className="absolute left-1/2 bottom-1 -translate-x-1/2 opacity-50"
                  style={{
                    textShadow: "1px 1px 1px black",
                  }}
                >
                  {friend.name}
                </div>
              </div>
            ))} */}
          </div>
          <div className="flex">
            <input
              type="search"
              placeholder="Search matches..."
              className="p-2 border border-gray-600 rounded-s bg-gray-800 text-white w-11/12"
            />
            <div className="bg-slate-500 rounded-e w-10 flex justify-center items-center">
              <img src={AddUserIMG} className="w-1/2" alt="" />
            </div>
          </div>
          <div className="h-14 flex flex-none justify-center items-center p-2 bg-slate-600 rounded-sm text-lg font-semibold">
            Start Match
          </div>
        </div>
      </main>
    </>
  );
}
