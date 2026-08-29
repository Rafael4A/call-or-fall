import { describe, expect, it } from "vitest";
import { GAME_STATE, HIDDEN_CARD } from "../constants";
import type { Room } from "../types";
import { createPlayer } from "./createPlayer";
import { createRoom } from "./createRoom";
import { playCard } from "./playCard";
import { predictRound } from "./predictRound";
import { startGame } from "./startGame";

function createPlayingRoom(playerNames: string[], round: number = 1): Room {
  if (playerNames.length < 2) {
    throw new Error("Player count must be at least 2 before dealing cards.");
  }

  const [firstPlayerName, ...otherPlayerNames] = playerNames;
  const newRoom = createRoom(firstPlayerName!, "test-room");
  for (const playerName of otherPlayerNames) {
    const newPlayer = createPlayer(playerName, false);
    newRoom.players.push(newPlayer);
  }

  newRoom.currentRound = round;
  newRoom.gameState = GAME_STATE.RoundOver;

  let startedRoom = startGame(newRoom);
  for (let i = 0; i < startedRoom.players.length; i++) {
    const predictingPlayerName = startedRoom.currentPlayerName!;
    const predictingPlayer = startedRoom.players.find(
      (p) => p.username === predictingPlayerName,
    )!;
    startedRoom = predictRound(startedRoom, predictingPlayer.id, 0);
  }
  startedRoom.currentPlayerName = startedRoom.players[0]!.username;
  startedRoom.roundFirstPlayerName = startedRoom.players[0]!.username;

  return startedRoom;
}

describe("playCard - validation", () => {
  it("should throw when game state is not Playing", () => {
    const room: Room = {
      id: "test-room",
      players: [createPlayer("A"), createPlayer("B")],
      options: { scoreLimit: 10, showWinningCard: false, deckCount: 1 },
      deck: [],
      table: [],
      gameState: GAME_STATE.Predicting,
      currentPlayerName: "A",
      roundFirstPlayerName: "A",
      currentRound: 1,
    };

    expect(() => playCard(room, room.players[0]!.id, "AS")).toThrow(
      "Game not in playing state",
    );
  });

  it("should throw when player not found", () => {
    const room = createPlayingRoom(["A", "B"]);
    room.gameState = GAME_STATE.Playing;

    expect(() => playCard(room, "nonexistent-id", "AS")).toThrow(
      "Player not found",
    );
  });

  it("should throw when it is not the player's turn", () => {
    const room = createPlayingRoom(["A", "B"]);
    room.gameState = GAME_STATE.Playing;
    room.currentPlayerName = "A";

    expect(() => playCard(room, room.players[1]!.id, "AS")).toThrow(
      "It's not the player's turn to play a card",
    );
  });

  it("should throw when player does not have the card", () => {
    const room = createPlayingRoom(["A", "B"]);
    room.currentPlayerName = "A";

    const notInHand = "KH";
    if (room.players[0]!.cards.includes(notInHand)) {
      return;
    }

    expect(() => playCard(room, room.players[0]!.id, notInHand)).toThrow(
      "Player does not have the specified card",
    );
  });
});

