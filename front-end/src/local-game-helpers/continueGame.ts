import {
  GAME_STATE,
  SOCKET_EVENTS,
  startGame,
  type GameState,
  type Room,
} from "shared-code";
import { haveBotsPlayCard } from "./haveBotsPlayCard";
import { haveBotsPredict } from "./haveBotsPredict";
import { OfflineBridge } from "./OfflineBridge";
import { updateLocalRoom } from "./updateLocalRoom";

export async function continueGame(room: Room) {
  const botsPredicted = await haveBotsPredict(room);
  if (botsPredicted) return;

  const botsPlayed = await haveBotsPlayCard(room);
  if (botsPlayed) return;

  const possibleGameStates: GameState[] = [
    GAME_STATE.RoundOver,
    GAME_STATE.TurnOver,
  ];
  if (possibleGameStates.includes(room.gameState)) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const newRoom = startGame(room);
    updateLocalRoom(newRoom);
    OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);
  }
}
