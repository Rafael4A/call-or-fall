import type { Room } from "shared-code";
import { STORAGE_KEYS } from "../constants";

export function updateLocalRoom(room: Room) {
  if (sessionStorage.getItem(STORAGE_KEYS.OFFLINE_GAME))
    sessionStorage.setItem(STORAGE_KEYS.OFFLINE_GAME, JSON.stringify(room));
}
