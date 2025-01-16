import axios, { type CancelTokenSource } from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { hostUrl } from "~/utils/constants";

export default function Rocket() {
  const [selectedRocket, setSelectedRocket] = useState<string>("Rocket");
  const [rockets, setRockets] = useState<Array<any>>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    const getMatch = async () => {
      try {
        const response = await axios.get("/rocket", {
          cancelToken: source.token,
        });

        setRockets(response?.data?.rockets);
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          console.error("Error ", error);
        }
      }
    };

    getMatch();

    return () => {
      source.cancel("Component unmounted, request canceled.");
    };
  }, []);

  const handleSelection = (name: string) => {
    setSelectedRocket(name);
  };

  const useRocket = (name: string) => async () => {
    try {
      const response = await axios.get(`/rocket/set-rocket/${name}`);
      window.location.pathname = '/';
    } catch (error) {
      console.log("Error(" + error + ")");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto flex-grow gap-5">
      {rockets.map((rocket) => (
        <div
          key={rocket.name}
          className={`relative p-4 border rounded-lg shadow-md text-center cursor-pointer transition transform hover:scale-105 ${
            selectedRocket === rocket.name
              ? "border-blue-500 bg-blue-50 shadow-lg z-50"
              : "border-gray-200"
          } `}
          onClick={() => handleSelection(rocket.name)}
        >
          <img
            src={`${hostUrl}/${rocket.rocket}`}
            alt={`Image of ${rocket.name} rocket`}
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2
            className={`font-bold text-xl ${
              user?.selectedRocket?.name === rocket.name ? "text-black" : ""
            }`}
          >
            {rocket.name}
          </h2>
          <p className="text-sm text-gray-600">Speed: {rocket.speed}m/s</p>
          <p className="text-sm text-gray-600">
            Speciality: {rocket.speciality}
          </p>
          {rocket.name === selectedRocket && user?.selectedRocket?.name !== rocket.name &&  (
            <div
              className={`absolute left-0 w-full max-w-md p-6 rounded-lg shadow-md text-center bg-blue-50`}
            >
              {rocket.price === 0 ? (
                <button
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                  onClick={useRocket(rocket.name)}
                >
                  Use Rocket
                </button>
              ) : (
                <>
                  <p className="mt-4 text-gray-700 font-bold">
                    Price: ${rocket.price}
                  </p>
                  <button
                    className="mt-2 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                    onClick={useRocket(rocket.name)}
                  >
                    Test Rocket
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
