---
name: spec-driven-website-update
description: >-
  Use this skill whenever proposing, designing, implementing, or verifying any updates,
  features, styling changes, or schema modifications to the Atelier Riwayat or Nanhi Maison
  websites. Enforces Spec-Driven Development (SDD) with automated Chrome DevTools Protocol verification.
---

# Spec-Driven Website Update Skill

This skill guides the agent through modifying or extending either storefront using formal specifications, testable acceptance criteria, and automated headless browser verification.

---

## 1. When to Use This Skill

Activate this skill when:
- The user requests a new feature, component, modal, or section on either website.
- Updating styling, palettes, fonts, or responsive breakpoints.
- Adding payment gateways, couriers, or currency options.
- Modifying Wagtail CMS models, REST APIs, or database schemas.

---

## 2. Step-by-Step Procedure

### Phase 1: Draft the Feature Specification
1. Copy the template from [feature_spec_template.md](./resources/feature_spec_template.md) into `Websites/specs/<feature_name>.spec.md`.
2. Review design tokens in [design_tokens.json](./resources/design_tokens.json) to ensure exact color, typography, and z-index compliance.
3. Define unambiguous acceptance criteria:
   - DOM element presence and styling.
   - Symmetrical behavior on Atelier (port 4202) and Kids (port 4201).
   - Zero console errors and minimum 4.5:1 WCAG contrast.

### Phase 2: Symmetrical Implementation
1. **Frontend**: Implement Angular Standalone components using Signals and SCSS.
   - Atelier: `Websites/atelier-clothing-brand/frontend/src/app/`
   - Kids: `Websites/petit-maison-kids/frontend/src/app/`
2. **Backend**: If models or endpoints are modified:
   - Update Django models in `commerce/models.py` or `catalog/models.py`.
   - Run migrations: `./venv/bin/python manage.py makemigrations && ./venv/bin/python manage.py migrate`.
   - Update seed scripts if necessary.

### Phase 3: Automated Spec Verification
Run the automated headless Chrome CDP verification script:
```bash
node .agents/skills/spec-driven-website-update/scripts/sdd_verify_all.js
```
The script automatically tests:
- Favicon and OpenGraph tags.
- VIP gate locking and unlocking.
- Anti-transparency solid backgrounds (`opacity: 1 !important`).
- WCAG 2.1 AA relative luminance contrast across all text elements.
- **0 console errors** and 0 failed HTTP requests.

### Phase 4: Production Build
Verify production compilation without errors:
```bash
cd Websites/atelier-clothing-brand/frontend && npm run build
cd Websites/petit-maison-kids/frontend && npm run build
```

---

## 3. Reference Files
- [Feature Spec Template](./resources/feature_spec_template.md)
- [Design Tokens (Colors, Typography, Z-Indexes)](./resources/design_tokens.json)
- [Verification Test Runner](./scripts/sdd_verify_all.js)
