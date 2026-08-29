import { describe, expect, it } from "vitest";
import { CARDS_CODES, GAME_STATE } from "../constants";
import type { Room } from "../types";
import { createPlayer } from "./createPlayer";
import { createRoom } from "./createRoom";
import { startGame } from "./startGame";

function createTestRoom(
  playerCount: number,
  deckCount: number,
  currentRound: number,
): Room {
  if (playerCount < 2) {
    throw new Error("Player count must be at least 2 before dealing cards.");
  }

  const playerNames = Array.from(
    { length: playerCount },
    (_, i) => `Player${i + 1}`,
  );

  const [firstPlayerName, ...otherPlayerNames] = playerNames;
  const newRoom = createRoom(firstPlayerName!, "test-room");

  for (const playerName of otherPlayerNames) {
    const newPlayer = createPlayer(playerName, false);
    newRoom.players.push(newPlayer);
  }

  newRoom.currentRound = currentRound;
  newRoom.gameState = GAME_STATE.RoundOver;

  return startGame(newRoom, {
    deckCount: deckCount,
    scoreLimit: 10,
    showWinningCard: false,
  });
}

// Tested indirectly through startGame
describe("dealCards", () => {
  it("should deal currentRound cards to each player", () => {
    const room = createTestRoom(3, 1, 1);

    for (const player of room.players) {
      expect(player.cards).toHaveLength(1);
    }
  });

  it("should deal correct number of cards for round 2", () => {
    const room = createTestRoom(2, 1, 2);
    console.log(
      room,
      room.players.map((p) => p.cards),
      room.deck.length,
    );
    for (const player of room.players) {
      expect(player.cards).toHaveLength(2);
    }
  });

  it("should deal correct number of cards for round 3", () => {
    const room = createTestRoom(4, 1, 3);

    for (const player of room.players) {
      expect(player.cards).toHaveLength(3);
    }
  });

  it("should remove dealt cards from the deck", () => {
    const deckCount = 1;
    const playerCount = 2;
    const currentRound = 2;
    const room = createTestRoom(playerCount, deckCount, currentRound);
    const initialDeckLength = CARDS_CODES.length * deckCount;

    expect(room.deck.length).toBe(
      initialDeckLength - playerCount * currentRound,
    );
  });

  it("should deal with multiple decks", () => {
    const room = createTestRoom(2, 2, 1);

    for (const player of room.players) {
      expect(player.cards).toHaveLength(1);
    }

    expect(room.deck.length).toBe(104 - 2);
  });
});
