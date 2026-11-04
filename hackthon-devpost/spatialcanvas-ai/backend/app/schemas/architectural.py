"""SpatialCanvas AI - Architectural Drafting & Structural Schemas.
Models G+1 Farmhouse architecture, structural drafting, 1:1 scale walk-through,
and room geometries.
"""

from __future__ import annotations
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from .spatial_types import Vector3, SpatialNode, SpatialNodeType, Transform


class FloorLevel(str, Enum):
    GROUND_FLOOR = "Ground Floor (G)"
    FIRST_FLOOR = "First Floor (G+1)"
    ROOF_TERRACE = "Rooftop Terrace"


class RoomType(str, Enum):
    LIVING_HALL = "Living Hall & Lounge"
    MODULAR_KITCHEN = "Modular Open Kitchen"
    CENTRAL_COURTYARD = "Central Courtyard & Garden"
    VERANDA = "Sprawling Veranda"
    MASTER_SUITE = "Master Suite with Walk-in Closet"
    SUNROOM = "East-Facing Sunroom & Studio"
    PERGOLA_TERRACE = "Timber Pergola Terrace Deck"
    BALCONY_SKYLIGHT = "Double-Height Skylight Gallery"
    DINING_ALCOVE = "Dining Alcove"
    GUEST_BEDROOM = "Guest Sanctuary"


class WallMaterial(str, Enum):
    WHITE_STUCCO = "white_stucco"
    EXPOSED_BRICK = "exposed_brick"
    TIMBER_SLATS = "timber_slats"
    CURTAIN_GLASS = "curtain_glass"
    POLISHED_CONCRETE = "polished_concrete"


class FlooringMaterial(str, Enum):
    TERRAZZO = "terrazzo"
    NATURAL_OAK_WOOD = "natural_oak_wood"
    TRAVERTINE_STONE = "travertine_stone"
    POLISHED_CONCRETE = "polished_concrete"
    COURTYARD_GRASS = "courtyard_grass"


class Window(BaseModel):
    id: str
    width: float = 1.8
    height: float = 1.5
    sill_height: float = 0.9
    offset_along_wall: float = 1.0
    glazing_type: str = "double_glazed_tinted"
    ifc_type: str = "IfcWindow"
    u_value: float = 1.15  # W/(m²·K) thermal transmittance
    shgc: float = 0.40     # Solar Heat Gain Coefficient
    acoustic_rw_db: int = 38


class Door(BaseModel):
    id: str
    width: float = 1.2
    height: float = 2.4
    offset_along_wall: float = 1.5
    door_type: str = "sliding_timber"  # or "pivot_glass"
    ifc_type: str = "IfcDoor"
    fire_rating_minutes: int = 60
    accessibility_compliant: bool = True


class WallSegment(BaseModel):
    id: str
    start: Vector3
    end: Vector3
    height: float = 3.2
    thickness: float = 0.25
    material: WallMaterial = WallMaterial.WHITE_STUCCO
    color: str = "#f3f4f6"
    windows: List[Window] = Field(default_factory=list)
    doors: List[Door] = Field(default_factory=list)
    ifc_type: str = "IfcWallStandardCase"
    load_bearing: bool = True
    load_capacity_kn_m: float = 48.5  # kN/m ultimate capacity
    fire_rating_minutes: int = 120
    u_value: float = 0.28  # W/(m²·K) thermal transmittance


class FurnitureItem(BaseModel):
    id: str
    name: str
    category: str  # "seating", "table", "storage", "plant", "fixture"
    position: Vector3
    rotation_y: float = 0.0
    dimensions: Vector3  # width, height, depth
    color: str = "#8b5cf6"
    material: str = "wood_fabric"
    ifc_type: str = "IfcFurnishingElement"


class DimensionLabel(BaseModel):
    id: str
    start: Vector3
    end: Vector3
    measurement_text: str
    orientation: str = "horizontal"
    ifc_type: str = "IfcAnnotation"


class RoomSpecification(BaseModel):
    id: str
    name: str
    room_type: RoomType
    floor: FloorLevel
    center: Vector3
    width: float = 6.0   # X-dimension in meters
    length: float = 7.0  # Z-dimension in meters
    ceiling_height: float = 3.2  # Y-dimension in meters
    area_sqm: float = 42.0
    flooring: FlooringMaterial = FlooringMaterial.NATURAL_OAK_WOOD
    floor_color: str = "#d4b996"
    walls: List[WallSegment] = Field(default_factory=list)
    furniture: List[FurnitureItem] = Field(default_factory=list)
    dimension_labels: List[DimensionLabel] = Field(default_factory=list)
    ambient_lux: float = 350.0
    ifc_type: str = "IfcSpace"
    live_load_kpa: float = 2.5   # kN/m² standard design live load
    dead_load_kpa: float = 3.8   # kN/m² self weight + finishes
    notes: str = ""


