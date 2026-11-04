"""Tests for PydanticAI Agents in SpatialCanvas AI."""

import pytest
import asyncio
from app.agents.architectural_agent import architectural_agent, ArchitecturalAgentResult
from app.agents.retro_agent import retro_agent, RetroMediaAgentResult


def test_architectural_agent_draft_farmhouse():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result: ArchitecturalAgentResult = loop.run_until_complete(
        architectural_agent.execute_drafting("Draft a modern G+1 farmhouse with living hall and courtyard")
    )
    assert result.status == "success"
    assert "draft_multi_floor_farmhouse" in result.mcp_tools_used
    assert result.scale == "1:1 True Spatial Metric"
    assert result.nodes_generated > 0


def test_architectural_agent_add_sunroom():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(
        architectural_agent.execute_drafting("Add an east-facing sunroom studio on the first floor")
    )
    assert result.status == "success"
    assert "draft_sunroom_studio" in result.mcp_tools_used
    assert "Sunroom" in result.room_or_structure_name


def test_retro_media_agent():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result: RetroMediaAgentResult = loop.run_until_complete(
        retro_agent.execute_synthesis("Create an 80s synthwave studio with CRT monitors")
    )
    assert result.status == "success"
    assert "1980s Retro Synthwave" in result.theme
    assert len(result.mcp_tools_used) > 0

