# Feature Specification: VIP Privé Gate, Dynamic OpenGraph Meta & Harmonized Footer

- **Status**: `IMPLEMENTED & VERIFIED`
- **Target Sites**: Atelier Riwayat (`http://localhost:4202`) & Nanhi Maison (`http://localhost:4201`)
- **Version**: 1.0.0 (Archival 2026 Edition)

---

## 1. Overview & Business Objectives
1. **VIP Privé / Nursery Gate**: Provide an alluring gate to boost subscriber conversion with exclusive promo codes (`VOGUE25`, `PURE25`) without dead-ending visitors (via a complimentary preview pass).
2. **Dynamic OpenGraph Meta & Favicon**: Dynamically update meta tags, document title, vector SVG favicons, and social sharing links with UTM parameters for viral social commerce.
3. **Anti-Transparency Dropdowns**: Enforce solid opaque backgrounds on all menus (`opacity: 1 !important`) to eliminate backdrop bleed-through.
4. **Harmonized 4-Tier Footer**: Establish a symmetrical luxury footer across both brands featuring a VIP newsletter strip, 4-badge trust ribbon, 12-column links/flagships grid, and bottom payment/legal ribbon.

---

## 2. Component & DOM Architecture

### A. VIP Login Gate (`app-login-gate`)
- **Selector**: `app-login-gate`
- **Overlay**: `.gate-overlay` (z-index 2000, fixed inset)
- **Modal Surface**: `.gate-modal`
- **Unlock Storage Key**:
  - Atelier: `localStorage['atelier_prive_gate_unlocked'] = 'true'`
  - Kids: `localStorage['nanhi_maison_gate_unlocked'] = 'true'`
- **Auth Options**:
  - Google Sign-In (`.google-btn`)
  - Apple Sign-In (`.apple-btn`)
  - Mobile / Email OTP (`.otp-verification-box`)
  - Complimentary Preview Pass (`.guest-preview-btn`)

### B. Social Share Modal (`app-social-share-modal`)
- **Selector**: `app-social-share-modal`
- **Backdrop**: `.share-backdrop`
- **Surface**: `.share-modal`
- **Channels**: WhatsApp, Twitter/X, Facebook, LinkedIn, Pinterest, Copy Link, Web Share API.

### C. Harmonized Footer (`app-footer`)
- **Selector**: `app-footer`
- **Tier 1**: `.newsletter-strip` (2-column flex)
- **Tier 2**: `.cert-ribbon` (4-column grid)
- **Tier 3**: `.footer-main-grid` (12-column grid: brand, collections, concierge, flagships)
- **Tier 4**: `.footer-bottom` (copyright, payment chips, policy links)

---

## 3. Visual & Accessibility Constraints (Verified)
- [x] **Zero Console Errors**: 0 errors on load and during user interaction.
- [x] **WCAG 2.1 AA Contrast**: All text >= 4.5:1 relative luminance across 1,066 tested elements.
- [x] **Anti-Transparency**: Menus enforce solid `#181b22` / `#FFFFFF` with `opacity: 1`.
- [x] **Keyboard Dismiss**: Modals close on `Esc` key press.

---

## 4. Automated Verification Commands
```bash
# 1. Run Automated Spec Verification
node .agents/skills/spec-driven-website-update/scripts/sdd_verify_all.js

# 2. Run WCAG Contrast Audit
node .agents/skills/wcag-accessibility-audit/scripts/run_contrast_audit.js

# 3. Check Wagtail Backend Schemas
python3 .agents/skills/wagtail-headless-sync/scripts/sync_schema.py

# 4. Production Build Verification
cd Websites/atelier-clothing-brand/frontend && npm run build
cd Websites/petit-maison-kids/frontend && npm run build
```
