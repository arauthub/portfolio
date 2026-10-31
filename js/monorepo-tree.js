/**
 * Nexus Prime - Monorepo Directory Explorer & Code Viewer
 * Interactive representation of the monorepo architecture
 */

import { soundSynth } from './audio-synth.js';

export const MONOREPO_TREE = [
  {
    name: "apps",
    type: "dir",
    desc: "Fullstack web applications & distributed cloud storage services",
    children: [
      {
        name: "arnas",
        type: "dir",
        desc: "Enterprise Cloud NAS & Zero-Knowledge E2EE Mobile Sync",
        snippet: `// apps/arnas/server/src/crypto/e2ee.ts
import { createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync } from 'crypto';

export function deriveKey(masterPassword: string, salt: Buffer): Buffer {
  return pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256');
}

export function encryptAESGCM(data: Buffer, key: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return { ciphertext: encrypted, iv, authTag: cipher.getAuthTag() };
}`
      },
      {
        name: "synapse-lms",
        type: "dir",
        desc: "Cybernetic Learning Experience Platform with Wagtail Headless Engine & Angular 22",
        snippet: `// apps/synapse-lms/frontend/src/app/core/services/gamification.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GamificationService {
  public profile = signal<LearnerProfile>({
    callsign: 'Cyber-Adept-01',
    level: 3,
    current_xp: 1450,
    streak_days: 6
  });
}`
      },
      {
        name: "workspace-curator",
        type: "dir",
        desc: "Google Workspace Webhook Ingestion & AI Curation Engine",
        snippet: `# apps/workspace-curator/app/main.py
from fastapi import FastAPI, BackgroundTasks, Request
from app.services.curator import generate_executive_briefing

app = FastAPI(title="WorkspaceCurator Pro")

@app.post("/api/v1/webhooks/google-drive")
async def handle_drive_watch(req: Request, bg: BackgroundTasks):
    headers = dict(req.headers)
    resource_state = headers.get("x-goog-resource-state")
    bg.add_task(generate_executive_briefing, resource_state)
    return {"status": "ingested", "channel": "drive_watch"}`
      },
      {
        name: "flashapps",
        type: "dir",
        desc: "Decoupled Django REST API & Angular Single Page App"
      },
      {
        name: "wagtailwind",
        type: "dir",
        desc: "Enterprise Wagtail CMS with Tailwind CSS design systems"
      },
      {
        name: "mytail",
        type: "dir",
        desc: "Feature-rich Wagtail CMS instance with custom blog architectures"
      }
    ]
  },
  {
    name: "extensions",
    type: "dir",
    desc: "Chrome Manifest V3 browser extensions & developer toolkits",
    children: [
      {
        name: "gravidrift-browser",
        type: "dir",
        desc: "Matter.js 2D zero-gravity physics engine & space arcade sandbox",
        snippet: `// extensions/gravidrift-browser/content/content.js
import Matter from 'matter-js';

export class GraviDriftEngine {
  constructor() {
    this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    this.runner = Matter.Runner.create();
  }

  invertGravity(dir) {
    const vectors = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    this.engine.gravity = vectors[dir] || { x: 0, y: 0 };
  }
}`
      },
      {
        name: "api-pulse-pro",
        type: "dir",
        desc: "Developer-grade network traffic inspector & replay studio",
        snippet: `// extensions/api-pulse-pro/content/network-interceptor.js
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const startTime = performance.now();
  const res = await originalFetch(...args);
  const latency = Math.round(performance.now() - startTime);
  window.postMessage({ type: "API_PULSE_TRAFFIC", url: args[0], latency, status: res.status });
  return res;
};`
      },
      {
        name: "diagram-image-lens",
        type: "dir",
        desc: "High-magnification architecture loupe & Retina snipper"
      },
      {
        name: "link-inspector-extension",
        type: "dir",
        desc: "Async link checker, Wayback Machine recovery & UTM stripper"
      }
    ]
  },
  {
    name: "agents",
    type: "dir",
    desc: "Autonomous AI agent swarms & RAG orchestration",
    children: [
      {
        name: "myagents",
        type: "dir",
        desc: "Google ADK multi-agent swarm DAG with vector RAG",
        snippet: `# agents/myagents/core/orchestrator.py
from typing import Dict, List
from core.llm_adapter import LLMAdapter

class SwarmOrchestrator:
    def __init__(self, mode="simulation"):
        self.adapter = LLMAdapter(mode=mode)
        self.dag = self._build_topological_dag()

    async def execute_task(self, prompt: str) -> Dict:
        dag_order = ["nexus_commander", "scout_intelligence", "vanguard_architect", "sentinel_auditor", "aegis_synthesizer"]
        results = {}
        for node in dag_order:
            results[node] = await self.run_agent(node, prompt, results)
        return results`
      }
    ]
  },
  {
    name: "devops",
    type: "dir",
    desc: "CI/CD verification pipelines & Docker multi-container topologies",
    children: [
      {
        name: "ci",
        type: "dir",
        desc: "Presubmit security scanner & GitHub Actions automation",
        snippet: `# devops/ci/ci.yml
name: Monorepo Verification & Presubmit
on: [push, pull_request]

jobs:
  presubmit-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Presubmit Suite
        run: python3 scripts/presubmit.py`
      },
      {
        name: "docker",
        type: "dir",
        desc: "Multi-container Docker Compose staging and production blueprints"
      }
    ]
  },
  {
    name: "Websites",
    type: "dir",
    desc: "Enterprise luxury storefronts & Spec-Driven Development ecosystems",
    children: [
      {
        name: "atelier-clothing-brand",
        type: "dir",
        desc: "Atelier Riwayat: Luxury Couture & Wagtail 7.1 Headless Storefront",
        snippet: `// Websites/atelier-clothing-brand/backend/catalog/models.py
class ProductPage(Page):
    sku = models.CharField(max_length=64, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_count = models.IntegerField(default=0)
    is_vip_exclusive = models.BooleanField(default=False)
    barcode = models.CharField(max_length=128, blank=True)`
      },
      {
        name: "petit-maison-kids",
        type: "dir",
        desc: "Petit Maison Kids: Heirloom Childrenswear & Wagtail 7.1 Platform",
        snippet: `// Websites/petit-maison-kids/frontend/src/app/core/services/monogram.service.ts
export class MonogramService {
  renderMonogramPreview(canvas: HTMLCanvasElement, text: string, font: string, threadColor: string) {
    const ctx = canvas.getContext('2d');
    ctx.font = \`32px \${font}\`;
    ctx.fillStyle = threadColor;
    ctx.fillText(text, 20, 40);
  }
}`
      }
    ]
  }
];