class ArchitecturalPlan(BaseModel):
    plan_id: str
    project_title: str = "G+1 Sustainable Farmhouse Build"
    architect_agent: str = "SpatialArchitectAgent-MCP"
    scale: str = "1:1 True Spatial Scale"
    total_builtup_sqm: float = 385.0
    floors: List[FloorLevel] = Field(
        default_factory=lambda: [FloorLevel.GROUND_FLOOR, FloorLevel.FIRST_FLOOR]
    )
    rooms: List[RoomSpecification] = Field(default_factory=list)
    staircases: List[Dict[str, Any]] = Field(default_factory=list)
    pergolas: List[Dict[str, Any]] = Field(default_factory=list)
    structural_notes: List[str] = Field(default_factory=list)

    def to_spatial_nodes(self) -> List[SpatialNode]:
        """Converts the architectural plan into renderable 3D SpatialNodes for WebXR."""
        nodes: List[SpatialNode] = []
        for room in self.rooms:
            # Add floor slab
            floor_node = SpatialNode(
                id=f"floor_{room.id}",
                name=f"{room.name} Floor Slab",
                node_type=SpatialNodeType.FLOOR,
                transform=Transform(
                    position=Vector3(x=room.center.x, y=room.center.y, z=room.center.z),
                    scale=Vector3(x=room.width, y=0.15, z=room.length),
                ),
                color=room.floor_color,
                roughness=0.35,
                metalness=0.05,
                metadata={
                    "room_id": room.id,
                    "room_type": room.room_type.value,
                    "floor_level": room.floor.value,
                    "material": room.flooring.value,
                    "area_sqm": room.area_sqm,
                },
            )
            nodes.append(floor_node)

            # Add ceiling if not open courtyard
            if room.room_type != RoomType.CENTRAL_COURTYARD and room.room_type != RoomType.PERGOLA_TERRACE:
                ceiling_node = SpatialNode(
                    id=f"ceiling_{room.id}",
                    name=f"{room.name} Ceiling",
                    node_type=SpatialNodeType.CEILING,
                    transform=Transform(
                        position=Vector3(
                            x=room.center.x,
                            y=room.center.y + room.ceiling_height,
                            z=room.center.z,
                        ),
                        scale=Vector3(x=room.width, y=0.1, z=room.length),
                    ),
                    color="#f8fafc",
                    roughness=0.8,
                    metadata={"room_id": room.id},
                )
                nodes.append(ceiling_node)

            # Add structural walls
            for wall in room.walls:
                # Calculate center and span of wall
                mid_x = (wall.start.x + wall.end.x) / 2.0
                mid_z = (wall.start.z + wall.end.z) / 2.0
                dx = wall.end.x - wall.start.x
                dz = wall.end.z - wall.start.z
                wall_length = (dx * dx + dz * dz) ** 0.5
                angle_deg = 0.0
                import math
                angle_deg = math.degrees(math.atan2(dx, dz))

                is_glass = wall.material == WallMaterial.CURTAIN_GLASS
                wall_node = SpatialNode(
                    id=f"wall_{wall.id}",
                    name=f"Wall {wall.id} ({wall.material.value})",
                    node_type=SpatialNodeType.WALL,
                    transform=Transform(
                        position=Vector3(x=mid_x, y=wall.start.y + wall.height / 2.0, z=mid_z),
                        rotation={"pitch": 0.0, "yaw": angle_deg, "roll": 0.0},
                        scale=Vector3(x=wall.thickness, y=wall.height, z=wall_length),
                    ),
                    color=wall.color if not is_glass else "#38bdf8",
                    opacity=0.35 if is_glass else 1.0,
                    roughness=0.1 if is_glass else 0.7,
                    metalness=0.05,
                    metadata={
                        "room_id": room.id,
                        "material": wall.material.value,
                        "doors_count": len(wall.doors),
                        "windows_count": len(wall.windows),
                    },
                )
                nodes.append(wall_node)

            # Add furniture
            for item in room.furniture:
                furn_node = SpatialNode(
                    id=f"furn_{item.id}",
                    name=item.name,
                    node_type=SpatialNodeType.FURNITURE,
                    transform=Transform(
                        position=item.position,
                        rotation={"pitch": 0.0, "yaw": item.rotation_y, "roll": 0.0},
                        scale=item.dimensions,
                    ),
                    color=item.color,
                    roughness=0.4,
                    metalness=0.2,
                    metadata={"category": item.category, "material": item.material},
                )
                nodes.append(furn_node)

            # Add dimension labels
            for dim in room.dimension_labels:
                dim_node = SpatialNode(
                    id=f"dim_{dim.id}",
                    name=f"Dimension {dim.measurement_text}",
                    node_type=SpatialNodeType.DIMENSION_LABEL,
                    transform=Transform(
                        position=Vector3(
                            x=(dim.start.x + dim.end.x) / 2.0,
                            y=dim.start.y + 0.1,
                            z=(dim.start.z + dim.end.z) / 2.0,
                        ),
                        scale=Vector3(x=1.0, y=0.1, z=0.1),
                    ),
                    color="#22d3ee",
                    emissive="#22d3ee",
                    emissive_intensity=0.8,
                    metadata={"measurement": dim.measurement_text, "start": dim.start.as_list(), "end": dim.end.as_list()},
                )
                nodes.append(dim_node)

        return nodes

    def export_bim_ifc(self) -> Dict[str, Any]:
        """Exports the architectural plan to an Industry Foundation Classes (IFC 4x3) compliant
        BIM interchange document for Revit, ArchiCAD, and Blender BIM."""
        import uuid

        storeys: Dict[str, Dict[str, Any]] = {
            FloorLevel.GROUND_FLOOR.value: {
                "ifc_type": "IfcBuildingStorey",
                "name": FloorLevel.GROUND_FLOOR.value,
                "elevation_meters": 0.0,
                "spaces": [],
                "structural_walls": [],
            },
            FloorLevel.FIRST_FLOOR.value: {
                "ifc_type": "IfcBuildingStorey",
                "name": FloorLevel.FIRST_FLOOR.value,
                "elevation_meters": 3.4,
                "spaces": [],
                "structural_walls": [],
            },
        }

        total_wall_length = 0.0
        total_openings = 0

        for room in self.rooms:
            storey_key = room.floor.value if room.floor.value in storeys else FloorLevel.GROUND_FLOOR.value
            space_data = {
                "global_id": f"space_{room.id}_{uuid.uuid4().hex[:8]}",
                "name": room.name,
                "type": room.room_type.value,
                "ifc_type": room.ifc_type,
                "area_m2": room.area_sqm,
                "volume_m3": round(room.area_sqm * room.ceiling_height, 2),
                "design_loads": {
                    "live_load_kpa": room.live_load_kpa,
                    "dead_load_kpa": room.dead_load_kpa,
                },
                "lighting_design": {
                    "target_lux": room.ambient_lux,
                    "daylight_factor": "4.2%" if "Sunroom" in room.name else "2.1%",
                },
                "furniture_count": len(room.furniture),
            }
            storeys[storey_key]["spaces"].append(space_data)

            for wall in room.walls:
                dx = wall.end.x - wall.start.x
                dz = wall.end.z - wall.start.z
                w_len = round((dx * dx + dz * dz) ** 0.5, 2)
                total_wall_length += w_len
                total_openings += len(wall.windows) + len(wall.doors)

                wall_data = {
                    "global_id": f"wall_{wall.id}_{uuid.uuid4().hex[:8]}",
                    "ifc_type": wall.ifc_type,
                    "length_m": w_len,
                    "height_m": wall.height,
                    "thickness_m": wall.thickness,
                    "load_bearing": wall.load_bearing,
                    "load_capacity_kn_m": wall.load_capacity_kn_m,
                    "fire_rating_minutes": wall.fire_rating_minutes,
                    "thermal_transmittance_u_value": wall.u_value,
                    "material": wall.material.value,
                    "openings": [
                        {
                            "ifc_type": win.ifc_type,
                            "width_m": win.width,
                            "height_m": win.height,
                            "u_value": win.u_value,
                            "solar_heat_gain_coef": win.shgc,
                            "acoustic_rw_db": win.acoustic_rw_db,
                        }
                        for win in wall.windows
                    ] + [
                        {
                            "ifc_type": door.ifc_type,
                            "width_m": door.width,
                            "height_m": door.height,
                            "fire_rating_minutes": door.fire_rating_minutes,
                            "accessible": door.accessibility_compliant,
                        }
                        for door in wall.doors
                    ],
                }
                storeys[storey_key]["structural_walls"].append(wall_data)

        return {
            "ifc_schema": "IFC4X3_ADD2",
            "mcp_agent": self.architect_agent,
            "project": {
                "global_id": f"proj_{uuid.uuid4().hex[:12]}",
                "name": self.project_title,
                "scale": self.scale,
                "units": "SI_METRIC (Meters, Radians, Kelvins)",
                "coordinate_system": "EPSG:4978 (WGS84 Earth-Centered)",
            },
            "site": {
                "name": "Spatial Farmhouse Parcel 104",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "elevation_amsl_m": 45.0,
            },
            "building": {
                "name": "Sustainable G+1 Biophilic Residence",
                "gross_floor_area_m2": self.total_builtup_sqm,
                "total_wall_span_linear_m": round(total_wall_length, 2),
                "total_fenestrations": total_openings,
                "structural_system": "Cross-Laminated Timber (CLT) & Reinforced Glulam Columns",
                "energy_rating": "Passive House Plus Certified (Net Positive)",
            },
            "storeys": list(storeys.values()),
            "structural_notes": self.structural_notes,
        }

