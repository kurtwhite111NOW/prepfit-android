# NutriPrep — Clean Eating & Weight Loss

## Overview

A premium AI-powered meal prep and health tracking app for busy moms. Users generate AI meal plans, scan meal photos for calorie analysis, track body weight over time, and get smart grocery lists with clean-brand suggestions. Built as a PWA (installable on Android without an app store).

**Brand:** NutriPrep — Clean Eating & Weight Loss · Simple Meal Prep for Busy Moms
**Price:** $12/month billed annually at $144.00 USD
**Trial:** 3-day free trial (localStorage-based, no login required)

---

## Features

- **AI Meal Planning** — Select 2–5 meals/day, set a daily calorie goal, generate a full weekly plan with balanced meals and per-meal calorie targets
- **Smart Grocery List** — AI-generated shopping list from the active meal plan, organized by category with clean-brand suggestions (Bob's Red Mill, Simple Truth, Siggi's, etc.), checkboxes for in-store use
- **Photo Scanner** — Take or upload a meal photo; AI identifies food, estimates calories, and lists ingredients. Save to journal.
- **My Meals (Journal)** — All photo-scanned meals saved with image, calorie count, ingredients, date, and notes
- **Weight Tracker** — Log body weight (lbs or kg), view a line chart of trend over time, see stats (current, total change, last change vs previous)
- **Android Install Guide** — Step-by-step visual guide to install as a PWA on Android (Chrome/Samsung Internet/Edge) with live QR code
- **3-Day Free Trial** — Trial banner, progress bar in sidebar, full-screen paywall after expiry
- **Light / Dark Mode** — Toggle in sidebar (moon/sun icon), persists to localStorage, respects system preference on first visit

---

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (`artifacts/meal-prep`), Tailwind CSS v4, shadcn/ui, wouter routing
- **Fonts**: Playfair Display (serif headings) + Bricolage Grotesque (sans body) — Google Fonts
- **Charts**: Recharts (weight tracker line chart)
- **API framework**: Express 5 (`artifacts/api-server`)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (OpenAPI spec → React Query hooks + Zod schemas)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2 for meal gen, vision for photo analysis — no user API key needed)
- **Build**: esbuild (CJS bundle)
- **QR codes**: api.qrserver.com (free external API, dynamic URL)

---

## Key Commands

```bash
# Run codegen after editing openapi.yaml
pnpm --filter @workspace/api-spec run codegen

# Full typecheck
pnpm run typecheck

# Build all packages
pnpm run build

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push
```

---

## Architecture

```
artifacts/
  meal-prep/          React/Vite frontend → served at /
  api-server/         Express backend     → served at /api
  mockup-sandbox/     Design canvas sandbox

lib/
  db/                 Drizzle ORM + PostgreSQL schema
  api-spec/           openapi.yaml (source of truth for all routes)
  api-client-react/   Generated React Query hooks (via Orval)
  api-zod/            Generated Zod validation schemas (via Orval)
  integrations-openai-ai-server/   OpenAI server-side client
```

---

## Database Tables

