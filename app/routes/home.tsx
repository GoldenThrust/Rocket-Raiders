import Header from "~/components/ui/home/header";
import TestUserIMG from "~/assets/test-user.png";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import freeforallMap from "~/assets/map/freeforall.png";
import teamdeathmatchMap from "~/assets/map/teamdeathmatch.png";
import {
  convertCamelToTitleCase,
  convertDashToCamelCase,
  convertTitleToCamelCase,
  convertTitleToTitleCaseDashed,
} from "~/utils/action";
import axios, { type CancelTokenSource } from "axios";
import { hostUrl } from "~/utils/constants";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [openMap, setOpenMap] = useState(true);
  const [openGame, setOpenGame] = useState("Free For All");

  const [activeMatches, setActiveMatches] = useState<any>({});

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(`${hostUrl}/home`, {
      withCredentials: true,
    });

    const socket = socketRef.current;

    socket.on("newMatches", (match) => {
      setActiveMatches((prevMatches: any) => ({ [`${match.id}`]: match  , ...prevMatches }));
    });

    socket.on("updateMatches", (matches) => {
      setActiveMatches(matches);
    });

    return () => {
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    const getMatch = async () => {
      try {
        const response = await axios.get("/game/get-matches", {
          cancelToken: source.token,
        });

        setActiveMatches(response?.data?.matches);
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

  const matchMode: any = {
    freeForAll: freeforallMap,
    teamDeathmatch: teamdeathmatchMap,
  };

  const initiateMatch = (openGame: string) => async () => {
    try {
      const response = await axios.get(
        `/game/${convertTitleToTitleCaseDashed(openGame)}`
      );
      socketRef.current?.emit("initiateGame", response?.data?.match);
      navigate(`/lobby/${response?.data?.match?.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to initiate match");
    }
  };
  return (
    <>
      <Header>
        <Link
          to={"/profile"}
          className="flex flex-row items-center gap-1 font-bold font-serif"
        >
          <span className="h-8 aspect-square rounded-full overflow-hidden">
            <img src={`${hostUrl}/${user?.avatar}`} alt="" />
          </span>
          <span className="text-white text-xs">{user?.username}</span>
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
            {Object.entries(activeMatches).map(([key, match]: any) => (
              <Link
                to={`/lobby/${key}`}
                style={{
                  background: `no-repeat center/100% url(${
                    matchMode[convertDashToCamelCase(match.gameMode)]
                  }) black`,
                  textShadow: "2px 2px 2px black",
                }}
                className="flex flex-row justify-between h-12 p-2 rounded-lg"
                key={key}
              >
                <span className="flex gap-1 items-center text-xs">
                  <span className="w-8 aspect-square rounded-full bg-gray-700 overflow-hidden">
                    <img
                      src={`${hostUrl}/${match.initiator.avatar}`}
                      className="object-cover"
                      alt=""
                    />
                  </span>
                  <span>{match.gameMode}</span>
                </span>
                <span className="flex flex-col justify-center gap-2 text-xs">
                  <div>{match.game}</div>
                  <div className="flex justify-end gap-2">
                    <span>
                      {match.connectPlayer} /{" "}
                      {match.gameMode === "free-for-all" ? 20 : 12}
                    </span>
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
            <div
              className={`flex flex-col gap-5 overflow-y-auto transition-all duration-300 ${
                openMap ? "h-auto" : "h-0"
              }`}
              onClick={() => setOpenMap(false)}
            >
              {Object.entries(matchMode).map(([key, value], index) => (
                <div
                  key={index}
                  className="h-14 flex flex-none justify-end items-end p-2 bg-blue-600"
                  style={{
                    background: `no-repeat center/100% url(${value}) black`,
                    textShadow: "2px 2px 2px black",
                  }}
                  onClick={(e) => setOpenGame(e.currentTarget.innerText)}
                >
                  {convertCamelToTitleCase(key)}
                </div>
              ))}
            </div>
            <div
              className="h-20 flex flex-none justify-end items-end p-2 bg-blue-600"
              style={{
                background: `no-repeat center/100% url(${
                  matchMode[convertTitleToCamelCase(openGame)]
                }) black`,
                textShadow: "2px 2px 2px black",
              }}
              onClick={() => setOpenMap(true)}
            >
              {convertCamelToTitleCase(openGame)}
            </div>
            <div
              onClick={initiateMatch(openGame)}
              className="h-16 flex flex-none justify-center items-center p-2 bg-indigo-950 bg-blend-lighten rounded-sm text-xl font-semibold"
            >
              Host Match
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
