# NutriPlan — MealPrep Pro

## Overview

A premium AI-powered meal prep and health tracking app. Users generate AI meal plans, scan meal photos for calorie analysis, track body weight over time, and get smart grocery lists with clean-brand suggestions. Built as a PWA (installable on iOS and Android without an app store).

**Perceived value: $20/month subscription product.**

---

## Features

- **AI Meal Planning** — Select 2–5 meals/day, set a daily calorie goal, generate a full weekly plan with balanced meals and per-meal calorie targets
- **Smart Grocery List** — AI-generated shopping list from the active meal plan, organized by category with clean-brand suggestions (Bob's Red Mill, Simple Truth, Siggi's, etc.), checkboxes for in-store use
- **Photo Scanner** — Take or upload a meal photo; AI identifies food, estimates calories, and lists ingredients. Save to journal.
- **My Meals (Journal)** — All photo-scanned meals saved with image, calorie count, ingredients, date, and notes
- **Weight Tracker** — Log body weight (lbs or kg), view a line chart of trend over time, see stats (current, total change, last change vs previous)
- **iOS Install Guide** — Step-by-step instructions to install the app on iPhone/iPad via Safari + Add to Home Screen, with live QR code
- **Android Install Guide** — Step-by-step instructions for Chrome/Samsung Internet/Edge on Android, with live QR code

---

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (`artifacts/meal-prep`), Tailwind CSS v4, shadcn/ui, wouter routing
- **Fonts**: Playfair Display (serif headings) + Bricolage Grotesque (sans body)
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

# Dev servers (managed by Replit workflows)
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/meal-prep run dev
```

---

## Architecture

```
artifacts/
  meal-prep/          React/Vite frontend → served at /
  api-server/         Express backend     → served at /api
  mockup-sandbox/     Design canvas sandbox

lib/
  db/                 Drizzle ORM + PostgreSQL schema + migrations
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
| `/ios` | iOS Guide | Step-by-step install guide for iPhone/iPad with QR code |
| `/android` | Android Guide | Step-by-step install guide for Android with QR code |

---

## Design System

- **Background**: Warm cream (`hsl(40 30% 97%)`)
- **Foreground**: Deep forest green/charcoal (`hsl(160 35% 9%)`)
- **Primary**: Rich emerald (`hsl(142 60% 38%)`)
- **Sidebar**: Dark forest (`hsl(160 35% 9%)`) — premium dark sidebar
- **Calorie indicator**: Amber/gold pill (`calorie-pill` utility class)
- **Cards**: White with subtle shadow and `card-glow` hover effect
- **Radius**: `0.875rem` base
- **Shadows**: Colored shadow system with green tint

---

## Publishing Guide — App Stores

> Saved for reference — how to publish this web app on iOS App Store and Android Play Store.

### iOS App Store

**Requirements:**
- Apple Developer Account — **$99/year** at [developer.apple.com](https://developer.apple.com)
- A Mac with Xcode (or rent cloud Mac time via MacStadium ~$1/hr)
- Privacy Policy URL (generate free at privacypolicygenerator.info)
- App screenshots (6.7", 6.5", 5.5" iPhone sizes + iPad)

**Steps:**
1. Deploy this app on Replit (get a live URL)
2. Install Capacitor: `npm install @capacitor/core @capacitor/cli @capacitor/ios`
3. Run `npx cap init` → `npx cap add ios` → set server URL to your live Replit URL
4. Run `npx cap open ios` → opens Xcode
5. In Xcode: Archive → Upload to App Store Connect
6. At [appstoreconnect.apple.com](https://appstoreconnect.apple.com): create listing, add screenshots, description, set pricing
7. Submit for Review (takes 1–3 days)

**Easiest path:** Use **[Median.co](https://median.co)** (~$99/year) — paste your URL and they handle the iOS packaging without needing Xcode.

---

### Android Play Store

**Requirements:**
- Google Play Developer Account — **$25 one-time fee** at [play.google.com/console](https://play.google.com/console)
- Privacy Policy URL
- App icon (512×512px), feature graphic (1024×500px), 2+ screenshots

**Steps (fastest — using PWABuilder):**
1. Deploy this app on Replit (get a live URL)
2. Go to **[pwabuilder.com](https://pwabuilder.com)** (free, by Microsoft)
3. Enter your deployed Replit URL → click "Package for Stores"
4. Download the Android App Bundle (.aab file) — no coding needed
5. In Google Play Console: Create app → fill store listing → upload .aab → submit

**Alternative:** Use **Capacitor.js** (`npx cap add android`) and build with Android Studio (free, Windows/Mac/Linux).

**Review time:** A few hours to 3 days for new accounts.

---

### Key Notes for Both Stores
- Both require a **privacy policy URL** — non-negotiable
- If charging a subscription, you **must** use Apple/Google in-app purchase (they take 15–30% cut)
- PWABuilder is the fastest path to Play Store for a web app
- Median.co is the easiest path to App Store for a web app
- Both stores require at least 2 screenshots from the actual app

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-set by Replit) |
| `SESSION_SECRET` | Session signing secret |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI proxy base URL (auto-set by Replit AI Integrations) |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI proxy key (auto-set by Replit AI Integrations) |
