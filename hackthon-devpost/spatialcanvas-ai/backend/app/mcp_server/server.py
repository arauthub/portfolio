"""SpatialCanvas AI - Model Context Protocol (MCP) Server.
Standardizes and registers all spatial drafting, media synthesis,
and spatial inspection tools for PydanticAI agents and external MCP clients.
"""

from __future__ import annotations
import json
import time
from typing import Dict, Any, List, Callable, Optional
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

    def handle_jsonrpc(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Processes standard JSON-RPC 2.0 requests adhering to the Model Context Protocol (MCP) spec.
        Supports:
        - initialize: Negotiates capabilities and server identity
        - ping: Liveness probe
        - tools/list: Lists all spatial drafting, media, and validation tools
        - tools/call: Executes an MCP tool with provided arguments
        - resources/list: Enumerates spatial scene blueprints & resources
        - resources/read: Reads a specific spatial resource schema
        """
        req_id = payload.get("id")
        method = payload.get("method")
        params = payload.get("params", {})

        if payload.get("jsonrpc") != "2.0" or not method:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {
                    "code": -32600,
                    "message": "Invalid Request: 'jsonrpc' must be '2.0' and 'method' is required.",
                },
            }

        # 1. Ping
        if method == "ping":
            return {"jsonrpc": "2.0", "id": req_id, "result": {}}

        # 2. Protocol Initialization
        if method == "initialize":
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "protocolVersion": "2024-11-05",
                    "serverInfo": {
                        "name": "SpatialCanvas AI Enterprise MCP Server",
                        "version": "1.0.0",
                    },
                    "capabilities": {
                        "tools": {"listChanged": False},
                        "resources": {"subscribe": False, "listChanged": False},
                    },
                },
            }

        # 3. Tools Listing
        if method == "tools/list":
            tools_data = []
            for tool in self.list_tools():
                tools_data.append({
                    "name": tool.name,
                    "description": tool.description,
                    "inputSchema": tool.parameters,
                })
            return {"jsonrpc": "2.0", "id": req_id, "result": {"tools": tools_data}}

        # 4. Tool Invocation
        if method == "tools/call":
            tool_name = params.get("name")
            tool_args = params.get("arguments", {})
            if not tool_name:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32602, "message": "Missing 'name' in tools/call params."},
                }
            call_req = MCPToolCallRequest(tool_name=tool_name, arguments=tool_args)
            call_resp = self.invoke_tool(call_req)
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [
                        {
                            "type": "text",
                            "text": call_resp.human_readable_summary,
                        }
                    ],
                    "isError": not call_resp.success,
                    "spatial_nodes": [
                        n.model_dump() if hasattr(n, "model_dump") else n
                        for n in call_resp.generated_nodes
                    ],
                    "execution_time_ms": call_resp.execution_time_ms,
                    "structured_data": call_resp.result,
                },
            }

        # 5. Resources Listing
        if method == "resources/list":
            res_data = [r.model_dump() for r in self.list_resources()]
            return {"jsonrpc": "2.0", "id": req_id, "result": {"resources": res_data}}

        # 6. Resources Read
        if method == "resources/read":
            uri = params.get("uri")
            matched = next((r for r in self.resources if r.uri == uri), None)
            if not matched:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32602, "message": f"Resource URI '{uri}' not found."},
                }
            from app.services.scene_manager import scene_manager
            scene_key = "g1_farmhouse" if "farmhouse" in uri else "retro_80s_studio"
            scene = scene_manager.get_scene(scene_key)
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "contents": [
                        {
                            "uri": uri,
                            "mimeType": "application/json",
                            "text": scene.model_dump_json(indent=2),
                        }
                    ]
                },
            }

        # Unknown method
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {
                "code": -32601,
                "message": f"Method '{method}' not found on Spatial MCP Server.",
            },
        }


mcp_server = SpatialMCPServer()

