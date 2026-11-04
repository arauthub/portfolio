/**
 * SpatialCanvas AI - Agent Thought Stream Visualizer
 * Renders real-time PydanticAI reasoning tokens, MCP tool executions,
 * and spatial action summaries inside the VR & Desktop HUD.
 */

class ThoughtStreamUI {
  constructor() {
    this.container = document.getElementById("thought-log-container");
    this.thoughtCount = 0;
  }

  addThought(thoughtData) {
    if (!this.container) return;

    const card = document.createElement("div");
    card.className = "thought-card";
    if (thoughtData.is_complete) {
      card.classList.add("complete");
    }

    const stepInfo = `Step ${thoughtData.step_number || 1}/${thoughtData.total_steps || 3}`;
    card.innerHTML = `
      <div class="thought-sender">🤖 ${thoughtData.agent_name || "SpatialAgent"} &bull; ${stepInfo}</div>
      <div class="thought-text">${thoughtData.thought}</div>
    `;

    this.container.appendChild(card);
    this.container.scrollTop = this.container.scrollHeight;
    this.thoughtCount++;
  }

  addMCPToolCall(mcpData) {
    if (!this.container) return;

    const card = document.createElement("div");
    card.className = "thought-card mcp";

    const toolsStr = (mcpData.tools_invoked || []).map(t => `<code>${t}</code>`).join(", ");
    card.innerHTML = `
      <div class="thought-sender">⚡ MCP Tool Invocation &bull; ${mcpData.agent || "Agent"}</div>
      <div class="thought-text">
        Executed: ${toolsStr}<br/>
        <span style="color: #94a3b8; font-size: 10px;">${mcpData.summary || "Tool completed successfully."}</span>
      </div>
    `;

    this.container.appendChild(card);
    this.container.scrollTop = this.container.scrollHeight;

    // Trigger audio bake feedback
    if (window.spatialAudio) {
      window.spatialAudio.playMCPToolBake();
    }
  }

  clear() {
    if (this.container) {
      this.container.innerHTML = "";
      this.thoughtCount = 0;
    }
  }
}

window.thoughtStreamUI = new ThoughtStreamUI();

