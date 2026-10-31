# Spec-Driven Development (SDD) Rules: Centralised Enterprise Storefronts

These rules govern all feature additions, styling modifications, CMS integrations, and maintenance for both **Atelier Riwayat** (`Websites/atelier-clothing-brand`) and **Nanhi Maison** (`Websites/petit-maison-kids`).

---

## 1. Spec-First Development Lifecycle

No code changes shall be made directly without a clear, documented Specification:
1. **Locate or Create Spec**: Check `Websites/specs/<feature_name>.spec.md`. If creating a new feature or modifying an existing flow, draft the specification using the template in `.agents/skills/spec-driven-website-update/resources/feature_spec_template.md`.
2. **Define Testable Acceptance Criteria**: Each spec MUST declare unambiguous, boolean pass/fail criteria (e.g. `Assert: .discount-pill text is visible and contrast >= 4.5:1`).
3. **Data Contract**: Specify TypeScript interfaces and Django/Wagtail model fields simultaneously to prevent drift.

---

## 2. Zero-Console-Error Standard

Every browser session, navigation event, modal trigger, filter selection, and checkout flow MUST produce **zero JavaScript errors, unhandled rejections, or 404 network assets** in Chrome DevTools:
- All dynamic image sources must provide a clean fallback handler (`(error)="onImgError($event)"`).
- External API calls must gracefully handle offline/null responses without throwing uncaught exceptions.
- Before committing, run the automated CDP audit:
  `node .agents/skills/spec-driven-website-update/scripts/sdd_verify_all.js`

---

## 3. WCAG 2.1 AA Accessibility & Contrast Strict Rule

- **Minimum Contrast Ratio**: All body copy, labels, icons, and button text must maintain a relative luminance contrast ratio of at least **4.5:1** against their background surfaces (3.0:1 for large display headings >= 24px).
- **Dark Theme Standards**: Never use `#64748b` on dark surfaces. Use `#94a3b8` or lighter (`#cbd5e1`, `#f8fafc`).
- **Light Theme Standards**: Never use yellow or light amber (`#E0A96D`) on white. Use deep amber (`#B45309`) or terracotta (`#7C2D12`).
- **Semantic HTML & Focusability**: All interactive buttons, modals, and dropdowns must have appropriate `aria-label`, `role="dialog"`, `aria-modal="true"`, and keyboard dismiss support (`Esc` key listener).

---

## 4. Anti-Transparency & Solid Dropdown Architecture

- All dropdown panels, mega menus, modal sheets, and floating drawers MUST enforce solid, opaque backgrounds (`opacity: 1 !important`):
  - **Atelier Riwayat**: Solid midnight `#181b22 !important`, border `rgba(234, 216, 192, 0.3)`.
  - **Nanhi Maison**: Solid white `#FFFFFF !important`, border `#CBD5E1`.
- Never rely solely on translucent alpha variables (`rgba(...)`) or `backdrop-filter` for dropdown content, as background cards bleed through during scrolling.

---

## 5. Dual-Storefront Symmetrical Harmonization

Atelier Riwayat and Nanhi Maison live under the same enterprise umbrella. Any architectural update to shared functionality must be applied symmetrically to both:
- **Header**: 3-zone architecture (Mobile toggle/Logo, Mega menus/Search, Actions/Concierge/Currency/Cart).
- **Footer**: 4-tier pattern (Newsletter VIP strip, 4-badge trust ribbon, 12-column links/flagships grid, legal/payment bottom ribbon).
- **VIP Login Gate**: Symmetrical auth methods (Google, Apple ID, Mobile OTP, and complimentary preview bypass).
- **Omnichannel POS**: Identical barcode scanner interface, receipt generator, and inventory decrementing logic.
- **Wagtail CMS Control**: Symmetrical brand control suite (theme presets, brand typography, D3 mathematical visualizer styles, and store subscription tiers).

---

## 6. PostgreSQL & Headless REST API Fidelity

- Storefront state must reflect live data from PostgreSQL databases:
  - `atelier_clothing_db` (Port 8002) for Atelier Riwayat.
  - `petit_maison_kids_db` (Port 8001) for Nanhi Maison.
- Never hardcode mock data in Angular services when a database model exists.
- Run migrations (`python manage.py migrate`) whenever model fields change, and verify API endpoints return HTTP 200 before concluding work.
