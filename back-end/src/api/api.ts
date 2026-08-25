import express from "express";
import {
  createRoomEndpoint,
  getRoomEndpoint,
  joinRoomEndpoint,
  playCardEndpoint,
  predictRoundEndpoint,
  startGameEndpoint,
} from "./endpoints";
import { leaveRoomEndpoint } from "./endpoints/room/[id]/leave/post";
import { playerInRoomMiddleware } from "./middlewares";

export const apiRouter = express.Router();

apiRouter.post("/room", createRoomEndpoint);
apiRouter.post("/room/:id/join", joinRoomEndpoint);
apiRouter.post("/room/:id/leave", playerInRoomMiddleware, leaveRoomEndpoint);
apiRouter.get("/room/:id", playerInRoomMiddleware, getRoomEndpoint);
apiRouter.post("/room/:id/start", playerInRoomMiddleware, startGameEndpoint);
apiRouter.post(
  "/room/:id/predict",
  playerInRoomMiddleware,
  predictRoundEndpoint,
);
apiRouter.post("/room/:id/play-card", playerInRoomMiddleware, playCardEndpoint);
