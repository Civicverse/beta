# CivicVerse Backend

The CivicVerse backend API server providing the core infrastructure for The Foyer lobby city.

## Features

- **REST API** - Express.js server for all backend services
- **Real-time Communication** - Socket.io integration for live updates
- **Database** - MongoDB connectivity for user data, missions, and civic records
- **Authentication** - JWT-based authentication with bcrypt password hashing
- **Blockchain Integration** - Ceramic and Web3 support for decentralized identity

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Decentralized**: Ceramic, Web3

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB running locally or remote connection string

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The server will start on `http://localhost:8000`

### Production

```bash
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/missions` - List available missions
- `GET /api/users/:id` - Get user profile
- `POST /api/users` - Create user account

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/civicverse
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
GAME_SERVER_URL=ws://localhost:4000
AI_URL=http://localhost:8001
```

## Docker

Build and run:

```bash
docker build -t civicverse-backend .
docker run -p 8000:8000 civicverse-backend
```

Or with docker-compose from root directory:

```bash
docker-compose up backend
```

## Project Structure

```
backend/
├── routes/          # API route handlers
├── services/        # Business logic
├── ai-protocols/    # AI integration
├── data/            # Data models and schemas
├── index.js         # Main entry point
├── Dockerfile       # Container configuration
└── package.json     # Dependencies
```

## Contributing

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines.
