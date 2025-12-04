# 🎯 CivicVerse Setup & Deployment Guide

Complete guide for setting up, developing, and deploying The Foyer.

## Quick Verification

Before starting, verify the repository structure:

```bash
bash scripts/verify.sh
```

This checks:
- ✅ All core configuration files
- ✅ Service package.json files
- ✅ Service README files
- ✅ Dockerfiles for containerization
- ✅ Deployment scripts

## Prerequisites

- **Docker & Docker Compose** - [Install](https://docs.docker.com/get-docker/)
- **Node.js 20+** - [Install](https://nodejs.org/)
- **Git** - For version control
- **RAM**: 4GB+ recommended
- **Disk**: 5GB+ for Docker images and node_modules

## Installation & Development

### Step 1: Clone Repository

```bash
git clone https://github.com/Civicverse/Civicverse.git
cd civicverse/beta
```

### Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration if needed
```

### Step 3: Start Development Environment

#### Option A: Automated (Recommended)

```bash
bash scripts/dev.sh
```

This automatically:
1. Checks Docker is running
2. Installs dependencies
3. Starts all services
4. Waits for MongoDB
5. Displays service URLs

#### Option B: Manual with Docker Compose

```bash
# Install dependencies
npm install

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Step 4: Access Services

Once everything is running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | The Foyer UI |
| Backend | http://localhost:8000 | REST API |
| Game Server | ws://localhost:4000 | WebSocket multiplayer |
| Craig AI | http://localhost:8001 | AI Assistant |
| Mining | http://localhost:5000 | Blockchain mining |
| MongoDB | mongodb://localhost:27017 | Database |

## Development Workflow

### Individual Service Development

```bash
# Terminal 1: Frontend
cd frontend
npm install
npm run dev

# Terminal 2: Backend
cd backend
npm install
npm run dev

# Terminal 3: Game Server
cd game-server
npm install
npm run dev

# Terminal 4: Craig AI
cd ai-assistant
npm install
npm run dev
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f game-server
```

### Stop Services

```bash
# Stop all
docker-compose down

# Remove volumes (clears database)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

## Smart Contracts Development

### Setup

```bash
cd smart-contracts
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Deploy to Local Network

```bash
# Start Hardhat local network (in another terminal)
npx hardhat node

# In another terminal, deploy
npm run deploy
npm run deploy-craig
npm run deploy-dao
```

### Run Tests

```bash
npm test
```

### Deploy to Testnet

```bash
# Update PRIVATE_KEY in .env
npm run deploy -- --network sepolia
```

## Monorepo Commands

From the root directory, use these commands for all services:

```bash
# Install dependencies for all workspaces
npm install

# Run dev scripts for all services
npm run dev

# Run tests for all services
npm test

# Build all services
npm run build

# Start all services
npm start
```

## Production Deployment

### Using Automated Script

```bash
bash scripts/deploy.sh
```

This:
1. Builds Docker images
2. Starts services in production mode
3. Performs health checks
4. Shows service status

### Manual Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Health Checks

Test service health:

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:8000/health

# Game Server
curl http://localhost:4000/health

# Craig AI
curl http://localhost:8001/health

# Mining
curl http://localhost:5000/health
```

## Docker Management

### View All Services

```bash
docker-compose ps
```

### View Service Logs

```bash
docker-compose logs -f [service-name]
```

### Restart a Service

```bash
docker-compose restart [service-name]
```

### Remove Everything

```bash
# Stop and remove all containers, volumes
docker-compose down -v

# Remove images
docker-compose down -v --rmi all
```

## Troubleshooting

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Failed

```bash
# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo

# Check if it's ready
docker-compose exec mongo mongo --eval "db.adminCommand('ping')"
```

### Memory Issues

If services are crashing due to memory:

```bash
# Increase Docker memory allocation
# Docker Desktop: Settings → Resources → Memory (increase to 8GB+)

# Or limit specific services in docker-compose.yml:
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Remove all node_modules
find . -type d -name node_modules -exec rm -rf {} +

# Reinstall
npm install
```

### Docker Daemon Not Running

On macOS/Windows:
```bash
# Start Docker Desktop application
open /Applications/Docker.app

# Or on Linux, start Docker service
sudo systemctl start docker
```

## Environment Variables Reference

See `.env.example` for complete list. Key variables:

```
# Backend
MONGODB_URI=mongodb://mongo:27017/civicverse
JWT_SECRET=your_secret_here_change_in_production
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:8000
VITE_GAME_SERVER_URL=ws://localhost:4000
VITE_AI_URL=http://localhost:8001

# Smart Contracts
ETHEREUM_NETWORK=sepolia
PRIVATE_KEY=your_private_key_here
```

## File Structure

```
civicverse/beta/
├── frontend/              # React 19 + Vite
├── backend/               # Node.js/Express
├── game-server/           # WebSocket multiplayer
├── ai-assistant/          # Craig AI
├── mining/                # Blockchain mining
├── smart-contracts/       # Solidity contracts
├── docker-compose.yml     # Service orchestration
├── package.json           # Monorepo config
├── .env                   # Configuration (create from .env.example)
├── .gitignore            # Git ignore rules
├── scripts/              # Utility scripts
│   ├── dev.sh           # Start development
│   ├── deploy.sh        # Deploy to production
│   └── verify.sh        # Verify setup
├── docs/                # Documentation
└── README.md            # Main documentation
```

## Next Steps

1. ✅ Run `bash scripts/verify.sh` to verify setup
2. ✅ Run `bash scripts/dev.sh` to start development
3. ✅ Visit http://localhost:3000 to see the frontend
4. ✅ Read service READMEs for detailed info
5. ✅ Check docs/ for protocol and governance info

## Support & Contribution

- See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines
- Check service READMEs for specific documentation
- Review [docs/](./docs/) for protocol and architecture docs

## Quick Commands Reference

```bash
# Verify setup
bash scripts/verify.sh

# Start development
bash scripts/dev.sh

# Deploy to production
bash scripts/deploy.sh

# View all logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean everything
docker-compose down -v --rmi all

# Health check
curl http://localhost:8000/health
```

---

**You're ready to build The Foyer! 🚀**

For detailed information about each service, see their individual READMEs:
- [Frontend](./frontend/README.md)
- [Backend](./backend/README.md)
- [Game Server](./game-server/README.md)
- [Craig AI](./ai-assistant/README.md)
- [Mining](./mining/README.md)
- [Smart Contracts](./smart-contracts/README.md)
