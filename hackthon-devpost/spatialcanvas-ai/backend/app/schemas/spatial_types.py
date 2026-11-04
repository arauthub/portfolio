"""SpatialCanvas AI - Core Spatial Geometry & Scene Types.
Defines 3D transforms, bounding volumes, and spatial nodes for VR rendering.
"""

from __future__ import annotations
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class Vector3(BaseModel):
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0

    def as_list(self) -> List[float]:
        return [self.x, self.y, self.z]

    def distance_to(self, other: Vector3) -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2 + (self.z - other.z) ** 2) ** 0.5


class Rotation(BaseModel):
    pitch: float = 0.0  # X axis in degrees
    yaw: float = 0.0    # Y axis in degrees
    roll: float = 0.0   # Z axis in degrees

    def as_list(self) -> List[float]:
        return [self.pitch, self.yaw, self.roll]


class Transform(BaseModel):
    position: Vector3 = Field(default_factory=Vector3)
    rotation: Rotation = Field(default_factory=Rotation)
    scale: Vector3 = Field(default_factory=lambda: Vector3(x=1.0, y=1.0, z=1.0))


class BoundingBox(BaseModel):
    min_pt: Vector3
    max_pt: Vector3
    width: float
    height: float
    depth: float


class SpatialNodeType(str, Enum):
    WALL = "wall"
    FLOOR = "floor"
    CEILING = "ceiling"
    DOOR = "door"
    WINDOW = "window"
    STAIRCASE = "staircase"
    PERGOLA = "pergola"
    FURNITURE = "furniture"
    DIMENSION_LABEL = "dimension_label"
    LIGHT = "light"
    # Retro Media Types
    CRT_MONITOR = "crt_monitor"
    NEON_GRID = "neon_grid"
    CASSETTE_DECK = "cassette_deck"
    HOLOGRAM_EMITTER = "hologram_emitter"
    RETRO_SUN = "retro_sun"
    # Meta / System Types
    GHOST_PREVIEW = "ghost_preview"
    SPATIAL_ANCHOR = "spatial_anchor"


class SpatialNode(BaseModel):
    id: str
    name: str
    node_type: SpatialNodeType
    transform: Transform = Field(default_factory=Transform)
    color: str = "#4ade80"
    opacity: float = 1.0
    roughness: float = 0.5
    metalness: float = 0.1
    emissive: Optional[str] = None
    emissive_intensity: float = 0.0
    visible: bool = True
    collidable: bool = True
    metadata: Dict[str, Any] = Field(default_factory=dict)
    children: List[SpatialNode] = Field(default_factory=list)


class SpatialScene(BaseModel):
    scene_id: str
    title: str
    description: str
    environment: str = "farmhouse_meadow"  # or "synthwave_void"
    ambient_light_color: str = "#ffffff"
    ambient_light_intensity: float = 0.6
    fog_color: Optional[str] = None
    fog_density: float = 0.0
    ground_grid: bool = True
    nodes: List[SpatialNode] = Field(default_factory=list)
    version: int = 1

