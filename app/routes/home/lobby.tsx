import { ChevronsLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import Header from "~/components/ui/home/header";
import TestUserIMG from "~/assets/test-user.png";
import AddUserIMG from "~/assets/add-user.svg";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { hostUrl } from "~/utils/constants";
import type { CancelTokenSource } from "axios";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";

export default function Lobby() {
  const [maps, setMap] = useState<Array<any>>([]);
  const [selectedMap, setSelectedMap] = useState<any>({});
  const [match, setMatch] = useState<any>({});
  const [players, setPlayers] = useState<Array<Array<any>>>([]);
  const { gameId } = useParams();
  const [myLoc, setMyLoc] = useState(`${0}:${0}`);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    socketRef.current = io(`${hostUrl}/lobby`, {
      withCredentials: true,
      query: {
        gameId,
      },
    });

    const socket = socketRef.current;

    socket.on("setGame", (match) => {
      setPlayers(match.players);
      if (
        match.map &&
        Object.entries(match.map).length > 0 &&
        user.username !== match.initiator.username
      )
        setSelectedMap(match.map);
      setMatch(match);
    });

    socket.on("map", (map) => {
      if (map && Object.entries(map).length > 0) setSelectedMap(map);
    });

    socket.on("matchDeleted", () => {
      navigate("/");
    });

    socket.on("startGame", (matchID) => {
      window.location.href = `${hostUrl}/game/?=matchid=${matchID}`;
    });

    socket.on("gameStartFailed", (errorMessage) => {
      alert(errorMessage);
    });

    const getMatch = async () => {
      try {
        const response = await axios.get(`/game/get-match/${gameId}`, {
          cancelToken: source.token,
        });

        const match = response.data?.match;

        if (match.gameMode === "free-for-all" && match.connectPlayer >= 20) {
          socket.disconnect();
          navigate("/");
        } else if (
          match.gameMode === "team-deathmatch" &&
          match.connectPlayer >= 12
        ) {
          socket.disconnect();
          navigate("/");
        }

        const playerData: Array<any> = match.players;
        let loc = "0:0";
        let skip = false;

        for (let i = 0; i < playerData.length; i++) {
          for (let j = 0; j < playerData[i].length; j++) {
            if (
              playerData[i][j] &&
              Object.entries(playerData[i][j]).length === 0
            ) {
              if (!skip) {
                playerData[i][j] = user;
                loc = `${i}:${j}`;
                setMyLoc(loc);
                skip = true;
              }
            } else {
              if (playerData[i][j].username === user.username) {
                socketRef.current?.disconnect();
                navigate("/");
              }
            }
          }
        }

        console.log(loc, loc)

        socketRef.current?.emit("joinLobby");
        socketRef.current?.emit("setGame", loc, loc);

        setPlayers(playerData);
        const map = await getMaps();

        if (match.map && Object.entries(match.map).length > 0) {
          setSelectedMap(match.map);
          socketRef.current?.emit("setMap", match.map);
        } else {
          setSelectedMap(map);
          socketRef.current?.emit("setMap", map);
        }

        setMatch(match);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch match data:", error);
          navigate("/");
        }
      }
    };

    const getMaps = async () => {
      try {
        const response = await axios.get("/game/maps", {
          cancelToken: source.token,
        });

        const maps = response?.data?.maps;

        setMap(maps);
        return maps[0];
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
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
    };
  }, [gameId]);

  const selectMap = (map: any) => (e: React.MouseEvent) => {
    if (match.initiator.username === user.username) {
      setSelectedMap(map);
      socketRef.current?.emit("setMap", map);

      e.currentTarget.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  const setGame = (loc: Array<any>) => (e: React.MouseEvent) => {
    if (
      players[loc[0]][loc[1]] &&
      Object.entries(players[loc[0]][loc[1]]).length === 0
    ) {
      const newPlayers = [...players];

      const mloc = myLoc.split(":");
      newPlayers[Number(mloc[0])][Number(mloc[1])] = {};
      newPlayers[loc[0]][loc[1]] = user;

      setMyLoc(`${loc[0]}:${loc[1]}`);
      socketRef.current?.emit(
        "setGame",
        `${loc[0]}:${loc[1]}`,
        `${mloc[0]}:${mloc[1]}`
      );
      setPlayers(newPlayers);
    }
  };

  const startGame = async () => {
    if (match.initiator.username === user.username) {
      try {
        socketRef.current?.emit("startGame");
      } catch (err: any) {
        alert(err.data.message);
      }
    }
  };

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
      <main
        className="flex"
        style={{
          height: "90%",
        }}
      >
        <div className="flex flex-col w-11/12 items-center gap-2">
          <div className="flex  flex-col text-white justify-center items-center h-full w-2/3 gap-5">
            {players.map((teams: any, i) => (
              <React.Fragment key={i}>
                <div
                  key={`08-${i}`}
                  className={`flex flex-wrap ${
                    i == 0 ? "place-self-start" : "place-self-end"
                  } gap-2`}
                >
                  {teams.map((team: any, key: any) => (
                    <div
                      className="flex flex-col justify-center items-center"
                      key={team.username || `${i}-${key}`}
                      onClick={setGame([i, key])}
                    >
                      <div className="relative flex-none rounded-full w-11 lg:w-16 overflow-hidden font-bold bg-gray-600 aspect-square border">
                        {team.avatar && (
                          <img
                            src={`${hostUrl}/${team.avatar}`}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          textShadow: "1px 1px 1px black",
                        }}
                      >
                        {team.username}
                      </div>
                    </div>
                  ))}
                </div>
                <>
                  {i === 0 && players.length === 2 && (
                    <span
                      className="text-2xl font-bold font-serif text-red-200"
                      style={{
                        textShadow: "1px 1px 1px black",
                      }}
                    >
                      VS
                    </span>
                  )}
                </>
              </React.Fragment>
            ))}
          </div>
          <div
            className={`flex gap-1 w-4/6 h-25 flex-none overflow-x-auto m-auto `}
          >
            {maps.map((map, key: any) => (
              <>
                <div
                  style={{
                    background: `black`,
                  }}
                  key={map.name}
                  id={key}
                  className="relative w-32 aspect-video flex-none text-white overflow-hidden flex justify-center items-end"
                  onClick={selectMap(map)}
                >
                  <span className="z-1 absolute font-extrabold">
                    {map.name}
                  </span>
                  <img
                    src={`${hostUrl}/${map.background}`}
                    alt=""
                    className="object-cover"
                  />
                </div>
              </>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 justify-end">
          {/* <div className="flex flex-col overflow-auto items-end gap-2 ">
            {friends.map((friend, key) => (
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
            ))}
          </div> */}
          <div
            style={{
              background: `black`,
            }}
            className="relative w-40 lg:w-72 aspect-video flex-none text-white overflow-hidden flex justify-center items-end"
          >
            <span className="z-1 absolute font-extrabold right-2">
              {selectedMap?.name}
            </span>
            <img
              src={`${hostUrl}/${selectedMap?.background}`}
              alt={selectedMap?.name}
              className="object-cover"
            />
          </div>
          {/* <div className="flex">
            <input
              type="search"
              placeholder="Search matches..."
              className="p-2 border border-gray-600 rounded-s bg-gray-800 text-white w-11/12"
            />
            <div className="bg-slate-500 rounded-e w-10 flex justify-center items-center">
              <img src={AddUserIMG} className="w-1/2" alt="" />
            </div>
          </div> */}
          <div
            className="h-14 flex flex-none justify-center items-center p-2 bg-blue-600 rounded-sm text-lg font-semibold"
            onClick={startGame}
          >
            Start Match
          </div>
        </div>
      </main>
    </>
  );
}
