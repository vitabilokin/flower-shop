# Posy — Flower Shop

A modern full-stack flower shop website with a product catalog, bouquet builder, and admin panel — built as a portfolio project to demonstrate production-ready Angular development.

---

## About

Posy is a customer-facing web app for a Ukrainian flower shop. It covers the full user journey: browsing and filtering bouquets, getting personalized recommendations, building a custom bouquet, placing an order, and scheduling a reminder for upcoming occasions.

The admin panel lets the shop owner manage the catalog, control seasonal highlights, and view reminder requests — all in real time via Firebase.

---

## Features

**Customer-facing**
- **Catalog** with multi-parameter filtering (occasion, flower type, color, price range) and URL-synced filter state
- **Bouquet detail pages** with add-to-cart and quick-order via Telegram/Viber
- **Quiz** — 5-step flower preference quiz that recommends matching bouquets
- **Bouquet builder** — interactive SVG canvas to compose a custom bouquet from 18 flower types with wrapping and ribbon options; supports unlimited flowers with a visual mode up to 20
- **Shopping cart** — slide-in drawer with quantity controls and one-tap order via Telegram or Viber
- **Reminder** — form to schedule a flower delivery reminder for birthdays or anniversaries, saved to Firestore

**Admin panel** (protected by Firebase Auth)
- Catalog management: create, edit, toggle visibility, soft-delete bouquets with photo upload to Firebase Storage
- Season hits: set featured bouquets per calendar month
- Reminders: view and mark customer reminder requests as done
- Site settings: update contact info, working hours, and social links — reflected live across the site

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 21 (standalone components) |
| Language | TypeScript |
| Styling | SCSS with a custom Posy design system (CSS tokens) |
| UI components | Angular Material |
| State | Angular Signals (`signal`, `computed`, `effect`) |
| Backend | Firebase — Firestore, Authentication, Storage |
| Build | Angular CLI, lazy-loaded routes |

---

## Architecture

```
src/app/
├── core/          # Services, guards, Firebase helpers
├── features/      # Lazy-loaded pages (catalog, constructor, admin, quiz…)
└── shared/        # Nav, cart drawer, filter drawer, footer, confirm dialog
```

**Key decisions:**
- **Feature-based folder structure** — each page is a self-contained folder with its component, template, styles, and child components
- **Lazy loading** on every route — initial bundle stays small regardless of how many admin pages exist
- **Angular Signals throughout** — no NgRx, no RxJS Subject chains; reactive state is local and explicit
- **Custom Firestore helpers** — thin `onSnapshot` wrappers instead of `@angular/fire` collection helpers, which have a known type mismatch in this firebase/angular-fire version combination
- **CSS design system** — all spacing, color, and typography defined as `--token` variables in a single `tokens.scss`; no hardcoded values in component styles

---

## Screenshots

> _Coming soon — live demo link and screenshots_

---

## Author

Built by **Vita Bilokin** · [GitHub](https://github.com/vitabilokin)
