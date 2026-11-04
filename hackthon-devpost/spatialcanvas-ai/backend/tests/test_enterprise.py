"""SpatialCanvas AI - Enterprise Architectural & Observability Tests.
Validates Industry Foundation Classes (IFC 4x3) BIM structural export,
Prometheus /metrics exposition, and JSON-RPC 2.0 MCP endpoints.
"""

from fastapi.testclient import TestClient
from app.main import app
from app.services.scene_manager import scene_manager

client = TestClient(app)


def test_enterprise_bim_ifc_export():
    """Validates BIM IFC 4x3 schema export for structural engineering."""
    response = client.get("/api/scene/export/bim")
    assert response.status_code == 200
    data = response.json()

    assert data["ifc_schema"] == "IFC4X3_ADD2"
    assert "project" in data
    assert data["project"]["units"] == "SI_METRIC (Meters, Radians, Kelvins)"
    assert "storeys" in data
    assert len(data["storeys"]) == 2  # Ground Floor and First Floor

    # Verify storey elevations & structural elements
    gf_storey = next(s for s in data["storeys"] if "Ground" in s["name"])
    assert gf_storey["elevation_meters"] == 0.0
    assert len(gf_storey["spaces"]) > 0
    assert len(gf_storey["structural_walls"]) > 0

    first_wall = gf_storey["structural_walls"][0]
    assert first_wall["ifc_type"] == "IfcWallStandardCase"
    assert first_wall["load_bearing"] is True
    assert first_wall["load_capacity_kn_m"] > 0
    assert first_wall["fire_rating_minutes"] >= 60
    assert first_wall["thermal_transmittance_u_value"] > 0


def test_enterprise_telemetry_stats():
    """Validates active sessions, node metrics, and MCP registry telemetry."""
    response = client.get("/api/telemetry/stats")
    assert response.status_code == 200
    data = response.json()

    assert "active_scene" in data
    assert data["active_scene"]["nodes_count"] > 0
    assert "mcp_server" in data
    assert data["mcp_server"]["registered_tools"] >= 7
    assert "websockets" in data


def test_enterprise_prometheus_metrics():
    """Validates plain-text Prometheus metrics exposition for GCP Cloud Monitoring."""
    response = client.get("/metrics")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/plain")
    text = response.text

    assert "spatialcanvas_active_websocket_connections" in text
    assert "spatialcanvas_scene_nodes_count" in text
    assert "spatialcanvas_mcp_tools_total" in text
    assert "# TYPE spatialcanvas_active_websocket_connections gauge" in text


def test_enterprise_jsonrpc_api_endpoint():
    """Validates POST /api/mcp/jsonrpc external client integration."""
    req_body = {
        "jsonrpc": "2.0",
        "id": "ext-agent-42",
        "method": "tools/call",
        "params": {
            "name": "draft_timber_pergola",
            "arguments": {"width": 8.0, "length": 4.0},
        },
    }
    response = client.post("/api/mcp/jsonrpc", json=req_body)
    assert response.status_code == 200
    data = response.json()

    assert data["jsonrpc"] == "2.0"
    assert data["id"] == "ext-agent-42"
    assert data["result"]["isError"] is False
    assert "spatial_nodes" in data["result"]
    assert len(data["result"]["spatial_nodes"]) > 0
