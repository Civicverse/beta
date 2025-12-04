#!/bin/bash
# Development startup script for CivicVerse

set -e

echo "🚀 Starting CivicVerse in development mode..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "🐳 Docker is not running. Please start Docker."
    exit 1
fi

# Start docker-compose services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
for i in {1..30}; do
    if docker exec mongo mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo "✅ MongoDB is ready"
        break
    fi
    echo "   Attempt $i/30..."
    sleep 2
done

echo ""
echo "✅ CivicVerse is ready!"
echo ""
echo "🌐 Frontend:    http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "🎮 Game Server: ws://localhost:4000"
echo "🤖 Craig AI:    http://localhost:8001"
echo ""
echo "�� To view logs: docker-compose logs -f"
echo "🛑 To stop:      docker-compose down"
echo ""
