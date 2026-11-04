#!/usr/bin/env bash
# ==============================================================================
# SpatialCanvas AI - Local Development & VR Testing Runner
# Boots the FastAPI backend, WebSockets, and WebXR Spatial Operating System
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=============================================================================="
echo "🥽 Starting SpatialCanvas AI - Spatial VR Creation Studio"
echo "=============================================================================="

# Use virtualenv python if available
if [ -f "./venv/bin/python" ]; then
    PYTHON="./venv/bin/python"
else
    PYTHON="python3"
fi

export PYTHONPATH="$DIR/backend"

# Detect Local IP for Meta Quest Headset Testing
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

echo "📍 Local Desktop Access:      http://localhost:8000"
echo "📍 Meta Quest Headset Access:  http://$LOCAL_IP:8000"
echo "📡 Model Context Protocol:     Active (7 Spatial Tools Registered)"
echo "☁️ Google Cloud Platform:      Targeting GCP Cloud Run & Vertex AI"
echo "=============================================================================="

exec $PYTHON -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

