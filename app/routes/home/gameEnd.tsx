import { ChevronsLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import Header from "~/components/ui/home/header";
import TestUserIMG from "~/assets/test-user.png";
import { useEffect, useState } from "react";
import type { CancelTokenSource } from "axios";
import axios from "axios";

export default function Lobby() {
  const { gameId } = useParams();
  const [match, setMatchData] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();

    const getMatch = async () => {
      try {
        const response = await axios.get(`/game/get-end-game/${gameId}`, {
          cancelToken: source.token,
        });

        const winners = response.data?.winners;
        // setMatchData(match);

        // Navigate after a delay
        // setTimeout(() => {
        //   navigate('/');
        // }, 10000);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch match data:", error);
          navigate("/");
        }
      }
    };

    getMatch();
    return () => {
      source.cancel("Component unmounted, request canceled.");
    };
  }, [gameId, navigate]);

  // const sortedWinners = match?.winners?.length
  // ? match.winners.sort((a: any, b: any) => b?.stats?.totalKills - a?.stats?.totalKills)
  // : [];


  return (
    <>
      <Header>
        <Link to={"/"} className="flex flex-row items-center gap-1 font-bold font-serif text-white">
          <ChevronsLeft /> Go Home
        </Link>
      </Header>
      <main className="flex" style={{ height: "90%" }}>
        {/* {sortedWinners.length > 0 ? (
          <div className="w-full px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Winners</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedWinners.map((winner: any) => (
                <div key={winner?._id} className="flex items-center bg-white shadow-md p-4 rounded-lg">
                  <img
                    src={winner?.avatar || TestUserIMG}
                    alt={winner?.username}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{winner?.username}</h3>
                    <p className="text-sm text-gray-500">Kills: {winner?.stats?.totalKills}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center">No winners found.</p>
        )} */}
      </main>
    </>
  );
}
