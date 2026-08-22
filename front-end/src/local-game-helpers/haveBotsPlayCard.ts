import { GAME_STATE, playCard, SOCKET_EVENTS, type Room } from "shared-code";
import { OfflineBridge } from "./OfflineBridge";
import { updateLocalRoom } from "./updateLocalRoom";

export async function haveBotsPlayCard(room: Room) {
  const currentPlayer = room.players.find(
    (p) => p.username === room.currentPlayerName,
  );

  if (currentPlayer?.isBot) {
    // TODO make it smarter, for now just random card
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (room.gameState !== GAME_STATE.Playing) return;

    const chosenCard =
      currentPlayer.cards[
        Math.floor(Math.random() * currentPlayer.cards.length)
      ];

    const newRoom = playCard(room, currentPlayer.id, chosenCard);

    updateLocalRoom(newRoom);
    OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);
  }
}
