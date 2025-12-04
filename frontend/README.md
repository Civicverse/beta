# CivicVerse Frontend

The CivicVerse frontend provides the React-based UI for The Foyer lobby city, serving as the HUD overlay for the decentralized civic engagement platform.

## Features

- **React 19** - Modern UI framework
- **Vite** - Lightning-fast development and builds
- **Real-time Updates** - Socket.io integration for live mission updates
- **Avatar System** - Display and customize player avatars
- **Mission Board** - Browse and accept civic missions
- **Social Arena** - VOIP-enabled squad formation and chat
- **Newsstand** - Live CivicWatch mission reports
- **Schoolhouse** - Educational content and credentials
- **Universe Portal** - Access to developer-built worlds

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: CSS Modules (extensible to Tailwind)
- **Real-time**: Socket.io-client
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── components/      # Reusable React components
├── pages/           # Page components
├── services/        # API and WebSocket services
├── assets/          # Images, icons, fonts
├── App.jsx          # Main app component
├── main.jsx         # React entry point
├── index.html       # HTML template
├── vite.config.js   # Vite configuration
├── package.json     # Dependencies
└── README.md        # This file
```

## Environment Variables

```
VITE_API_URL=http://localhost:8000
VITE_GAME_SERVER=ws://localhost:4000
VITE_AI_URL=http://localhost:8001
```

## Docker

Build and run:

```bash
docker build -t civicverse-frontend .
docker run -p 3000:3000 civicverse-frontend
```

Or with docker-compose from root directory:

```bash
docker-compose up frontend
```

## Contributing

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines.

## License

ISC - See [LICENSE](../docs/LICENSE) for details.
