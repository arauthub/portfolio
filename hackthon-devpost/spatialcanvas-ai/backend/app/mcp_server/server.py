"""SpatialCanvas AI - Model Context Protocol (MCP) Server.
Standardizes and registers all spatial drafting, media synthesis,
and spatial inspection tools for PydanticAI agents and external MCP clients.
"""

from __future__ import annotations
import time
from typing import Dict, Any, List, Callable
from app.schemas.mcp_schemas import (
    MCPToolDefinition,
    MCPToolCallRequest,
    MCPToolCallResponse,
    MCPResourceDefinition,
)
from .tools_drafting import (
    mcp_draft_multi_floor_farmhouse,
    mcp_draft_sunroom_studio,
    mcp_draft_timber_pergola,
)
from .tools_media import (
    mcp_synthesize_retro_studio,
    mcp_spawn_crt_monitor,
    mcp_spawn_hologram,
)
from .tools_spatial import (
    mcp_inspect_scene_bounds,
    mcp_validate_structural_scale,
)


class SpatialMCPServer:
    """Model Context Protocol (MCP) server managing spatial computing tools."""

    def __init__(self):
        self.tool_handlers: Dict[str, Callable[[Dict[str, Any]], Dict[str, Any]]] = {}
        self.tool_definitions: Dict[str, MCPToolDefinition] = {}
        self.resources: List[MCPResourceDefinition] = []
        self._register_all_tools()
        self._register_resources()

    def _register_all_tools(self):
        # 1. Architectural Drafting Tools
        self.register_tool(
            name="draft_multi_floor_farmhouse",
            description="Drafts a complete 1:1 scale G+1 Sustainable Farmhouse with Living Lounge, Courtyard, Kitchen, Master Suite, Sunroom, and Pergola.",
            parameters={
                "type": "object",
                "properties": {
                    "scale": {"type": "string", "description": "Drafting scale (default: 1:1)"},
                    "floors_count": {"type": "integer", "description": "Number of floors (default: 2)"},
                },
            },
            handler=mcp_draft_multi_floor_farmhouse,
        )

        self.register_tool(
            name="draft_sunroom_studio",
            description="Drafts an East-Facing Sunroom & Studio on the First Floor (G+1) with double-glazed low-E curtain glass.",
            parameters={
                "type": "object",
                "properties": {
                    "width": {"type": "number", "description": "Room width in meters (default: 6.0)"},
                    "length": {"type": "number", "description": "Room length in meters (default: 6.0)"},
                    "height": {"type": "number", "description": "Ceiling height in meters (default: 3.2)"},
                },
            },
            handler=mcp_draft_sunroom_studio,
        )

        self.register_tool(
            name="draft_timber_pergola",
            description="Drafts a Timber Pergola Rooftop Terrace on G+1 with cedar louvers and outdoor deck.",
            parameters={
                "type": "object",
                "properties": {
                    "width": {"type": "number", "description": "Deck width in meters (default: 8.0)"},
                    "length": {"type": "number", "description": "Deck length in meters (default: 4.0)"},
                },
            },
            handler=mcp_draft_timber_pergola,
        )

        # 2. 1980s Retro Digital Media Synthesis Tools
        self.register_tool(
            name="synthesize_retro_studio",
            description="Synthesizes a 1980s synthwave creation studio with horizon sun, neon perspective grid, CRT monitor array, and cassette deck.",
            parameters={
                "type": "object",
                "properties": {
                    "grid_color": {"type": "string", "description": "Neon grid color hex (default: #ff007f)"},
                    "horizon_sun": {"type": "boolean", "description": "Include horizon retro sun"},
                },
            },
            handler=mcp_synthesize_retro_studio,
        )

        self.register_tool(
            name="spawn_crt_monitor",
            description="Spawns a curved vintage Sony Trinitron style CRT monitor with phosphor glow scanlines.",
            parameters={
                "type": "object",
                "properties": {
                    "x": {"type": "number", "description": "X coordinate in meters"},
                    "y": {"type": "number", "description": "Y coordinate in meters"},
                    "z": {"type": "number", "description": "Z coordinate in meters"},
                    "phosphor": {"type": "string", "description": "Phosphor color hex (e.g. #39ff14, #00f3ff, #ff007f)"},
                    "channel": {"type": "string", "description": "Screen channel (wireframe_torus, spectrum_analyzer, vector_flight)"},
                },
            },
            handler=mcp_spawn_crt_monitor,
        )

        self.register_tool(
            name="spawn_hologram",
            description="Spawns a rotating 3D wireframe hologram emitter with particle beams.",
            parameters={
                "type": "object",
                "properties": {
                    "x": {"type": "number", "description": "X coordinate"},
                    "y": {"type": "number", "description": "Y coordinate"},
                    "z": {"type": "number", "description": "Z coordinate"},
                    "subject": {"type": "string", "description": "Subject (wireframe_delorean, neon_pyramid, spatial_avatar)"},
                    "glow_color": {"type": "string", "description": "Hologram glow color hex"},
                },
            },
            handler=mcp_spawn_hologram,
        )

        # 3. Spatial Inspection & Ergonomics Tools
        self.register_tool(
            name="inspect_scene_bounds",
            description="Calculates scene bounding volumes, node counts, and 1:1 scale metrics for VR headsets.",
            parameters={"type": "object", "properties": {}},
            handler=mcp_inspect_scene_bounds,
        )

        self.register_tool(
            name="validate_structural_scale",
            description="Validates 1:1 architectural scale, headroom clearances, and VR ergonomics.",
            parameters={"type": "object", "properties": {}},
            handler=mcp_validate_structural_scale,
        )

    def _register_resources(self):
        self.resources = [
            MCPResourceDefinition(
                uri="spatial://scenes/g1_farmhouse",
                name="G+1 Farmhouse Architectural Blueprint",
                description="Live 1:1 scale spatial layout containing walls, slabs, courtyard, and dimensions.",
            ),
            MCPResourceDefinition(
                uri="spatial://scenes/retro_80s_studio",
                name="1980s Synthwave Creation Studio",
                description="Live 1980s retro-aesthetic scene with CRT arrays, neon horizon, and audio synthesizers.",
            ),
        ]

    def register_tool(
        self,
        name: str,
        description: str,
        parameters: Dict[str, Any],
        handler: Callable[[Dict[str, Any]], Dict[str, Any]],
    ):
        self.tool_definitions[name] = MCPToolDefinition(
            name=name,
            description=description,
            parameters=parameters,
        )
        self.tool_handlers[name] = handler

    def list_tools(self) -> List[MCPToolDefinition]:
        return list(self.tool_definitions.values())

    def list_resources(self) -> List[MCPResourceDefinition]:
        return self.resources

    def invoke_tool(self, req: MCPToolCallRequest) -> MCPToolCallResponse:
        start_time = time.time()
        tool_name = req.tool_name

        if tool_name not in self.tool_handlers:
            return MCPToolCallResponse(
                tool_name=tool_name,
                success=False,
                result={"error": f"Tool '{tool_name}' not registered in Spatial MCP Server."},
                human_readable_summary=f"Failed to find MCP tool '{tool_name}'.",
                execution_time_ms=(time.time() - start_time) * 1000,
            )

        try:
            handler = self.tool_handlers[tool_name]
            result = handler(req.arguments)
            execution_time = (time.time() - start_time) * 1000

            return MCPToolCallResponse(
                tool_name=tool_name,
                success=True,
                result=result,
                generated_nodes=result.get("nodes", []),
                human_readable_summary=result.get("summary", f"Successfully executed {tool_name}."),
                execution_time_ms=round(execution_time, 2),
            )
        except Exception as err:
            return MCPToolCallResponse(
                tool_name=tool_name,
                success=False,
                result={"error": str(err)},
                human_readable_summary=f"Error executing MCP tool '{tool_name}': {str(err)}",
                execution_time_ms=(time.time() - start_time) * 1000,
            )


mcp_server = SpatialMCPServer()

