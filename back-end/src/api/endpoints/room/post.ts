import { type Request, type Response } from "express";
import type { CreateRoomResponse } from "shared-code";
import { addRoom } from "../../state/index.js";

export function createRoomEndpoint(req: Request, res: Response) {
  console.log(req.params, req.path, req.body);
  const usernameParam = req.body?.username;

  if (
    !usernameParam ||
    typeof usernameParam !== "string" ||
    usernameParam.trim() === ""
  ) {
    return res.status(400).send({ error: "Invalid or missing username" });
  }

  const username = usernameParam.trim().toUpperCase();

  const createdRoom = addRoom(username);
  console.log(createdRoom);

  const playerId = createdRoom.players[0]?.id!;

  const response: CreateRoomResponse = { playerId, roomId: createdRoom.id };

  res.status(201).send(response);
}
