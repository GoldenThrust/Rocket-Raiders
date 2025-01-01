import { useState } from "react";

export default function Rocket() {
  const [selectedRocket, setSelectedRocket] = useState<string>("Zaber");

  const rockets = [
    {
      name: "Zaber",
      img: "/imgs/player.svg",
      speed: "10m/s",
      ability: "Snare Snipers",
      price: 0,
      bought: true,
    },
    {
      name: "Chrome",
      img: "/imgs/player.svg",
      speed: "12m/s",
      ability: "Hyper Boost",
      price: 50,
      bought: false,
    },
    {
      name: "Liz",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 40,
      bought: false,
    },
    {
      name: "Jock",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 30,
      bought: false,
    },
    {
      name: "Scrim",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 20,
      bought: false,
    },
    {
      name: "Zareber",
      img: "/imgs/player.svg",
      speed: "10m/s",
      ability: "Snare Snipers",
      price: 0,
      bought: true,
    },
    {
      name: "Cherome",
      img: "/imgs/player.svg",
      speed: "12m/s",
      ability: "Hyper Boost",
      price: 50,
      bought: false,
    },
    {
      name: "Lriz",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 40,
      bought: false,
    },
    {
      name: "Jorck",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 30,
      bought: false,
    },
    {
      name: "Scrgim",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 20,
      bought: false,
    },
    {
      name: "Zaqber",
      img: "/imgs/player.svg",
      speed: "10m/s",
      ability: "Snare Snipers",
      price: 0,
      bought: true,
    },
    {
      name: "Chroome",
      img: "/imgs/player.svg",
      speed: "12m/s",
      ability: "Hyper Boost",
      price: 50,
      bought: false,
    },
    {
      name: "Lirz",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 40,
      bought: false,
    },
    {
      name: "Jorck",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 30,
      bought: false,
    },
    {
      name: "Scrjim",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 20,
      bought: false,
    },
    {
      name: "Zabelr",
      img: "/imgs/player.svg",
      speed: "10m/s",
      ability: "Snare Snipers",
      price: 0,
      bought: true,
    },
    {
      name: "Chrompe",
      img: "/imgs/player.svg",
      speed: "12m/s",
      ability: "Hyper Boost",
      price: 50,
      bought: false,
    },
    {
      name: "Liqz",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 40,
      bought: false,
    },
    {
      name: "Jomck",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 30,
      bought: false,
    },
    {
      name: "Scrimw",
      img: "/imgs/player.svg",
      speed: "9m/s",
      ability: "EMP Shockwave",
      price: 20,
      bought: false,
    },
  ];

  const handleSelection = (name: string) => {
    setSelectedRocket(name);
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
          }`}
          onClick={() => handleSelection(rocket.name)}
        >
          <img
            src={rocket.img}
            alt={`Image of ${rocket.name} rocket`}
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className={`font-bold text-xl ${ selectedRocket === rocket.name ? 'text-black': ''}`}>{rocket.name}</h2>
          <p className="text-sm text-gray-600">Speed: {rocket.speed}</p>
          <p className="text-sm text-gray-600">Ability: {rocket.ability}</p>
          <div
            className={`absolute left-0 w-full max-w-md p-6 rounded-lg shadow-md text-center bg-blue-50 ${
              rocket.name === selectedRocket ? "block" : "hidden"
            }`}
          >
            {rocket.bought ? (
              <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                Use Rocket
              </button>
            ) : (
              <>
                <p className="mt-4 text-gray-700 font-bold">
                  Price: ${rocket.price}
                </p>
                <button className="mt-2 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                  Test Rocket
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
