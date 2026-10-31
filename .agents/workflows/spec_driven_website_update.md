# Workflow: Spec-Driven Website Update

This workflow defines the standard operating procedure for delivering verifiable, regression-free updates to **Atelier Riwayat** and **Nanhi Maison**.

---

## Prerequisites
- Both frontend dev servers running on ports 4202 (Atelier) and 4201 (Kids).
- Both Django backend servers running on ports 8002 (Atelier) and 8001 (Kids).
- PostgreSQL running with `atelier_clothing_db` and `petit_maison_kids_db`.

---

## Phase 1: Specification & Contract Design
1. **Create the Spec Document**:
   Create a new specification file under `Websites/specs/<feature_name>.spec.md` using the template at `.agents/skills/spec-driven-website-update/resources/feature_spec_template.md`.
2. **Define Acceptance Assertions**:
   - Explicit DOM selectors to test.
   - User interactions (click, input, ESC dismiss).
   - Expected contrast and responsive layout requirements.
   - Symmetrical impact on both sites.

---

## Phase 2: Implementation & Token Alignment
1. **Reference Design Tokens**:
   Review `.agents/skills/spec-driven-website-update/resources/design_tokens.json` to ensure standard colors, typography, and z-indexes are used.
2. **Apply Code Changes**:
   - Implement Angular standalone components using Signals.
   - Follow the anti-transparency rule (`opacity: 1 !important` on menu panels).
   - If backend changes are involved, follow `.agents/skills/wagtail-headless-sync/SKILL.md`.

---

## Phase 3: Automated CDP Audit & Spec Verification
1. Run the unified SDD verification script:
   ```bash
   node .agents/skills/spec-driven-website-update/scripts/sdd_verify_all.js
   ```
2. Verify:
   - [x] Zero JavaScript console errors.
   - [x] Zero failed HTTP/image requests (404/500).
   - [x] 100% WCAG 2.1 AA compliant text contrast (>= 4.5:1).
   - [x] Anti-transparency solid menus.
   - [x] VIP Login Gate functional and dismissible via guest pass.

---

## Phase 4: Production Bundling & Completion Gate
1. Execute production builds for both storefronts:
   ```bash
   cd Websites/atelier-clothing-brand/frontend && npm run build
   cd Websites/petit-maison-kids/frontend && npm run build
   ```
2. Both builds must succeed with exit code 0.
3. Mark the spec status as `IMPLEMENTED` in `Websites/specs/<feature_name>.spec.md`.
