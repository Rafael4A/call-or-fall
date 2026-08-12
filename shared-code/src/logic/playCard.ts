import { GAME_STATE } from "../constants/GAME_STATE.js";
import type { CardCode } from "../types/CardCode.js";
import type { Player } from "../types/Player.js";
import type { Room } from "../types/Room.js";
import { getBestTableCard } from "./getBestTableCard.js";

export function playCard(room: Room, playerId: string, card: CardCode): Room {
  const _room = structuredClone(room);
  if (_room.gameState !== GAME_STATE.Playing)
    throw new Error("Game not in playing state");

  const player = _room.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  if (room.currentPlayerName !== player.username) {
    throw new Error("It's not the player's turn to play a card");
  }

  const actuallyPlayedCard =
    card === "HIDDEN" && _room.currentRound <= 1 ? player.cards[0]! : card;

  if (!player.cards.some((c) => c === actuallyPlayedCard)) {
    throw new Error("Player does not have the specified card");
  }

  const newPlayer = {
    ...player,
    cards: player.cards.filter((c) => c !== actuallyPlayedCard),
  };

  const roomWithNewPlayer = {
    ..._room,
    table: [
      ..._room.table,
      { card: actuallyPlayedCard, owner: player.username },
    ],
    players: _room.players.map((p) => (p.id === playerId ? newPlayer : p)),
  };

  // check if all players have played their turns
  const allPlayersPlayed =
    roomWithNewPlayer.table.length === roomWithNewPlayer.players.length;

  console.log("#\n#", "allplayersPlayed", allPlayersPlayed);
  if (allPlayersPlayed) {
    roomWithNewPlayer.gameState = GAME_STATE.TurnOver;
    const roundWinningTableCard = getBestTableCard(roomWithNewPlayer.table);
    console.log("#", "roundWinningTableCard", roundWinningTableCard);
    if (roundWinningTableCard) {
      console.log({
        roundWinningCard: roundWinningTableCard.card,
        cardOwner: JSON.stringify(roundWinningTableCard.owner),
      });

      const cardOwner = roomWithNewPlayer.players.find(
        (player) => player.username === roundWinningTableCard.owner,
      ) as Player;

      if (cardOwner.prediction == null)
        throw new Error("Card owner prediction is undefined");

      console.log("#", "cardOwner", cardOwner);
      cardOwner.prediction -= 1;
      roomWithNewPlayer.currentPlayerName = cardOwner.username;
    }

    if (
      roomWithNewPlayer.players.every((player) => player.cards.length === 0)
    ) {
      console.log("#", "roundOver");
      for (const player of roomWithNewPlayer.players) {
        player.score += Math.abs(player.prediction ?? 0);
        player.prediction = undefined;
      }
      roomWithNewPlayer.gameState = GAME_STATE.RoundOver;
      roomWithNewPlayer.currentRound += 1;
    }
  } else {
    console.log("#keepon");
    const currentPlayerIndex = roomWithNewPlayer.players.findIndex(
      (player) => player.id === playerId,
    );
    const nextPlayerIndex =
      (currentPlayerIndex + 1) % roomWithNewPlayer.players.length;

    roomWithNewPlayer.currentPlayerName =
      roomWithNewPlayer.players[nextPlayerIndex]?.username;
  }

  return roomWithNewPlayer;
}
