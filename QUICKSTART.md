# 🚀 CivicVerse Quick Start Guide

The Foyer - A decentralized multiplayer civic engagement platform.

## Prerequisites

- **Docker & Docker Compose** - [Install Docker](https://docs.docker.com/get-docker/)
- **Node.js 20+** - [Install Node.js](https://nodejs.org/)
- **Git** - For cloning and version control

## Quick Start (5 minutes)

### 1. Clone and Setup

```bash
git clone https://github.com/Civicverse/Civicverse.git
cd civicverse/beta
cp .env.example .env
```

### 2. Run Development Environment

```bash
bash scripts/dev.sh
```

Or manually with Docker Compose:

```bash
docker-compose up -d
npm install
```

### 3. Access Services

Once everything is running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Game Server**: ws://localhost:4000
- **Craig AI**: http://localhost:8001

## Project Structure

```
civicverse/beta/
├── frontend/              # React 19 + Vite UI
├── backend/               # Node.js/Express API
├── game-server/           # WebSocket multiplayer
├── ai-assistant/          # Craig AI guide
├── smart-contracts/       # Solidity contracts
├── docker-compose.yml     # Service orchestration
├── package.json           # Monorepo config
└── docs/                  # Documentation
```

## Available Commands

### Development

```bash
# Start all services
npm run dev

# Start specific service
cd frontend && npm run dev
cd backend && npm run dev
cd game-server && npm run dev
cd ai-assistant && npm run dev

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down
```

### Production

```bash
bash scripts/deploy.sh
```

### Smart Contracts

```bash
cd smart-contracts
npm install
npm run compile
npm run deploy
```

## Services Overview

### Frontend
React-based UI for The Foyer lobby. Real-time updates, avatar system, mission board.

**Ports**: 3000 (dev), 5173 (Vite)
**Tech**: React 19, Vite, Socket.io

### Backend
Node.js/Express API server. Handles missions, users, authentication, civic data.

**Port**: 8000
**Tech**: Express, MongoDB, JWT, Ceramic

### Game Server
Real-time multiplayer server. Player synchronization, world state, events.

**Port**: 4000 (WebSocket)
**Tech**: Socket.io, Express, WebRTC

### Craig AI Assistant
Civic routing, mission suggestions, DAO interpretation, ethics verification.

**Port**: 8001
**Tech**: Express, Node.js

### Smart Contracts
DAO governance, protocol enforcement, reputation tokens, NFTs.

**Network**: Ethereum, Sepolia testnet
**Tech**: Solidity, Hardhat, OpenZeppelin

## Environment Variables

Key variables in `.env`:

```
# Database
MONGODB_URI=mongodb://mongo:27017/civicverse

# Services
VITE_API_URL=http://localhost:8000
VITE_GAME_SERVER_URL=ws://localhost:4000
VITE_AI_URL=http://localhost:8001

# Security
JWT_SECRET=your_secret_here
```

See `.env.example` for complete list.

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Failed

```bash
# Check MongoDB container
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

### Build Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf **/node_modules

# Reinstall
npm install
```

## Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Game Server README](./game-server/README.md)
- [Craig AI README](./ai-assistant/README.md)
- [Smart Contracts README](./smart-contracts/README.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)

## Support

For issues and questions:
1. Check [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
2. Review service READMEs
3. Check Docker logs: `docker-compose logs`
4. Open an issue on GitHub

## License

See [LICENSE](./docs/LICENSE) for details.

---

**Ready to build The Foyer? Let's go! 🚀**
