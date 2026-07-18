export function shuffleDeck<T>(deck: T[]): T[] {
  const shuffledDeck = [...deck];
  if (shuffledDeck.length < 2) return shuffledDeck;
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements shuffledDeck[i] and shuffledDeck[j]
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j]!, shuffledDeck[i]!];
  }
  return shuffledDeck;
}
