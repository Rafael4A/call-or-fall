import type { CardCode } from "./CardCode.js";
import type { GameState } from "./GameState.js";
import type { Player, PlayerOpponentDTO } from "./Player.js";
import type { TableCard } from "./TableCard.js";

export interface Room {
  id: string;
  players: Player[];
  options: RoomOptions;
  deck: CardCode[];
  table: TableCard[];
  gameState: GameState;
  currentPlayerName?: string;
  roundFirstPlayerName?: string;
  currentRound: number;
}

export interface RoomOptions {
  scoreLimit: number;
  showWinningCard: boolean;
  deckCount: number;
}

export interface RoomDTO extends Omit<Room, "deck" | "players"> {
  opponents: PlayerOpponentDTO[];
  player: Player;
  isHost: boolean;
}

export interface CreateRoomResponse {
  roomId: string;
  playerId: string;
}
