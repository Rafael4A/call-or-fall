import crypto from "node:crypto";
import { GAME_STATE } from "../constants/GAME_STATE.js";
import { INITIAL_ROOM_OPTIONS } from "../constants/INITIAL_ROOM_OPTIONS.js";
import { ROOM_ID_CHARS } from "../constants/ROOM_ID_CHARS.js";
import type { Room } from "../types/Room.js";
import { createPlayer } from "./createPlayer.js";

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
