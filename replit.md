# MealPrep Pro

## Overview

A smart meal prep app with AI-powered meal planning, calorie tracking, and photo-based meal analysis. Uses OpenAI via Replit AI Integrations (no API key needed).

## Features

- **Meal Planning**: Select 2-5 meals/day, set daily calorie goal, generate AI meal plans
- **Shopping List**: Detailed, categorized shopping list with brand suggestions (clean eating focused)
- **Photo Scanner**: Take/upload meal photos, AI estimates calories and identifies ingredients
- **My Meals**: Save analyzed meals, view history, manage saved entries

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/meal-prep), Tailwind CSS, shadcn/ui, wouter routing
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2 for meal gen, vision for photo analysis)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

- `artifacts/meal-prep/` — React/Vite frontend, served at `/`
- `artifacts/api-server/` — Express backend, served at `/api`
- `lib/db/` — Drizzle ORM + PostgreSQL schema
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod validation schemas
- `lib/integrations-openai-ai-server/` — OpenAI server-side integration

## DB Tables

- `meal_plans` — user-created meal plans
- `meal_items` — individual meals in a plan
- `saved_meals` — meals saved from photo analysis

## API Routes

- `GET/POST /api/meal-plans` — list/create meal plans
- `GET/DELETE /api/meal-plans/:id` — get/delete a meal plan
- `GET/POST /api/saved-meals` — list/save analyzed meals
- `DELETE /api/saved-meals/:id` — delete a saved meal
- `GET /api/shopping-lists/:mealPlanId` — AI-generated shopping list for a plan
- `POST /api/ai/generate-meal-plan` — AI generates full meal plan + shopping items
- `POST /api/ai/analyze-meal-photo` — AI analyzes photo to estimate calories