export function renderMonorepoExplorer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="tree-grid">
      <div class="tree-sidebar" id="tree-nav"></div>
      <div class="tree-preview-panel">
        <div class="tree-preview-header">
          <span class="preview-filename" id="preview-filename">apps/arnas/server/src/crypto/e2ee.ts</span>
          <button class="btn-copy-code" id="btn-copy-tree-code">📋 Copy Code</button>
        </div>
        <div class="tree-code-wrap">
          <pre><code id="tree-code-content"></code></pre>
        </div>
      </div>
    </div>
  `;

  const nav = container.querySelector('#tree-nav');
  const previewFilename = container.querySelector('#preview-filename');
  const codeContent = container.querySelector('#tree-code-content');
  const copyBtn = container.querySelector('#btn-copy-tree-code');

  const setSnippet = (name, snippet) => {
    previewFilename.textContent = name;
    codeContent.textContent = snippet || '// Architectural module selected.\n// Contains comprehensive production-tested source code.';
    soundSynth.playTerminalBeep();
  };

  // Build tree HTML
  let navHtml = '';
  MONOREPO_TREE.forEach(root => {
    navHtml += `
      <div class="tree-root-item">
        <div class="tree-folder-title">📁 ${root.name}/ <span class="text-dim">(${root.children.length} packages)</span></div>
        <div class="tree-children">
    `;
    root.children.forEach(c => {
      navHtml += `
        <div class="tree-leaf" data-name="${root.name}/${c.name}" data-snippet="${encodeURIComponent(c.snippet || '')}">
          <span class="leaf-icon">⚡</span>
          <span class="leaf-name">${c.name}</span>
        </div>
      `;
    });
    navHtml += `</div></div>`;
  });

  nav.innerHTML = navHtml;

  nav.querySelectorAll('.tree-leaf').forEach(leaf => {
    leaf.addEventListener('click', () => {
      nav.querySelectorAll('.tree-leaf').forEach(l => l.classList.remove('active'));
      leaf.classList.add('active');
      const name = leaf.getAttribute('data-name');
      const snippet = decodeURIComponent(leaf.getAttribute('data-snippet'));
      setSnippet(name, snippet);
    });
  });

  // Default selection
  const firstLeaf = nav.querySelector('.tree-leaf');
  if (firstLeaf) firstLeaf.click();

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(codeContent.textContent);
    copyBtn.textContent = '✅ Copied!';
    soundSynth.playClick();
    setTimeout(() => { copyBtn.textContent = '📋 Copy Code'; }, 1500);
  });
}
