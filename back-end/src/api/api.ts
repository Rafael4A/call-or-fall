import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import {
  createRoomEndpoint,
  getRoomEndpoint,
  joinRoomEndpoint,
  playCardEndpoint,
  predictTurnEndpoint,
  startGameEndpoint,
} from "./endpoints/index.js";
import { leaveRoomEndpoint } from "./endpoints/room/[id]/leave/post.js";
import { playerInRoomMiddleware } from "./middlewares/index.js";
import { Rooms } from "./state/index.js";

export const apiRouter = express.Router();

// TODO REMOVE middleware that is specific to this router
const reqLog = (req: Request, res: Response, next: NextFunction) => {
  console.log("Requested: ", req.originalUrl, req.params, req.path, req.body);
  next();
};
apiRouter.use(reqLog);

// TODO REMOVE
apiRouter.get("/", (req, res) => {
  res.send(Array.from(Rooms.values()));
});

apiRouter.post("/room", createRoomEndpoint);
apiRouter.post("/room/:id/join", joinRoomEndpoint);
apiRouter.post("/room/:id/leave", playerInRoomMiddleware, leaveRoomEndpoint);
apiRouter.get("/room/:id", playerInRoomMiddleware, getRoomEndpoint);
apiRouter.post("/room/:id/start", playerInRoomMiddleware, startGameEndpoint);
apiRouter.post(
  "/room/:id/predict",
  playerInRoomMiddleware,
  predictTurnEndpoint,
);
apiRouter.post("/room/:id/play-card", playerInRoomMiddleware, playCardEndpoint);
