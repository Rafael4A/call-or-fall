import {
  CARDS_CODES,
  GAME_LIMITS,
  GAME_STATE,
  INITIAL_ROOM_OPTIONS,
} from "../constants";
import type { GameState, Room, RoomOptions } from "../types";
import { safeClamp } from "../utils";
import { dealCards } from "./dealCards";
import { shuffleDeck } from "./shuffleDeck";

export function startGame(room: Room, roomOptions?: RoomOptions): Room {
  const _room = structuredClone(room);

  if (roomOptions) {
    _room.options.deckCount = safeClamp(
      roomOptions.deckCount || INITIAL_ROOM_OPTIONS.deckCount,
      GAME_LIMITS.MIN_DECK_COUNT,
      GAME_LIMITS.MAX_DECK_COUNT,
    );

    _room.options.scoreLimit = safeClamp(
      roomOptions.scoreLimit || INITIAL_ROOM_OPTIONS.scoreLimit,
      GAME_LIMITS.MIN_SCORE_LIMIT,
      GAME_LIMITS.MAX_SCORE_LIMIT,
    );

    _room.options.showWinningCard = !!roomOptions.showWinningCard;
  }

  const possibleStatesToStartGame: GameState[] = [
    GAME_STATE.WaitingForPlayers,
    GAME_STATE.TrickOver,
    GAME_STATE.RoundOver,
  ];

  if (!possibleStatesToStartGame.includes(_room.gameState)) {
    throw new Error("Game cannot be started at this time");
  }

  if (_room.players.length < 2) {
    throw new Error("Not enough players to start the game");
  }

  if (_room.gameState === GAME_STATE.WaitingForPlayers) {
    const randomIndex = Math.floor(Math.random() * _room.players.length);
    _room.roundFirstPlayerName = _room.players[randomIndex]?.username;
    _room.currentPlayerName = _room.roundFirstPlayerName;
    _room.currentRound = 1;
  }

  // If score limit has been reached, or not enough cards, end the game
  if (_room.gameState === GAME_STATE.RoundOver) {
    const amountOfCardsForNextRound =
      (_room.currentRound + 1) * _room.players.length;
    const amountOfCardsInDeck = _room.options.deckCount * CARDS_CODES.length;

    const highestScore = Math.max(
      ..._room.players.map((player) => player.score),
    );

    if (
      amountOfCardsForNextRound > amountOfCardsInDeck ||
      highestScore >= _room.options.scoreLimit
    ) {
      _room.gameState = GAME_STATE.GameOver;
      return _room;
    }
  }

  const statesToDealCards: GameState[] = [
    GAME_STATE.WaitingForPlayers,
    GAME_STATE.RoundOver,
  ];

  _room.table = [];

  if (statesToDealCards.includes(_room.gameState)) {
    const currentStartingPlayerIndex = _room.players.findIndex(
      (player) => player.username === _room.roundFirstPlayerName,
    );

    const nextPlayerIndex =
      (currentStartingPlayerIndex + 1) % _room.players.length;

    _room.currentPlayerName = _room.players[nextPlayerIndex]?.username;
    _room.roundFirstPlayerName = _room.currentPlayerName;

    _room.gameState = GAME_STATE.Predicting;

    for (const player of _room.players) {
      player.prediction = undefined;
      player.originalPrediction = undefined;
      player.currentRoundScore = 0;
    }

    const newDeck = Array.from(
      { length: _room.options.deckCount },
      () => CARDS_CODES,
    ).flat();

    _room.deck = shuffleDeck(newDeck);

    return dealCards(_room);
  } else {
    _room.gameState = GAME_STATE.Playing;
  }

  return _room;
}
