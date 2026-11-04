"""Tests for WebSocket and Predictive Engine."""

import pytest
from app.schemas.spatial_types import Vector3
from app.schemas.agent_protocol import VoiceCommandInput
from app.services.predictive_engine import predictive_engine
from app.services.scene_manager import scene_manager


def test_predictive_engine_sunroom():
    cmd = VoiceCommandInput(
        transcript="Please add an east facing sunroom on the first floor",
        user_position=Vector3(x=0.0, y=1.6, z=0.0),
    )
    ghost = predictive_engine.predict_ghost(cmd)
    assert ghost.target_intent.value == "add_sunroom"
    assert ghost.position.y >= 3.6  # First floor height
    assert ghost.wireframe_color == "#38bdf8"


def test_predictive_engine_retro_studio():
    cmd = VoiceCommandInput(
        transcript="Transform into an 80s retro synthwave studio with neon grid",
        user_position=Vector3(x=0.0, y=1.6, z=0.0),
    )
    ghost = predictive_engine.predict_ghost(cmd)
    assert ghost.target_intent.value == "generate_retro_media"
    assert ghost.wireframe_color == "#ec4899"


def test_scene_manager_presets():
    farmhouse = scene_manager.get_scene("g1_farmhouse")
    assert farmhouse.scene_id == "g1_farmhouse"
    assert len(farmhouse.nodes) > 15

    retro = scene_manager.get_scene("retro_80s_studio")
    assert retro.scene_id == "retro_80s_studio"
    assert any(n.node_type.value == "crt_monitor" for n in retro.nodes)

