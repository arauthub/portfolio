# Spec-Driven Development (SDD) Rules: Centralised Enterprise Storefronts

Refer to [GEMINI.md](./GEMINI.md) for the complete rules and guidelines.

### Mandatory Verification Checklist Before Completing Any Website Task:
1. **Spec Alignment**: All features match `Websites/specs/*.spec.md`.
2. **Zero Console Errors**: Headless CDP audit returns 0 console errors on ports 4201 and 4202.
3. **WCAG 2.1 AA Contrast**: 100% compliant contrast (>= 4.5:1) on all rendered text elements.
4. **Anti-Transparency**: Menus and dropdowns have solid opaque backgrounds (opacity: 1).
5. **Build Verification**: `npm run build` exits with code 0 on both frontends.
6. **Backend Check**: `./venv/bin/python manage.py check` exits with 0 issues on both backends.
