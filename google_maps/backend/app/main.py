import os
import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .core.config import settings
from .routers import places, routes, weather, geocoding, ai, system

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production backend for Google Maps Platform Suite. "
        "Integrates Places API (New), Routes API (computeRoutes), Geocoding API v4, "
        "Live Weather API, and Gemini Maps Grounding Lite."
    )
)

# CORS middleware for Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers under /api/v1
app.include_router(places.router, prefix=settings.API_V1_STR)
app.include_router(routes.router, prefix=settings.API_V1_STR)
app.include_router(weather.router, prefix=settings.API_V1_STR)
app.include_router(geocoding.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(system.router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health():
    return {"status": "healthy", "project": settings.GCP_PROJECT_ID}

# Serve Angular frontend if built
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist" / "frontend" / "browser"

if FRONTEND_DIST.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIST)), name="static")

    @app.get("/{full_path:path}")
    @app.head("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes or Swagger docs
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    async def root():
        return {
            "app": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "gcp_project": settings.GCP_PROJECT_ID,
            "docs_url": "/docs",
            "api_v1": settings.API_V1_STR,
            "note": "Angular frontend not yet built to static directory. Run 'npm run build' inside frontend/."
        }
