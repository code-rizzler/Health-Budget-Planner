# BudgetBite

A full-stack AI-powered nutrition and grocery budgeting web app for busy professionals in India. Plan meals, track groceries, and stay within budget — without sacrificing nutrition.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/budgetbite run dev` — run the frontend (port 25755)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — rebuild lib declarations (run after changing lib/db schema)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind + shadcn/ui + framer-motion + wouter + recharts
- Auth: Clerk (`@clerk/react` frontend, `@clerk/express` backend)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → `@workspace/api-client-react`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — DB schema (profiles, grocery_plans, meal_plans, recipes, expenses, food_items)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for all API types)
- `lib/api-client-react/src/generated/` — Orval-generated React Query hooks + Zod schemas
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/planner.ts` — Rule-based meal + grocery plan generator
- `artifacts/budgetbite/src/pages/` — All frontend pages
- `artifacts/budgetbite/src/components/` — Shared UI components + layout

## Architecture decisions

- **Rule-based planner**: No OpenAI API key required. Meal and grocery plans are generated from curated Indian meal templates in `planner.ts`, filtered by diet preference (Veg/Eggitarian/Non-Veg), allergies, and calorie goals.
- **Contract-first API**: OpenAPI spec → Orval codegen → typed React Query hooks. Zod schemas used server-side for validation.
- **Clerk proxy middleware**: Clerk auth is proxied through the Express server so the frontend and backend share auth state correctly in the Replit preview environment.
- **JSONB for complex fields**: Meal plan days, grocery items, recipe ingredients/steps stored as typed JSONB columns in PostgreSQL.
- **Single artifact routing**: Frontend at `/`, API at `/api`. Shared proxy handles routing.

## Product

- **Onboarding**: Multi-step profile wizard (age, gender, height, weight, activity, goal, diet, allergies, budget, city)
- **Dashboard**: Today's meals, calorie/protein summary, budget snapshot, grocery item count
- **30-day Meal Plan**: Calendar/grid view with generate/regenerate; clicking meals shows recipe details
- **Grocery Planner**: AI-generated categorized grocery list with Blinkit/Zepto/Instamart/BigBasket link placeholders
- **Budget Tracker**: Progress bar, expense list, add/delete expenses, per-category breakdown
- **Recipe Library**: Grid with diet filter, full recipe detail pages (ingredients, steps, nutrition, cook time)
- **Analytics**: Weekly calorie/macro charts and grocery expense charts (Recharts)
- **Admin Panel**: Food item CRUD table for managing the food database

## User preferences

- No emojis in the UI
- Currency displayed as ₹ (rupees)
- India-specific meal templates and grocery items

## Gotchas

- After changing `lib/db/src/schema/`, always run `pnpm run typecheck:libs` before checking `api-server` — stale lib declarations cause false import errors.
- After schema changes, run `pnpm --filter @workspace/db run push` to apply to the DB.
- Use `getAuth(req)` from `@clerk/express` (not `req.auth`) for user ID in route handlers — the type augmentation isn't always picked up.
- All route handlers need explicit `Promise<void>` return type and `return;` after early `res.json()` calls to satisfy TS strict mode.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Clerk dev key warnings in browser console are expected and harmless in development
