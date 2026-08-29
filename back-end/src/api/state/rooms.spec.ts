import { GAME_STATE } from "shared-code";
import { beforeEach, describe, expect, it } from "vitest";
import {
  addRoom,
  clearRooms,
  deleteRoom,
  getAllRooms,
  getRoomById,
  getRoomByIdWithUser,
  roomExists,
} from "./rooms";

describe("Rooms store", () => {
  beforeEach(() => {
    clearRooms();
  });

  describe("addRoom", () => {
    it("should create a new room and store it", () => {
      const room = addRoom("Host");

      expect(room.id).toBeDefined();
      expect(roomExists(room.id)).toBe(true);
    });

    it("should create a room with the host as first player", () => {
      const room = addRoom("Host");

      expect(room.players).toHaveLength(1);
      expect(room.players[0]!.username).toBe("Host");
    });

    it("should generate unique room IDs", () => {
      const room1 = addRoom("Host1");
      const room2 = addRoom("Host2");

      expect(room1.id).not.toBe(room2.id);
    });

    it("should start in WaitingForPlayers state", () => {
      const room = addRoom("Host");

      expect(room.gameState).toBe(GAME_STATE.WaitingForPlayers);
    });
  });

  describe("getRoomById", () => {
    it("should return undefined for non-existent room", () => {
      expect(getRoomById("nonexistent")).toBeUndefined();
    });

    it("should return the room for existing room", () => {
      const room = addRoom("Host");
      const found = getRoomById(room.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(room.id);
    });
  });

  describe("getRoomByIdWithUser", () => {
    it("should return undefined when user is not in room", () => {
      const room = addRoom("Host");
      const found = getRoomByIdWithUser(room.id, "nonexistent-user");

      expect(found).toBeUndefined();
    });

    it("should return room when user is in room", () => {
      const room = addRoom("Host");
      const found = getRoomByIdWithUser(room.id, room.players[0]!.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(room.id);
    });
  });

  describe("roomExists", () => {
    it("should return false for non-existent room", () => {
      expect(roomExists("nonexistent")).toBe(false);
    });

    it("should return true for existing room", () => {
      const room = addRoom("Host");
      expect(roomExists(room.id)).toBe(true);
    });
  });

  describe("getAllRooms", () => {
    it("should return all rooms", () => {
      addRoom("Host1");
      addRoom("Host2");
      addRoom("Host3");

      const rooms = getAllRooms();
      expect(rooms).toHaveLength(3);
    });

    it("should return empty array when no rooms", () => {
      expect(getAllRooms()).toEqual([]);
    });
  });

  describe("deleteRoom", () => {
    it("should delete a room", () => {
      const room = addRoom("Host");
      const result = deleteRoom(room.id);

      expect(result).toBe(true);
      expect(roomExists(room.id)).toBe(false);
    });

    it("should return false for non-existent room", () => {
      const result = deleteRoom("nonexistent");
      expect(result).toBe(false);
    });
  });

  describe("clearRooms", () => {
    it("should clear all rooms", () => {
      addRoom("Host1");
      addRoom("Host2");
      clearRooms();

      expect(getAllRooms()).toEqual([]);
    });
  });
});
