# Craig - CivicVerse AI Assistant

Craig is the always-on civic AI guide for The Foyer, providing mission suggestions, civic routing, and ethical alignment verification.

## Features

- **Mission Routing** - Suggests nearby missions and civic goals
- **DAO Interpretation** - Interprets and explains DAO proposals
- **Ethical Alignment** - Fryboy Test verification for protocol integrity
- **Context-Aware** - Learns from user reputation and choices
- **Voice Optional** - Text and voice interfaces

## Tech Stack

- Node.js 20+, Express.js, Socket.io

## Getting Started

```bash
npm install
npm run dev
```

Server runs on `http://localhost:8001`

## API Endpoints

- `GET /api/missions/nearby` - Nearby missions
- `POST /api/craig/suggest` - Get AI suggestions
- `GET /api/craig/dao-proposal/:id` - DAO interpretation
- `GET /api/craig/fryboy-test` - Ethics check

## Environment Variables

```
NODE_ENV=development
BACKEND_URL=http://localhost:8000
GAME_SERVER_URL=ws://localhost:4000
PORT=8001
```

## Docker

```bash
docker build -t civicverse-craig-ai .
docker run -p 8001:8001 civicverse-craig-ai
```

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines.
