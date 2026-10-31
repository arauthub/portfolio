# ATELIER VOGUE — Enterprise Luxury Clothing Brand Platform
### Headless Wagtail CMS • Angular 19 & Angular Material • Multi-Gateway Payments • PWA • AWS & App Engine Ready

---

## 🌟 Executive Summary

**ATELIER VOGUE** is a production-ready, enterprise-grade e-commerce showcase built for luxury, couture, and sustainable fashion brands. Designed with a **headless architecture**, it marries the editorial and content publishing powers of **Python Wagtail CMS (Django)** with an ultra-responsive, dynamic **Angular 19 + Angular Material** client storefront.

This platform gives **brand owners complete autonomy** over the digital storefront—from publishing runway collections, lookbooks, and size matrices to triggering promotional announcement tickers, discount coupons, and exit-intent banners in real time.

---

## 🏛️ System Architecture

```
                                  ┌───────────────────────────┐
                                  │   CLIENT BROWSER / PWA    │
                                  │  (Angular 19 + Material)  │
                                  └─────────────┬─────────────┘
                                                │ REST API / JSON
                                                ▼
                                  ┌───────────────────────────┐
                                  │   HEADLESS WAGTAIL CMS    │
                                  │  (Django 4.2+ / DRF 3.16) │
                                  └──────┬──────────────┬─────┘
                                         │              │
                   ┌─────────────────────▼──┐        ┌──▼────────────────────┐
                   │  CONTENT & INVENTORY   │        │   PAYMENT GATEWAYS    │
                   │ • Product Catalog      │        │ • Stripe Elements     │
                   │ • Lookbooks & Stories  │        │ • Razorpay UPI        │
                   │ • Tickers & Ads        │        │ • PayPal & Apple Pay  │
                   │ • Coupons & Discounts  │        │ • Webhook Ingestion   │
                   └────────────────────────┘        └───────────────────────┘
                                         │
              ┌──────────────────────────┴──────────────────────────┐
              ▼                                                     ▼
┌───────────────────────────┐                         ┌───────────────────────────┐
│     GOOGLE CLOUD (GAE)    │                         │          AWS CLOUD        │
│ • App Engine (Standard)   │                         │ • ECS Fargate / EB        │
│ • Cloud SQL (PostgreSQL)  │                         │ • RDS (PostgreSQL)        │
│ • Cloud Storage (GCS)     │                         │ • S3 Bucket + CloudFront  │
└───────────────────────────┘                         └───────────────────────────┘
```

---

## ✨ Key Enterprise Features

### 1. 🛍️ Immersive Luxury Shopping Experience
- **Fluid Micro-Interactions**: Hover flips between front and movement angles, smooth color swatch switching, heart wishlist toggle, and subtle glassmorphism headers.
- **Dynamic Live Announcement Bar**: Built-in countdown timer (`03d : 14h : 28m : 45s`) and 1-click click-to-copy promo codes (`VOGUE25`).
- **Interactive "Fit Finder" AI Size Recommender**: Custom sizing recommendation engine taking client height and fit preferences (Tailored Slim, Relaxed, Draped) with confidence scores.
- **"Complete The Look" Outfit Builder**: Complementary outfit pairings (e.g. Cashmere Trench + Italian Leather Frame Bag) with 1-click 15% bundle discounts.
- **Dynamic Slide-Over Bag Drawer**: Real-time **Free Worldwide Shipping Progress Bar** calculating threshold proximity (`$250.00`) and live coupon code redemption.

### 2. 🎨 4 Live Brand Theme Presets
Store owners or clients can toggle between 4 distinct luxury aesthetic templates via the header menu or Wagtail CMS settings:
1. **Luxe Haute Couture**: Deep Obsidian Monochrome (`#0A0B0E`), Champagne Gold accents (`#EAD8C0`), and serif typography.
2. **Urban Neo-Streetwear**: Cyber Carbon (`#050608`), Electric Lime (`#D4FF00`), and cyan neon highlights.
3. **Artisan Bohemian**: Warm Terracotta (`#D97757`), Sage Green (`#8EA87D`), and natural linen textures.
4. **Nordic Clean**: Minimal Slate (`#0A0F12`), Architectural Ice (`#CBD5E1`), and geometric lines.

### 3. 💳 Multi-Gateway Payment Engine
- **Stripe**: Credit/debit card authorization with interactive virtual card preview (CVV flip, cardholder formatting, live brand detection).
- **Razorpay**: Ready for Indian & Southeast Asian markets with instant UPI QR code and NetBanking.
- **PayPal One-Touch & Apple Pay**: Mobile-native checkout flows.
- **Sandbox Demo Mode**: Allows immediate, frictionless testing of order placement and invoice generation without entering real cards.

### 4. 👑 Complete Wagtail CMS Owner Controls
Brand managers can log into `http://localhost:8000/admin/` to:
- **Products & Inventory**: Manage prices, compare-at discounts, sizes (XS–XL), hex color swatches, Italian fabric descriptions, and stock counts.
- **Marketing Banners & Popups**: Create hero slider announcements, midway parallax banners, and exit-intent VIP club popups.
- **Coupons Engine**: Create percentage (`VOGUE25` = 25% off) or flat vouchers with expiration dates and minimum basket sizes.
- **Order Vault & Fulfilment**: Track incoming orders, inspect line items, update delivery carriers (DHL Express, FedEx), and generate tracking numbers.

### 5. 📱 Progressive Web App (PWA)
- Offline support via Service Worker caching (`public/sw.js`).
- Standalone app manifest (`public/manifest.webmanifest`).
- Install app banner prompt for desktop and mobile devices.

