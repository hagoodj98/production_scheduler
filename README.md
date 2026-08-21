# Production Scheduler

Production Scheduler is a full-stack planning tool for assigning production work to resources by date and time, then tracking status through completion.

This repository was originally built for a contract coding challenge and evolved into a portfolio-ready app that demonstrates practical frontend, backend, and data-layer engineering decisions.

## Project Snapshot

- **Problem solved:** streamline resource scheduling and reduce manual status tracking.
- **Primary users:** operations teams or planners managing time-based production work.
- **Tech stack:** Next.js (App Router), TypeScript, Prisma, PostgreSQL, Zod, MUI, Tailwind.
- **Current maturity:** production-like MVP with working core scheduling workflows.

## Setup Instructions

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create/update `.env` with at least:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5433/<db>?schema=public"
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_DB=<db>
```

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/production_orders?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=production_orders
```

### 3) Start the database

```bash
npm run db:up
```

### 4) Run Prisma migrations and generate client

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 5) Seed initial resource data (optional but recommended)

```bash
npm run db:seed
```

### 6) Run the app

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Helpful commands

```bash
npm run lint
npm run type-check
npm run test:unit
npm run test:api
npm run test:components
npm run test:e2e
npm run db:logs
npm run db:down
```

## Features Implemented

- End-to-end workflow for creating, assigning, and tracking production orders.
- Resource management: add resources with duplicate/name validation support.
- Production order creation: date/time/resource selection with schema validation.
- Scheduling flow: pending order creation and assignment workflow across pages.
- Status lifecycle updates (e.g., pending/scheduled/busy/completed) via backend logic.
- Calendar-based visualization of production schedule.
- Basic charting dashboard for workload/status visibility.
- API route layer for CRUD/status operations and resource/order queries.

## Testing Approach

### How to run tests

```bash
npm run test:unit
npm run test:api
npm run test:components
npm run test:e2e
```

### What is covered

- Zod schema/unit tests for validation rules in `tests/zod/zod-schemas.spec.ts`.
- API route tests for key handlers in `tests/api/*.spec.ts` with repository mocking.
- Component tests for rendering and interaction behavior in `tests/components/*.spec.tsx`.
- Scheduler task status-transition tests in `tests/task/schedulerTask.spec.ts`.
- Playwright e2e coverage for core home/add-resource/notifier flows in `tests/e2e/home.spec.ts`.
- Type safety checks via TypeScript (`npm run type-check`).
- Lint checks for code quality and consistency (`npm run lint`).

### Why this approach

- For a challenge timeline, validation-heavy tests provided the best risk reduction quickly.
- Priority was preventing invalid schedule/resource payloads from reaching persistence.

### Additional quality checks

```bash
npm run lint
npm run type-check
```

## Technical Decisions

- **Next.js App Router + API routes**: kept UI and backend endpoints in one codebase for fast iteration.
- **Prisma + PostgreSQL**: selected for type-safe DB access and straightforward schema migrations.
- **Custom generated Prisma client output** (`app/generated/prisma`): explicitly controlled client generation path.
- **Zod validation**: centralized input validation for order/resource payloads.
- **React context**: lightweight shared state for selected resources and scheduling UI state.
- **MUI + Tailwind**: used together for fast component composition and utility-first layout styling.
- **Seed pipeline**: CSV-driven seed process for reproducible local setup.

## Architecture (High-level)

- **UI layer:** App Router pages + reusable React components.
- **API layer:** Next.js route handlers in `app/api/*` for resource/order operations.
- **Validation layer:** Zod schemas for request/input constraints.
- **Data layer:** Prisma ORM with PostgreSQL, migrations, seed scripts, and a repository layer under `lib/repositories/*`.
- **Background processing:** cron-driven status transitions for scheduled work.

## CI Pipeline

- Workflow name: `Production Scheduler CI`
- Location: `.github/workflows/ci.yml`
- Runs on push/PR to `main`:
  - Install
  - Prisma client generation
  - Type check
  - Lint
  - Unit tests (`npm run test:unit`)
  - E2E tests (`npm run test:e2e`)
  - Build

## Known Issues / Limitations

- No authentication/authorization yet; all flows assume a trusted user.
- Current e2e coverage is smoke-level and can be expanded for full multi-step workflows.
- Scheduling/status logic is functional but can be further hardened for timezone edge cases and concurrency.
- Some UX polish opportunities remain (form feedback consistency, loading/error states across all screens).
- Error boundaries and observability/monitoring are minimal in current scope.

## Bonus Features

- CSV-based Prisma seed workflow (`npm run db:seed`).
- Background cron process launched with dev server for automated status handling.
- Data visualization widgets (calendar + chart) to improve operational visibility.

## Portfolio Notes

- This project highlights practical full-stack ownership: database setup, API contracts, UI workflows, validation, and diagnostics.
- It is designed to be understandable quickly by reviewers while still showing technical depth.

## Next Steps

- Add authentication (Auth.js/NextAuth + Prisma adapter).
- Introduce role-based access (admin/operator/view-only).
- Expand tests to include API route integration and critical user flows.