describe("playCard - basic behavior", () => {
  it("should remove card from player's hand", () => {
    const room = createPlayingRoom(["A", "B"]);
    room.currentPlayerName = "A";
    const cardToPlay = room.players[0]!.cards[0]!;

    const result = playCard(room, room.players[0]!.id, cardToPlay);

    expect(result.players[0]!.cards).not.toContain(cardToPlay);
  });

  it("should add card to the table", () => {
    const room = createPlayingRoom(["A", "B"]);
    room.currentPlayerName = "A";
    const cardToPlay = room.players[0]!.cards[0]!;

    const result = playCard(room, room.players[0]!.id, cardToPlay);

    expect(result.table).toHaveLength(1);
    expect(result.table[0]!.card).toBe(cardToPlay);
    expect(result.table[0]!.owner).toBe("A");
  });

  it("should change turn to next player when not all have played", () => {
    const room = createPlayingRoom(["A", "B", "C"]);
    room.currentPlayerName = "A";

    const result = playCard(
      room,
      room.players[0]!.id,
      room.players[0]!.cards[0]!,
    );

    expect(result.currentPlayerName).toBe("B");
    expect(result.gameState).toBe(GAME_STATE.Playing);
  });

  it("should not change state to TrickOver when not all players have played", () => {
    const room = createPlayingRoom(["A", "B", "C"]);
    room.currentPlayerName = "A";

    const result = playCard(
      room,
      room.players[0]!.id,
      room.players[0]!.cards[0]!,
    );

    expect(result.gameState).not.toBe(GAME_STATE.TrickOver);
  });

  it("should handle the last player playing (trick resolution) with 3 players in round 2", () => {
    const room = createPlayingRoom(["A", "B", "C"], 2);
    room.currentPlayerName = "A";
    room.players.forEach((p) => (p.prediction = 2));

    // A plays first card (has 2 cards)
    const cardA = room.players[0]!.cards[0]!;
    const afterFirst = playCard(room, room.players[0]!.id, cardA);
    expect(afterFirst.gameState).toBe(GAME_STATE.Playing);
    expect(afterFirst.currentPlayerName).toBe("B");

    // B plays first card
    const cardB = afterFirst.players[1]!.cards[0]!;
    const afterSecond = playCard(afterFirst, room.players[1]!.id, cardB);
    expect(afterSecond.gameState).toBe(GAME_STATE.Playing);
    expect(afterSecond.currentPlayerName).toBe("C");

    // C plays first card
    const cardC = afterSecond.players[2]!.cards[0]!;
    const afterThird = playCard(afterSecond, room.players[2]!.id, cardC);

    expect(afterThird.gameState).toBe(GAME_STATE.TrickOver);
    expect(afterThird.table).toHaveLength(3);
    // Players still have 1 card each, so not RoundOver
    expect(afterThird.players.every((p) => p.cards.length > 0)).toBe(true);
  });
});

describe("playCard - round over", () => {
  it("should score predictions and transition to RoundOver when all cards played", () => {
    const room = createPlayingRoom(["A", "B"], 1);
    room.players[0]!.prediction = 1;
    room.players[1]!.prediction = 0;
    room.currentPlayerName = "A";

    // A plays (last card for A in round 1)
    const cardA = room.players[0]!.cards[0]!;
    const r1 = playCard(room, room.players[0]!.id, cardA);
    expect(r1.gameState).toBe(GAME_STATE.Playing);
    expect(r1.currentPlayerName).toBe("B");

    // B plays last card (last card for B in round 1)
    const cardB = r1.players[1]!.cards[0]!;
    const r2 = playCard(r1, room.players[1]!.id, cardB);

    expect(r2.gameState).toBe(GAME_STATE.RoundOver);
    expect(r2.currentRound).toBe(2);
  });

  it("should add absolute prediction value to score on round over", () => {
    const room = createPlayingRoom(["A", "B"], 1);
    room.players[0]!.prediction = 2;
    room.players[1]!.prediction = 0;
    room.currentPlayerName = "A";

    // A plays (wins trick, prediction 2->1)
    const cardA = room.players[0]!.cards[0]!;
    const r1 = playCard(room, room.players[0]!.id, cardA);

    // B plays last card (trick resolution happens)
    const cardB = r1.players[1]!.cards[0]!;
    const r2 = playCard(r1, room.players[1]!.id, cardB);

    // Both predictions are absolute-valued and added to scores on round over
    // A started with prediction 2, B with 0
    // After trick resolution, predictions may have changed
    expect(r2.players[0]!.score).toBe(Math.abs(r2.players[0]!.prediction ?? 0));
    expect(r2.players[1]!.score).toBe(Math.abs(r2.players[1]!.prediction ?? 0));
  });
});

describe("playCard - first round hidden card", () => {
  it("should use HIDDEN_CARD sentinel on first round when card is HIDDEN_CARD", () => {
    const room = createPlayingRoom(["A", "B"], 1);
    room.currentPlayerName = "A";

    const result = playCard(room, room.players[0]!.id, HIDDEN_CARD);

    expect(result.table[0]!.card).not.toBe(HIDDEN_CARD);
    expect(result.players[0]!.cards).not.toContain(result.table[0]!.card);
  });
});

describe("playCard - immutability", () => {
  it("should not modify the original room", () => {
    const room = createPlayingRoom(["A", "B"]);
    room.currentPlayerName = "A";
    const originalCards = room.players[0]!.cards.slice();
    const originalTableLength = room.table.length;

    playCard(room, room.players[0]!.id, room.players[0]!.cards[0]!);

    expect(room.players[0]!.cards).toEqual(originalCards);
    expect(room.table.length).toBe(originalTableLength);
  });
});
