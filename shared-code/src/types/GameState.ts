import type { GAME_STATE } from "../constants";

export type GameState = (typeof GAME_STATE)[keyof typeof GAME_STATE];
