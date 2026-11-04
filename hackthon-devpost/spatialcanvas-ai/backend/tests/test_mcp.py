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


def test_mcp_jsonrpc_initialize():
    res = mcp_server.handle_jsonrpc({
        "jsonrpc": "2.0",
        "id": "init-1",
        "method": "initialize",
        "params": {},
    })
    assert res["jsonrpc"] == "2.0"
    assert res["id"] == "init-1"
    assert res["result"]["protocolVersion"] == "2024-11-05"
    assert "serverInfo" in res["result"]
    assert "tools" in res["result"]["capabilities"]


def test_mcp_jsonrpc_tools_list_and_call():
    # 1. tools/list
    res_list = mcp_server.handle_jsonrpc({
        "jsonrpc": "2.0",
        "id": "list-1",
        "method": "tools/list",
    })
    assert "tools" in res_list["result"]
    tool_names = [t["name"] for t in res_list["result"]["tools"]]
    assert "draft_multi_floor_farmhouse" in tool_names
    assert "synthesize_retro_studio" in tool_names

    # 2. tools/call with drafting tool
    res_call = mcp_server.handle_jsonrpc({
        "jsonrpc": "2.0",
        "id": "call-1",
        "method": "tools/call",
        "params": {
            "name": "draft_sunroom_studio",
            "arguments": {"width": 6.0, "length": 6.0},
        },
    })
    assert res_call["result"]["isError"] is False
    assert "content" in res_call["result"]
    assert len(res_call["result"]["spatial_nodes"]) > 0


def test_mcp_jsonrpc_resources_list_and_read():
    res_res = mcp_server.handle_jsonrpc({
        "jsonrpc": "2.0",
        "id": "res-1",
        "method": "resources/list",
    })
    assert len(res_res["result"]["resources"]) >= 2

    # Read specific resource
    res_read = mcp_server.handle_jsonrpc({
        "jsonrpc": "2.0",
        "id": "read-1",
        "method": "resources/read",
        "params": {"uri": "spatial://scenes/g1_farmhouse"},
    })
    assert "contents" in res_read["result"]
    assert res_read["result"]["contents"][0]["uri"] == "spatial://scenes/g1_farmhouse"

