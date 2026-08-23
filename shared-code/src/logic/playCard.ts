import { GAME_STATE, HIDDEN_CARD } from "../constants";
import type { CardCode, Player, Room } from "../types";
import { getBestTableCard } from "./getBestTableCard";
import { getNextPlayerName } from "./getNextPlayerName";

export function playCard(room: Room, playerId: string, card: CardCode): Room {
  const _room = structuredClone(room);

  if (_room.gameState !== GAME_STATE.Playing) {
    throw new Error("Game not in playing state");
  }

  const player = _room.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  if (_room.currentPlayerName !== player.username) {
    throw new Error("It's not the player's turn to play a card");
  }

  const actuallyPlayedCard =
    card === HIDDEN_CARD && _room.currentRound <= 1 ? player.cards[0]! : card;

  if (!player.cards.includes(actuallyPlayedCard)) {
    throw new Error("Player does not have the specified card");
  }

  // Update player cards and add to table directly on _room
  player.cards = player.cards.filter((c) => c !== actuallyPlayedCard);
  _room.table.push({ card: actuallyPlayedCard, owner: player.username });

  // Check if all players have played their turns
  const allPlayersPlayed = _room.table.length === _room.players.length;

  if (!allPlayersPlayed) {
    _room.currentPlayerName = getNextPlayerName(_room);
    return _room;
  }

  // Handle Trick Over
  _room.gameState = GAME_STATE.TrickOver;
  const trickWinningTableCard = getBestTableCard(_room.table);

  if (trickWinningTableCard) {
    const cardOwner = _room.players.find(
      (p) => p.username === trickWinningTableCard.owner,
    ) as Player;

    if (cardOwner.prediction == null)
      throw new Error("Card owner prediction is undefined");

    cardOwner.prediction -= 1;
    cardOwner.currentRoundScore += 1;
    _room.currentPlayerName = cardOwner.username;
  } else {
    _room.currentPlayerName = getNextPlayerName(_room);
  }

  // Handle Round Over
  if (_room.players.every((p) => p.cards.length === 0)) {
    for (const p of _room.players) {
      p.score += Math.abs(p.prediction ?? 0);
    }
    _room.gameState = GAME_STATE.RoundOver;
    _room.currentRound += 1;
  }

  return _room;
}
