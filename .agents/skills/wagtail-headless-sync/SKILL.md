---
name: wagtail-headless-sync
description: >-
  Use this skill when modifying or extending Wagtail CMS models, REST APIs, or PostgreSQL
  schemas for Atelier Riwayat or Nanhi Maison to ensure Angular TypeScript models stay in sync.
---

# Wagtail Headless Schema Sync Skill

This skill ensures field fidelity between Django Wagtail backend models and headless Angular frontend interfaces.

---

## 1. When to Use This Skill
- Adding new attributes to garments (e.g., fabric certifications, care guides, weight, dimensions).
- Adding custom settings to Wagtail Brand CMS panels (e.g., promotional tickers, festival themes).
- Extending the checkout payload with new customer or courier fields.

---

## 2. Procedure

### Step 1: Update Django Wagtail Models
- For Atelier: `Websites/atelier-clothing-brand/backend/commerce/models.py`
- For Kids: `Websites/petit-maison-kids/backend/catalog/models.py`

### Step 2: Make & Apply Database Migrations
```bash
# Atelier
cd Websites/atelier-clothing-brand/backend
./venv/bin/python manage.py makemigrations
./venv/bin/python manage.py migrate

# Nanhi Maison Kids
cd Websites/petit-maison-kids/backend
./venv/bin/python manage.py makemigrations
./venv/bin/python manage.py migrate
```

### Step 3: Update Headless Serializers & Angular Models
- Update serializers in `api/serializers.py`.
- Mirror new fields in Angular TypeScript models:
  - Atelier: `Websites/atelier-clothing-brand/frontend/src/app/models/product.model.ts`
  - Kids: `Websites/petit-maison-kids/frontend/src/app/models/kids.model.ts`

### Step 4: Validate Backend Health
```bash
python3 .agents/skills/wagtail-headless-sync/scripts/sync_schema.py
```
