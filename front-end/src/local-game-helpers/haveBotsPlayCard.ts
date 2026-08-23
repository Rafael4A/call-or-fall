import {
  GAME_STATE,
  getBestTableCard,
  getCardValue,
  playCard,
  SOCKET_EVENTS,
  type Room,
} from "shared-code";
import { OfflineBridge } from "./OfflineBridge";
import { updateLocalRoom } from "./updateLocalRoom";

export async function haveBotsPlayCard(room: Room) {
  const currentPlayer = room.players.find(
    (p) => p.username === room.currentPlayerName,
  );

  if (currentPlayer?.isBot) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (room.gameState !== GAME_STATE.Playing) return;

    const chosenCard = pickBestCardToPlay(room);

    const newRoom = playCard(room, currentPlayer.id, chosenCard);

    updateLocalRoom(newRoom);
    OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);
    return true;
  }
  return false;
}

function pickBestCardToPlay(room: Room) {
  const currentPlayer = room.players.find(
    (p) => p.username === room.currentPlayerName,
  )!;
  // If the bot only has 1 card left, it has no choice. Play it.
  if (currentPlayer.cards.length === 1) {
    return currentPlayer.cards[0];
  }

  // Assess the Goal State
  const tricksWon = currentPlayer.score;
  const wantsToWin = tricksWon < (currentPlayer.prediction ?? 0);

  // Assess the Board State
  const tableCards = room.table;
  const isFirstToPlay = tableCards.length === 0;

  const currentBestCard = getBestTableCard(tableCards);
  const currentBestValue = currentBestCard
    ? getCardValue(currentBestCard.card)
    : -1;

  // Track values already on the table to handle the Tie-Cancellation mechanic
  const tableValues = new Set(tableCards.map((c) => getCardValue(c.card)));

  // Sort hand from Lowest to Highest for easier filtering
  const hand = [...currentPlayer.cards].sort(
    (a, b) => getCardValue(a) - getCardValue(b),
  );

  // Bot wants to win
  if (wantsToWin) {
    if (isFirstToPlay) {
      // Lead with the absolute highest card to secure the trick
      return hand[hand.length - 1];
    }

    // Find cards that beat the current winner AND won't cancel out due to a tie
    const winningCards = hand.filter((card) => {
      const val = getCardValue(card);
      return val > currentBestValue && !tableValues.has(val);
    });

    if (winningCards.length > 0) {
      // EFFICIENCY: Play the LOWEST possible winning card to save high cards for later
      return winningCards[0];
    } else {
      // SURRENDER: We can't beat the table.
      // Dump the absolute LOWEST card so we don't waste good cards on a lost trick.
      return hand[0];
    }
  }

  // Bot wants to lose
  else {
    if (isFirstToPlay) {
      // Lead with the absolute lowest card.
      return hand[0];
    }

    // Screw other players over if we can, otherwise play the safest card possible.
    const tieCards = hand.filter((c) => tableValues.has(getCardValue(c)));
    if (tieCards.length > 0) {
      console.log(`${currentPlayer.username} executing offensive Kamikaze!`);
      // Play the HIGHEST tie card to dump maximum liability
      return tieCards[tieCards.length - 1];
    }

    // Standard safe dodge
    const safeLosingCards = hand.filter(
      (c) => getCardValue(c) < currentBestValue,
    );

    if (safeLosingCards.length > 0) {
      // Play the HIGHEST safe losing card
      return safeLosingCards[safeLosingCards.length - 1];
    }

    // Doomed to win
    return hand[hand.length - 1];
  }
}
