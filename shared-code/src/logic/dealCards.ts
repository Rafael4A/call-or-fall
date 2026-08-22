import type { Room } from "../types";

export function dealCards(room: Room) {
  const _room = structuredClone(room);
  const cardsPerPlayer = _room.currentRound;
  for (const player of _room.players) {
    player.cards = _room.deck.splice(0, cardsPerPlayer);
  }
  return _room;
}
