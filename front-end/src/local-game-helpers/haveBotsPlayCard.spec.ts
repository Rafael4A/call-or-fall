import {
  createPlayer,
  createRoom,
  GAME_STATE,
  predictRound,
  startGame,
  type CardCode,
  type Room,
} from "shared-code";
import { describe, expect, it } from "vitest";
import { pickBestCardToPlay } from "./haveBotsPlayCard";

function createTestRoom(
  hand: CardCode[],
  prediction: number,
  table: CardCode[] = [],
): Room {
  const newRoom = createRoom("Opponent", "test-room");

  const newPlayer = createPlayer("BotPlayer", true);
  newRoom.players.push(newPlayer);

  newRoom.gameState = GAME_STATE.RoundOver;

  let startedRoom = startGame(newRoom);

  for (let i = 0; i < startedRoom.players.length; i++) {
    const predictingPlayerName = startedRoom.currentPlayerName!;
    const predictingPlayer = startedRoom.players.find(
      (p) => p.username === predictingPlayerName,
    )!;
    startedRoom = predictRound(startedRoom, predictingPlayer.id, 1);
  }

  startedRoom.roundFirstPlayerName = startedRoom.players[0]!.username;
  startedRoom.currentPlayerName = startedRoom.players[1]!.username;

  startedRoom.players[1]!.cards = hand;
  startedRoom.players[1]!.prediction = prediction;
  startedRoom.table = table.map((c) => ({ card: c, owner: "Opponent" }));

  return startedRoom;
}

describe("pickBestCardToPlay", () => {
  it("Plays the only card left if hand size is 1", () => {
    const room = createTestRoom(["AS"], 0, ["2H"]);
    expect(pickBestCardToPlay(room)).toBe("AS");
  });

  describe("Wants to Win (Prediction > 0)", () => {
    it("First to play -> Leads with the highest overall card", () => {
      const room = createTestRoom(["4S", "AS", "8C"], 1, []);
      expect(pickBestCardToPlay(room)).toBe("8C");
    });

    it("Not first & Can win -> Plays the lowest valid winning card", () => {
      const room = createTestRoom(["3S", "KC", "9C"], 2, ["7H"]);
      expect(pickBestCardToPlay(room)).toBe("9C");
    });

    it("Not first & Cannot win -> Dumps the lowest card", () => {
      const room = createTestRoom(["2S", "JC", "5C"], 1, ["JH"]);
      expect(pickBestCardToPlay(room)).toBe("2S");
    });

    it("Not first & Can win but card is a tie -> Dumps lowest card", () => {
      const room = createTestRoom(["3S", "JC"], 1, ["JH"]);
      expect(pickBestCardToPlay(room)).toBe("3S");
    });
  });

  describe("Wants to Lose (Prediction == 0)", () => {
    it("First to play -> Leads with the lowest card", () => {
      const room = createTestRoom(["KS", "5S", "9C"], 0, []);
      expect(pickBestCardToPlay(room)).toBe("5S");
    });

    it("Not first & Has tie card -> Plays the highest tie card to screw players", () => {
      const room = createTestRoom(["2S", "KS", "4C", "8C"], 0, ["4H", "8H"]);
      expect(pickBestCardToPlay(room)).toBe("8C");
    });

    it("Not first & No tie card & Can safely lose -> Plays highest safe losing card", () => {
      const room = createTestRoom(["2S", "AS", "9C", "7C"], 0, ["0H"]);
      expect(pickBestCardToPlay(room)).toBe("9C");
    });

    it("Branch 9: Not first & Doomed to win -> Plays highest card", () => {
      const room = createTestRoom(["8S", "KC", "0C"], 0, ["5H"]);
      expect(pickBestCardToPlay(room)).toBe("KC");
    });
  });
});
