"""SpatialCanvas AI - FastAPI Application Entry Point.
Serves REST endpoints, WebSockets, MCP tools, and static WebXR client.
"""

from __future__ import annotations
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.api.routes_scene import router as scene_router
from app.api.routes_mcp import router as mcp_router
from app.api.routes_gcp import router as gcp_router
from app.api.websocket import router as ws_router, manager as ws_manager
from app.mcp_server.server import mcp_server
from app.services.scene_manager import scene_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print(f"🚀 {settings.app_name} v{settings.app_version} starting on {settings.host}:{settings.port}")
    print(f"📡 Model Context Protocol (MCP) Server initialized with 7 tools.")
    print(f"☁️ Google Cloud Platform (GCP) target: {settings.gcp_project_id} ({settings.gcp_region})")
    print(f"🥽 WebXR client ready for Meta Quest 2 / Quest 3 / Quest Pro & Meta XR Simulator.")
    yield
    print(f"🛑 {settings.app_name} shutting down.")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Immersive VR Creation Studio & Agentic Spatial Operating System built with PydanticAI, MCP, and FastAPI on GCP.",
    lifespan=lifespan,
)

# Enable CORS for WebXR & external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allow_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(scene_router)
app.include_router(mcp_router)
app.include_router(gcp_router)
app.include_router(ws_router)


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "gcp_ready": True,
    }


@app.get("/api/telemetry/stats")
async def telemetry_stats():
    """Returns active VR sessions, node counts, and streaming statistics."""
    current_scene = scene_manager.get_scene()
    ws_stats = ws_manager.get_stats()
    return {
        "active_scene": {
            "id": current_scene.scene_id,
            "version": current_scene.version,
            "nodes_count": len(current_scene.nodes),
        },
        "mcp_server": {
            "registered_tools": len(mcp_server.list_tools()),
            "registered_resources": len(mcp_server.list_resources()),
        },
        "websockets": ws_stats,
    }


@app.get("/metrics", response_class=PlainTextResponse)
async def prometheus_metrics():
    """Exposes Prometheus exposition text format metrics for GCP Cloud Monitoring, Datadog, or Grafana."""
    current_scene = scene_manager.get_scene()
    ws_stats = ws_manager.get_stats()
    tools_count = len(mcp_server.list_tools())
    resources_count = len(mcp_server.list_resources())
    node_count = len(current_scene.nodes)

    lines = [
        "# HELP spatialcanvas_active_websocket_connections Active WebXR client connections",
        "# TYPE spatialcanvas_active_websocket_connections gauge",
        f"spatialcanvas_active_websocket_connections {ws_stats['active_connections']}",
        "",
        "# HELP spatialcanvas_total_websocket_connections_total Lifetime WebXR client sessions",
        "# TYPE spatialcanvas_total_websocket_connections_total counter",
        f"spatialcanvas_total_websocket_connections_total {ws_stats['total_lifetime_connections']}",
        "",
        "# HELP spatialcanvas_websocket_messages_received_total Total inbound WebSocket packets",
        "# TYPE spatialcanvas_websocket_messages_received_total counter",
        f"spatialcanvas_websocket_messages_received_total {ws_stats['total_messages_received']}",
        "",
        "# HELP spatialcanvas_websocket_messages_sent_total Total outbound WebSocket packets",
        "# TYPE spatialcanvas_websocket_messages_sent_total counter",
        f"spatialcanvas_websocket_messages_sent_total {ws_stats['total_messages_sent']}",
        "",
        "# HELP spatialcanvas_scene_nodes_count Current 3D SpatialNode count in active graph",
        "# TYPE spatialcanvas_scene_nodes_count gauge",
        f"spatialcanvas_scene_nodes_count{{scene=\"{current_scene.scene_id}\"}} {node_count}",
        "",
        "# HELP spatialcanvas_mcp_tools_total Registered Model Context Protocol spatial tools",
        "# TYPE spatialcanvas_mcp_tools_total gauge",
        f"spatialcanvas_mcp_tools_total {tools_count}",
        "",
        "# HELP spatialcanvas_mcp_resources_total Registered Model Context Protocol spatial resources",
        "# TYPE spatialcanvas_mcp_resources_total gauge",
        f"spatialcanvas_mcp_resources_total {resources_count}",
        "",
    ]
    return "\n".join(lines)


# Mount the frontend directory if it exists
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../frontend"))
if not os.path.exists(frontend_dir):
    # Fallback to local sibling path
    frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend"))

if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

