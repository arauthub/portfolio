# Workspace Rule: Spec-Driven Development (SDD) Protocol

This rule governs the automated procedure for all software modifications across the enterprise web platform.

## 1. The 4-Stage SDD Loop

Every task MUST follow this strict sequence:

```
[1. Specification] ──> [2. Implementation] ──> [3. Automated CDP Audit] ──> [4. Build & Verify]
```

### Stage 1: Specification
- Create or update the relevant specification in `Websites/specs/<component_or_flow>.spec.md`.
- Detail the Component Contracts, DOM Selectors, Expected Behaviors, and Visual Constraints.

### Stage 2: Implementation
- Implement changes symmetrically across `Websites/atelier-clothing-brand` and `Websites/petit-maison-kids`.
- Use Angular Signals for reactive state and SCSS variables for design tokens.

### Stage 3: Automated CDP Audit
- Execute the headless Chrome CDP runner:
  ```bash
  node .agents/skills/spec-driven-website-update/scripts/sdd_verify_all.js
  ```
- Any console error, contrast failure (< 4.5:1), or broken network link (4xx/5xx) halts the pipeline.

### Stage 4: Build & Verify
- Run production builds for both frontends:
  ```bash
  cd Websites/atelier-clothing-brand/frontend && npm run build
  cd Websites/petit-maison-kids/frontend && npm run build
  ```
- Both builds must exit with code 0.
