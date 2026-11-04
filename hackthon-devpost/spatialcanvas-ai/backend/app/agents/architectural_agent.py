"""SpatialCanvas AI - PydanticAI Spatial Architectural Agent.
Orchestrates multi-floor architectural drafting, 1:1 scale spatial calculations,
and G+1 Farmhouse layouts using the Model Context Protocol (MCP).
"""

from __future__ import annotations
import logging
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from app.config import settings
from app.mcp_server.server import mcp_server
from app.schemas.mcp_schemas import MCPToolCallRequest

logger = logging.getLogger(__name__)


class ArchitecturalAgentResult(BaseModel):
    action_type: str = Field(description="Action executed (e.g. draft_farmhouse, add_sunroom, add_pergola)")
    status: str = "success"
    room_or_structure_name: str
    scale: str = "1:1 True Spatial Metric"
    thought_summary: str
    mcp_tools_used: list[str] = Field(default_factory=list)
    nodes_generated: int = 0


# System instruction for architectural reasoning
ARCHITECT_SYSTEM_PROMPT = """
You are the SpatialCanvas Architectural Agent, an expert AI architect running inside Meta Quest VR.
Your mission is to interpret user spatial voice commands and draft multi-floor architectural structures
(specifically sustainable G+1 farmhouse builds) at true 1:1 scale.

You leverage Model Context Protocol (MCP) tools:
- draft_multi_floor_farmhouse
- draft_sunroom_studio
- draft_timber_pergola
- inspect_scene_bounds
- validate_structural_scale

Always ensure 1:1 scale ergonomics:
- Ceiling heights: minimum 2.8m, optimal 3.2m to 3.6m
- Staircase risers: ~0.18m to 0.25m
- Corridors and doorways: minimum 1.2m
- Courtyards: open-to-sky double-height bioclimatic ventilation
"""


class SpatialArchitectAgent:
    """PydanticAI agent coordinating architectural drafting tools via MCP."""

    def __init__(self):
        # Select model based on API key availability
        if settings.gemini_api_key:
            model = f"google-gla:{settings.vertex_ai_model}"
        else:
            from pydantic_ai.models.test import TestModel
            model = TestModel()

        self.agent = Agent(
            model=model,
            system_prompt=ARCHITECT_SYSTEM_PROMPT,
            output_type=ArchitecturalAgentResult,
        )
        self._register_tools()

    def _register_tools(self):
        @self.agent.tool
        async def draft_farmhouse(ctx: RunContext[None]) -> str:
            """Drafts the complete G+1 sustainable farmhouse at 1:1 scale."""
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(tool_name="draft_multi_floor_farmhouse", arguments={})
            )
            return res.human_readable_summary

        @self.agent.tool
        async def add_sunroom_studio(ctx: RunContext[None], width: float = 6.0, length: float = 6.0) -> str:
            """Drafts an east-facing sunroom studio on the first floor."""
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(
                    tool_name="draft_sunroom_studio",
                    arguments={"width": width, "length": length},
                )
            )
            return res.human_readable_summary

        @self.agent.tool
        async def add_timber_pergola(ctx: RunContext[None], width: float = 8.0, length: float = 4.0) -> str:
            """Drafts a cedar timber pergola rooftop deck."""
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(
                    tool_name="draft_timber_pergola",
                    arguments={"width": width, "length": length},
                )
            )
            return res.human_readable_summary

        @self.agent.tool
        async def validate_scale(ctx: RunContext[None]) -> str:
            """Validates 1:1 scale dimensions and ergonomics."""
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(tool_name="validate_structural_scale", arguments={})
            )
            return res.human_readable_summary

    async def execute_drafting(self, prompt: str) -> ArchitecturalAgentResult:
        """Executes agentic drafting pipeline based on natural language command."""
        p = prompt.lower()
        tools_called: list[str] = []
        action_type = "draft_farmhouse"
        structure_name = "G+1 Sustainable Farmhouse"
        nodes_count = 35
        thought = (
            "Analyzed spatial prompt for architectural composition. "
            "Synthesized 1:1 scale G+1 Farmhouse with living hall, central courtyard, "
            "and timber pergola terrace."
        )

        if "sunroom" in p or "studio" in p or "east" in p:
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(
                    tool_name="draft_sunroom_studio",
                    arguments={"width": 6.0, "length": 6.0},
                )
            )
            tools_called.append("draft_sunroom_studio")
            action_type = "add_sunroom"
            structure_name = "East-Facing Sunroom & Studio (G+1)"
            nodes_count = len(res.generated_nodes)
            thought = res.human_readable_summary

        elif "pergola" in p or "terrace" in p or "rooftop" in p:
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(
                    tool_name="draft_timber_pergola",
                    arguments={"width": 8.0, "length": 4.0},
                )
            )
            tools_called.append("draft_timber_pergola")
            action_type = "add_pergola"
            structure_name = "Timber Pergola Rooftop Deck"
            nodes_count = len(res.generated_nodes)
            thought = res.human_readable_summary

        else:
            res = mcp_server.invoke_tool(
                MCPToolCallRequest(tool_name="draft_multi_floor_farmhouse", arguments={})
            )
            tools_called.append("draft_multi_floor_farmhouse")
            action_type = "draft_farmhouse"
            structure_name = "G+1 Sustainable Farmhouse Residence"
            nodes_count = res.result.get("nodes_count", 35)
            thought = res.human_readable_summary

        # Also validate structural scale
        mcp_server.invoke_tool(
            MCPToolCallRequest(tool_name="validate_structural_scale", arguments={})
        )
        tools_called.append("validate_structural_scale")

        return ArchitecturalAgentResult(
            action_type=action_type,
            status="success",
            room_or_structure_name=structure_name,
            scale="1:1 True Spatial Metric",
            thought_summary=thought,
            mcp_tools_used=tools_called,
            nodes_generated=nodes_count,
        )


architectural_agent = SpatialArchitectAgent()
