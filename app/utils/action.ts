import axios from "axios";
import { io, Socket } from "socket.io-client";
import { hostUrl } from "./constants";

let socket: Socket | null;
export async function verifyAdmin() {
  try {
    const response = await axios.get("/auth/admin/verify");
    if (response.status === 200) {
      console.log("User is authenticated");
    } else {
      console.log("User is not authenticatedhb");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error during auth verification:", error);
  }
}

export function convertCamelToTitleCase(input: string) {
  if (!input) return "";

  const formatted = input
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (match) => match.toUpperCase());

  return formatted.trim();
}

export function convertTitleToCamelCase(input: string) {
  if (!input) return "";

  return input
    .toLowerCase()
    .replace(/(?:\s+)([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^./, (match) => match.toLowerCase());
}

export function convertTitleToTitleCaseDashed(input: string) {
  if (!input) return "";

  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^-/, (match) => match.toLowerCase());
}

export function convertDashToCamelCase(input: string) {
  if (!input) return "";

  return input
    .toLowerCase()
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export const initializeSocket = () => {
  if (!socket) {
    socket = io(`${hostUrl}/home`, {
      withCredentials: true,
    });
  }
  return socket;
};
