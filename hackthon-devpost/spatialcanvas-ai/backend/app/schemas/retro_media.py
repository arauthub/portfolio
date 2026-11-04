"""SpatialCanvas AI - 1980s Retro-Aesthetic Digital Media Schemas.
Models vintage CRT monitor arrays, neon grids, cassette decks, and holographic emitters.
"""

from __future__ import annotations
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from .spatial_types import Vector3, Rotation, SpatialNode, SpatialNodeType, Transform


class CRTMonitorSpec(BaseModel):
    id: str
    label: str = "Retro CRT Display"
    position: Vector3
    rotation: Rotation = Field(default_factory=Rotation)
    screen_width: float = 1.2
    screen_height: float = 0.9
    phosphor_color: str = "#39ff14"  # Neon green phosphor, or "#00f3ff", "#ff007f"
    scanline_intensity: float = 0.75
    curvature: float = 0.2
    active_channel: str = "synthwave_sunset"  # "wireframe_torus", "spectrum_analyzer", "retro_matrix", "vector_flight"
    text_overlay: Optional[str] = "SPATIAL-OS v1.85"


class CassetteDeckSpec(BaseModel):
    id: str
    label: str = "Spatial Cassette Deck Deck-84"
    position: Vector3
    tape_title: str = "SYNTHWAVE ODYSSEY 1984"
    is_playing: bool = True
    tape_counter: int = 420
    glow_color: str = "#f43f5e"


class HologramEmitterSpec(BaseModel):
    id: str
    position: Vector3
    hologram_subject: str = "wireframe_delorean"  # or "neon_pyramid", "spatial_avatar"
    glow_color: str = "#06b6d4"
    beam_height: float = 2.5
    rotation_speed: float = 1.0
    glitch_intensity: float = 0.3


class RetroSynthStudioSpec(BaseModel):
    studio_id: str
    title: str = "1980s Neon Synthwave Creation Studio"
    neon_grid_color: str = "#ff007f"  # Synthwave hot magenta
    grid_horizon_z: float = 40.0
    retro_sun_position: Vector3 = Field(default_factory=lambda: Vector3(x=0.0, y=12.0, z=-35.0))
    retro_sun_radius: float = 8.0
    retro_sun_color: str = "#fbbf24"
    crt_monitors: List[CRTMonitorSpec] = Field(default_factory=list)
    cassette_decks: List[CassetteDeckSpec] = Field(default_factory=list)
    hologram_emitters: List[HologramEmitterSpec] = Field(default_factory=list)
    ambient_audio_track: str = "neon_drift_120bpm"

    def to_spatial_nodes(self) -> List[SpatialNode]:
        nodes: List[SpatialNode] = []

        # Retro Sun
        sun_node = SpatialNode(
            id=f"sun_{self.studio_id}",
            name="1980s Synthwave Horizon Sun",
            node_type=SpatialNodeType.RETRO_SUN,
            transform=Transform(
                position=self.retro_sun_position,
                scale=Vector3(x=self.retro_sun_radius, y=self.retro_sun_radius, z=0.5),
            ),
            color=self.retro_sun_color,
            emissive=self.retro_sun_color,
            emissive_intensity=2.0,
            metadata={"sun_segments": 6, "pulse_frequency": 0.5},
        )
        nodes.append(sun_node)

        # Neon Infinite Grid
        grid_node = SpatialNode(
            id=f"grid_{self.studio_id}",
            name="Infinite Perspective Neon Grid",
            node_type=SpatialNodeType.NEON_GRID,
            transform=Transform(
                position=Vector3(x=0.0, y=-0.05, z=0.0),
                scale=Vector3(x=60.0, y=1.0, z=60.0),
            ),
            color=self.neon_grid_color,
            emissive=self.neon_grid_color,
            emissive_intensity=1.2,
            metadata={"grid_spacing": 2.0, "horizon_distance": self.grid_horizon_z},
        )
        nodes.append(grid_node)

        # CRT Monitors
        for mon in self.crt_monitors:
            mon_node = SpatialNode(
                id=f"crt_{mon.id}",
                name=mon.label,
                node_type=SpatialNodeType.CRT_MONITOR,
                transform=Transform(
                    position=mon.position,
                    rotation=mon.rotation,
                    scale=Vector3(x=mon.screen_width, y=mon.screen_height, z=0.4),
                ),
                color="#1e1e2f",
                emissive=mon.phosphor_color,
                emissive_intensity=1.5,
                metadata={
                    "phosphor": mon.phosphor_color,
                    "channel": mon.active_channel,
                    "scanlines": mon.scanline_intensity,
                    "overlay_text": mon.text_overlay,
                },
            )
            nodes.append(mon_node)

        # Cassette Decks
        for deck in self.cassette_decks:
            deck_node = SpatialNode(
                id=f"deck_{deck.id}",
                name=deck.label,
                node_type=SpatialNodeType.CASSETTE_DECK,
                transform=Transform(
                    position=deck.position,
                    scale=Vector3(x=0.8, y=0.3, z=0.5),
                ),
                color="#18181b",
                emissive=deck.glow_color,
                emissive_intensity=1.0,
                metadata={"title": deck.tape_title, "counter": deck.tape_counter},
            )
            nodes.append(deck_node)

        # Hologram Emitters
        for holo in self.hologram_emitters:
            holo_node = SpatialNode(
                id=f"holo_{holo.id}",
                name=f"Hologram ({holo.hologram_subject})",
                node_type=SpatialNodeType.HOLOGRAM_EMITTER,
                transform=Transform(
                    position=holo.position,
                    scale=Vector3(x=1.2, y=holo.beam_height, z=1.2),
                ),
                color=holo.glow_color,
                opacity=0.6,
                emissive=holo.glow_color,
                emissive_intensity=1.8,
                metadata={
                    "subject": holo.hologram_subject,
                    "glitch": holo.glitch_intensity,
                    "spin": holo.rotation_speed,
                },
            )
            nodes.append(holo_node)

        return nodes

