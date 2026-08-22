import type { CardCode } from "./CardCode";
import type { GameState } from "./GameState";
import type { Player, PlayerOpponentDTO } from "./Player";
import type { TableCard } from "./TableCard";

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
