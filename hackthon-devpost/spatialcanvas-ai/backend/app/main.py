"""SpatialCanvas AI - FastAPI Application Entry Point.
Serves REST endpoints, WebSockets, MCP tools, and static WebXR client.
"""

from __future__ import annotations
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.api.routes_scene import router as scene_router
from app.api.routes_mcp import router as mcp_router
from app.api.routes_gcp import router as gcp_router
from app.api.websocket import router as ws_router


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


# Mount the frontend directory if it exists
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../frontend"))
if not os.path.exists(frontend_dir):
    # Fallback to local sibling path
    frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend"))

if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

