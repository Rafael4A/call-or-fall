import crypto from "node:crypto";
import { GAME_STATE, INITIAL_ROOM_OPTIONS, ROOM_ID_CHARS } from "../constants";
import type { Room } from "../types";
import { createPlayer } from "./createPlayer";

export function createRoom(username: string) {
  const randomRoomId = Array.from({ length: 6 })
    .map(() => ROOM_ID_CHARS[crypto.randomInt(0, ROOM_ID_CHARS.length)])
    .join("");

  const room: Room = {
    id: randomRoomId,
    players: [createPlayer(username)],
    options: structuredClone(INITIAL_ROOM_OPTIONS),
    deck: [],
    gameState: GAME_STATE.WaitingForPlayers,
    table: [],
    currentPlayerName: "",
    roundFirstPlayerName: "",
    currentRound: 0,
  };

  return room;
}
