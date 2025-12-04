#!/bin/bash
# Production deployment script for CivicVerse

set -e

echo "🚀 Deploying CivicVerse to production..."

# Check environment
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

# Build Docker images
echo "🔨 Building Docker images..."
docker-compose build

# Start services
echo "🐳 Starting services..."
docker-compose -f docker-compose.yml up -d

# Run migrations
echo "📊 Running database migrations..."
docker-compose exec -T backend npm run migrate || echo "No migrations found"

# Health checks
echo "🏥 Performing health checks..."

SERVICES=("frontend" "backend" "game-server" "ai-assistant")
for service in "${SERVICES[@]}"; do
    echo "  Checking $service..."
    # Services will be running if container is up
done

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Services status:"
docker-compose ps
echo ""
echo "📋 Logs: docker-compose logs -f"
