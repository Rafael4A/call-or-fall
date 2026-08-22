import { type Request, type Response } from "express";
import type { CreateRoomResponse } from "shared-code";
import { addPlayerToRoom, getRoomById } from "../../../../state";

export function joinRoomEndpoint(req: Request, res: Response) {
  const usernameParam = req.body?.username;

  if (
    !usernameParam ||
    typeof usernameParam !== "string" ||
    usernameParam.trim() === ""
  ) {
    return res.status(400).send({ error: "Invalid or missing username" });
  }
  const username = usernameParam.trim().toUpperCase();

  const roomId = req.params?.id;
  if (
    roomId === undefined ||
    typeof roomId !== "string" ||
    roomId.trim() === ""
  ) {
    return res.status(400).send({ error: "Invalid or missing roomId" });
  }

  const room = getRoomById(roomId);

  if (!room) {
    return res.status(404).send({ error: "Room not found" });
  }

  if (room.players.some((p) => p.username === username)) {
    return res
      .status(400)
      .send({ error: "Username already taken in this room" });
  }

  const newPlayer = addPlayerToRoom(room, username);

  const playerId = newPlayer.id;

  const response: CreateRoomResponse = { playerId, roomId };

  res.status(201).send(response);
}
