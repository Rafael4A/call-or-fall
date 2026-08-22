import type { Room } from "shared-code";
import { STORAGE_KEYS } from "../constants";

export function updateLocalRoom(room: Room) {
  sessionStorage.setItem(STORAGE_KEYS.OFFLINE_GAME, JSON.stringify(room));
}
