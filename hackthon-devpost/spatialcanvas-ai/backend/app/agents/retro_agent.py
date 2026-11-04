"""SpatialCanvas AI - PydanticAI 1980s Retro Digital Media Synthesis Agent.
Synthesizes retro-futuristic synthwave environments, CRT arrays, and holographic projections
using the Model Context Protocol (MCP).
"""

from __future__ import annotations
import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from app.config import settings
from app.mcp_server.server import mcp_server
from app.schemas.mcp_schemas import MCPToolCallRequest

logger = logging.getLogger(__name__)


class RetroMediaAgentResult(BaseModel):
    action_type: str = Field(description="Action executed (e.g. synthesize_studio, spawn_crt, spawn_hologram)")
    status: str = "success"
    theme: str = "1980s Retro Synthwave / Cyberpunk"
    thought_summary: str
    mcp_tools_used: list[str] = Field(default_factory=list)
    nodes_generated: int = 0


RETRO_SYSTEM_PROMPT = """
You are the SpatialCanvas Retro Media Agent, specialized in 1980s retro-aesthetic digital media synthesis in VR.
You transform spatial computing environments into vintage synthwave horizons, featuring:
- Glowing wireframe terrain and horizon neon suns
- Curved CRT monitor arrays with phosphor scanlines (phosphor greens, hot pinks, electric cyans)
- Vintage cassette tape decks with spinning reels and VU meters
- Holographic emitters projecting 3D wireframe models

You trigger Model Context Protocol (MCP) tools:
- synthesize_retro_studio
- spawn_crt_monitor
- spawn_hologram
"""


class RetroMediaAgent:
    """PydanticAI agent orchestrating 1980s retro media tools via MCP."""

    def __init__(self):
        if settings.gemini_api_key:
            model = f"google-gla:{settings.vertex_ai_model}"
        else:
            from pydantic_ai.models.test import TestModel
            model = TestModel()

        self.agent = Agent(
            model=model,
            system_prompt=RETRO_SYSTEM_PROMPT,
            output_type=RetroMediaAgentResult,
        )
        self._register_tools()

    def _register_tools(self):
        @self.agent.tool
        async def synthesize_studio(ctx: RunContext[None]) -> str:
            """Synthesizes the 1980s synthwave studio."""
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(tool_name="synthesize_retro_studio", arguments={})
            )
            return res.human_readable_summary

        @self.agent.tool
        async def spawn_crt(ctx: RunContext[None], phosphor: str = "#39ff14", channel: str = "synthwave_sunset") -> str:
            """Spawns a curved CRT monitor."""
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(
                    tool_name="spawn_crt_monitor",
                    arguments={"phosphor": phosphor, "channel": channel},
                )
            )
            return res.human_readable_summary

        @self.agent.tool
        async def spawn_holo(ctx: RunContext[None], subject: str = "wireframe_delorean") -> str:
            """Spawns a 3D hologram."""
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(
                    tool_name="spawn_hologram",
                    arguments={"subject": subject},
                )
            )
            return res.human_readable_summary

    async def execute_synthesis(self, prompt: str) -> RetroMediaAgentResult:
        """Executes retro media synthesis workflow."""
        p = prompt.lower()
        tools_called: list[str] = []
        action_type = "synthesize_studio"
        nodes_count = 10
        thought = (
            "Detected 1980s retro-aesthetic request. Synthesizing curved CRT monitor array, "
            "infinite perspective grid, horizon sun, and cassette audio deck."
        )

        if "crt" in p or "monitor" in p or "screen" in p:
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(
                    tool_name="spawn_crt_monitor",
                    arguments={
                        "x": 0.0,
                        "y": 1.6,
                        "z": -2.2,
                        "phosphor": "#39ff14",
                        "channel": "wireframe_torus",
                    },
                )
            )
            tools_called.append("spawn_crt_monitor")
            action_type = "spawn_crt"
            nodes_count = 1
            thought = res.human_readable_summary

        elif "hologram" in p:
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(
                    tool_name="spawn_hologram",
                    arguments={"subject": "wireframe_delorean", "glow_color": "#06b6d4"},
                )
            )
            tools_called.append("spawn_hologram")
            action_type = "spawn_hologram"
            nodes_count = 1
            thought = res.human_readable_summary

        else:
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(tool_name="synthesize_retro_studio", arguments={})
            )
            tools_called.append("synthesize_retro_studio")
            action_type = "synthesize_studio"
            nodes_count = res.result.get("nodes_count", 10)
            thought = res.human_readable_summary

        return RetroMediaAgentResult(
            action_type=action_type,
            status="success",
            theme="1980s Retro Synthwave / Cyberpunk",
            thought_summary=thought,
            mcp_tools_used=tools_called,
            nodes_generated=nodes_count,
        )


retro_agent = RetroMediaAgent()
