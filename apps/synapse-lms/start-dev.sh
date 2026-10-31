#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "================================================================="
echo "⚡ SYNAPSE LMS // FUTURISTIC CYBERNETIC LEARNING PLATFORM ⚡"
echo "================================================================="
echo ""

# Free ports if already occupied
for P in 8000 4200; do
    PID=$(lsof -ti tcp:$P -sTCP:LISTEN 2>/dev/null || true)
    if [ -n "$PID" ]; then
        kill -9 $PID 2>/dev/null || true
    fi
done

# Ensure backend venv and database are prepared
if [ ! -d "backend/.venv" ]; then
    echo "[!] Setting up Python virtual environment in backend/.venv..."
    python3 -m venv backend/.venv
    backend/.venv/bin/pip install --upgrade pip
    backend/.venv/bin/pip install -r backend/requirements.txt
fi

# Ensure PostgreSQL 18 is active
if ! command -v pg_isready >/dev/null 2>&1; then
    export PATH="/opt/homebrew/opt/postgresql@18/bin:/opt/homebrew/bin:$PATH"
fi
if ! pg_isready -q 2>/dev/null; then
    brew services start postgresql@18 >/dev/null 2>&1 || true
    sleep 2
fi
psql -U "$(whoami)" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'synapse_lms_db'" | grep -q 1 || \
    psql -U "$(whoami)" -d postgres -c "CREATE DATABASE synapse_lms_db;" >/dev/null 2>&1 || true

echo "[!] Ensuring PostgreSQL 18 migrations and demo curriculum are in sync..."
(cd backend && .venv/bin/python manage.py migrate --noinput)
(cd backend && .venv/bin/python manage.py seed_lms_demo)

echo "[1/2] Starting Wagtail Headless Backend at http://localhost:8000..."
(cd backend && .venv/bin/python manage.py runserver 0.0.0.0:8000) &
BACKEND_PID=$!

echo "[2/2] Starting Angular 22 Frontend at http://localhost:4200..."
(cd frontend && npm start -- --host 0.0.0.0 --port 4200) &
FRONTEND_PID=$!

cleanup() {
    echo ""
    echo "[!] Shutting down Synapse LMS dev services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

echo ""
echo "🚀 Synapse LMS is online!"
echo "   - Frontend UI:     http://localhost:4200"
echo "   - Wagtail Admin:   http://localhost:8000/admin (admin / cyberadmin2026)"
echo "   - REST API v1:     http://localhost:8000/api/v1/"
echo "   - Wagtail API v2:  http://localhost:8000/api/v2/pages/"
echo ""
echo "Press Ctrl+C to terminate services."

wait

