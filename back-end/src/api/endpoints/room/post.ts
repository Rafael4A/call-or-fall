import { type Request, type Response } from "express";
import type { CreateRoomResponse } from "shared-code";
import { addRoom } from "../../state";

export function createRoomEndpoint(req: Request, res: Response) {
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

  const playerId = createdRoom.players[0]?.id!;

  const response: CreateRoomResponse = { playerId, roomId: createdRoom.id };

  res.status(201).send(response);
}
