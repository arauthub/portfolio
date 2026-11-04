"""SpatialCanvas AI - Spatial Scene Graph Manager.
Maintains active 3D scenes in memory, provides 1:1 scale G+1 Farmhouse
and 1980s Retro Studio presets, and computes delta diffs for WebSockets.
"""

from __future__ import annotations
import copy
import json
import logging
from typing import Dict, List, Optional, Any
from app.schemas.spatial_types import (
    SpatialScene,
    SpatialNode,
    SpatialNodeType,
    Vector3,
    Rotation,
    Transform,
)
from app.schemas.architectural import (
    ArchitecturalPlan,
    RoomSpecification,
    RoomType,
    FloorLevel,
    WallSegment,
    WallMaterial,
    FlooringMaterial,
    FurnitureItem,
    DimensionLabel,
)
from app.schemas.retro_media import (
    RetroSynthStudioSpec,
    CRTMonitorSpec,
    CassetteDeckSpec,
    HologramEmitterSpec,
)
from app.schemas.agent_protocol import DeltaUpdate

logger = logging.getLogger(__name__)


class SceneManager:
    """Manages active spatial scenes and dispatches delta updates to VR clients."""

    def __init__(self):
        self.active_scenes: Dict[str, SpatialScene] = {}
        self.current_scene_id: str = "g1_farmhouse"
        self.farmhouse_plan: Optional[ArchitecturalPlan] = None
        self._initialize_presets()

    def _initialize_presets(self):
        """Constructs rich presets: G+1 Farmhouse and 1980s Retro Studio."""
        farmhouse_scene = self._build_g1_farmhouse_scene()
        retro_scene = self._build_retro_studio_scene()

        self.active_scenes["g1_farmhouse"] = farmhouse_scene
        self.active_scenes["retro_80s_studio"] = retro_scene

    def _build_g1_farmhouse_scene(self) -> SpatialScene:
        """Constructs the high-fidelity G+1 Farmhouse CAD layout at true 1:1 scale."""
        plan = ArchitecturalPlan(
            plan_id="farmhouse_v1",
            project_title="Sustainable G+1 Farmhouse Residence",
            scale="1:1 True Spatial Scale (VR Metres)",
            total_builtup_sqm=365.0,
            structural_notes=[
                "Bioclimatic cross-ventilation through central courtyard",
                "Ground floor exposed brick & white stucco",
                "First floor lightweight timber pergola & low-E curtain glazing",
            ],
        )

        # ---------------- GROUND FLOOR (G) ----------------

        # 1. Grand Living Hall & Lounge (G) - 8m x 6m, 3.6m ceiling
        living_room = RoomSpecification(
            id="gf_living",
            name="Grand Living Hall",
            room_type=RoomType.LIVING_HALL,
            floor=FloorLevel.GROUND_FLOOR,
            center=Vector3(x=-4.0, y=0.0, z=-3.0),
            width=8.0,
            length=6.0,
            ceiling_height=3.6,
            area_sqm=48.0,
            flooring=FlooringMaterial.POLISHED_CONCRETE,
            floor_color="#e2e8f0",
            walls=[
                # South wall with entrance
                WallSegment(
                    id="gf_liv_s",
                    start=Vector3(x=-8.0, y=0.0, z=0.0),
                    end=Vector3(x=0.0, y=0.0, z=0.0),
                    height=3.6,
                    material=WallMaterial.WHITE_STUCCO,
                    color="#f8fafc",
                ),
                # North wall (curtain glass overlooking gardens)
                WallSegment(
                    id="gf_liv_n",
                    start=Vector3(x=-8.0, y=0.0, z=-6.0),
                    end=Vector3(x=0.0, y=0.0, z=-6.0),
                    height=3.6,
                    material=WallMaterial.CURTAIN_GLASS,
                    color="#38bdf8",
                ),
                # West wall (exposed brick accent)
                WallSegment(
                    id="gf_liv_w",
                    start=Vector3(x=-8.0, y=0.0, z=-6.0),
                    end=Vector3(x=-8.0, y=0.0, z=0.0),
                    height=3.6,
                    material=WallMaterial.EXPOSED_BRICK,
                    color="#b45309",
                ),
            ],
            furniture=[
                # Modern L-Shape Sectional Sofa
                FurnitureItem(
                    id="gf_sofa",
                    name="L-Shape Designer Sectional Sofa",
                    category="seating",
                    position=Vector3(x=-4.5, y=0.45, z=-3.2),
                    rotation_y=0.0,
                    dimensions=Vector3(x=3.2, y=0.8, z=2.2),
                    color="#475569",
                ),
                # Low Oak Coffee Table
                FurnitureItem(
                    id="gf_coffeetable",
                    name="Minimalist Oak Coffee Table",
                    category="table",
                    position=Vector3(x=-4.2, y=0.22, z=-3.2),
                    rotation_y=0.0,
                    dimensions=Vector3(x=1.6, y=0.4, z=0.9),
                    color="#b45309",
                ),
                # Media Credenza & Ambient Fireplace
                FurnitureItem(
                    id="gf_credenza",
                    name="Floating Media Credenza & Hearth",
                    category="fixture",
                    position=Vector3(x=-7.6, y=0.5, z=-3.0),
                    rotation_y=90.0,
                    dimensions=Vector3(x=0.6, y=0.8, z=3.6),
                    color="#1e293b",
                ),
            ],
            dimension_labels=[
                DimensionLabel(
                    id="dim_liv_w",
                    start=Vector3(x=-8.0, y=0.1, z=0.0),
                    end=Vector3(x=0.0, y=0.1, z=0.0),
                    measurement_text="8.00 m (Span)",
                ),
                DimensionLabel(
                    id="dim_liv_d",
                    start=Vector3(x=-8.0, y=0.1, z=-6.0),
                    end=Vector3(x=-8.0, y=0.1, z=0.0),
                    measurement_text="6.00 m (Depth)",
                ),
            ],
        )

        # 2. Central Courtyard & Garden (G) - 6m x 6m Open to Sky
        courtyard = RoomSpecification(
            id="gf_courtyard",
            name="Central Sunlit Courtyard",
            room_type=RoomType.CENTRAL_COURTYARD,
            floor=FloorLevel.GROUND_FLOOR,
            center=Vector3(x=3.0, y=0.0, z=-3.0),
            width=6.0,
            length=6.0,
            ceiling_height=7.0,  # Double-height opening
            area_sqm=36.0,
            flooring=FlooringMaterial.COURTYARD_GRASS,
            floor_color="#15803d",
            furniture=[
                # Centerpiece Architectural Tree / Planter
                FurnitureItem(
                    id="court_tree",
                    name="Courtyard Japanese Maple Tree Planter",
                    category="plant",
                    position=Vector3(x=3.0, y=1.8, z=-3.0),
                    rotation_y=45.0,
                    dimensions=Vector3(x=1.8, y=3.6, z=1.8),
                    color="#16a34a",
                ),
                # Stone Water Basin
                FurnitureItem(
                    id="court_water",
                    name="Reflective Granite Water Basin",
                    category="fixture",
                    position=Vector3(x=4.2, y=0.2, z=-1.8),
                    rotation_y=0.0,
                    dimensions=Vector3(x=1.4, y=0.35, z=1.4),
                    color="#0284c7",
                ),
            ],
            dimension_labels=[
                DimensionLabel(
                    id="dim_court_sq",
                    start=Vector3(x=0.0, y=0.1, z=0.0),
                    end=Vector3(x=6.0, y=0.1, z=0.0),
                    measurement_text="6.00 m x 6.00 m (Open Courtyard)",
                )
            ],
        )

        # 3. Modular Open Kitchen & Dining (G) - 6m x 6m
        kitchen = RoomSpecification(
            id="gf_kitchen",
            name="Modular Kitchen & Dining Alcove",
            room_type=RoomType.MODULAR_KITCHEN,
            floor=FloorLevel.GROUND_FLOOR,
            center=Vector3(x=3.0, y=0.0, z=3.0),
            width=6.0,
            length=6.0,
            ceiling_height=3.4,
            area_sqm=36.0,
            flooring=FlooringMaterial.TRAVERTINE_STONE,
            floor_color="#cbd5e1",
            walls=[
                WallSegment(
                    id="gf_kit_e",
                    start=Vector3(x=6.0, y=0.0, z=0.0),
                    end=Vector3(x=6.0, y=0.0, z=6.0),
                    height=3.4,
                    material=WallMaterial.WHITE_STUCCO,
                    color="#f1f5f9",
                ),
                WallSegment(
                    id="gf_kit_s",
                    start=Vector3(x=0.0, y=0.0, z=6.0),
                    end=Vector3(x=6.0, y=0.0, z=6.0),
                    height=3.4,
                    material=WallMaterial.CURTAIN_GLASS,
                    color="#38bdf8",
                ),
            ],
            furniture=[
                # Quartz Kitchen Island
                FurnitureItem(
                    id="gf_island",
                    name="Calacatta Quartz Island Counter",
                    category="table",
                    position=Vector3(x=3.0, y=0.5, z=2.6),
                    rotation_y=0.0,
                    dimensions=Vector3(x=3.2, y=0.95, z=1.2),
                    color="#f8fafc",
                ),
                # 6-Seater Oak Dining Table
                FurnitureItem(
                    id="gf_dining",
                    name="Solid Oak 6-Seater Dining Table",
                    category="table",
                    position=Vector3(x=3.0, y=0.42, z=4.6),
                    rotation_y=0.0,
                    dimensions=Vector3(x=2.2, y=0.78, z=1.0),
                    color="#92400e",
                ),
            ],
        )

        # 4. Sprawling Veranda (G) - 8m x 4m covered outdoor porch
        veranda = RoomSpecification(
            id="gf_veranda",
            name="Sprawling Farmhouse Veranda",
            room_type=RoomType.VERANDA,
            floor=FloorLevel.GROUND_FLOOR,
            center=Vector3(x=-4.0, y=0.0, z=2.0),
            width=8.0,
            length=4.0,
            ceiling_height=3.2,
            area_sqm=32.0,
            flooring=FlooringMaterial.NATURAL_OAK_WOOD,
            floor_color="#9a3412",
            walls=[
                WallSegment(
                    id="gf_ver_w",
                    start=Vector3(x=-8.0, y=0.0, z=0.0),
                    end=Vector3(x=-8.0, y=0.0, z=4.0),
                    height=3.2,
                    material=WallMaterial.TIMBER_SLATS,
                    color="#78350f",
                )
            ],
            furniture=[
                FurnitureItem(
                    id="ver_loungers",
                    name="Wicker Farmhouse Daybed & Planters",
                    category="seating",
                    position=Vector3(x=-4.0, y=0.3, z=2.5),
                    rotation_y=0.0,
                    dimensions=Vector3(x=2.4, y=0.6, z=1.2),
                    color="#a16207",
                )
            ],
        )

        # ---------------- FIRST FLOOR (G+1) ----------------
        # Floor Y offset = 3.6m

        # 5. Master Suite with Panoramic Balcony (G+1) - 8m x 6m
        master_suite = RoomSpecification(
            id="f1_master",
            name="Master Bedroom Suite (G+1)",
            room_type=RoomType.MASTER_SUITE,
            floor=FloorLevel.FIRST_FLOOR,
            center=Vector3(x=-4.0, y=3.6, z=-3.0),
            width=8.0,
            length=6.0,
            ceiling_height=3.2,
            area_sqm=48.0,
            flooring=FlooringMaterial.NATURAL_OAK_WOOD,
            floor_color="#b45309",
            walls=[
                # West Wall
                WallSegment(
                    id="f1_mas_w",
                    start=Vector3(x=-8.0, y=3.6, z=-6.0),
                    end=Vector3(x=-8.0, y=3.6, z=0.0),
                    height=3.2,
                    material=WallMaterial.TIMBER_SLATS,
                    color="#78350f",
                ),
                # North Glass Balcony Wall
                WallSegment(
                    id="f1_mas_n",
                    start=Vector3(x=-8.0, y=3.6, z=-6.0),
                    end=Vector3(x=0.0, y=3.6, z=-6.0),
                    height=3.2,
                    material=WallMaterial.CURTAIN_GLASS,
                    color="#38bdf8",
                ),
            ],
            furniture=[
                # King Sized Platform Bed
                FurnitureItem(
                    id="f1_kingbed",
                    name="Floating Teak King Bed & Headboard",
                    category="seating",
                    position=Vector3(x=-5.2, y=3.6 + 0.35, z=-3.0),
                    rotation_y=90.0,
                    dimensions=Vector3(x=2.2, y=0.7, z=2.0),
                    color="#475569",
                ),
                # Lounge Armchair
                FurnitureItem(
                    id="f1_armchair",
                    name="Bouclé Reading Chair & Floor Lamp",
                    category="seating",
                    position=Vector3(x=-2.2, y=3.6 + 0.4, z=-4.8),
                    rotation_y=-45.0,
                    dimensions=Vector3(x=0.9, y=0.85, z=0.9),
                    color="#0284c7",
                ),
            ],
            dimension_labels=[
                DimensionLabel(
                    id="dim_mas_h",
                    start=Vector3(x=-8.0, y=3.7, z=0.0),
                    end=Vector3(x=-8.0, y=6.8, z=0.0),
                    measurement_text="3.20 m (G+1 Ceiling)",
                    orientation="vertical",
                )
            ],
        )

        # 6. East-Facing Sunroom & Studio (G+1) - 6m x 6m Glass Enclosure
        sunroom = RoomSpecification(
            id="f1_sunroom",
            name="East-Facing Sunroom & Studio (G+1)",
            room_type=RoomType.SUNROOM,
            floor=FloorLevel.FIRST_FLOOR,
            center=Vector3(x=3.0, y=3.6, z=-3.0),
            width=6.0,
            length=6.0,
            ceiling_height=3.2,
            area_sqm=36.0,
            flooring=FlooringMaterial.POLISHED_CONCRETE,
            floor_color="#e2e8f0",
            walls=[
                WallSegment(
                    id="f1_sun_e",
                    start=Vector3(x=6.0, y=3.6, z=-6.0),
                    end=Vector3(x=6.0, y=3.6, z=0.0),
                    height=3.2,
                    material=WallMaterial.CURTAIN_GLASS,
                    color="#38bdf8",
                ),
                WallSegment(
                    id="f1_sun_n",
                    start=Vector3(x=0.0, y=3.6, z=-6.0),
                    end=Vector3(x=6.0, y=3.6, z=-6.0),
                    height=3.2,
                    material=WallMaterial.CURTAIN_GLASS,
                    color="#38bdf8",
                ),
            ],
            furniture=[
                # Architecture Drafting Workbench
                FurnitureItem(
                    id="sun_workbench",
                    name="Architectural Drafting Drafting Desk",
                    category="table",
                    position=Vector3(x=3.2, y=3.6 + 0.45, z=-3.2),
                    rotation_y=0.0,
                    dimensions=Vector3(x=2.2, y=0.9, z=1.1),
                    color="#334155",
                ),
                # Botanical Planters Array
                FurnitureItem(
                    id="sun_planters",
                    name="Botanical Sunroom Planters",
                    category="plant",
                    position=Vector3(x=5.2, y=3.6 + 0.4, z=-4.8),
                    rotation_y=0.0,
                    dimensions=Vector3(x=1.8, y=0.8, z=0.6),
                    color="#15803d",
                ),
            ],
        )

        # 7. Timber Pergola Terrace Deck (G+1) - 8m x 4m Outdoor Deck
        pergola_deck = RoomSpecification(
            id="f1_pergola",
            name="Timber Pergola Rooftop Deck (G+1)",
            room_type=RoomType.PERGOLA_TERRACE,
            floor=FloorLevel.FIRST_FLOOR,
            center=Vector3(x=-4.0, y=3.6, z=2.0),
            width=8.0,
            length=4.0,
            ceiling_height=3.0,
            area_sqm=32.0,
            flooring=FlooringMaterial.NATURAL_OAK_WOOD,
            floor_color="#78350f",
            furniture=[
                # Outdoor Firepit Table
                FurnitureItem(
                    id="perg_firepit",
                    name="Granite Firepit Coffee Table & Stools",
                    category="fixture",
                    position=Vector3(x=-4.0, y=3.6 + 0.25, z=2.0),
                    rotation_y=0.0,
                    dimensions=Vector3(x=1.6, y=0.5, z=1.6),
                    color="#e11d48",
                )
            ],
            dimension_labels=[
                DimensionLabel(
                    id="dim_perg_deck",
                    start=Vector3(x=-8.0, y=3.7, z=0.0),
                    end=Vector3(x=0.0, y=3.7, z=0.0),
                    measurement_text="8.00 m Pergola Span",
                )
            ],
        )

        # Assemble plan
        plan.rooms = [
            living_room,
            courtyard,
            kitchen,
            veranda,
            master_suite,
            sunroom,
            pergola_deck,
        ]
        self.farmhouse_plan = plan

        # Convert to 3D spatial nodes
        nodes = plan.to_spatial_nodes()

        # Add Floating Staircase connecting G to G+1
        staircase_steps = 14
        step_width = 1.2
        step_height = 3.6 / staircase_steps
        step_depth = 0.28
        for i in range(staircase_steps):
            step_node = SpatialNode(
                id=f"stair_step_{i}",
                name=f"Floating Oak Tread #{i+1}",
                node_type=SpatialNodeType.STAIRCASE,
                transform=Transform(
                    position=Vector3(
                        x=-0.2,
                        y=(i + 0.5) * step_height,
                        z=-0.5 - (i * step_depth),
                    ),
                    scale=Vector3(x=step_width, y=0.08, z=step_depth),
                ),
                color="#b45309",
                roughness=0.3,
                metalness=0.1,
                metadata={"step_index": i, "tread_elevation": (i + 1) * step_height},
            )
            nodes.append(step_node)

        # Add Timber Pergola Slats overhead on First Floor Terrace
        for s in range(7):
            pergola_slat = SpatialNode(
                id=f"pergola_slat_{s}",
                name=f"Cedar Pergola Louver #{s+1}",
                node_type=SpatialNodeType.PERGOLA,
                transform=Transform(
                    position=Vector3(
                        x=-4.0,
                        y=6.6,
                        z=0.5 + (s * 0.55),
                    ),
                    scale=Vector3(x=7.8, y=0.15, z=0.08),
                ),
                color="#451a03",
                roughness=0.6,
                metadata={"pergola_level": "G+1 Roof"},
            )
            nodes.append(pergola_slat)

        return SpatialScene(
            scene_id="g1_farmhouse",
            title="G+1 Farmhouse Architectural Drafting Studio",
            description="True 1:1 scale spatial walkthrough of a modern sustainable G+1 farmhouse with central courtyard, veranda, sunroom, and timber pergola.",
            environment="farmhouse_meadow",
            ambient_light_color="#fef3c7",
            ambient_light_intensity=0.85,
            ground_grid=True,
            nodes=nodes,
            version=1,
        )

    def _build_retro_studio_scene(self) -> SpatialScene:
        """Constructs the 1980s retro-aesthetic synthwave creation studio."""
        spec = RetroSynthStudioSpec(
            studio_id="retro_1984",
            title="1980s Retro Synthwave Creation Studio",
            neon_grid_color="#ff007f",
            crt_monitors=[
                # Center Main CRT Monitor
                CRTMonitorSpec(
                    id="crt_center",
                    label="Master Synth CRT Monitor",
                    position=Vector3(x=0.0, y=1.6, z=-2.8),
                    rotation=Rotation(pitch=0.0, yaw=0.0, roll=0.0),
                    screen_width=1.6,
                    screen_height=1.2,
                    phosphor_color="#39ff14",  # Neon green
                    active_channel="wireframe_torus",
                    text_overlay="SPATIAL-OS :: MCP-AGENT 80s",
                ),
                # Left Wing Curved CRT Monitor
                CRTMonitorSpec(
                    id="crt_left",
                    label="Audio Spectrum Analyzer CRT",
                    position=Vector3(x=-2.2, y=1.5, z=-2.3),
                    rotation=Rotation(pitch=0.0, yaw=35.0, roll=0.0),
                    screen_width=1.2,
                    screen_height=0.9,
                    phosphor_color="#00f3ff",  # Cyan
                    active_channel="spectrum_analyzer",
                    text_overlay="STEREO 120BPM :: EQ ACTIVE",
                ),
                # Right Wing Curved CRT Monitor
                CRTMonitorSpec(
                    id="crt_right",
                    label="Vector Grid Flight CRT",
                    position=Vector3(x=2.2, y=1.5, z=-2.3),
                    rotation=Rotation(pitch=0.0, yaw=-35.0, roll=0.0),
                    screen_width=1.2,
                    screen_height=0.9,
                    phosphor_color="#ff007f",  # Hot pink
                    active_channel="vector_flight",
                    text_overlay="HORIZON LOCK :: 1984 VIBES",
                ),
            ],
            cassette_decks=[
                CassetteDeckSpec(
                    id="deck_alpha",
                    label="Stereo Cassette Deck Model 84",
                    position=Vector3(x=-0.8, y=0.85, z=-2.2),
                    tape_title="SYNTHWAVE DREAMS VOL. 1",
                    glow_color="#f43f5e",
                ),
                CassetteDeckSpec(
                    id="deck_beta",
                    label="Analog Sampler Rack",
                    position=Vector3(x=0.8, y=0.85, z=-2.2),
                    tape_title="RETRO CAD BLUEPRINTS",
                    glow_color="#38bdf8",
                ),
            ],
            hologram_emitters=[
                HologramEmitterSpec(
                    id="holo_car",
                    position=Vector3(x=-3.2, y=0.0, z=0.0),
                    hologram_subject="wireframe_delorean",
                    glow_color="#06b6d4",
                    beam_height=2.2,
                    rotation_speed=0.8,
                ),
                HologramEmitterSpec(
                    id="holo_pyramid",
                    position=Vector3(x=3.2, y=0.0, z=0.0),
                    hologram_subject="neon_pyramid",
                    glow_color="#ec4899",
                    beam_height=2.2,
                    rotation_speed=-1.2,
                ),
            ],
        )

        nodes = spec.to_spatial_nodes()

        # Add Synth Keyboard / Console Table
        table_node = SpatialNode(
            id="synth_console_table",
            name="1980s Studio Console Desk",
            node_type=SpatialNodeType.FURNITURE,
            transform=Transform(
                position=Vector3(x=0.0, y=0.4, z=-2.2),
                scale=Vector3(x=3.4, y=0.8, z=1.2),
            ),
            color="#09090b",
            roughness=0.2,
            metalness=0.8,
            metadata={"style": "matte_black_studio_desk"},
        )
        nodes.append(table_node)

        return SpatialScene(
            scene_id="retro_80s_studio",
            title="1980s Retro Digital Media Synthesis Studio",
            description="Step directly into an 80s synthwave horizon with floating CRT arrays, tape decks, neon grids, and audio-reactive holograms.",
            environment="synthwave_void",
            ambient_light_color="#3b0764",
            ambient_light_intensity=0.5,
            fog_color="#2e0854",
            fog_density=0.02,
            ground_grid=True,
            nodes=nodes,
            version=1,
        )

    def get_scene(self, scene_id: Optional[str] = None) -> SpatialScene:
        sid = scene_id or self.current_scene_id
        if sid not in self.active_scenes:
            sid = "g1_farmhouse"
        return self.active_scenes[sid]

    def switch_scene(self, scene_id: str) -> SpatialScene:
        if scene_id in self.active_scenes:
            self.current_scene_id = scene_id
        return self.get_scene()

    def add_node(self, scene_id: str, node: SpatialNode) -> DeltaUpdate:
        scene = self.get_scene(scene_id)
        # Check if node exists and update
        existing_idx = next((i for i, n in enumerate(scene.nodes) if n.id == node.id), None)
        if existing_idx is not None:
            scene.nodes[existing_idx] = node
        else:
            scene.nodes.append(node)
        scene.version += 1
        return DeltaUpdate(action="upsert", nodes=[node], version=scene.version)

    def add_nodes(self, scene_id: str, new_nodes: List[SpatialNode]) -> DeltaUpdate:
        scene = self.get_scene(scene_id)
        for node in new_nodes:
            existing_idx = next((i for i, n in enumerate(scene.nodes) if n.id == node.id), None)
            if existing_idx is not None:
                scene.nodes[existing_idx] = node
            else:
                scene.nodes.append(node)
        scene.version += 1
        return DeltaUpdate(action="batch_replace", nodes=new_nodes, version=scene.version)

    def remove_node(self, scene_id: str, node_id: str) -> DeltaUpdate:
        scene = self.get_scene(scene_id)
        scene.nodes = [n for n in scene.nodes if n.id != node_id]
        scene.version += 1
        return DeltaUpdate(action="delete", removed_ids=[node_id], version=scene.version)

    def reset_scene(self, scene_id: str) -> SpatialScene:
        if scene_id == "g1_farmhouse":
            self.active_scenes["g1_farmhouse"] = self._build_g1_farmhouse_scene()
        elif scene_id == "retro_80s_studio":
            self.active_scenes["retro_80s_studio"] = self._build_retro_studio_scene()
        return self.get_scene(scene_id)

    def get_bim_export(self) -> Dict[str, Any]:
        """Returns IFC 4x3 compliant BIM architectural exchange payload."""
        if not self.farmhouse_plan:
            self._build_g1_farmhouse_scene()
        return self.farmhouse_plan.export_bim_ifc()


scene_manager = SceneManager()

