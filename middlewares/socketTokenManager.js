import { COOKIE_NAME } from "../utils/constants.js";
import jwt from "jsonwebtoken";
import process from "process";
import User from "../models/user.js";

export default async function socketAuthenticateToken(socket, next) {
  const token = socket.request.signedCookies[COOKIE_NAME]
  if (!token || token.trim() === "") {
    return next();
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtData = jwt.verify(token, jwtSecret);
    const user = await User.findById(jwtData.id)
    socket.user = await user.populate(['selectedRocket']);
    return next();
  } catch (error) {
    next();
    return console.error(error);
  }
}