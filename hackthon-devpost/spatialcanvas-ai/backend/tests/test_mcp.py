"""Tests for Model Context Protocol (MCP) server and tools."""

from app.mcp_server.server import mcp_server
from app.schemas.mcp_schemas import MCPToolCallRequest


def test_mcp_list_tools():
    tools = mcp_server.list_tools()
    assert len(tools) >= 5
    tool_names = [t.name for t in tools]
    assert "draft_multi_floor_farmhouse" in tool_names
    assert "draft_sunroom_studio" in tool_names
    assert "synthesize_retro_studio" in tool_names
    assert "inspect_scene_bounds" in tool_names


def test_mcp_invoke_draft_farmhouse():
    res = mcp_server.invoke_tool(
        MCPToolCallRequest(tool_name="draft_multi_floor_farmhouse", arguments={})
    )
    assert res.success is True
    assert res.result.get("status") == "success"
    assert res.result.get("total_sqm") == 365.0


def test_mcp_invoke_inspect_bounds():
    res = mcp_server.invoke_tool(
        MCPToolCallRequest(tool_name="inspect_scene_bounds", arguments={})
    )
    assert res.success is True
    assert "vr_ergonomics" in res.result
    assert res.result["vr_ergonomics"]["scale"] == "1:1 True Metric"

