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

Create/update `.env` with the database settings and session secret:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5433/<db>?schema=public"
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_DB=<db>
SESSION_SECRET=<strong-random-secret>
```

Generate a session secret with `openssl rand -base64 32`. Keep it private and use a different value outside local development.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/production_orders?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=production_orders
SESSION_SECRET=<paste-generated-secret-here>
```

The seed script has local fallback credentials. Set the following optional variables in `.env` before running `npm run db:seed` to override them; use unique, secure values and do not commit `.env`:

```env
JOHN_ADMIN_EMAIL=
JOHN_ADMIN_PASSWORD=
JANE_ADMIN_EMAIL=
JANE_ADMIN_PASSWORD=
CREATE_ASSIGN_ADMIN_ACCESS_KEY=
MICHAEL_ADMIN_EMAIL=
MICHAEL_ADMIN_PASSWORD=
ALL_ACCESS_ADMIN_ACCESS_KEY=
WILLIAM_ADMIN_EMAIL=
WILLIAM_ADMIN_PASSWORD=
EMILY_ADMIN_EMAIL=
EMILY_ADMIN_PASSWORD=
RESCHEDULE_TASK_ADMIN_ACCESS_KEY=
OLIVIA_ADMIN_EMAIL=
OLIVIA_ADMIN_PASSWORD=
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

### 5) Seed resources, users, and permissions

```bash
npm run db:seed
```

Run this after migrations on a fresh database. This single command runs `seed-resources-users-script.ts`, which seeds the resource data from `prisma/data/resources.csv`, permission records, the initial user accounts, and their permission assignments. The script reads optional account passwords and access keys from environment variables; configure those before seeding if you do not want to use the script's local defaults. Seed the database once rather than rerunning against existing records.

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
- Playwright e2e coverage for permission-based access, protected pages, and core scheduler flows in `tests/e2e/`.
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
- **Seed pipeline**: one command seeds CSV resources, user accounts, permissions, and user-permission assignments.

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

- Authentication and permission checks are implemented; password handling and session lifecycle can be further hardened.
- E2E coverage exercises permission boundaries and core workflows, with broader multi-step scheduling scenarios still possible.
- Scheduling/status logic is functional but can be further hardened for timezone edge cases and concurrency.
- Some UX polish opportunities remain (form feedback consistency, loading/error states across all screens).
- Error boundaries and observability/monitoring are minimal in current scope.

## Bonus Features

- Consolidated database seed script for resources, users, and permissions (`npm run db:seed`).
- Background cron process launched with dev server for automated status handling.
- Data visualization widgets (calendar + chart) to improve operational visibility.

## Portfolio Notes

- This project highlights practical full-stack ownership: database setup, API contracts, UI workflows, validation, and diagnostics.
- It is designed to be understandable quickly by reviewers while still showing technical depth.

## Next Steps

- Further harden password storage and session security.
- save hashed passwords to database instead of the password
- Expand end-to-end coverage for complete scheduling and status-transition workflows.
