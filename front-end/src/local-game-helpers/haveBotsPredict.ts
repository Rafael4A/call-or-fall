import { GAME_STATE, predictTurn, SOCKET_EVENTS, type Room } from "shared-code";
import { OfflineBridge } from "./OfflineBridge";
import { updateLocalRoom } from "./updateLocalRoom";

export async function haveBotsPredict(room: Room) {
  const currentPlayer = room.players.find(
    (p) => p.username === room.currentPlayerName,
  );

  if (currentPlayer?.isBot) {
    // TODO make it smarter, for now just random prediction
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (room.gameState !== GAME_STATE.Predicting) return;

    const newRoom = predictTurn(
      room,
      currentPlayer.id,
      Math.floor(Math.random() * (room.currentRound + 1)),
    );

    updateLocalRoom(newRoom);
    OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);
  }
}
