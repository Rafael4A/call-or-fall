import crypto from "node:crypto";
import { GAME_STATE } from "../constants/GAME_STATE.js";
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
    options: {
      scoreLimit: 4,
      showWinningCard: true,
      deckCount: 1,
    },
    deck: [],
    gameState: GAME_STATE.WaitingForPlayers,
    table: [],
    currentPlayerName: "",
    roundFirstPlayerName: "",
    currentRound: 0,
  };

  return room;
}
