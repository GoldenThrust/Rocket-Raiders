import express from "express";
// import { createServer } from "http";
import { createServer } from "https";
import path from "path";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { fileURLToPath } from "url";
import fs from "fs";
import websocket from "./config/websocket.js";
import mongodb, { redis } from "./config/db.js";
import authRoutes from "./routes/authentication.js";
import { getIPAddress } from './utils/func.js'
import { authOptionalMiddleware } from "./middlewares/authOptionalMiddleware.js";
import gameRoutes from "./routes/game.js";
import socketcookieParser from "./middlewares/socketCookieParser.js";
import socketAuthenticateToken from "./middlewares/socketTokenManager.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const options = {
  key: fs.readFileSync(`C:\\Users\\adeni\\Documents\\Cert\\localhost.key`),
  cert: fs.readFileSync(`C:\\Users\\adeni\\Documents\\Cert\\localhost.crt`),
  password: `Golden455256`
};


const allowUrl = [`http://localhost:5173`, `http://${getIPAddress()}:5173`, `https://${getIPAddress()}:${PORT}`, 'https://localhost:3000'];


const app = express();
const server = createServer(options, app);
const optionalAuthRoutes = [
  // /^\/$/, // Root route
  /^\/favicon\.ico.*$/, // Favicon
  /^\/assets\//, // Assets folder
  /^\/imgs\//, // Images folder
  /^\/styles\//, // Styles folder
  /^\/auth\/(?!verify|update-profile|logout).*$/, // Auth routes excluding specific actions
  /^\/api\/auth\/(?!verify|update-profile|logout|admin.*).*$/, // API auth routes excluding specific actions and admin subpaths
];


app.use(cors({ origin: allowUrl, credentials: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(authOptionalMiddleware(optionalAuthRoutes))

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use('/logic', express.static(path.join(__dirname, "logic")));
app.use('/', express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "build", "client")));

app.get('/game', (req, res) => {
  res.render('index');
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "client", "index.html"));
});

server.listen(PORT, () => {
  if (process.env.DEV === "true") {
    console.log("Running on Development");
  }


  redis.run().catch(console.dir);
  mongodb.run().catch(console.dir);

  const io = new Server(server, {
    adapter: createAdapter(redis.client),
    cors: {
      origin: [allowUrl],
      credentials: true
    },

  });

  io.use(socketcookieParser);
  io.use(socketAuthenticateToken);
  websocket.getConnection(io);

  console.log(`Server is running on https://localhost:${PORT}`);
});
