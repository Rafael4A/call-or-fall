import { type Request, type Response } from "express";
import type { CreateRoomResponse } from "shared-code";
import { addPlayerToRoom, getRoomById } from "../../../../state/index.js";

export function joinRoomEndpoint(req: Request, res: Response) {
  console.log(req.params, req.path, req.body);

  const username = req.body?.username;

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).send({ error: "Invalid or missing username" });
  }

  const roomId = req.params?.id;
  if (
    roomId === undefined ||
    typeof roomId !== "string" ||
    roomId.trim() === ""
  ) {
    return res.status(400).send({ error: "Invalid or missing roomId" });
  }

  const room = getRoomById(roomId);

  console.log(room);

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
