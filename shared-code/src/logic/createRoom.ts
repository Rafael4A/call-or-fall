import { GAME_STATE, INITIAL_ROOM_OPTIONS } from "../constants";
import type { Room } from "../types";
import { createPlayer } from "./createPlayer";

export function createRoom(username: string, id: string) {
  const room: Room = {
    id,
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
