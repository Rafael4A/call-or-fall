import type { GAME_STATE } from "../constants/GAME_STATE";

export type GameState = (typeof GAME_STATE)[keyof typeof GAME_STATE];
