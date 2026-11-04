"""SpatialCanvas AI - Model Context Protocol (MCP) Schemas.
Conforms to MCP specifications for exposing spatial drafting and synthesis tools.
"""

from __future__ import annotations
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class MCPToolParameter(BaseModel):
    name: str
    type: str
    description: str
    required: bool = True
    default: Optional[Any] = None


class MCPToolDefinition(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any]


class MCPToolCallRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any] = Field(default_factory=dict)


class MCPToolCallResponse(BaseModel):
    tool_name: str
    success: bool
    result: Dict[str, Any] = Field(default_factory=dict)
    generated_nodes: List[Dict[str, Any]] = Field(default_factory=list)
    human_readable_summary: str = ""
    execution_time_ms: float = 0.0


class MCPResourceDefinition(BaseModel):
    uri: str
    name: str
    mimeType: str = "application/json"
    description: str = ""

