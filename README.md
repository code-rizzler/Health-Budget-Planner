# BudgetBite

A full-stack AI-powered nutrition and grocery budgeting web app for busy professionals in India. Plan meals, track groceries, and stay within budget — without sacrificing nutrition.

## Features

- **Multi-step onboarding** — age, weight, goal, diet preference, allergies, monthly budget
- **30-day Meal Planner** — rule-based, diet-aware (Veg / Eggitarian / Non-Veg), regeneratable
- **Grocery Planner** — auto-generated categorized shopping list with estimated costs
- **Budget Tracker** — expense logging, category breakdown, progress bar
- **Recipe Library** — full recipe pages with ingredients, steps, nutrition, cook time
- **Analytics** — weekly calorie and grocery spend charts
- **Admin Panel** — password-protected food item CRUD (accessible at `/admin`)
- **Light / Dark mode** — user preference persisted in localStorage
- **Clerk Auth** — sign up / sign in with email or social

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Wouter, Recharts |
| Backend | Node.js 24, Express 5, TypeScript |
| Auth | Clerk (`@clerk/react` + `@clerk/express`) |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v4, drizzle-zod |
| API codegen | Orval (OpenAPI → React Query hooks) |
| Package manager | pnpm workspaces |

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/budgetbite.git
cd budgetbite
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database (required)
DATABASE_URL=postgresql://postgres:password@localhost:5432/budgetbite

# Clerk Auth (required — get these from https://clerk.com)
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Session
SESSION_SECRET=your-random-secret-string-here

# Admin panel password (optional, default: budgetbite@admin)
VITE_ADMIN_PASSWORD=budgetbite@admin
```

> **Clerk setup**: Create a free account at [clerk.com](https://clerk.com), create an application, and copy the API keys from the dashboard.

### 4. Create the database

```bash
createdb budgetbite
```

### 5. Push the database schema

```bash
pnpm --filter @workspace/db run push
```

### 6. Seed the database

Run the following SQL to add the food items (or import via the Admin panel after starting the app):

```bash
psql budgetbite < scripts/seed.sql
```

> If `scripts/seed.sql` doesn't exist yet, start the app, go to `/admin`, and add food items manually.

### 7. Regenerate API client (if needed)

```bash
pnpm --filter @workspace/api-spec run codegen
```

### 8. Start the development servers

In two separate terminals:

```bash
# Terminal 1 — API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 5173)
pnpm --filter @workspace/budgetbite run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
budgetbite/
├── artifacts/
│   ├── api-server/          # Express API
│   │   └── src/
│   │       ├── routes/      # Route handlers (profile, mealplan, groceries, budget, recipes, admin…)
│   │       └── lib/
│   │           └── planner.ts   # Rule-based meal + grocery plan generator
│   └── budgetbite/          # React + Vite frontend
│       └── src/
│           ├── pages/       # Dashboard, MealPlan, Grocery, Budget, Recipes, Analytics, Admin…
│           └── components/  # Layout, UI primitives
├── lib/
│   ├── db/                  # Drizzle schema + client
│   ├── api-spec/            # OpenAPI contract (source of truth)
│   └── api-client-react/    # Orval-generated React Query hooks
└── pnpm-workspace.yaml
```

## Available Scripts

| Command | Description |
|---|---|
| `pnpm run typecheck` | Full TypeScript check across all packages |
| `pnpm run typecheck:libs` | Rebuild shared lib declarations |
| `pnpm run build` | Build all packages |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks from OpenAPI spec |
| `pnpm --filter @workspace/db run push` | Push DB schema changes |

## Admin Panel

Navigate to `/admin` and enter the admin password (default: `budgetbite@admin`).  
Change the password by setting the `VITE_ADMIN_PASSWORD` environment variable.

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Yes | Clerk backend secret key |
| `CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key (backend) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key (frontend) |
| `SESSION_SECRET` | Yes | Random string for session signing |
| `VITE_ADMIN_PASSWORD` | No | Admin panel password (default: `budgetbite@admin`) |

## Author

Developed by **Shubham Kumar Rajwar**

## License

MIT &copy; 2025 Shubham Kumar Rajwar
