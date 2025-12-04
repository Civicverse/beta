#!/bin/bash
# Verification script for CivicVerse setup

echo "🔍 Verifying CivicVerse Repository Structure..."
echo ""

ERRORS=0

# Check core files
echo "📋 Core Files:"
for file in package.json docker-compose.yml .env.example .gitignore QUICKSTART.md README.md; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
        ((ERRORS++))
    fi
done

echo ""
echo "📦 Services:"

SERVICES=(frontend backend game-server ai-assistant mining smart-contracts)

for svc in "${SERVICES[@]}"; do
    echo "  $svc:"
    
    # Check package.json
    if [ -f "$svc/package.json" ]; then
        echo "    ✅ package.json"
    else
        echo "    ❌ package.json (MISSING)"
        ((ERRORS++))
    fi
    
    # Check README
    if [ -f "$svc/README.md" ]; then
        echo "    ✅ README.md"
    else
        echo "    ❌ README.md (MISSING)"
        ((ERRORS++))
    fi
    
    # Check Dockerfile (except smart-contracts)
    if [ "$svc" != "smart-contracts" ]; then
        if [ -f "$svc/Dockerfile" ]; then
            echo "    ✅ Dockerfile"
        else
            echo "    ❌ Dockerfile (MISSING)"
            ((ERRORS++))
        fi
    fi
done

echo ""
echo "🔧 Development Scripts:"
for script in dev.sh deploy.sh; do
    if [ -f "scripts/$script" ]; then
        echo "  ✅ scripts/$script"
    else
        echo "  ❌ scripts/$script (MISSING)"
        ((ERRORS++))
    fi
done

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed! Repository is ready."
    echo ""
    echo "Next steps:"
    echo "  1. cp .env.example .env"
    echo "  2. bash scripts/dev.sh"
    echo ""
else
    echo "❌ Found $ERRORS issues. Please fix them."
    exit 1
fi
