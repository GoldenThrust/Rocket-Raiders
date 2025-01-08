import axios from "axios";
import { useState } from "react";
import { useNotAdminAuth } from "~/hooks/auth";
import type { Route } from "../+types/layouts";
import FormField from "~/components/ui/authentication/Form";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  try {
    const response = await axios.post(
      `/auth/admin/create-${formData.get("type")}`,
      formData
    );

    window.location.reload();
    return response?.data;
  } catch (error: any) {
    console.error("Submission error:", error);
    return error?.response?.data;
  }
}

export default function AdminHome() {
  const [userData, setUserData] = useState<any>(null);
  const [section, setSection] = useState<string>("map");
  useNotAdminAuth(setUserData);

  const formData: Record<string, any[]> = {
    map: [
      { type: "hidden", name: "type", value: "map" },
      { type: "text", name: "name", placeholder: "Map name", required: true },
      {
        type: "textarea",
        name: "description",
        placeholder: "Description",
        default: "A mysterious space battlefield",
      },
      { type: "file", name: "map", placeholder: "Background image" },
    ],
    rocket: [
      { type: "hidden", name: "type", value: "rocket" },
      {
        type: "file",
        name: "rocket",
        placeholder: "Rocket Image",
        required: true,
      },
      {
        type: "file",
        name: "flame",
        placeholder: "Rocket flame Image",
        required: false,
      },
      {
        type: "text",
        name: "name",
        placeholder: "Rocket name",
        required: true,
      },
      { type: "number", name: "price", placeholder: "Speed", required: true },
      { type: "number", name: "speed", placeholder: "Speed", required: true },
      {
        type: "number",
        name: "durability",
        placeholder: "Durability",
        required: true,
      },
      {
        type: "name",
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
      { type: "number", name: "range", placeholder: "Range", required: true },
    ],
  };

  return (
    <>
      <header className="flex justify-evenly *:border *:p-2 *:rounded-lg">
        {["Map", "Rocket"].map((sectionName) => (
          <div
            key={sectionName}
            onClick={(e) => setSection(sectionName.toLowerCase())}
            className={`cursor-pointer ${
              section === sectionName.toLowerCase() ? "font-bold" : ""
            }`}
          >
            {sectionName}
          </div>
        ))}
      </header>
      <main>
        <FormField
          formData={formData[section]}
          value="Save"
          encType="multipart/form-data"
          // post={}
        />
      </main>
    </>
  );
}
