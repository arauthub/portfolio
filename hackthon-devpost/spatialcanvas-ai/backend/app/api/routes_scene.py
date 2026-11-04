"""SpatialCanvas AI - Scene Management REST Endpoints."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.schemas.spatial_types import SpatialScene
from app.services.scene_manager import scene_manager

router = APIRouter(prefix="/api/scene", tags=["Spatial Scene"])


@router.get("", response_model=SpatialScene)
async def get_current_scene() -> SpatialScene:
    """Returns the currently active spatial scene graph."""
    return scene_manager.get_scene()


@router.get("/presets")
async def list_presets() -> List[Dict[str, Any]]:
    """Returns metadata for built-in scenes."""
    return [
        {
            "id": "g1_farmhouse",
            "title": "G+1 Farmhouse Architectural Drafting Studio",
            "description": "True 1:1 scale spatial walkthrough of a modern sustainable G+1 farmhouse with living hall, courtyard, master suite, sunroom, and timber pergola.",
            "category": "Architectural Drafting",
            "nodes_count": len(scene_manager.get_scene("g1_farmhouse").nodes),
        },
        {
            "id": "retro_80s_studio",
            "title": "1980s Retro Digital Media Studio",
            "description": "1980s synthwave horizon with floating CRT arrays, tape decks, neon grids, and audio-reactive holograms.",
            "category": "Retro Digital Media",
            "nodes_count": len(scene_manager.get_scene("retro_80s_studio").nodes),
        },
    ]


@router.get("/{scene_id}", response_model=SpatialScene)
async def get_scene_by_id(scene_id: str) -> SpatialScene:
    """Returns a specific spatial scene by ID."""
    if scene_id not in scene_manager.active_scenes:
        raise HTTPException(status_code=404, detail=f"Scene '{scene_id}' not found.")
    return scene_manager.get_scene(scene_id)


@router.post("/switch/{scene_id}", response_model=SpatialScene)
async def switch_active_scene(scene_id: str) -> SpatialScene:
    """Switches the active scene for all connected VR clients."""
    if scene_id not in scene_manager.active_scenes:
        raise HTTPException(status_code=404, detail=f"Scene '{scene_id}' not found.")
    return scene_manager.switch_scene(scene_id)


@router.post("/reset/{scene_id}", response_model=SpatialScene)
async def reset_scene(scene_id: str) -> SpatialScene:
    """Resets the scene to its initial baseline blueprint."""
    return scene_manager.reset_scene(scene_id)

