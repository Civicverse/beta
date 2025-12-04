#!/bin/bash

# CivicVerse Demo Startup Script
# Runs Hardhat node, deploys contracts, starts backend and frontend in demo mode

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
LOGS_DIR="$REPO_DIR/.dev-logs"
mkdir -p "$LOGS_DIR"

echo "🚀 Starting CivicVerse Demo Stack..."

# Kill any existing processes on our ports
echo "🧹 Cleaning up old processes..."
lsof -i :8545 -t 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -i :8001 -t 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -i :3001 -t 2>/dev/null | xargs kill -9 2>/dev/null || true

sleep 0.5

# Start Hardhat node
echo "⛓️  Starting Hardhat local node..."
cd "$REPO_DIR/smart-contracts"
npx hardhat node > "$LOGS_DIR/hardhat.log" 2>&1 &
HARDHAT_PID=$!
echo $HARDHAT_PID > "$LOGS_DIR/hardhat.pid"
sleep 2

# Deploy contracts
echo "📦 Deploying smart contracts..."
npx hardhat run scripts/deploy.js --network localhost >> "$LOGS_DIR/deploy.log" 2>&1

# Start backend
echo "🔌 Starting backend (demo mode)..."
cd "$REPO_DIR"
PORT=8001 DEMO_MODE=true ETH_RPC=http://127.0.0.1:8545 node backend/index.js > "$LOGS_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$LOGS_DIR/backend.pid"
sleep 2

# Start frontend
echo "🎨 Starting frontend (Vite dev server)..."
cd "$REPO_DIR/frontend"
npm install > /dev/null 2>&1 || true
VITE_DEMO_MODE=true npm run dev > "$LOGS_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$LOGS_DIR/frontend.pid"

sleep 2

echo ""
echo "✅ CivicVerse Demo is Running!"
echo ""
echo "📍 Endpoints:"
echo "   Frontend:       http://localhost:3001"
echo "   Backend Health: http://localhost:8001/health"
echo "   Hardhat RPC:    http://127.0.0.1:8545"
echo ""
echo "📊 Logs:"
echo "   Hardhat:  tail -f $LOGS_DIR/hardhat.log"
echo "   Backend:  tail -f $LOGS_DIR/backend.log"
echo "   Frontend: tail -f $LOGS_DIR/frontend.log"
echo ""
echo "🛑 To stop all services:"
echo "   kill $HARDHAT_PID $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🎮 Demo Features:"
echo "   • Move with WASD or Arrow Keys"
echo "   • Click near the yellow pyramid to enter the shop"
echo "   • Buy neon items (1% tax goes to multisig treasury)"
echo "   • Check UBI eligibility and claim tokens"
echo "   • View transaction receipts in real-time"
echo ""

# Wait for all processes
wait
