import { ChevronsLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import Header from "~/components/ui/home/header";
import { useEffect, useState } from "react";
import type { CancelTokenSource } from "axios";
import axios from "axios";
import { hostUrl } from "~/utils/constants";

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
        const sortedWinners = winners?.length
          ? winners.sort((a: any, b: any) => b?.kills - a?.kills)
          : [];
          console.log(sortedWinners);
        setMatchData(sortedWinners);

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


  return (
    <>
      <Header>
        <Link
          to={"/"}
          className="flex flex-row items-center gap-1 font-bold font-serif text-white"
        >
          <ChevronsLeft /> Go Home
        </Link>
      </Header>
      <main className="flex" style={{ height: "90%" }}>
        {match.length > 0 ? (
          <div className="w-full px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Winners</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {match.map((winner: any) => (
                <div
                  key={winner?.player?._id}
                  className="flex items-center bg-slate-500 shadow-md p-4 rounded-lg"
                >
                  <img
                    src={`${hostUrl}/${winner?.player?.avatar}`}
                    alt={winner?.player?.username}
                    className="w-16 h-16 rounded-full mr-4 border-2"
                  />
                  <div>
                    <h3 className="text-lg text-white font-semibold">
                      {winner?.player?.username}
                    </h3>
                    <p className="text-sm text-zinc-100">
                      Kills: {winner?.kills}<br />
                      Deaths: {winner?.deaths}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center">No winners found.</p>
        )}
      </main>
    </>
  );
}
