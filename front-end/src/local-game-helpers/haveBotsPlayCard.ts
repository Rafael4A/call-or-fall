import {
  cardSortFunc,
  GAME_STATE,
  getBestTableCard,
  getCardValue,
  playCard,
  SOCKET_EVENTS,
  type Room,
} from "shared-code";
import { BOT_DELAY } from "../constants";
import { OfflineBridge } from "./OfflineBridge";
import { updateLocalRoom } from "./updateLocalRoom";

export async function haveBotsPlayCard(room: Room) {
  const currentPlayer = room.players.find(
    (p) => p.username === room.currentPlayerName,
  );

  if (currentPlayer?.isBot) {
    await new Promise((resolve) => setTimeout(resolve, BOT_DELAY));
    if (room.gameState !== GAME_STATE.Playing) return;

    const chosenCard = pickBestCardToPlay(room);

    const newRoom = playCard(room, currentPlayer.id, chosenCard);

    updateLocalRoom(newRoom);
    OfflineBridge.emitToClient(SOCKET_EVENTS.ROOM_UPDATE);
    return true;
  }
  return false;
}

export function pickBestCardToPlay(room: Room) {
  const currentPlayer = room.players.find(
    (p) => p.username === room.currentPlayerName,
  )!;
  // If the bot only has 1 card left, it has no choice. Play it.
  if (currentPlayer.cards.length === 1) {
    return currentPlayer.cards[0];
  }

  // Assess the Goal State
  const tricksNeeded = Math.max(0, currentPlayer.prediction ?? 0);
  const wantsToWin = tricksNeeded > 0;

  // Assess the Table State
  const tableCards = room.table;
  const isFirstToPlay = tableCards.length === 0;

  const currentBestCard = getBestTableCard(tableCards);
  const currentBestValue = currentBestCard
    ? getCardValue(currentBestCard.card)
    : -1;

  // Track values already on the table to handle the Tie-Cancellation mechanic
  const tableValues = new Set(tableCards.map((c) => getCardValue(c.card)));

  // Sort hand from Lowest to Highest
  const hand = currentPlayer.cards.toSorted(cardSortFunc);

  const winningPoolSize = Math.min(tricksNeeded, hand.length);
  const dodgingPoolSize = hand.length - winningPoolSize;

  const winningPool = hand.slice(dodgingPoolSize); // The highest 'N' cards

  if (wantsToWin) {
    if (isFirstToPlay) {
      // Lead with the highest card overall to confidently secure the trick
      return winningPool[winningPool.length - 1];
    }

    // Try to win using only the designated winning cards
    const validWinningCards = winningPool.filter((card) => {
      const val = getCardValue(card);
      return val > currentBestValue && !tableValues.has(val);
    });

    if (validWinningCards.length > 0) {
      // Play the lowest of the designated winning cards
      return validWinningCards[0];
    } else {
      // Dump the absolute lowest card from the whole hand to save resources
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
      // Play the highest tie card to dump maximum liability
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
