# CivicVerse Mining Service

Blockchain node operations and Monero/Kaspa privacy mining for CivicVerse.

## Features

- **Privacy Mining** - Monero XMR support
- **Speed Layer** - Kaspa mining integration
- **Node Operations** - Blockchain synchronization
- **Contribution Tracking** - Transparent mining rewards

## Tech Stack

- Node.js 20+, Express.js

## Getting Started

```bash
npm install
npm run dev
```

Service runs on `http://localhost:5000`

## API Endpoints

- `GET /api/mining/status` - Mining status
- `POST /api/mining/start` - Start mining
- `POST /api/mining/stop` - Stop mining

## Environment Variables

```
NODE_ENV=development
MINING_NETWORK=monero
MINING_POOL=pool.example.com
PORT=5000
```

## Docker

```bash
docker build -t civicverse-mining .
docker run -p 5000:5000 civicverse-mining
```

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines.