---

## 🚀 Quick Start Guide (Local Development)

### Prerequisites
- Python 3.9+ 
- Node.js 18+ and npm 10+

### Option A: Running with Development Servers

#### 1. Backend Setup (Wagtail CMS)
```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run migrations and seed rich clothing brand data
python manage.py makemigrations catalog marketing commerce api
python manage.py migrate
python seed_data.py

# Start Wagtail server (Runs at http://localhost:8000)
python manage.py runserver 0.0.0.0:8000
```

> **Wagtail Admin Credentials:**
> - URL: `http://localhost:8000/admin/`
> - Username: `admin`
> - Password: `atelier2026!`

#### 2. Frontend Setup (Angular Storefront)
```bash
cd frontend

# Install npm dependencies
npm install

# Start Angular development server (Runs at http://localhost:4200)
npm run start -- --port 4200 --host 0.0.0.0
```

Open `http://localhost:4200/` in your browser.

---

### Option B: Running with Docker Compose (One-Command Startup)

```bash
# From the project root
docker-compose up --build
```
- Storefront: `http://localhost:4200`
- Wagtail CMS Admin: `http://localhost:8000/admin`

---

## ☁️ Enterprise Cloud Deployment

### 1. Google App Engine (GCP)
The project includes a production configuration in `deploy/app.yaml`:
```bash
cd backend
gcloud app deploy ../deploy/app.yaml
```
- Runs Python 3.11 runtime on App Engine Standard or Flexible.
- Connects to Google Cloud SQL via UNIX socket (`/cloudsql/PROJECT_ID:REGION:INSTANCE`).
- Serves media and high-res apparel lookbooks from Google Cloud Storage (GCS).

### 2. Amazon Web Services (AWS)
Configured for **AWS ECS Fargate** and **AWS Elastic Beanstalk**:
- `deploy/Dockerrun.aws.json`: Multi-container Elastic Beanstalk task definition.
- `backend/Dockerfile`: Multi-stage, slim production container with Gunicorn and WhiteNoise.
- Database: AWS RDS PostgreSQL.
- Assets: AWS S3 bucket with CloudFront CDN distribution.

---

## 📁 Repository Directory Structure

```
Websites/atelier-clothing-brand/
├── docker-compose.yml          # Containerized local environment
├── README.md                   # Enterprise documentation
├── deploy/                     # Cloud Deployment Configs
│   ├── app.yaml                # Google App Engine specification
│   └── Dockerrun.aws.json      # AWS Elastic Beanstalk / ECS definition
├── backend/                    # Headless Wagtail CMS Platform
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── seed_data.py            # Pre-seeds luxury products, banners, coupons
│   ├── atelier_backend/        # Core Django & Wagtail settings
│   │   ├── settings/
│   │   │   ├── base.py         # Shared configuration & payment gateway keys
│   │   │   ├── dev.py          # Local development settings
│   │   │   └── production.py   # AWS & Google App Engine production settings
│   │   └── urls.py             # Route aggregator for Wagtail & DRF
│   ├── catalog/                # Products, Categories, Lookbooks & Reviews
│   ├── marketing/              # Banners, Announcement Ticker & Coupon Engine
│   ├── commerce/               # Orders, Payment Gateway & Tracking API
│   └── api/                    # Consolidated REST API router
└── frontend/                   # Angular 19 + Material Storefront
    ├── angular.json
    ├── package.json
    ├── Dockerfile
    ├── nginx.conf              # Production reverse proxy
    ├── public/
    │   ├── manifest.webmanifest# PWA metadata
    │   └── sw.js               # Offline service worker
    └── src/
        ├── index.html          # Typography & Material Symbols
        ├── styles.scss         # Luxury CSS Design System & 4 Theme Presets
        └── app/
            ├── app.ts          # Orchestrator & state binding
            ├── app.html
            ├── app.scss
            ├── models/         # TypeScript interfaces
            ├── services/       # Cart, Wishlist, Themes & API services
            └── components/     # Modular Standalone Components
                ├── header/     # Countdown ticker, logo, currency, theme picker
                ├── hero/       # Fullscreen editorial carousel & brand pillars
                ├── catalog/    # Filter tabs, price slider, product grid & swatches
                ├── product-modal/ # Multi-image gallery, Fit Finder & Outfit Builder
                ├── cart-drawer/# Slide-over drawer & Free Shipping progress bar
                ├── checkout-modal/# Multi-step checkout & Stripe card preview
                ├── order-receipt-modal/# Digital luxury invoice & timeline
                ├── owner-panel/# Real-time Wagtail CMS live controls
                ├── lookbook/   # Fall/Winter 2026 runway editorial
                └── footer/     # VIP club newsletter, boutiques & architecture
```

---

## 🧪 Validated Shopping Workflow Test
The platform was thoroughly tested with our browser automation suite:
1. **Catalog Browsing**: Product cards loaded with imagery, price compare, and live swatch previews.
2. **AI Fit Recommender**: Evaluated height/silhouette preferences and yielded optimal size recommendations.
3. **Cart Drawer**: Added *The Milanese Double-Faced Cashmere Trench*, unlocked Complimentary Worldwide Delivery.
4. **Promo Redemption**: Applied code `VOGUE25` (25% off discount, saving **$222.50**).
5. **Concierge Checkout**: Simulated Stripe payment with 3D Secure / card validation.
6. **Confirmation Vault**: Generated official order reference (`AV-698212`) and DHL Express tracking reference.

---
*Created by Antigravity for enterprise fashion brands.*
