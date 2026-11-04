"""SpatialCanvas AI - Global Application Configuration.
Reads settings from environment variables and provides GCP / Vertex AI settings.
"""

import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "SpatialCanvas AI"
    app_version: str = "1.0.0"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    # Google Cloud Platform (GCP) settings
    gcp_project_id: str = os.getenv("GCP_PROJECT_ID", "spatialcanvas-ai-gcp")
    gcp_region: str = os.getenv("GCP_REGION", "us-central1")
    vertex_ai_location: str = os.getenv("VERTEX_AI_LOCATION", "us-central1")
    vertex_ai_model: str = os.getenv("VERTEX_AI_MODEL", "gemini-2.0-flash")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))

    # Model Context Protocol
    mcp_server_name: str = "spatialcanvas-mcp-server"
    mcp_version: str = "1.0.0"

    # Spatial Engine & Performance
    predictive_latency_ms: int = 15  # Instant visual response budget
    default_scene: str = "g1_farmhouse"  # or "retro_80s_studio"
    allow_cors_origins: list[str] = ["*"]


settings = Settings()
