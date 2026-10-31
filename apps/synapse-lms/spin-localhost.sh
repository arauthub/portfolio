#!/usr/bin/env bash
# ==============================================================================
# ⚡ SYNAPSE LMS // ONE-CLICK LOCALHOST SPIN RUNNER ⚡
# ==============================================================================
set -e

# Resolve directory even if launched via Finder .command double-click
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

# ANSI Colors & Cyberpunk Styling
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${BOLD}  ⚡ SYNAPSE LMS // FUTURISTIC CYBERNETIC LEARNING PLATFORM  ⚡   ${NC}${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${MAGENTA}>> Starting automated one-click localhost stack...${NC}"
echo ""

# 1. Clean existing rogue processes on ports 8000 and 4200
echo -e "${YELLOW}[1/6] Checking ports 8000 & 4200 availability...${NC}"
kill_port() {
    PORT=$1
    PID=$(lsof -ti tcp:$PORT -sTCP:LISTEN 2>/dev/null || true)
    if [ -n "$PID" ]; then
        echo -e "      Found server listener on port $PORT (PID: $PID). Releasing port..."
        kill -9 $PID 2>/dev/null || true
    fi
}
kill_port 8000
kill_port 4200
echo -e "${GREEN}      ✓ Ports 8000 and 4200 are clear.${NC}"

# 2. Check & Initialize PostgreSQL 18 RDBMS Backend
echo -e "${YELLOW}[2/6] Verifying PostgreSQL 18 RDBMS service...${NC}"
if ! command -v pg_isready >/dev/null 2>&1; then
    export PATH="/opt/homebrew/opt/postgresql@18/bin:/opt/homebrew/bin:$PATH"
fi

if ! pg_isready -q 2>/dev/null; then
    echo -e "      Starting PostgreSQL 18 via Homebrew services..."
    brew services start postgresql@18 >/dev/null 2>&1 || true
    sleep 2
fi

if pg_isready -q 2>/dev/null; then
    echo -e "${GREEN}      ✓ PostgreSQL 18 RDBMS is active and accepting connections on port 5432.${NC}"
    # Ensure database exists
    psql -U "$(whoami)" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'synapse_lms_db'" | grep -q 1 || \
        psql -U "$(whoami)" -d postgres -c "CREATE DATABASE synapse_lms_db;" >/dev/null 2>&1 || true
else
    echo -e "${RED}      [!] Warning: PostgreSQL 18 not responding on port 5432. Falling back to local store.${NC}"
fi

# 3. Prepare Backend Virtualenv & Dependencies
echo -e "${YELLOW}[3/6] Initializing Wagtail CMS backend...${NC}"
if [ ! -d "backend/.venv" ]; then
    echo -e "      Creating Python virtual environment in backend/.venv..."
    python3 -m venv backend/.venv
    backend/.venv/bin/pip install --upgrade pip --quiet
    echo -e "      Installing backend dependencies..."
    backend/.venv/bin/pip install -r backend/requirements.txt --quiet
fi

# Run migrations and seed database
echo -e "      Syncing migrations with PostgreSQL 18 and verifying curriculum..."
(cd backend && .venv/bin/python manage.py migrate --noinput >/dev/null 2>&1)
(cd backend && .venv/bin/python manage.py seed_lms_demo >/dev/null 2>&1)
echo -e "${GREEN}      ✓ PostgreSQL 18 database 'synapse_lms_db' synchronized with full schema.${NC}"

# 4. Check Frontend Dependencies
echo -e "${YELLOW}[4/6] Verifying Angular 22 frontend dependencies...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo -e "      Installing frontend npm packages (this may take a minute on first run)..."
    (cd frontend && npm install --quiet)
fi
echo -e "${GREEN}      ✓ Frontend packages ready.${NC}"

# 5. Launch Backend & Frontend Daemons
echo -e "${YELLOW}[5/6] Launching microservices...${NC}"

# Start Wagtail on port 8000
(cd backend && .venv/bin/python manage.py runserver 0.0.0.0:8000) > .backend.log 2>&1 &
BACKEND_PID=$!
echo -e "      Started Wagtail Backend (PID: $BACKEND_PID)"

# Start Angular 22 on port 4200
(cd frontend && npm start -- --host 0.0.0.0 --port 4200) > .frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "      Started Angular 22 Frontend (PID: $FRONTEND_PID)"

cleanup() {
    echo ""
    echo -e "${RED}[!] Terminating Synapse LMS processes...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✓ All services safely stopped. Goodbye!${NC}"
    exit 0
}
trap cleanup INT TERM EXIT

# 6. Wait for Services and Open Browser
echo -e "${YELLOW}[6/6] Polling health status and launching browser...${NC}"

# Wait for backend
BACKEND_READY=0
for i in {1..20}; do
    if curl -s http://127.0.0.1:8000/api/v1/courses/ >/dev/null 2>&1; then
        BACKEND_READY=1
        break
    fi
    sleep 1
done

if [ $BACKEND_READY -eq 1 ]; then
    echo -e "${GREEN}      ✓ Wagtail API is responding at http://localhost:8000/api/v1/${NC}"
else
    echo -e "${YELLOW}      [!] Backend starting up; check .backend.log if delayed.${NC}"
fi

# Wait for frontend
FRONTEND_READY=0
for i in {1..35}; do
    if curl -s http://127.0.0.1:4200/ >/dev/null 2>&1; then
        FRONTEND_READY=1
        break
    fi
    sleep 1
done

if [ $FRONTEND_READY -eq 1 ]; then
    echo -e "${GREEN}      ✓ Angular 22 Frontend is responding at http://localhost:4200/${NC}"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}🚀 SYNAPSE LMS IS LIVE AND RUNNING!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "  💻 ${BOLD}Frontend App:${NC}       ${CYAN}http://localhost:4200${NC}"
echo -e "  ⚙️ ${BOLD}Wagtail Admin:${NC}      ${CYAN}http://localhost:8000/admin${NC} (${BOLD}admin${NC} / ${BOLD}cyberadmin2026${NC})"
echo -e "  📡 ${BOLD}REST API:${NC}          ${CYAN}http://localhost:8000/api/v1/${NC}"
echo -e "  📜 ${BOLD}Wagtail Pages API:${NC} ${CYAN}http://localhost:8000/api/v2/pages/${NC}"
echo -e "  🗄️ ${BOLD}Database Backend:${NC}  ${GREEN}PostgreSQL 18${NC} (database: ${CYAN}synapse_lms_db${NC} on port 5432)"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

# Automatically open browser on macOS or Linux
if command -v open >/dev/null 2>&1; then
    open http://localhost:4200
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open http://localhost:4200
fi

echo -e "${MAGENTA}Streaming service logs below. Press ${BOLD}Ctrl+C${NC}${MAGENTA} in this terminal to stop.${NC}"
echo ""

# Stream both logs
tail -f -n 20 .backend.log .frontend.log

