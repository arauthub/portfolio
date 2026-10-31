/**
 * Nexus Prime - Pre-Rendered Jamstack Projects Dataset
 * Curated from All-Projects monorepo (Abhijeet Raut)
 */

export const MONOREPO_PROJECTS = [
  {
    id: "myagents",
    title: "Autonomous AI Agent Orchestration (MyAgents)",
    category: "ai",
    categoryLabel: "AI & Autonomous Swarms",
    badge: "Active Architecture",
    badgeColor: "cyan",
    relPath: "agents/myagents",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/agents/myagents",
    techStack: ["Python", "FastAPI", "Google ADK", "Vector RAG", "Google Cloud Run", "Docker", "SSE"],
    description: "Enterprise-grade multi-agent swarm platform featuring autonomous task decomposition into a topological Directed Acyclic Graph (DAG), coordinating 5 specialized agents (Nexus Commander, Scout Intelligence, Vanguard Architect, Sentinel Auditor, Aegis Synthesizer).",
    metrics: [
      { label: "Swarm Agents", value: "5 Specialized" },
      { label: "Vector Latency", value: "< 120ms" },
      { label: "Offline Mode", value: "100% Zero-Key" },
      { label: "Execution Graph", value: "Topological DAG" }
    ],
    features: [
      "Autonomous task decomposition into topological DAG execution pipeline",
      "Dual-engine LLM adapter: 100% offline zero-key simulation + Google Gemini live API",
      "In-memory TF-IDF semantic vector store for RAG grounding and blackboard state",
      "Real-time Server-Sent Events (SSE) telemetry web UI with interactive DAG graph",
      "Automated Executive Presentation Slide Deck generator with 1-click GCP deployment"
    ],
    simulatorId: "swarm-dag",
    simulatorName: "Launch Swarm DAG Simulator",
    designDoc: "agents/myagents/DESIGN.md"
  },
  {
    id: "arnas",
    title: "ARNAS: Enterprise Cloud NAS & Zero-Knowledge E2EE Mobile Sync",
    category: "cloud",
    categoryLabel: "Distributed Storage & Cloud",
    badge: "Enterprise Grade",
    badgeColor: "emerald",
    relPath: "apps/arnas",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/apps/arnas",
    techStack: ["Fastify", "Node.js/TypeScript", "React Native", "Expo", "PostgreSQL", "Prisma", "S3/MinIO", "AES-256-GCM", "PBKDF2"],
    description: "Distributed self-hosted enterprise cloud storage platform featuring multi-server storage clustering, location-geofenced auto-sync (trusted sites + approved Wi-Fi only), full enterprise NAS suite, and client-side zero-knowledge end-to-end encryption.",
    metrics: [
      { label: "Encryption", value: "AES-256-GCM" },
      { label: "Key Derivation", value: "100k PBKDF2" },
      { label: "Failover", value: "Auto-Mirroring" },
      { label: "Mobile Sync", value: "Geofenced GPS" }
    ],
    features: [
      "Multi-server storage clustering uniting local NVMe/NAS with S3/MinIO object stores",
      "Client-side Zero-Knowledge End-to-End Encryption (E2EE) with 12-word mnemonic",
      "Location Geofenced Auto-Sync: triggers backup strictly in trusted GPS sites & approved Wi-Fi",
      "Instant ingest pipeline with async fan-out replication queue & SHA-256 integrity",
      "Full NAS explorer, 30-day recycle bin, expiring QR share links, and S.M.A.R.T. telemetry"
    ],
    simulatorId: "arnas-vault",
    simulatorName: "Launch E2EE Cryptographic Vault",
    designDoc: "apps/arnas/DESIGN.md"
  },
  {
    id: "synapse-lms",
    title: "Synapse LMS: Headless Wagtail & Angular Cybernetic Learning Platform",
    category: "fullstack",
    categoryLabel: "Enterprise Fullstack & LMS",
    badge: "Angular 22 & Wagtail",
    badgeColor: "cyan",
    relPath: "apps/synapse-lms",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/apps/synapse-lms",
    techStack: ["Angular 22", "TypeScript", "Tailwind CSS", "Angular Material 3", "D3.js", "Python 3", "Wagtail CMS", "Django", "PostgreSQL 18"],
    description: "Enterprise cybernetic learning management platform featuring headless Wagtail CMS 5.2 on PostgreSQL 18, Angular 22 Signals frontend, multi-tenant white-label branding, interactive D3 competency constellation graphs, Python sandbox execution benchmarks, and Web Audio synthesizer.",
    metrics: [
      { label: "Architecture", value: "Headless Wagtail + Angular 22" },
      { label: "RDBMS", value: "PostgreSQL 18" },
      { label: "Multi-Tenancy", value: "Isolated Schemas" },
      { label: "Data Viz", value: "D3 Velocity Matrix" }
    ],
    features: [
      "Decoupled headless Wagtail CMS 5.2 content engine on PostgreSQL 18 with REST endpoints",
      "Modern Angular 22 Standalone and Signals reactive frontend architecture",
      "Interactive D3 pedagogical velocity matrix tracking learner progress across cognitive tracks",
      "Multi-tenant white-label administration wizard supporting dynamic brand and palette isolation",
      "Web Audio synthesizer sound effects, daily quest bounties, and verified holographic credentials"
    ],
    designDoc: "apps/synapse-lms/DESIGN.md"
  },
  {
    id: "gravidrift-browser",
    title: "GraviDrift Web & Space Arcade Browser",
    category: "extensions",
    categoryLabel: "Browser Extensions & DevTools",
    badge: "Chrome Store Live",
    badgeColor: "purple",
    relPath: "extensions/gravidrift-browser",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/extensions/gravidrift-browser",
    storeUrl: "https://chromewebstore.google.com/detail/gravidrift-web-physics-space-arcade",
    techStack: ["Chrome Manifest V3", "Matter.js Physics", "JavaScript (ES6+)", "HTML5 Canvas", "CSS Transforms"],
    description: "Physics-driven browser extension published on Chrome Web Store that non-destructively extracts webpage DOM structures into an isolated 60 FPS 2D rigid-body zero-gravity physics sandbox with directional gravity inversion, tractor beams, and arcade mini-games.",
    metrics: [
      { label: "Chrome Store", value: "Live & Published" },
      { label: "Physics Rate", value: "60 FPS Steady" },
      { label: "Engine", value: "Matter.js 2D" },
      { label: "Manifest", value: "Chrome V3" }
    ],
    features: [
      "Published on Google Chrome Web Store (Manifest V3 certified production release)",
      "Invertible directional gravity with arrow key manipulation and mouse fling momentum",
      "Tractor beam mouse attraction mode drawing nearby DOM elements into orbit",
      "Starfighter Web Blaster arcade mode with WASD thrust controls and laser targeting",
      "Orbital Cosmic Orb Web Absorption mode rolling up DOM nodes into an escalating sphere",
      "100% client-side zero-tracking execution with non-destructive DOM preservation"
    ],
    simulatorId: "antigravity-sandbox",
    simulatorName: "Launch Zero-G Gravity Sandbox",
    designDoc: "extensions/gravidrift-browser/DESIGN.md"
  },
  {
    id: "api-pulse-pro",
    title: "API Pulse Pro: Network Traffic Inspector & Replay Studio",
    category: "extensions",
    categoryLabel: "Browser Extensions & DevTools",
    badge: "Chrome Store Live",
    badgeColor: "emerald",
    relPath: "extensions/api-pulse-pro",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/extensions/api-pulse-pro",
    storeUrl: "https://chromewebstore.google.com/detail/api-pulse-pro-network-inspector-studio",
    techStack: ["JavaScript (ES6+)", "Manifest V3", "Chrome DevTools Protocol", "HTML5", "Scoped CSS3"],
    description: "Developer-grade browser network inspector and API mock engine published on Chrome Web Store providing zero-configuration capture of fetch/XHR traffic, in-page floating glassmorphic HUD, synthetic mock engine, and automated TypeScript snippet generation.",
    metrics: [
      { label: "Chrome Store", value: "Live & Published" },
      { label: "Capture Mode", value: "Zero-Config" },
      { label: "In-Page HUD", value: "Glassmorphic 60fps" },
      { label: "Replay Engine", value: "Active Session" }
    ],
    features: [
      "Published on Google Chrome Web Store (Manifest V3 developer tooling suite)",
      "Zero-configuration real-time interception of fetch and XMLHttpRequest transactions",
      "In-page floating glassmorphic HUD with live latency counters and expandable drawer",
      "Live API replay inheriting active browser session cookies and authentication headers",
      "Synthetic mock engine stubbing status codes, simulated delays, and modified payloads",
      "Instant code generator outputting clean TypeScript interfaces, cURL, and Axios snippets"
    ],
    simulatorId: "api-pulse-inspector",
    simulatorName: "Launch API Pulse Inspector",
    designDoc: "extensions/api-pulse-pro/DESIGN.md"
  },
  {
    id: "workspace-curator",
    title: "WorkspaceCurator Pro: Google Workspace Webhook & Curation Engine",
    category: "ai",
    categoryLabel: "AI & Fullstack Platforms",
    badge: "Autonomous Ingestion",
    badgeColor: "cyan",
    relPath: "apps/workspace-curator",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/apps/workspace-curator",
    techStack: ["Python", "FastAPI", "SQLite", "Server-Sent Events (SSE)", "Google Workspace APIs", "Heuristic NLP"],
    description: "Universal event-driven webhook engine supporting Google Drive push sync, Gmail Pub/Sub push envelopes, Calendar notifications, and real-time Docs/Sheets Google Apps Script streaming with autonomous executive TL;DR briefings.",
    metrics: [
      { label: "Event Ingest", value: "Universal Webhooks" },
      { label: "Intelligence", value: "Heuristic NLP" },
      { label: "Live Telemetry", value: "SSE Streaming" },
      { label: "Syndication", value: "RSS / Markdown / Slack" }
    ],
    features: [
      "Universal webhook receiver for Drive (`changes.watch`), Gmail Pub/Sub, Calendar, and Forms",
      "Autonomous intelligence engine generating executive TL;DR briefings and action item matrices",
      "Quantified metric extraction and P0 urgency classifiers flagging immediate blockers",
      "Live reactive SSE glassmorphic web dashboard with real-time ingestion counters",
      "1-click Markdown, Slack, Email exports and universal syndication RSS feed"
    ],
    simulatorId: "curator-digest",
    simulatorName: "Launch Webhook Ingestion Digest",
    designDoc: "apps/workspace-curator/DESIGN.md"
  },
  {
    id: "diagram-image-lens",
    title: "Diagram & Image Lens Pro: Precision Visual Inspection",
    category: "extensions",
    categoryLabel: "Browser Extensions & DevTools",
    badge: "Retina Loupe",
    badgeColor: "purple",
    relPath: "extensions/diagram-image-lens",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/extensions/diagram-image-lens",
    storeUrl: "https://chromewebstore.google.com/detail/diagram-image-lens-pro",
    techStack: ["Chrome Manifest V3", "JavaScript (ES6+)", "HTML5 Canvas", "CSS3"],
    description: "Precision diagram inspection suite featuring an interactive hover loupe (2x–16x zoom), fullscreen deep-zoom pan & scan lightbox, schematic dark mode inversion, and offline Retina area screen snipping.",
    metrics: [
      { label: "Magnification", value: "2x to 16x Loupe" },
      { label: "Schematic Mode", value: "Dark Inversion" },
      { label: "Snipping Tool", value: "Offline Retina" },
      { label: "Manifest", value: "Chrome V3" }
    ],
    features: [
      "Interactive circular hover loupe with dynamic 2x to 16x zoom wheel scaling",
      "Fullscreen deep-zoom pan and scan lightbox for massive architectural diagrams",
      "Schematic dark mode inversion for high-contrast viewing of white-background blueprints",
      "Zero-latency offline Retina area screen snipper saving directly to clipboard and PNG"
    ],
    simulatorId: "lens-loupe",
    simulatorName: "Preview Lens Loupe Demo",
    designDoc: "extensions/diagram-image-lens/DESIGN.md"
  },
  {
    id: "link-inspector-extension",
    title: "Link Inspector Pro & Broken Link Checker",
    category: "extensions",
    categoryLabel: "Browser Extensions & DevTools",
    badge: "HTTP Telemetry",
    badgeColor: "emerald",
    relPath: "extensions/link-inspector-extension",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/extensions/link-inspector-extension",
    storeUrl: "https://chromewebstore.google.com/detail/link-inspector-pro-broken-link-checker",
    techStack: ["Chrome Manifest V3", "JavaScript (ES6+)", "Asynchronous Service Workers", "CSS3"],
    description: "High-performance browser extension providing real-time hover inspection, async HTTP status validation (200, 301, 404, 500), 1-click Wayback Machine recovery, UTM tracking parameter stripping, and dual CSV/JSON audit reports.",
    metrics: [
      { label: "Async Audit", value: "Non-Blocking" },
      { label: "Tracking Stripper", value: "UTM / GCLID / FBCLID" },
      { label: "Recovery", value: "Wayback Machine 1-Click" },
      { label: "Exports", value: "CSV & JSON Reports" }
    ],
    features: [
      "Real-time hover inspection HUD displaying HTTP status and round-trip latency",
      "Intelligent UTM parameter and marketing tracker stripper preventing telemetry leakage",
      "1-click historical archive recovery via Wayback Machine for dead 404/500 endpoints",
      "Comprehensive multi-page audit report generator with CSV and JSON exports"
    ],
    simulatorId: "link-auditor",
    simulatorName: "Preview Link Auditor",
    designDoc: "extensions/link-inspector-extension/DESIGN.md"
  },
  {
    id: "flashapps",
    title: "Flashapps Platform & Containerized Architecture",
    category: "fullstack",
    categoryLabel: "Enterprise Fullstack & CMS",
    badge: "Containerized",
    badgeColor: "cyan",
    relPath: "apps/flashapps",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/apps/flashapps",
    techStack: ["Django REST Framework", "Angular", "Docker Compose", "SQLite", "Gunicorn", "Nginx"],
    description: "Fullstack containerized platform pairing a decoupled Django REST Framework backend with an Angular modern single-page application and unified Docker Compose orchestration.",
    metrics: [
      { label: "Architecture", value: "Decoupled SPA + API" },
      { label: "Frontend", value: "Angular Modern" },
      { label: "Backend", value: "Django REST" },
      { label: "Containerization", value: "Docker Compose" }
    ],
    features: [
      "Decoupled Django REST API backend with token authentication and rate limiting",
      "High-performance Angular single-page frontend with responsive component library",
      "Multi-stage Docker build pipeline with persistent volume management and Nginx reverse proxy"
    ],
    designDoc: "apps/flashapps/DESIGN.md"
  },
  {
    id: "wagtailwind",
    title: "Wagtailwind & Mytail CMS Architectures",
    category: "fullstack",
    categoryLabel: "Enterprise Fullstack & CMS",
    badge: "Enterprise CMS",
    badgeColor: "emerald",
    relPath: "apps/wagtailwind",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/apps/wagtailwind",
    techStack: ["Python", "Django", "Wagtail CMS", "Tailwind CSS", "SCSS", "Docker"],
    description: "High-scalability enterprise content management platforms with custom streamfield blocks, dynamic caching, multi-app blog architectures, and sub-second page delivery.",
    metrics: [
      { label: "CMS Engine", value: "Wagtail on Django" },
      { label: "Styling System", value: "Tailwind CSS + SCSS" },
      { label: "Page Delivery", value: "Sub-Second Cached" },
      { label: "Extensibility", value: "StreamField Blocks" }
    ],
    features: [
      "Enterprise Wagtail CMS hierarchy supporting multi-language blogs and customized account tiers",
      "Modular StreamField content blocks empowering non-technical editors with flexible layouts",
      "Optimized query caching and media asset pipelines delivering lightning-fast response times"
    ],
    designDoc: "apps/wagtailwind/DESIGN.md"
  },
  {
    id: "wagtaildemo",
    title: "Wagtail Demo: Modular Django Extension Framework",
    category: "fullstack",
    categoryLabel: "Enterprise Fullstack & CMS",
    badge: "Modular Modules",
    badgeColor: "amber",
    relPath: "apps/wagtaildemo",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/apps/wagtaildemo",
    techStack: ["Python", "Django", "Wagtail CMS", "Cryptographic Generators"],
    description: "Specialized Django and Wagtail extension modules demonstrating custom model structures, streamfields, decoupled service integrations, and test generators.",
    metrics: [
      { label: "Modularity", value: "Pluggable Apps" },
      { label: "Integration", value: "Decoupled Services" },
      { label: "Testing", value: "Automated Fixtures" }
    ],
    features: [
      "Decoupled pluggable Django application architecture for high maintainability",
      "Custom streamfield model structures and dynamic page routing configurations"
    ],
    designDoc: "apps/wagtaildemo/DESIGN.md"
  },
  {
    id: "ci",
    title: "DevOps & CI/CD Security Presubmit Pipeline",
    category: "devops",
    categoryLabel: "DevOps & Infrastructure",
    badge: "Security Gatekeeper",
    badgeColor: "rose",
    relPath: "devops/ci",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/devops/ci",
    techStack: ["GitHub Actions", "Python", "Shell Scripting", "Docker Compose", "Vitest", "Pytest"],
    description: "Automated multi-stage presubmit verification pipeline validating secret detection, code integrity, Python multi-agent swarms, and containerized Docker topologies before commits and pushes.",
    metrics: [
      { label: "Secret Leakage", value: "Zero Tolerance" },
      { label: "Hook Enforce", value: "Pre-Commit & Pre-Push" },
      { label: "Presubmit Checks", value: "5/5 Automated" },
      { label: "Test Suites", value: "Pytest & Vitest" }
    ],
    features: [
      "Automated presubmit security gatekeeper preventing credential leaks, private keys, and unmasked envs",
      "Automatic project discovery and documentation synchronizer across CV, Profile, and README",
      "Pre-commit and pre-push hook integration ensuring 100% repository cleanliness"
    ],
    simulatorId: "presubmit-runner",
    simulatorName: "Run Virtual Presubmit Suite",
    designDoc: "devops/ci/DESIGN.md"
  },
  {
    id: "atelier-clothing-brand",
    title: "Atelier Riwayat: Luxury Couture & Wagtail 7.1 Storefront",
    category: "fullstack",
    categoryLabel: "Enterprise Fullstack & E-Commerce",
    badge: "Wagtail 7.1 & Angular",
    badgeColor: "amber",
    relPath: "Websites/atelier-clothing-brand",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/Websites/atelier-clothing-brand",
    techStack: ["Wagtail CMS 7.1", "Django 4.2 LTS", "Angular 19/22", "PostgreSQL 18", "Stripe", "Razorpay UPI", "PWA", "Tailwind CSS", "D3.js"],
    description: "High-fashion enterprise digital storefront marrying headless Wagtail 7.1 CMS editorial publishing with an ultra-responsive Angular client. Features VIP Privé gated security, real-time POS barcode inventory sync, tiered memberships, multi-gateway payments, and WCAG 2.1 AA accessibility.",
    metrics: [
      { label: "CMS Engine", value: "Wagtail 7.1 Headless" },
      { label: "Storefront", value: "Angular + Material" },
      { label: "Security Gate", value: "VIP Privé 3-Tier" },
      { label: "Inventory", value: "Live POS Barcode" }
    ],
    features: [
      "Headless Wagtail 7.1 REST content API delivering runway lookbooks, coupons, and promo tickers",
      "Angular responsive storefront with VIP Privé gated access and tiered loyalty memberships",
      "Multi-gateway payment support (Stripe Elements, Razorpay UPI, PayPal) with webhook sync",
      "Real-time in-store POS barcode reader and instant stock level synchronization",
      "Spec-Driven Development (SDD) verified with 100% WCAG 2.1 AA color contrast compliance"
    ],
    designDoc: "Websites/atelier-clothing-brand/DESIGN.md"
  },
  {
    id: "petit-maison-kids",
    title: "Petit Maison Kids: Heirloom Childrenswear & Wagtail 7.1 Platform",
    category: "fullstack",
    categoryLabel: "Enterprise Fullstack & E-Commerce",
    badge: "Wagtail 7.1 & Angular 22",
    badgeColor: "emerald",
    relPath: "Websites/petit-maison-kids",
    githubUrl: "https://github.com/arauthub/portfolio/tree/main/Websites/petit-maison-kids",
    techStack: ["Wagtail 7.1", "Django 4.2 LTS", "Angular 22", "PostgreSQL 18", "Tailwind CSS", "D3.js", "PWA"],
    description: "Enterprise flagship for luxury heirloom children's clothing. Integrates headless Wagtail 7.1 CMS with Angular 22 Material frontend, Foldable Room-To-Grow™ double cuffs, live bespoke monogram embroidery studio, hotspot lifestyle lookbooks, and 4 real-time luxury atmosphere theme presets.",
    metrics: [
      { label: "CMS Engine", value: "Wagtail 7.1 CMS" },
      { label: "Frontend", value: "Angular 22 Signals" },
      { label: "Personalization", value: "Live Monogram Canvas" },
      { label: "Compliance", value: "GOTS & OEKO-TEX" }
    ],
    features: [
      "Decoupled Wagtail 7.1 headless architecture with PostgreSQL relational backend",
      "Live Bespoke Monogram Studio with real-time canvas preview of nursery fonts & threads",
      "Innovative Foldable Room-To-Grow™ cuff metrics and interactive Hotspot lifestyle lookbook",
      "Dynamic free-shipping basket building progress meter with DHL Express logistics",
      "4 luxury theme atmosphere presets switchable in real-time with 0 console errors"
    ],
    designDoc: "Websites/petit-maison-kids/DESIGN.md"
  }
];
