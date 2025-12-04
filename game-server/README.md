# CivicVerse Game Server

The multiplayer game server powering real-time interactions in The Foyer, handling WebSocket/WebRTC connections, player state synchronization, and live gameplay events.

## Features

- **WebSocket Server** - Real-time bidirectional communication
- **P2P Networking** - WebRTC support for optimized player connections
- **Player State Management** - Synchronize avatar positions, actions, and interactions
- **Room/Instance Management** - Support multiple concurrent game worlds
- **Event Broadcasting** - Efficient event propagation to relevant players
- **Mission Tracking** - Real-time mission status updates
- **Social Features** - Squad formation, emotes, and chat relay

## Tech Stack

- **Runtime**: Node.js 20+
- **WebSocket**: Socket.io for real-time communication
- **P2P**: PeerJS for WebRTC connections
- **HTTP**: Express.js for health checks and admin endpoints

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The server will start on `http://localhost:4000`

### Production

```bash
npm start
```

## Configuration

### Environment Variables

```
NODE_ENV=development
PORT=4000
BACKEND_URL=http://localhost:8000
AI_URL=http://localhost:8001
MAX_PLAYERS_PER_ROOM=64
ROOM_TIMEOUT=3600000
```

## WebSocket Events

### Client → Server

- `player:join` - Player enters a world/room
- `player:move` - Position/rotation update
- `player:action` - Action (emote, mission accept, etc)
- `chat:send` - Send chat message
- `squad:invite` - Squad formation request

### Server → Client

- `player:joined` - New player in room
- `player:moved` - Another player's position update
- `player:left` - Player left the room
- `chat:message` - Incoming chat
- `mission:update` - Mission status change
- `server:error` - Server error notification

## Project Structure

```
game-server/
├── index.js           # Main entry point
├── package.json       # Dependencies
├── Dockerfile         # Container config
├── README.md          # This file
```

## Docker

Build and run:

```bash
docker build -t civicverse-game-server .
docker run -p 4000:4000 civicverse-game-server
```

Or with docker-compose from root directory:

```bash
docker-compose up game-server
```

## Contributing

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines.

## License

ISC - See [LICENSE](../docs/LICENSE) for details.
