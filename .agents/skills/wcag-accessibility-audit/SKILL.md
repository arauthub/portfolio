---
name: wcag-accessibility-audit
description: >-
  Use this skill to audit both websites for WCAG 2.1 AA accessibility and color contrast compliance.
  Evaluates relative luminance across all DOM text nodes using Chrome DevTools Protocol.
---

# WCAG 2.1 AA Accessibility & Contrast Audit Skill

This skill allows the agent to run an automated, programmatic accessibility audit of all rendered text, buttons, headings, badges, and interactive controls across both websites.

---

## 1. When to Use This Skill
- Whenever updating colors, themes, font families, or button backgrounds.
- Prior to completing any user feature request.
- When validating dark-theme or light-theme palette presets.

---

## 2. Procedure

Run the automated CDP contrast auditor:
```bash
node .agents/skills/wcag-accessibility-audit/scripts/run_contrast_audit.js
```

### Evaluation Criteria:
- **Body & Normal Text**: Contrast ratio must be `>= 4.5:1`.
- **Large Text (>= 24px or bold >= 18.5px)**: Contrast ratio must be `>= 3.0:1`.
- Elements failing contrast will be logged with their tag, text content, CSS classes, computed foreground and background colors, and exact contrast ratio.

---

## 3. Resolving Contrast Failures
- If `--text-muted` fails on dark surfaces, upgrade from `#64748b` (3.6:1) to `#94a3b8` (7.3:1) or `#cbd5e1` (11.5:1).
- If gold accents fail on white surfaces, upgrade from `#E0A96D` (2.09:1) to `#B45309` (5.5:1).
- If discount emerald badges fail with white text, invert to `#065F46` background with `#ECFDF5` text (9.1:1).
