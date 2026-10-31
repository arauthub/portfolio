# PETIT MAISON KIDS — Enterprise Heirloom Childrenswear Platform
> **"Organic, Playful & Heirloom Childrenswear (Ages 0 – 12Y)"**
> Handcrafted in pure GOTS Certified Peruvian Organic Pima Cotton & Normandy French Linen.

[![Wagtail](https://img.shields.io/badge/CMS-Wagtail%207.1-228B22.svg)](https://wagtail.org/)
[![Django](https://img.shields.io/badge/Backend-Django%204.2%20LTS-092E20.svg)](https://www.djangoproject.com/)
[![Angular](https://img.shields.io/badge/Frontend-Angular%2022%20%2B%20Material-DD0031.svg)](https://angular.dev/)
[![PWA](https://img.shields.io/badge/PWA-Enabled%20Offline%20Ready-5A0FC8.svg)](https://web.dev/progressive-web-apps/)
[![GOTS](https://img.shields.io/badge/Certified-100%25%20GOTS%20Organic-2E7D32.svg)](https://global-standard.org/)
[![OEKO-TEX](https://img.shields.io/badge/Safety-OEKO--TEX%20Standard%20100%20Class%20I-F57F17.svg)](https://www.oeko-tex.com/)

---

## 🧸 Brand Overview & Design Philosophy

**PETIT MAISON KIDS** is an enterprise-grade digital flagship for a luxury, heirloom children's clothing brand. Designed for conscious parents seeking heirloom quality, skin safety, and emotional craftsmanship, the platform couples the editorial power of **Wagtail CMS** with a modern **Angular 22 Material** storefront.

### Specialized Innovations for Childrenswear E-Commerce:
1. **Foldable Room-To-Grow™ Cuffs**: Engineered double-cuffs that extend through growth spurts, giving parents an extra 2–3 months of wear per garment.
2. **Live Bespoke Monogram Studio**: Real-time canvas rendering of custom initials/names in nursery fonts (*Heirloom Script*, *Playful Block*, *French Cursive*) with luxury thread palettes (*Champagne Gold*, *Forest Sage*, *Rose Petal*, *Heritage Navy*).
3. **Nursery Milestone Stages**: Curated taxonomy across Baby (0–24M), Toddler (2–5Y), Junior (6–12Y), Sibling Sets, and Heirloom Occasions.
4. **Interactive Playbook Lookbook**: Hotspot-enabled lifestyle journal showing coordinated sibling outfits with 1-click discovery.
5. **Dynamic Global Free Shipping Meter**: Interactive threshold indicator ($95 minimum) encouraging basket building with DHL Express delivery.
6. **Heirloom Gift Keepsake Packaging**: Optional archival ribbon box (+$5) with custom handwritten note.
7. **Live Theme Atmosphere Engine**: 4 customizable luxury theme presets (*Nordic Pastel*, *Sunshine Pop*, *Parisian Vintage*, *Forest Adventure*) switchable in real time.

---

## 🏛 Architecture & Running Ports

The project is structured as a decoupled headless architecture:

| Component | Port | Technology | Primary Function |
| :--- | :--- | :--- | :--- |
| **Storefront** | `http://localhost:4201` | Angular 22, Material, SCSS, PWA | Customer experience, personalization studio, checkout |
| **Wagtail CMS** | `http://localhost:8001/admin/` | Wagtail 7.1, Django 4.2, Pillow | Full owner administrative control, products, copy, ads |
| **REST API** | `http://localhost:8001/api/v1/` | Django REST Framework, CORS | Products, categories, promotions, checkout endpoints |

*(Note: Port 8000 and 4200 are reserved for the adult brand atelier website).*

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run (Port 8001)

```bash
cd Websites/petit-maison-kids/backend

# Virtual environment is already configured
source venv/bin/activate

# Migrations & database seeding
python manage.py migrate
python seed_kids_data.py

# Run development server
python manage.py runserver 0.0.0.0:8001
```

- **Wagtail Admin**: [http://localhost:8001/admin/](http://localhost:8001/admin/)
  - **Username**: `admin`
  - **Password**: `petit2026!`
- **REST API Catalog**: [http://localhost:8001/api/v1/products/](http://localhost:8001/api/v1/products/)

### 2. Frontend Setup & Run (Port 4201)

```bash
cd Websites/petit-maison-kids/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start live dev server
npm run start -- --port 4201 --host 0.0.0.0
```

- **Storefront URL**: [http://localhost:4201/](http://localhost:4201/)

---

## 🎨 Theme Palette System

| Theme ID | Palette Name | Character | Colors |
| :--- | :--- | :--- | :--- |
| `theme-nordic-pastel` | **Nordic Pastel Nursery** | Calm, Scandinavian, Organic | Sage Leaf (`#7AA884`), Powder Blue (`#FAD4C0`), Buttermilk (`#FAF6EE`) |
| `theme-sunshine-pop` | **Playful Sunshine Pop** | Joyful, Vibrant, Outdoor Play | Sunny Tangerine (`#FF9F1C`), Coral Poppy (`#FF6B6B`), Cream (`#FFFDF7`) |
| `theme-parisian-vintage` | **Heirloom Parisian Vintage** | Romantic, Classic French, Lace | French Lavender (`#8E7CC3`), Antique Honey (`#D9A05B`), Ecru (`#F9F6F0`) |
| `theme-forest-adventure` | **Enchanted Forest Explorer** | Earthy, Woods, Warm Autumn | Pine Woodland (`#3D5A4C`), Terracotta (`#C86D51`), Flax (`#F4F1EA`) |

---

## 🏷 Active Promotional Codes (Pre-Seeded)

- `PETIT25` — **25% Off** Spring Carnival promotion
- `FIRSTBABY15` — **15% Off** Welcome newborn gift voucher
- `SIBLINGPAIR` — **$20 Off** Sibling matching set purchase

---

## ☁️ Production Deployment

### 1. Google App Engine (GAE)
Configured in [`deploy/app.yaml`](deploy/app.yaml):
```bash
gcloud app deploy deploy/app.yaml --project=YOUR_GCP_PROJECT_ID
```

### 2. AWS Elastic Beanstalk / ECS
Configured in [`deploy/Dockerrun.aws.json`](deploy/Dockerrun.aws.json):
```bash
eb init -p docker petit-maison-kids
eb create petit-maison-kids-prod
eb deploy
```

### 3. Docker Compose (Full Stack Local Orchestration)
Configured in [`docker-compose.yml`](docker-compose.yml):
```bash
docker compose up --build
```
Runs backend on `:8001` and frontend on `:4201` simultaneously.

---

## 🛡 Certifications & Standards

- **GOTS Certified Organic**: Global Organic Textile Standard (License CU808924)
- **OEKO-TEX Standard 100 Class I**: Infant skin safety certified (0–36 months)
- **Nickel-Free YKK Snaps**: Hypoallergenic fasteners preventing contact dermatitis
- **PWA Service Worker**: Cache-first offline capability with `manifest.webmanifest`
- **Carbon-Neutral Logistics**: DHL Express verified offsetting

---
*© 2026 Petit Maison Kids Inc. All rights reserved. Archival Enterprise Edition.*
