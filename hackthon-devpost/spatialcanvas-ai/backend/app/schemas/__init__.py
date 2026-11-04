"""Schemas package for SpatialCanvas AI."""

from .spatial_types import (
    Vector3,
    Rotation,
    Transform,
    BoundingBox,
    SpatialNodeType,
    SpatialNode,
    SpatialScene,
)
from .architectural import (
    FloorLevel,
    RoomType,
    WallMaterial,
    FlooringMaterial,
    Window,
    Door,
    WallSegment,
    FurnitureItem,
    DimensionLabel,
    RoomSpecification,
    ArchitecturalPlan,
)
from .retro_media import (
    CRTMonitorSpec,
    CassetteDeckSpec,
    HologramEmitterSpec,
    RetroSynthStudioSpec,
)
from .agent_protocol import (
    CommandIntent,
    VoiceCommandInput,
    PredictiveGhostState,
    AgentThoughtChunk,
    DeltaUpdate,
    SpatialWebSocketMessage,
)
from .mcp_schemas import (
    MCPToolDefinition,
    MCPToolCallRequest,
    MCPToolCallResponse,
    MCPResourceDefinition,
)

__all__ = [
    "Vector3",
    "Rotation",
    "Transform",
    "BoundingBox",
    "SpatialNodeType",
    "SpatialNode",
    "SpatialScene",
    "FloorLevel",
    "RoomType",
    "WallMaterial",
    "FlooringMaterial",
    "Window",
    "Door",
    "WallSegment",
    "FurnitureItem",
    "DimensionLabel",
    "RoomSpecification",
    "ArchitecturalPlan",
    "CRTMonitorSpec",
    "CassetteDeckSpec",
    "HologramEmitterSpec",
    "RetroSynthStudioSpec",
    "CommandIntent",
    "VoiceCommandInput",
    "PredictiveGhostState",
    "AgentThoughtChunk",
    "DeltaUpdate",
    "SpatialWebSocketMessage",
    "MCPToolDefinition",
    "MCPToolCallRequest",
    "MCPToolCallResponse",
    "MCPResourceDefinition",
]

