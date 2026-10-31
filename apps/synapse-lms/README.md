# ⚡ SYNAPSE LMS // NEXT-GEN CYBERNETIC LEARNING PLATFORM

A futuristic, highly playful Learning Management System built with a headless **Wagtail CMS** backend and an **Angular 22** frontend. Designed with rich cyberpunk HUD micro-interactions, procedural Web Audio sound synthesis, real-time quantum and code simulations, and enterprise multi-tenancy white-labeling.

---

## 🚀 Key Architectural Pillars

### 1. 🔮 Playful & Futuristic User Interface
- **Cyberpunk HUD Design**: Dark mode neon aesthetics, glassmorphic panels, hexagonal badges, glowing borders, and animated particle trails.
- **Procedural Web Audio Engine**: Zero-dependency sound synthesizer using browser Web Audio API oscillators (button blips, success chords, level-up fanfare, and error buzzers).
- **Interactive Holographic Simulators**: Real-time HTML5 Canvas 60 FPS simulations (quantum phase coherence, Bloch sphere vectors) with interactive sliders.
- **Hands-On Code Sandbox**: Browser-based code runner with syntax styling, line numbers, live terminal execution logs, and automated test assertions.
- **Gamification Mechanics**: XP accumulation, Level 1 to Singularity clearances, consecutive daily streaks, daily/weekly bounties, and rarity-tiered holographic trophies.
- **Neural Skill Tree**: Interactive multi-tier knowledge graph allowing learners to spend XP to unlock prerequisite competency nodes.

### 2. 🏛️ Complete LMS Workflows
- **Learner Experience**: Mission Command dashboard, course discovery, interactive code labs, time-attack assessments, holographic profile, and cryptographically verifiable certificates.
- **Instructor Studio**: Course and module authoring, real-time student cohort telemetry, completion heatmaps, and assessment evaluation.
- **Enterprise Multi-Tenancy (White-Label Setup)**:
  - Any organization can onboard and deploy their own branded version of Synapse LMS.
  - Live branding customizer: Primary Neon color, Secondary glow, Accent alerts, font families, and custom subdomains.
  - Granular feature toggles: enable or disable XP, quests, skill trees, audio FX, and certificates.
  - One-click configuration export (`synapse-tenant.json`) and dockerized deployment recipes.

### 3. 🧩 Proper Modular Architecture
```
synapse-lms/
├── backend/                   # Headless Wagtail CMS + Django Engine
│   ├── manage.py
│   ├── requirements.txt
│   ├── synapse_backend/       # Django project configuration & Wagtail v2 API
│   │   ├── api.py             # WagtailAPIRouter (pages, images, documents)
│   │   ├── settings/          # Base, dev, and production settings with CORS
│   │   └── urls.py            # API v1 & Wagtail v2 routing
│   ├── tenancy/               # Multi-Tenant & Organization White-Label App
│   ├── courses/               # Wagtail Page Models (CourseIndex, CoursePage, LessonPage)
│   ├── gamification/          # XP, Badges, Skill Tree, Quests, and Learner Profiles
│   └── assessments/           # Time-attack cyber quizzes, evaluations, and grading
├── frontend/                  # Angular 22 Futuristic Web Application
│   ├── package.json           # Angular 22.2 + canvas-confetti
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Tenant, sound, gamification, course, and auth services
│   │   │   ├── shared/        # Futuristic Cyber HUD Header, sound toggles
│   │   │   └── features/      # Dashboard, Course Catalog & Player, Skill Tree, Quests, Org Setup, Studio, Certs
│   │   └── styles.css         # Neon glow variables, glassmorphism, cyber-cut cards
├── docker-compose.yml         # Containerized full-stack deployment
├── start-dev.sh               # Unified single-command launcher
└── README.md                  # Comprehensive documentation
```

---

## ⚡ Quickstart: One-Click Localhost & Deployment

### 🖥️ 1-Click Localhost Spin (Development)
You can launch the entire stack with a single click or terminal command:
- **macOS Finder One-Click**: Double-click `spin-localhost.command` in the folder.
- **Terminal One-Click**:
  ```bash
  ./spin-localhost.sh
  # or
  npm run spin
  ```
