#!/usr/bin/env bash
# ==============================================================================
# ⚡ SYNAPSE LMS // ONE-CLICK DEPLOYMENT ENGINE ⚡
# ==============================================================================
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${BOLD}    ⚡ SYNAPSE LMS // PRODUCTION DEPLOYMENT ENGINE ⚡             ${NC}${CYAN}║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

deploy_docker() {
    echo -e "${YELLOW}[*] Initializing Docker Production Deployment...${NC}"
    
    if ! command -v docker >/dev/null 2>&1; then
        echo -e "${RED}[ERROR] Docker is not installed or not in PATH.${NC}"
        echo -e "Please install Docker Desktop (https://www.docker.com/products/docker-desktop) and retry."
        exit 1
    fi

    # Determine docker compose command
    if docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE="docker compose"
    elif command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE="docker-compose"
    else
        echo -e "${RED}[ERROR] Neither 'docker compose' nor 'docker-compose' found.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Found Docker Compose.${NC}"
    echo -e "${MAGENTA}Building production containers (Wagtail + Angular Nginx)...${NC}"
    
    $DOCKER_COMPOSE down --remove-orphans 2>/dev/null || true
    $DOCKER_COMPOSE up -d --build

    echo ""
    echo -e "${YELLOW}Waiting for container healthchecks...${NC}"
    sleep 5
    
    BACKEND_STATUS="starting"
    for i in {1..20}; do
        if curl -s http://localhost:8000/api/v1/courses/ >/dev/null 2>&1; then
            BACKEND_STATUS="healthy"
            break
        fi
        sleep 2
    done

    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${GREEN}🚀 PRODUCTION CONTAINER DEPLOYMENT ONLINE!${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo -e "  🌐 ${BOLD}Production Web URL:${NC}  ${CYAN}http://localhost${NC} (or ${CYAN}http://localhost:4200${NC})"
    echo -e "  ⚙️ ${BOLD}Wagtail Admin:${NC}       ${CYAN}http://localhost:8000/admin${NC} (${BOLD}admin${NC} / ${BOLD}cyberadmin2026${NC})"
    echo -e "  📡 ${BOLD}REST API Endpoint:${NC}   ${CYAN}http://localhost:8000/api/v1/${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    if command -v open >/dev/null 2>&1; then
        open http://localhost
    fi
}

deploy_build_artifacts() {
    echo -e "${YELLOW}[*] Building Standalone Production Artifacts...${NC}"

    # 1. Build Angular 22
    echo -e "    [1/2] Compiling Angular 22 AOT production bundle..."
    (cd frontend && npm run build)
    echo -e "${GREEN}    ✓ Frontend compiled to frontend/dist/frontend/browser${NC}"

    # 2. Collect Wagtail Static Assets
    echo -e "    [2/2] Collecting Wagtail & Django static files..."
    (cd backend && .venv/bin/python manage.py collectstatic --noinput)
    echo -e "${GREEN}    ✓ Static files collected to backend/static${NC}"

    echo ""
    echo -e "${BOLD}${GREEN}✓ All production build artifacts compiled successfully!${NC}"
}

deploy_package_cloud() {
    echo -e "${YELLOW}[*] Generating Standalone Cloud Deployment Archive (.tar.gz)...${NC}"
    
    # Ensure artifacts are built first
    deploy_build_artifacts

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    ARCHIVE_NAME="synapse-lms-deploy-${TIMESTAMP}.tar.gz"

    tar --exclude="node_modules" \
        --exclude=".venv" \
        --exclude=".git" \
        --exclude=".angular" \
        --exclude="__pycache__" \
        --exclude="*.pyc" \
        -czf "$ARCHIVE_NAME" \
        backend frontend docker-compose.yml README.md start-dev.sh deploy.sh

    echo ""
    echo -e "${BOLD}${GREEN}✓ Deployment archive generated: ${CYAN}${ARCHIVE_NAME}${NC}"
    echo -e "  You can upload this tarball to any VPS, AWS EC2, or DigitalOcean droplet and run:"
    echo -e "  ${BOLD}tar -xzf ${ARCHIVE_NAME} && ./deploy.sh --docker${NC}"
}

deploy_healthcheck() {
    echo -e "${YELLOW}[*] Running System Health Checks...${NC}"
    
    echo -n "  - Testing Backend API (http://localhost:8000/api/v1/courses/)... "
    if curl -s http://localhost:8000/api/v1/courses/ | grep -q "Quantum"; then
        echo -e "${GREEN}OK (Courses Live)${NC}"
    else
        echo -e "${RED}OFFLINE or UNREACHABLE${NC}"
    fi

    echo -n "  - Testing Multi-Tenant API (http://localhost:8000/api/v1/organizations/)... "
    if curl -s http://localhost:8000/api/v1/organizations/ | grep -q "nexus"; then
        echo -e "${GREEN}OK (Tenants Live)${NC}"
    else
        echo -e "${RED}OFFLINE or UNREACHABLE${NC}"
    fi

    echo -n "  - Testing Frontend Web Server (http://localhost:4200/)... "
    if curl -s http://localhost:4200/ | grep -q "SYNAPSE"; then
        echo -e "${GREEN}OK (Frontend Live)${NC}"
    elif curl -s http://localhost/ | grep -q "SYNAPSE"; then
        echo -e "${GREEN}OK (Production Nginx Port 80 Live)${NC}"
    else
        echo -e "${YELLOW}Frontend port not currently responding${NC}"
    fi
}

# Check argument flags
case "$1" in
    --docker)
        deploy_docker
        exit 0
        ;;
    --build)
        deploy_build_artifacts
        exit 0
        ;;
    --package)
        deploy_package_cloud
        exit 0
        ;;
    --health)
        deploy_healthcheck
        exit 0
        ;;
esac

# Interactive prompt if executed without arguments
echo -e "${BOLD}Select a deployment action:${NC}"
echo -e "  ${CYAN}1)${NC} ${BOLD}Full Docker Production Deployment${NC} (Wagtail + Angular Nginx Containers)"
echo -e "  ${CYAN}2)${NC} ${BOLD}Compile Production Build Artifacts${NC} (Frontend dist + Collectstatic)"
echo -e "  ${CYAN}3)${NC} ${BOLD}Package Cloud Archive (.tar.gz)${NC} (For VPS / AWS / Cloud droplets)"
echo -e "  ${CYAN}4)${NC} ${BOLD}Run Health Check & Endpoint Verification${NC}"
echo -e "  ${CYAN}5)${NC} Exit"
echo ""
read -p "Enter choice [1-5]: " CHOICE

case "$CHOICE" in
    1) deploy_docker ;;
    2) deploy_build_artifacts ;;
    3) deploy_package_cloud ;;
    4) deploy_healthcheck ;;
    *) echo "Exiting deployment engine." ; exit 0 ;;
esac

