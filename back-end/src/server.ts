import express from "express";
import path from "node:path";
import { Server } from "socket.io";
import { apiRouter } from "./api/api";
import { SOCKETIO_STRING } from "./api/constants/SOCKETIO_STRING";
import { socketHandler } from "./api/sockets";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

app.use("/api", apiRouter);

app.use(
  "/locales",
  express.static(path.join(process.cwd(), "../shared-code/src/locales")),
);

app.use(express.static(path.join(process.cwd(), "../front-end/dist")));

app.get("/{*any}", (req, res) => {
  // Don't serve index.html for API routes or locale files
  if (req.path.startsWith("/api") || req.path.startsWith("/locales")) {
    return res.status(404).send("Not found");
  }
  res.sendFile(path.join(process.cwd(), "../front-end/dist/index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

const io = new Server(server, { path: "/api/socket.io" });
socketHandler(io);
app.set(SOCKETIO_STRING, io);
