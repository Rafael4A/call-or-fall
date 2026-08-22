import { type NextFunction, type Request, type Response } from "express";
import { getRoomByIdWithUser } from "../state/rooms";

export function playerInRoomMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const roomId = req.params?.id;
  const userId = req.query?.userId;

  if (
    roomId === undefined ||
    typeof roomId !== "string" ||
    roomId.trim() === ""
  ) {
    return res.status(400).send({ error: "Invalid or missing roomId" });
  }

  if (
    userId === undefined ||
    typeof userId !== "string" ||
    userId.trim() === ""
  ) {
    return res.status(400).send({ error: "Invalid or missing userId" });
  }

  const room = getRoomByIdWithUser(roomId, userId);

  if (!room) {
    return res.status(404).send({ error: "Room with player not found" });
  }

  next();
}
