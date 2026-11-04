"""SpatialCanvas AI - Model Context Protocol (MCP) REST Endpoints."""

from fastapi import APIRouter
from typing import List, Dict, Any
from app.schemas.mcp_schemas import (
    MCPToolDefinition,
    MCPToolCallRequest,
    MCPToolCallResponse,
    MCPResourceDefinition,
)
from app.mcp_server.server import mcp_server

router = APIRouter(prefix="/api/mcp", tags=["Model Context Protocol"])


@router.get("/tools", response_model=List[MCPToolDefinition])
async def list_mcp_tools() -> List[MCPToolDefinition]:
    """Lists all spatial computing tools registered with the MCP server."""
    return mcp_server.list_tools()


@router.get("/resources", response_model=List[MCPResourceDefinition])
async def list_mcp_resources() -> List[MCPResourceDefinition]:
    """Lists all spatial resources exposed via MCP."""
    return mcp_server.list_resources()


@router.post("/invoke", response_model=MCPToolCallResponse)
async def invoke_mcp_tool(req: MCPToolCallRequest) -> MCPToolCallResponse:
    """Invokes a specific MCP spatial tool directly."""
    return mcp_server.invoke_tool(req)


@router.post("/jsonrpc")
async def mcp_jsonrpc_endpoint(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Standard JSON-RPC 2.0 endpoint for external Model Context Protocol hosts
    (e.g., Claude Desktop, Cursor, external AI agents).
    Supports methods: initialize, ping, tools/list, tools/call, resources/list, resources/read.
    """
    return mcp_server.handle_jsonrpc(payload)

