#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "=========================================================="
echo "🗺️ Starting Google Maps Platform Studio"
echo "Project: gmp-demo-project-569655961"
echo "=========================================================="

# Check if Python virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv backend/venv
    ./backend/venv/bin/pip install --upgrade pip
    ./backend/venv/bin/pip install -r backend/requirements.txt
fi

# Build Angular frontend if not yet built
if [ ! -d "frontend/dist/frontend/browser" ]; then
    echo "Building Angular frontend..."
    cd frontend && npm install && npm run build && cd ..
fi

echo "▶ Starting unified server on http://localhost:8000"
echo "  - SPA Frontend: http://localhost:8000"
echo "  - API Swagger Docs: http://localhost:8000/docs"
echo "  - Health Check: http://localhost:8000/health"
echo "=========================================================="

exec ./backend/venv/bin/uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload

