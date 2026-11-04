"""SpatialCanvas AI - Agent Protocol & WebSocket Streaming Schemas.
Handles voice input, predictive ghost states, MCP tool invocations, and real-time state deltas.
"""

from __future__ import annotations
from enum import Enum
from typing import List, Dict, Any, Optional, Union
import time
from pydantic import BaseModel, Field
from .spatial_types import Vector3, SpatialNode


class CommandIntent(str, Enum):
    DRAFT_FARMHOUSE = "draft_farmhouse"
    MODIFY_STRUCTURE = "modify_structure"
    ADD_ROOM = "add_room"
    ADD_SUNROOM = "add_sunroom"
    ADD_PERGOLA = "add_pergola"
    GENERATE_RETRO_MEDIA = "generate_retro_media"
    SPAWN_CRT_ARRAY = "spawn_crt_array"
    SPAWN_HOLOGRAM = "spawn_hologram"
    INSPECT_SCALE = "inspect_scale"
    VALIDATE_LOAD = "validate_load"
    TOGGLE_1TO1_WALK = "toggle_1to1_walk"
    SWITCH_PRESET = "switch_preset"
    TRANSFORM_NODE = "transform_node"
    DELETE_NODE = "delete_node"
    UNKNOWN = "unknown"


class VoiceCommandInput(BaseModel):
    transcript: str
    user_position: Vector3 = Field(default_factory=Vector3)
    target_ray_point: Optional[Vector3] = None
    hand_gesture: Optional[str] = None  # "pinch_draw", "palm_spread", "two_finger_point"
    active_floor: str = "Ground Floor (G)"


class PredictiveGhostState(BaseModel):
    ghost_id: str
    label: str = "Synthesizing Spatial Geometry..."
    position: Vector3
    dimensions: Vector3 = Field(default_factory=lambda: Vector3(x=4.0, y=3.0, z=4.0))
    wireframe_color: str = "#38bdf8"
    pulse_rate_hz: float = 2.0
    progress_percent: float = 10.0
    target_intent: CommandIntent = CommandIntent.DRAFT_FARMHOUSE


class AgentThoughtChunk(BaseModel):
    agent_name: str
    thought: str
    mcp_tool: Optional[str] = None
    step_number: int = 1
    total_steps: int = 3
    is_complete: bool = False


class DeltaUpdate(BaseModel):
    action: str  # "upsert", "delete", "batch_replace"
    nodes: List[SpatialNode] = Field(default_factory=list)
    removed_ids: List[str] = Field(default_factory=list)
    version: int = 1


class SpatialWebSocketMessage(BaseModel):
    type: str  # "voice_input", "predictive_ghost", "agent_thought", "mcp_tool_call", "delta_update", "full_scene", "telemetry"
    payload: Dict[str, Any] = Field(default_factory=dict)
    timestamp_ms: int = Field(default_factory=lambda: int(time.time() * 1000))

