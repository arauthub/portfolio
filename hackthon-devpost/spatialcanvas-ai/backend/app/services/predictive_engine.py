"""SpatialCanvas AI - Predictive Loading State Engine.
Generates sub-15ms ghost wireframe states for WebXR clients to eliminate
VR latency and prevent motion sickness while the LLM / MCP agents process tasks.
"""

from __future__ import annotations
import uuid
from typing import Optional
from app.schemas.spatial_types import Vector3
from app.schemas.agent_protocol import (
    CommandIntent,
    PredictiveGhostState,
    VoiceCommandInput,
)


class PredictiveEngine:
    """Predictive spatial inference engine for instant VR feedback (<15ms)."""

    def predict_ghost(self, cmd: VoiceCommandInput) -> PredictiveGhostState:
        text = cmd.transcript.lower()
        ghost_id = f"ghost_{uuid.uuid4().hex[:8]}"

        # Calculate spawn position: default to 2.5m in front of user or controller ray point
        spawn_pos = cmd.target_ray_point or Vector3(
            x=cmd.user_position.x,
            y=cmd.user_position.y,
            z=cmd.user_position.z - 2.5,
        )

        # 1. Retro Media: CRT Monitor Array, Synth Studio, Hologram (checked first to avoid studio collision)
        if any(k in text for k in ["retro", "80s", "synth", "cassette", "neon", "hologram", "synthwave"]):
            if any(k in text for k in ["crt", "monitor", "screen", "display"]):
                return PredictiveGhostState(
                    ghost_id=ghost_id,
                    label="Calibrating Phosphor CRT Geometry...",
                    position=spawn_pos,
                    dimensions=Vector3(x=1.6, y=1.2, z=0.5),
                    wireframe_color="#39ff14",  # Retro green phosphor
                    pulse_rate_hz=4.0,
                    progress_percent=25.0,
                    target_intent=CommandIntent.SPAWN_CRT_ARRAY,
                )
            return PredictiveGhostState(
                ghost_id=ghost_id,
                label="Synthesizing 1980s Neon Holographic Matrix...",
                position=spawn_pos,
                dimensions=Vector3(x=3.0, y=2.5, z=3.0),
                wireframe_color="#ec4899",  # Neon pink
                pulse_rate_hz=3.5,
                progress_percent=20.0,
                target_intent=CommandIntent.GENERATE_RETRO_MEDIA,
            )

        # 2. Architectural: Sunroom addition
        elif "sunroom" in text or "sun room" in text or ("east" in text and "room" in text):
            return PredictiveGhostState(
                ghost_id=ghost_id,
                label="Synthesizing Sunroom Glass Structure...",
                position=Vector3(x=3.0, y=3.6, z=-3.0),
                dimensions=Vector3(x=6.0, y=3.2, z=6.0),
                wireframe_color="#38bdf8",  # Sky blue
                pulse_rate_hz=2.5,
                progress_percent=15.0,
                target_intent=CommandIntent.ADD_SUNROOM,
            )

        # 3. Architectural: Pergola Rooftop Deck
        elif "pergola" in text or "terrace" in text or "deck" in text or "rooftop" in text:
            return PredictiveGhostState(
                ghost_id=ghost_id,
                label="Synthesizing Cedar Pergola Framing...",
                position=Vector3(x=-4.0, y=3.6, z=2.0),
                dimensions=Vector3(x=8.0, y=3.0, z=4.0),
                wireframe_color="#f59e0b",  # Amber/wood
                pulse_rate_hz=2.0,
                progress_percent=15.0,
                target_intent=CommandIntent.ADD_PERGOLA,
            )

        # 4. Architectural: General Room / Living Hall
        elif any(k in text for k in ["room", "farmhouse", "kitchen", "draft", "floor", "living", "veranda"]):
            return PredictiveGhostState(
                ghost_id=ghost_id,
                label="Generating 1:1 Architectural Blueprint Wireframe...",
                position=spawn_pos,
                dimensions=Vector3(x=7.0, y=3.4, z=6.0),
                wireframe_color="#4ade80",  # Neon green CAD line
                pulse_rate_hz=3.0,
                progress_percent=20.0,
                target_intent=CommandIntent.DRAFT_FARMHOUSE,
            )

        # Fallback generic spatial anchor
        return PredictiveGhostState(
            ghost_id=ghost_id,
            label="Agent Processing Spatial Context...",
            position=spawn_pos,
            dimensions=Vector3(x=2.0, y=2.0, z=2.0),
            wireframe_color="#818cf8",
            pulse_rate_hz=2.0,
            progress_percent=10.0,
            target_intent=CommandIntent.UNKNOWN,
        )


predictive_engine = PredictiveEngine()
