import { GAME_STATE, HIDDEN_CARD } from "../constants";
import type { Room, RoomDTO, TableCard } from "../types";

export function mapRoomToRoomDTO(room: Room, userId: string): RoomDTO {
  const { players, deck, ...roomWithoutPlayersAndDeck } = room;

  const player = players.find(({ id }) => id === userId);
  if (!player)
    throw new Error(`Player with id ${userId} not found in room ${room.id}`);

  const opponents = players.filter(({ id }) => id !== userId);

  const mappedOpponents = opponents.map(
    ({
      username,
      score,
      isBot,
      prediction,
      originalPrediction,
      currentRoundScore,
    }) => ({
      username,
      score,
      isBot,
      prediction,
      originalPrediction,
      currentRoundScore,
    }),
  );

  const censoredPlayer = structuredClone(player);
  if (censoredPlayer.cards.length > 0 && room.currentRound === 1) {
    censoredPlayer.cards = [HIDDEN_CARD];
  }

  const shouldShowOpponentCardsOnTable =
    room.currentRound === 1 && room.gameState === GAME_STATE.Predicting;
  const opponentsTableCards: TableCard[] =
    opponents.map((opponent) => ({
      card: opponent.cards?.[0] || HIDDEN_CARD, // Should never show HIDDEN here, fallback for type safety
      owner: opponent.username,
    })) ?? [];

  return {
    ...roomWithoutPlayersAndDeck,
    player: censoredPlayer,
    opponents: mappedOpponents,
    isHost: players[0]?.id === userId,
    table: shouldShowOpponentCardsOnTable ? opponentsTableCards : room.table,
  };
}
