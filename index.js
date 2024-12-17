import express from "express";
// import { createServer } from "http";
import { createServer } from "https";
import path from "path";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { fileURLToPath } from "url";
import fs from "fs";
import websocket from "./config/websocket.js";
import mongodb, { redis } from "./config/db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const options = {
  key: fs.readFileSync(`C:\\Users\\adeni\\Documents\\Cert\\localhost.key`),
  cert: fs.readFileSync(`C:\\Users\\adeni\\Documents\\Cert\\localhost.crt`),
  password: `Golden455256`
};

const app = express();
const server = createServer(options, app);

app.set("trust proxy", 3)

app.use(cors());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use('/logic', express.static(path.join(__dirname, "logic")));

app.use('/', express.static(path.join(__dirname, "views")));

app.get('/', (req, res) => {
  res.render('index');
})

server.listen(PORT, () => {
  if (process.env.DEV === "true") {
    console.log("Running on Development");
  }


  redis.run().catch(console.dir);
  mongodb.run().catch(console.dir);

  const io = new Server(server, {
    adapter: createAdapter(redis.client)
  });

  websocket.getConnection(io);

  console.log(`Server is running on https://localhost:${PORT}`);
});
