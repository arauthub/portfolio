# Technical Design Document: Atelier Riwayat Luxury Storefront

## 1. System Overview
Atelier Riwayat is an enterprise-grade luxury couture and high-fashion digital storefront platform. It leverages a headless architecture decoupling the Python Wagtail CMS (Django 4.2 LTS) editorial engine from an ultra-responsive Angular 19/22 client.

## 2. Architectural Blueprint
```
[Client PWA (Angular + Material)] <--- REST API ---> [Wagtail 7.1 / Django Backend]
                                                            |
                                        +-------------------+-------------------+
                                        |                   |                   |
                                   [PostgreSQL]    [Payment Gateways]   [POS Inventory]
```

## 3. Core Capabilities & Tech Stack
- **Backend**: Wagtail CMS 7.1, Django 4.2 LTS, Django REST Framework, PostgreSQL 18
- **Frontend**: Angular Standalone Components, Angular Material 3, Tailwind CSS, D3.js
- **E-Commerce & Gateways**: Stripe Elements, Razorpay UPI, PayPal, Webhook Verification
- **Security**: VIP Privé 3-tier membership gate (Classic, Silver, Privé Gold)
- **Inventory Management**: Real-time in-store POS barcode reader integration
- **Accessibility**: 100% WCAG 2.1 AA compliant color contrast (>= 4.5:1)
