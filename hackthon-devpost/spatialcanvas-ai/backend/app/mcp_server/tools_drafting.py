"""SpatialCanvas AI - MCP Tools: Architectural Drafting & Multi-floor Layouts.
Exposes Model Context Protocol tools for G+1 Farmhouse generation and structural design.
"""

from __future__ import annotations
import uuid
from typing import Dict, Any, List
from app.schemas.spatial_types import Vector3, SpatialNode, SpatialNodeType, Transform
from app.schemas.architectural import (
    RoomSpecification,
    RoomType,
    FloorLevel,
    WallSegment,
    WallMaterial,
    FlooringMaterial,
    FurnitureItem,
    DimensionLabel,
)


def mcp_draft_multi_floor_farmhouse(args: Dict[str, Any]) -> Dict[str, Any]:
    """MCP Tool: Draft a complete G+1 Sustainable Farmhouse at true 1:1 scale."""
    from app.services.scene_manager import scene_manager
    scene = scene_manager.reset_scene("g1_farmhouse")

    return {
        "status": "success",
        "action": "replace_scene",
        "scene_id": scene.scene_id,
        "nodes_count": len(scene.nodes),
        "total_sqm": 365.0,
        "floors": ["Ground Floor (G)", "First Floor (G+1)"],
        "summary": "Synthesized 1:1 scale G+1 Farmhouse with Living Lounge, Sunlit Courtyard, Open Kitchen, Master Suite, Sunroom, and Timber Pergola.",
    }


def mcp_draft_sunroom_studio(args: Dict[str, Any]) -> Dict[str, Any]:
    """MCP Tool: Draft an East-Facing Sunroom & Studio on the First Floor."""
    room_id = f"sunroom_{uuid.uuid4().hex[:6]}"
    center_x = float(args.get("x", 3.0))
    center_y = float(args.get("y", 3.6))  # G+1 height
    center_z = float(args.get("z", -3.0))
    width = float(args.get("width", 6.0))
    length = float(args.get("length", 6.0))
    height = float(args.get("height", 3.2))

    # Construct spatial nodes for the sunroom
    nodes: List[SpatialNode] = []

    # Floor slab
    floor_node = SpatialNode(
        id=f"floor_{room_id}",
        name="Sunroom Polished Concrete Floor",
        node_type=SpatialNodeType.FLOOR,
        transform=Transform(
            position=Vector3(x=center_x, y=center_y, z=center_z),
            scale=Vector3(x=width, y=0.15, z=length),
        ),
        color="#e2e8f0",
        roughness=0.2,
        metadata={"room": "Sunroom & Studio (G+1)"},
    )
    nodes.append(floor_node)

    # Ceiling slab
    ceil_node = SpatialNode(
        id=f"ceil_{room_id}",
        name="Sunroom Skylight Ceiling",
        node_type=SpatialNodeType.CEILING,
        transform=Transform(
            position=Vector3(x=center_x, y=center_y + height, z=center_z),
            scale=Vector3(x=width, y=0.1, z=length),
        ),
        color="#f8fafc",
        roughness=0.8,
        metadata={"room": "Sunroom & Studio (G+1)"},
    )
    nodes.append(ceil_node)

    # East Glass Curtain Wall
    east_wall = SpatialNode(
        id=f"wall_{room_id}_east",
        name="East Low-E Curtain Glass Facade",
        node_type=SpatialNodeType.WALL,
        transform=Transform(
            position=Vector3(x=center_x + width / 2.0, y=center_y + height / 2.0, z=center_z),
            scale=Vector3(x=0.15, y=height, z=length),
        ),
        color="#38bdf8",
        opacity=0.35,
        roughness=0.05,
        metalness=0.1,
        metadata={"glazing": "Double-pane low-E solar control"},
    )
    nodes.append(east_wall)

    # North Glass Wall
    north_wall = SpatialNode(
        id=f"wall_{room_id}_north",
        name="North Panorama Glazing",
        node_type=SpatialNodeType.WALL,
        transform=Transform(
            position=Vector3(x=center_x, y=center_y + height / 2.0, z=center_z - length / 2.0),
            scale=Vector3(x=width, y=height, z=0.15),
        ),
        color="#38bdf8",
        opacity=0.35,
        roughness=0.05,
        metalness=0.1,
    )
    nodes.append(north_wall)

    # Drafting Workbench
    desk = SpatialNode(
        id=f"desk_{room_id}",
        name="Oak Architectural Drafting Table",
        node_type=SpatialNodeType.FURNITURE,
        transform=Transform(
            position=Vector3(x=center_x, y=center_y + 0.45, z=center_z),
            scale=Vector3(x=2.2, y=0.9, z=1.1),
        ),
        color="#334155",
        roughness=0.3,
    )
    nodes.append(desk)

    # Dimension Marker
    dim = SpatialNode(
        id=f"dim_{room_id}",
        name=f"Sunroom Dimension {width:.1f}m x {length:.1f}m",
        node_type=SpatialNodeType.DIMENSION_LABEL,
        transform=Transform(
            position=Vector3(x=center_x, y=center_y + 0.1, z=center_z + length / 2.0),
            scale=Vector3(x=width, y=0.1, z=0.1),
        ),
        color="#22d3ee",
        emissive="#22d3ee",
        emissive_intensity=0.9,
        metadata={"measurement": f"{width:.1f}m x {length:.1f}m Studio"},
    )
    nodes.append(dim)

    from app.services.scene_manager import scene_manager
    scene_manager.add_nodes("g1_farmhouse", nodes)

    return {
        "status": "success",
        "action": "add_nodes",
        "room_id": room_id,
        "nodes": [n.model_dump() for n in nodes],
        "summary": f"Constructed {width}m x {length}m East-Facing Sunroom & Studio on First Floor (G+1).",
    }


def mcp_draft_timber_pergola(args: Dict[str, Any]) -> Dict[str, Any]:
    """MCP Tool: Draft a Timber Pergola Rooftop Deck."""
    center_x = float(args.get("x", -4.0))
    center_y = float(args.get("y", 3.6))
    center_z = float(args.get("z", 2.0))
    width = float(args.get("width", 8.0))
    length = float(args.get("length", 4.0))

    nodes: List[SpatialNode] = []
    # Deck Floor
    deck_floor = SpatialNode(
        id=f"pergola_deck_{uuid.uuid4().hex[:6]}",
        name="Pergola Timber Deck Flooring",
        node_type=SpatialNodeType.FLOOR,
        transform=Transform(
            position=Vector3(x=center_x, y=center_y, z=center_z),
            scale=Vector3(x=width, y=0.15, z=length),
        ),
        color="#78350f",
        roughness=0.6,
    )
    nodes.append(deck_floor)

    # 6 Cedar louvers
    for i in range(6):
        slat = SpatialNode(
            id=f"pergola_louver_{uuid.uuid4().hex[:6]}",
            name=f"Cedar Pergola Louver #{i+1}",
            node_type=SpatialNodeType.PERGOLA,
            transform=Transform(
                position=Vector3(x=center_x, y=center_y + 3.0, z=center_z - 1.5 + (i * 0.6)),
                scale=Vector3(x=width - 0.2, y=0.15, z=0.08),
            ),
            color="#451a03",
        )
        nodes.append(slat)

    from app.services.scene_manager import scene_manager
    scene_manager.add_nodes("g1_farmhouse", nodes)

    return {
        "status": "success",
        "action": "add_nodes",
        "nodes": [n.model_dump() for n in nodes],
        "summary": f"Constructed {width}m x {length}m Timber Pergola Rooftop Terrace on G+1.",
    }

