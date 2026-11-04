"""SpatialCanvas AI - High-Performance Real-Time WebSocket Streaming.
Provides bi-directional communication between Meta Quest VR clients and FastAPI backend.
Streams predictive ghost states, PydanticAI reasoning tokens, and spatial delta updates.
"""

from __future__ import annotations
import json
import time
import uuid
import logging
from typing import Set, Dict, Any, Optional
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
    """Enterprise WebXR Client Connection & Session Manager.
    Tracks active sessions, manages heartbeats, counts telemetry frames,
    and isolates client streams.
    """

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.session_metadata: Dict[WebSocket, Dict[str, Any]] = {}
        self.total_connections_opened: int = 0
        self.total_messages_received: int = 0
        self.total_messages_sent: int = 0

    async def connect(self, websocket: WebSocket) -> str:
        await websocket.accept()
        session_id = f"session_{uuid.uuid4().hex[:8]}"
        self.active_connections.add(websocket)
        self.session_metadata[websocket] = {
            "session_id": session_id,
            "connected_at": time.time(),
            "last_heartbeat": time.time(),
            "messages_in": 0,
            "messages_out": 0,
        }
        self.total_connections_opened += 1
        logger.info(f"VR Client connected [{session_id}]. Active: {len(self.active_connections)}")
        return session_id

    def disconnect(self, websocket: WebSocket):
        meta = self.session_metadata.pop(websocket, None)
        self.active_connections.discard(websocket)
        sid = meta.get("session_id", "unknown") if meta else "unknown"
        logger.info(f"VR Client disconnected [{sid}]. Active: {len(self.active_connections)}")

    async def send_message(self, websocket: WebSocket, message: SpatialWebSocketMessage):
        await websocket.send_text(message.model_dump_json())
        self.total_messages_sent += 1
        if websocket in self.session_metadata:
            self.session_metadata[websocket]["messages_out"] += 1

    async def broadcast(self, message: SpatialWebSocketMessage):
        payload_json = message.model_dump_json()
        dead_sockets = []
        for connection in list(self.active_connections):
            try:
                await connection.send_text(payload_json)
                self.total_messages_sent += 1
                if connection in self.session_metadata:
                    self.session_metadata[connection]["messages_out"] += 1
            except Exception as e:
                logger.warning(f"Error broadcasting to client: {e}")
                dead_sockets.append(connection)
        for dead in dead_sockets:
            self.disconnect(dead)

    def record_inbound(self, websocket: WebSocket):
        self.total_messages_received += 1
        if websocket in self.session_metadata:
            self.session_metadata[websocket]["messages_in"] += 1
            self.session_metadata[websocket]["last_heartbeat"] = time.time()

    def get_stats(self) -> Dict[str, Any]:
        return {
            "active_connections": len(self.active_connections),
            "total_lifetime_connections": self.total_connections_opened,
            "total_messages_received": self.total_messages_received,
            "total_messages_sent": self.total_messages_sent,
            "sessions": [
                {
                    "session_id": m["session_id"],
                    "uptime_seconds": round(time.time() - m["connected_at"], 1),
                    "idle_seconds": round(time.time() - m["last_heartbeat"], 1),
                    "messages_in": m["messages_in"],
                    "messages_out": m["messages_out"],
                }
                for m in self.session_metadata.values()
            ],
        }


manager = ConnectionManager()


@router.websocket("/ws/spatial")
async def spatial_websocket_endpoint(websocket: WebSocket):
    session_id = await manager.connect(websocket)

    # Immediately send the active scene and session confirmation to initialize WebXR world
    try:
        initial_scene = scene_manager.get_scene()
        await manager.send_message(
            websocket,
            SpatialWebSocketMessage(
                type="full_scene",
                payload={
                    **initial_scene.model_dump(),
                    "session_id": session_id,
                },
            ),
        )

        while True:
            data = await websocket.receive_text()
            manager.record_inbound(websocket)
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

                # 4. Latency Ping-Pong with server timestamp & session verification
                elif msg_type == "ping":
                    await manager.send_message(
                        websocket,
                        SpatialWebSocketMessage(
                            type="pong",
                            payload={
                                "client_time": payload.get("client_time", 0),
                                "server_time": time.time(),
                                "session_id": session_id,
                            },
                        ),
                    )

            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON received on websocket: {data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as exc:
        logger.error(f"WebSocket session [{session_id}] exception: {exc}")
        manager.disconnect(websocket)