| Table | Description |
|---|---|
| `meal_plans` | User-created meal plans (name, mealsPerDay, dailyCalories) |
| `meal_items` | Individual meals within a plan (FK → meal_plans, cascade delete) |
| `saved_meals` | Meals saved from photo analysis (name, calories, ingredients, imageData) |
| `weight_entries` | Body weight logs (weight REAL, unit text, notes, recordedAt timestamp) |

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/meal-plans` | List all meal plans |
| POST | `/api/meal-plans` | Create a meal plan with meals |
| GET | `/api/meal-plans/:id` | Get a plan with its meal items |
| DELETE | `/api/meal-plans/:id` | Delete a plan (cascades to items) |
| GET | `/api/saved-meals` | List all photo-scanned meals |
| POST | `/api/saved-meals` | Save an analyzed meal |
| DELETE | `/api/saved-meals/:id` | Delete a saved meal |
| GET | `/api/shopping-lists/:mealPlanId` | AI-generated shopping list for a plan |
| POST | `/api/ai/generate-meal-plan` | AI generates full meal plan |
| POST | `/api/ai/analyze-meal-photo` | AI analyzes meal photo (base64) |
| GET | `/api/weight-entries` | List all weight logs |
| POST | `/api/weight-entries` | Log a new weight entry |
| DELETE | `/api/weight-entries/:id` | Delete a weight entry |

---

## Frontend Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Greeting, stats from active plan, quick actions |
| `/planner` | Meal Planner | Configure + generate + save AI meal plans |
| `/shopping` | Grocery List | Categorized shopping list with check-off |
| `/meals` | My Meals | Photo journal with image gallery |
| `/scan` | Scan Photo | Upload/capture photo for AI calorie analysis |
| `/weight` | Weight Tracker | Log weight, line chart, history |
| `/android` | Android Guide | Visual step-by-step PWA install guide with QR code |

---

## Design System

- **Background**: Warm cream (`hsl(40 30% 97%)`)
- **Foreground**: Deep forest green/charcoal (`hsl(160 35% 9%)`)
- **Primary**: Rich emerald (`hsl(142 60% 38%)`)
- **Sidebar**: Dark forest (`hsl(160 35% 9%)`) — premium dark sidebar
- **Calorie indicator**: Amber/gold pill (`calorie-pill` utility class)
- **Cards**: White with subtle shadow and `card-glow` hover effect
- **Radius**: `0.875rem` base
- **Dark mode**: `.dark` class on `<html>`, toggled via `useTheme` hook, saved to localStorage

## Sidebar Branding

- **Line 1**: "NutriPrep" — serif bold, white
- **Line 2**: "Clean Eating & Weight Loss" — `text-primary` (emerald green)
- **Line 3**: "Simple Meal Prep for Busy Moms" — bright white, small caps

---

## Trial & Paywall System

- **Hook**: `src/hooks/use-trial.ts` — reads/writes `nutriplan_trial_start` in localStorage
- **Banner**: `src/components/trial-banner.tsx` — shown at top of every page during trial, dismissible
- **Paywall**: `src/components/upgrade-wall.tsx` — full-screen overlay when trial expires; closeable (X button) if user clicks Upgrade early during trial
- **Pricing displayed**: $12/month, billed annually at $144.00 USD
- **Stripe**: Not yet connected — "Start Pro Plan" button is UI-only, ready for Stripe integration

## Theme System

- **Hook**: `src/hooks/use-theme.ts` — reads/writes `nutriplan_theme` in localStorage
- **Toggle**: `src/components/theme-toggle.tsx` — moon/sun button, two variants (sidebar + mobile header)
- **Default**: Matches system `prefers-color-scheme` on first visit

---

## Publishing Guide — App Stores

> How to publish NutriPrep on iOS App Store and Android Play Store.

### iOS App Store
- Apple Developer Account — **$99/year** at developer.apple.com
- Requires a Mac + Xcode (or Median.co ~$99/year as easier alternative)
- Wrap with Capacitor.js: `npx cap init` → `npx cap add ios` → Xcode → App Store Connect
- Review takes 1–3 days

### Android Play Store
- Google Play Developer Account — **$25 one-time** at play.google.com/console
- **Fastest path**: [pwabuilder.com](https://pwabuilder.com) — paste URL, download .aab, upload to Play Console
- Alternative: Capacitor.js `npx cap add android` → Android Studio
- Review takes hours to 3 days

### Requirements for both
- Privacy policy URL (generate free at privacypolicygenerator.info)
- App icon (512×512px) + screenshots
- If charging subscription: must use Apple/Google in-app purchase (15–30% cut)

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-set by Replit) |
| `SESSION_SECRET` | Session signing secret |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI proxy base URL (auto-set by Replit AI Integrations) |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI proxy key (auto-set by Replit AI Integrations) |

---

## Upcoming

- **Stripe paywall** — Wire "Start Pro Plan" button to Stripe Checkout ($144/year subscription), handle webhook to unlock access after payment
