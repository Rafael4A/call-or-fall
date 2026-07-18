import { type Request, type Response } from "express";
import type { RoomDTO } from "shared-code";
import { mapRoomToRoomDTO } from "../../mappers/index.js";
import { getRoomByIdWithUser } from "../../state/index.js";

export function getRoomEndpoint(req: Request, res: Response) {
  console.log(req.params, req.query);

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

  console.log(room);

  if (!room) {
    return res.status(404).send({ error: "Room with player not found" });
  }

  const response: RoomDTO = mapRoomToRoomDTO(room, userId);
  res.status(200).send(response);
}
