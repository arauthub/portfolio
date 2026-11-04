"""SpatialCanvas AI - High-Performance Real-Time WebSocket Streaming.
Provides bi-directional communication between Meta Quest VR clients and FastAPI backend.
Streams predictive ghost states, PydanticAI reasoning tokens, and spatial delta updates.
"""

from __future__ import annotations
import json
import logging
from typing import Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.schemas.spatial_types import Vector3
from app.schemas.agent_protocol import (
    VoiceCommandInput,
    SpatialWebSocketMessage,
)
from app.services.scene_manager import scene_manager
from app.agents.orchestrator import orchestrator

logger = logging.getLogger(__name__)

router = APIRouter(tags=["WebSockets"])


class ConnectionManager:
    """Manages active WebXR clients and multiplexes messages."""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"VR Client connected. Total active sessions: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"VR Client disconnected. Total active sessions: {len(self.active_connections)}")

    async def send_message(self, websocket: WebSocket, message: SpatialWebSocketMessage):
        await websocket.send_text(message.model_dump_json())

    async def broadcast(self, message: SpatialWebSocketMessage):
        payload_json = message.model_dump_json()
        for connection in list(self.active_connections):
            try:
                await connection.send_text(payload_json)
            except Exception as e:
                logger.warning(f"Error broadcasting to client: {e}")


manager = ConnectionManager()


@router.websocket("/ws/spatial")
async def spatial_websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    # Immediately send the active scene to initialize the client's WebXR world
    try:
        initial_scene = scene_manager.get_scene()
        await manager.send_message(
            websocket,
            SpatialWebSocketMessage(
                type="full_scene",
                payload=initial_scene.model_dump(),
            ),
        )

        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                msg_type = message.get("type", "")
                payload = message.get("payload", {})

                # 1. Voice Command / Prompt input
                if msg_type == "voice_input":
                    transcript = payload.get("transcript", "")
                    pos_data = payload.get("user_position", {})
                    user_pos = Vector3(
                        x=pos_data.get("x", 0.0),
                        y=pos_data.get("y", 1.6),
                        z=pos_data.get("z", 0.0),
                    )
                    ray_data = payload.get("target_ray_point")
                    ray_pos = None
                    if ray_data:
                        ray_pos = Vector3(
                            x=ray_data.get("x", 0.0),
                            y=ray_data.get("y", 0.0),
                            z=ray_data.get("z", 0.0),
                        )

                    cmd = VoiceCommandInput(
                        transcript=transcript,
                        user_position=user_pos,
                        target_ray_point=ray_pos,
                        hand_gesture=payload.get("hand_gesture"),
                    )

                    # Stream orchestrator steps asynchronously to this client
                    async for step_msg in orchestrator.process_voice_command(cmd):
                        await manager.send_message(websocket, step_msg)

                # 2. Switch Scene Preset
                elif msg_type == "switch_scene":
                    scene_id = payload.get("scene_id", "g1_farmhouse")
                    scene = scene_manager.switch_scene(scene_id)
                    await manager.broadcast(
                        SpatialWebSocketMessage(
                            type="full_scene",
                            payload=scene.model_dump(),
                        )
                    )

                # 3. Reset Scene
                elif msg_type == "reset_scene":
                    scene_id = payload.get("scene_id", scene_manager.current_scene_id)
                    scene = scene_manager.reset_scene(scene_id)
                    await manager.broadcast(
                        SpatialWebSocketMessage(
                            type="full_scene",
                            payload=scene.model_dump(),
                        )
                    )

                # 4. Latency Ping-Pong
                elif msg_type == "ping":
                    await manager.send_message(
                        websocket,
                        SpatialWebSocketMessage(
                            type="pong",
                            payload={"client_time": payload.get("client_time", 0)},
                        ),
                    )

            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON received on websocket: {data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as exc:
        logger.error(f"WebSocket session exception: {exc}")
        manager.disconnect(websocket)

