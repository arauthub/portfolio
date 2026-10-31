# Technical Design Document: Petit Maison Kids (Nanhi Maison)

## 1. System Overview
Petit Maison Kids is an enterprise flagship children's luxury and heirloom apparel platform. It couples headless Wagtail 7.1 CMS editorial management with an interactive Angular 22 Signals storefront.

## 2. Architectural Blueprint
```
[Client PWA (Angular 22 Signals)] <--- REST Endpoints ---> [Headless Wagtail 7.1]
                                                                    |
                                        +---------------------------+---------------------------+
                                        |                           |                           |
                                  [PostgreSQL 18]        [Live Monogram Canvas]       [Theme Presets]
```

## 3. Specialized Innovations & Tech Stack
- **Backend**: Wagtail CMS 7.1, Django 4.2 LTS, Django REST Framework, PostgreSQL 18
- **Frontend**: Angular 22 Standalone Architecture, Signals Reactivity, Tailwind CSS, D3.js
- **Personalization**: Live Bespoke Monogram Embroidery Studio (HTML5 Canvas preview)
- **Sustainability & Standards**: 100% GOTS Peruvian Pima Cotton & OEKO-TEX Standard 100
- **Garment Engineering**: Foldable Room-To-Grow™ extensible double-cuff tracking
- **Atmosphere Engine**: 4 dynamic luxury theme presets (Nordic Pastel, Sunshine Pop, Parisian Vintage, Forest Adventure)
