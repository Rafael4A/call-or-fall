import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { createRoom, getRoom } from "./endpoints/index.js";
import { joinRoom } from "./endpoints/join/post.js";

import { startGame } from "./endpoints/room/[id]/start/post.js";
import { Rooms } from "./state/index.js";

export const apiRouter = express.Router();

// TODO REMOVE middleware that is specific to this router
const reqLog = (req: Request, res: Response, next: NextFunction) => {
  console.log("Requested: ", req.originalUrl);
  next();
};
apiRouter.use(reqLog);

// TODO REMOVE
apiRouter.get("/", (req, res) => {
  res.send(Array.from(Rooms.values()));
});

apiRouter.post("/room", createRoom);
apiRouter.get("/room/:id", getRoom);
apiRouter.post("/room/:id/join", joinRoom);
apiRouter.post("/room/:id/start", startGame);
