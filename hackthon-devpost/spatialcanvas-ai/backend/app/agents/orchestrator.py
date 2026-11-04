"""SpatialCanvas AI - Master Agent Orchestrator.
Coordinates spatial voice commands, sub-15ms predictive ghost wireframes,
PydanticAI agent reasoning loops, and WebSocket delta updates.
"""

from __future__ import annotations
import asyncio
import logging
import time
from typing import AsyncGenerator, Dict, Any
from app.schemas.spatial_types import SpatialScene
from app.schemas.agent_protocol import (
    VoiceCommandInput,
    PredictiveGhostState,
    AgentThoughtChunk,
    DeltaUpdate,
    SpatialWebSocketMessage,
)
from app.services.predictive_engine import predictive_engine
from app.services.scene_manager import scene_manager
from .architectural_agent import architectural_agent
from .retro_agent import retro_agent

logger = logging.getLogger(__name__)


class SpatialOrchestrator:
    """Master orchestrator for real-time spatial computing agent workflows."""

    async def process_voice_command(
        self, cmd: VoiceCommandInput
    ) -> AsyncGenerator[SpatialWebSocketMessage, None]:
        """Asynchronously streams predictive ghosts, thoughts, tool calls, and final state."""
        transcript = cmd.transcript.strip()
        if not transcript:
            return

        # ---------------- STEP 1: SUB-15MS PREDICTIVE GHOST (Zero Latency) ----------------
        ghost: PredictiveGhostState = predictive_engine.predict_ghost(cmd)
        yield SpatialWebSocketMessage(
            type="predictive_ghost",
            payload=ghost.model_dump(),
        )

        # Brief artificial yield to let WebSocket push ghost before heavier processing
        await asyncio.sleep(0.01)

        # ---------------- STEP 2: AGENT REASONING STREAM (Step 1 of 3) ----------------
        yield SpatialWebSocketMessage(
            type="agent_thought",
            payload=AgentThoughtChunk(
                agent_name="SpatialOrchestrator",
                thought=f"Parsed spatial voice intent from transcript: '{transcript}'",
                step_number=1,
                total_steps=3,
            ).model_dump(),
        )

        # ---------------- STEP 3: ROUTING & MCP EXECUTION (Step 2 of 3) ----------------
        p = transcript.lower()
        is_retro = any(k in p for k in ["retro", "80s", "crt", "synth", "cassette", "neon", "hologram"])

        if is_retro:
            target_agent = "RetroMediaAgent-MCP"
            thought_desc = "Routing to RetroMediaAgent for 1980s synthwave media synthesis..."
        else:
            target_agent = "SpatialArchitectAgent-MCP"
            thought_desc = "Routing to SpatialArchitectAgent for 1:1 multi-floor architectural drafting..."

        yield SpatialWebSocketMessage(
            type="agent_thought",
            payload=AgentThoughtChunk(
                agent_name=target_agent,
                thought=thought_desc,
                step_number=2,
                total_steps=3,
            ).model_dump(),
        )

        await asyncio.sleep(0.08)

        # Execute chosen PydanticAI Agent
        if is_retro:
            agent_result = await retro_agent.execute_synthesis(transcript)
            active_scene_id = "retro_80s_studio"
        else:
            agent_result = await architectural_agent.execute_drafting(transcript)
            active_scene_id = "g1_farmhouse"

        # ---------------- STEP 4: MCP TOOL CALL AUDIT (Step 3 of 3) ----------------
        yield SpatialWebSocketMessage(
            type="mcp_tool_call",
            payload={
                "tools_invoked": agent_result.mcp_tools_used,
                "agent": target_agent,
                "status": "completed",
                "summary": agent_result.thought_summary,
            },
        )

        yield SpatialWebSocketMessage(
            type="agent_thought",
            payload=AgentThoughtChunk(
                agent_name=target_agent,
                thought=f"Baking 3D spatial geometry: {agent_result.nodes_generated} nodes generated at 1:1 scale.",
                step_number=3,
                total_steps=3,
                is_complete=True,
            ).model_dump(),
        )

        # ---------------- STEP 5: PUSH UPDATED SCENE OR DELTA ----------------
        current_scene: SpatialScene = scene_manager.get_scene(active_scene_id)
        yield SpatialWebSocketMessage(
            type="full_scene",
            payload=current_scene.model_dump(),
        )


orchestrator = SpatialOrchestrator()