**What this does automatically:**
1. Checks & clears existing zombie processes on ports `8000` & `4200`.
2. Verifies Python virtualenv and auto-runs database migrations and demo curriculum seeding.
3. Spawns the Wagtail CMS backend and Angular 22 frontend concurrently.
4. Waits for healthcheck responses and **automatically opens your default browser** directly to `http://localhost:4200`.
5. Gracefully handles shutdown on `Ctrl+C`.

---

### 🚀 1-Click Production Deployment
- **macOS Finder One-Click**: Double-click `deploy.command` in the folder.
- **Terminal One-Click**:
  ```bash
  # Interactive Menu:
  ./deploy.sh

  # Or direct flags:
  ./deploy.sh --docker    # Build & start production multi-container stack (Nginx + Gunicorn)
  ./deploy.sh --build     # Compile Angular 22 AOT + Django collectstatic
  ./deploy.sh --package   # Create self-contained .tar.gz for AWS / VPS droplets
  ./deploy.sh --health    # Verify production endpoints
  ```

---

## 🗄️ Database Backend: PostgreSQL 18

Synapse LMS is connected directly to **PostgreSQL 18** on this Mac:
- **RDBMS Engine**: PostgreSQL 18.6 (`django.db.backends.postgresql`)
- **Database Name**: `synapse_lms_db`
- **Host & Port**: `localhost:5432`
- **Driver**: `psycopg2-binary`
- **Connection Pooling**: `CONN_MAX_AGE=600`
- Both `spin-localhost.sh` and `start-dev.sh` automatically verify that the Homebrew `postgresql@18` service is running and ensure the database is active.

---

## 🌐 Default Ports & Access Points

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/v1/organizations/` | `GET`, `POST` | List and provision white-labeled organizations |
| `/api/v1/organizations/<slug>/` | `GET`, `PATCH` | Retrieve and update tenant branding & theme |
| `/api/v1/organizations/<slug>/export_config/` | `GET` | Export downloadable tenant config JSON |
| `/api/v1/courses/` | `GET` | List all curriculum tracks with lesson hierarchy |
| `/api/v1/courses/<slug>/` | `GET` | Course detail with full lesson syllabus |
| `/api/v1/lessons/<id>/` | `GET` | Lesson detail with code starter and lab data |
| `/api/v1/lessons/<id>/complete/` | `POST` | Mark lesson complete and trigger XP rewards |
| `/api/v1/gamification/profile/` | `GET` | Retrieve learner XP, rank, level, and streak |
| `/api/v1/gamification/skill-tree/` | `GET` | Retrieve all skill nodes grouped by track and tier |
| `/api/v1/gamification/unlock-skill/` | `POST` | Deduct XP and unlock a new skill node |
| `/api/v1/gamification/quests/` | `GET` | Active daily, weekly, and milestone bounties |
| `/api/v1/assessments/quiz/<id>/` | `GET` | Retrieve quiz questions with time limits |
| `/api/v1/assessments/quiz/<id>/submit/` | `POST` | Submit answers, calculate score, and award XP |
| `/api/v2/pages/` | `GET` | Wagtail Headless Pages API |

---

## 🏢 Multi-Tenant Setup for Organizations

When an enterprise opts to set up their own version of Synapse LMS:
1. Navigate to **Org Setup** in the top navigation or visit `/org-setup`.
2. Enter the Organization Name, Custom Subdomain, and Mission Slogan.
3. Select from 4 pre-engineered cyber presets (`Cyber Neon`, `Quantum Void`, `Matrix Emerald`, `Solar Flare`) or fine-tune custom primary, secondary, and accent colors.
4. Toggle feature modules (Gamification, Quests, Skill Tree, Audio FX, Certificates).
5. Click **Deploy & Activate This Tenant** to save and apply the tenant instantaneously.
6. Click **Export Self-Hosted Package** to receive the production `synapse-tenant.json` and containerized deployment commands.

---

## 🧪 Testing & Verification

- **Frontend Compilation**: `cd frontend && npm run build` (Verified 0 errors on Angular 22.2.5)
- **Backend Migrations & Health**: `cd backend && .venv/bin/python manage.py check` (Verified 0 system issues)
- **Demo Content Seeder**: `cd backend && .venv/bin/python manage.py seed_lms_demo` (Preloads 3 organizations, 4 courses, quizzes, badges, and skill nodes)

