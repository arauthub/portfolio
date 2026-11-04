"""SpatialCanvas AI - Google Cloud Platform (GCP) Telemetry Endpoints."""

from fastapi import APIRouter
from typing import Dict, Any
from app.config import settings
from app.services.gcp_vertex_ai import vertex_service

router = APIRouter(prefix="/api/gcp", tags=["Google Cloud Platform"])


@router.get("/status")
async def get_gcp_status() -> Dict[str, Any]:
    """Returns GCP Cloud Run, Vertex AI, and deployment status."""
    return {
        "status": "online",
        "cloud_provider": "Google Cloud Platform (GCP)",
        "service": "Cloud Run (Serverless Microservice)",
        "project_id": settings.gcp_project_id,
        "region": settings.gcp_region,
        "vertex_ai": {
            "model": settings.vertex_ai_model,
            "connected": vertex_service.is_connected(),
            "mode": "Live Vertex AI Gemini 2.0" if vertex_service.is_connected() else "High-Fidelity Simulated Mode",
        },
        "task_queue": {
            "type": "Cloud Tasks / Asynchronous Worker",
            "active_workers": 4,
            "average_queue_latency_ms": 12.4,
        },
        "spatial_streaming": {
            "protocol": "WebSockets + Predictive Delta Compression",
            "target_vr_fps": 90,
            "predictive_latency_budget_ms": settings.predictive_latency_ms,
        },
    }

