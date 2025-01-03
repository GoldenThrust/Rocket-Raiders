import axios from "axios";
import { useState } from "react";
import { useNotAdminAuth } from "~/hooks/auth";
import type { Route } from "../+types/layouts";
import FormField from "~/components/ui/authentication/Form";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await axios.post("/auth/admin/login", data);
    return response?.data;
  } catch (error: any) {
    console.error("Login error:", error);
    return error?.response?.data;
  }
}

export default function AdminHome() {
  const [userData, setUserData] = useState<any>(null);
  const [section, setSection] = useState<any>("map");
  useNotAdminAuth(setUserData);

  const formData: any = {
    map: [
      {
        type: "hidden",
        name: "type",
        value: "maps",
      },
      {
        type: "text",
        name: "name",
        placeholder: "Map name",
        required: true,
      },
      {
        type: "textarea",
        name: "description",
        placeholder: "Description",
        default: "A mysterious space battlefield",
      },
      {
        type: "file",
        name: "background",
        placeholder: "Background image",
      },
    ],
    rocket: [
      {
        type: "hidden",
        name: "type",
        value: "rockets",
      },
      {
        type: "file",
        name: "rocketimg",
        placeholder: "Rocket Image",
        required: true,
      },
      {
        type: "text",
        name: "name",
        placeholder: "Rocket name",
        required: true,
      },
      {
        type: "number",
        name: "speed",
        placeholder: "Speed",
        required: true,
      },
      {
        type: "number",
        name: "durability",
        placeholder: "Durability",
        required: true,
      },
      {
        type: "number",
        name: "speciality",
        placeholder: "Speciality",
        required: true,
      },
      {
        type: "number",
        name: "fireRate",
        placeholder: "Fire rate",
        required: true,
      },
      {
        type: "number",
        name: "range",
        placeholder: "Range",
        required: true,
      },
    ],
    // weapon: [
    //   {
    //     type: "text",
    //     name: "name",
    //     placeholder: "Weapon name",
    //     required: true,
    //   },
    //   {
    //     type: "number",
    //     name: "damage",
    //     placeholder: "Damage",
    //     required: true,
    //   },
    //   {
    //     type: "number",
    //     name: "fireRate",
    //     placeholder: "Fire rate",
    //     required: true,
    //   },
    //   {
    //     type: "number",
    //     name: "range",
    //     placeholder: "Range",
    //     required: true,
    //   },
    //   {
    //     type: "select",
    //     name: "type",
    //     options: ["laser", "missile", "plasma", "gun"],
    //     placeholder: "Weapon type",
    //     required: true,
    //   },
    // ],
    // powerUp: [
    //   {
    //     type: "text",
    //     name: "name",
    //     placeholder: "Power-up name",
    //     required: true,
    //   },
    //   {
    //     type: "text",
    //     name: "effect",
    //     placeholder: "Effect",
    //     required: true,
    //   },
    //   {
    //     type: "number",
    //     name: "duration",
    //     placeholder: "Duration (seconds)",
    //     required: true,
    //   },
    //   {
    //     type: "group",
    //     name: "location",
    //     fields: [
    //       {
    //         type: "number",
    //         name: "x",
    //         placeholder: "X-coordinate",
    //         required: true,
    //       },
    //       {
    //         type: "number",
    //         name: "y",
    //         placeholder: "Y-coordinate",
    //         required: true,
    //       },
    //     ],
    //   },
    // ],
  };

  return (
    <>
      <header className="flex justify-evenly *:border *:p-2 *:rounded-lg">
        <div
          onClick={(e) => setSection(e.currentTarget.innerText.toLowerCase())}
        >
          Map
        </div>
        <div
          onClick={(e) => setSection(e.currentTarget.innerText.toLowerCase())}
        >
          Rocket
        </div>
        {/* <div
          onClick={(e) => setUserData(e.currentTarget.innerText.toLowerCase())}
        >
          Weapon
        </div>
        <div
          onClick={(e) => setUserData(e.currentTarget.innerText.toLowerCase())}
        >
          PowerUps
        </div> */}
      </header>
      <main>
        <FormField formData={formData[section]} value="Save" />
      </main>
    </>
  );
}
