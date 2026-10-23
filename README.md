# Call or Fall

A real-time multiplayer card game for up to 8 players. Built with React, Express, and Socket.io.

## About the Game

Call or Fall is a bidding card game where players try to predict how many rounds they'll win before playing their cards.

### Rules

- **Dealing**: Round 1: 1 card per player. Round 2: 2 cards each. Round 3: 3 cards each. And so on.
- **Hidden cards**: On the first round only, you cannot see your own card, only your opponents'.
- **Bidding**: Before every round, each player predicts how many of their current cards they think they'll win. To win a card, you must play the highest card among all players.
- **Penalties**: Players who miss their prediction receive penalty points (more points = worse).
- **Bid constraint**: The sum of all predictions cannot equal the total number of cards in play. If Alice bids 2 and Bob bids 0 on a 3-card round, Carol cannot bid 1 (2+0+1=3). She must bid 0, 2, or 3.
- **Tiebreaker**: When two or more players play cards of the same value, those cards cancel each other out and score nothing.
- **Game end**: The game ends when the deck is exhausted. The player with the fewest penalty points wins.

### Features

- Online multiplayer with up to 8 simultaneous players
- Offline mode via PWA with cached assets, play against bots
- Real-time communication over WebSockets (Socket.io)
- Room creation and management
- Customizable game settings (point limit, golden border on winning cards)
- Full game lifecycle: create room, join, bid, play cards, evaluate rounds, ranking, surrender

## Project Structure

```
call-or-fall/
├── front-end/     React + Vite + MUI client
├── back-end/      Express + Socket.io server
├── shared-code/   Shared types, constants, and game logic
├── Dockerfile
└── docker-compose.yaml
```

## Getting Started

### Prerequisites

- Node.js 24+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Builds `shared-code` then runs all three packages concurrently in watch mode.

### Production

```bash
npm run prod
```

Builds everything and starts the backend server.

### Tests

```bash
npm test
```

Runs tests across all packages.

### Circular Dependency Check

```bash
npm run check-deps
```

## Docker

```bash
docker compose up --build
```
