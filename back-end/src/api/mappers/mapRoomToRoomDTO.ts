import type { Room, RoomDTO } from "shared-code";

export function mapRoomToRoomDTO(room: Room, userId: string): RoomDTO {
  const { players, deck, ...roomWithoutPlayersAndDeck } = room;

  const player = players.find(({ id }) => id === userId);
  if (!player)
    throw new Error(`Player with id ${userId} not found in room ${room.id}`);

  const opponents = players
    .filter(({ id }) => id !== userId)
    .map(({ username, score, isBot, prediction, currentRoundScore }) => ({
      username,
      score,
      isBot,
      prediction,
      currentRoundScore,
    }));

  const censoredPlayer = structuredClone(player);
  if (room.currentRound === 1) {
    censoredPlayer.cards = ["HIDDEN"];
  }

  return {
    ...roomWithoutPlayersAndDeck,
    player: censoredPlayer,
    opponents,
    isHost: players[0]?.id === userId,
  };
}
