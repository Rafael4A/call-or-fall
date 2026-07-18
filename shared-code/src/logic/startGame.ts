import { CARDS_CODES } from "../constants/CARD_CODES.js";
import { GAME_STATE } from "../constants/GAME_STATE.js";
import type { Room } from "../types/Room.js";
import { dealCards } from "./dealCards.js";
import { shuffleDeck } from "./shuffleDeck.js";

export function startGame(room: Room): Room {
  const _room = structuredClone(room);
  if (_room.gameState !== GAME_STATE.WaitingForPlayers)
    throw new Error("Game already started");

  if (_room.players.length < 2)
    throw new Error("Not enough players to start the game");

  _room.gameState = GAME_STATE.Predicting;

  const randomIndex = Math.floor(Math.random() * _room.players.length);
  _room.roundFirstPlayerName = _room.players[randomIndex]?.username;
  _room.currentPlayerName = _room.roundFirstPlayerName;

  const newDeck = Array.from(
    { length: _room.options.deckCount },
    () => CARDS_CODES,
  ).flat();

  _room.deck = shuffleDeck(newDeck);
  _room.currentRound = 1;

  return dealCards(_room);
}
