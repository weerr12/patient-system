# Patient Form System

A responsive, real-time patient registration form and staff monitoring dashboard built with **Next.js**, **TailwindCSS**, **Pusher**, and **PostgreSQL (Prisma)**.

> **Live Demo:** [patient-system-seven.vercel.app](https://patient-system-seven.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Development Server](#running-the-development-server)
- [Available Scripts](#available-scripts)
- [Development Planning Documentation](#development-planning-documentation)
  - [Design Decisions (UI/UX)](#1-design-decisions-uiux)
  - [Component Architecture](#2-component-architecture)
  - [Real-Time Synchronization Flow](#3-real-time-synchronization-flow)
- [Deployment](#deployment)
- [Bonus Features](#bonus-features)

---

## Overview

The system consists of two main interfaces:

1. **Patient Form** (`/patient`) — A responsive form where patients can enter their personal details. The form captures data in real-time and synchronizes it to the staff dashboard as the patient types.
2. **Staff Monitoring Dashboard** (`/staff`) — A real-time interface for staff members to monitor all incoming patient registrations, view live status indicators, and inspect detailed patient data.

Both interfaces synchronize in real-time via **Pusher WebSockets**, reflecting patient input immediately on the staff view without page refreshes.

---

## Features

| Feature | Description |
|---------|-------------|
| **Patient Registration Form** | Comprehensive form with 13 fields including personal details, contact information, and emergency contacts |
| **Form Validation** | Client-side validation with `react-hook-form` + `Zod` (required fields, email format, phone regex) |
| **Staff Monitoring Dashboard** | Live table of all patient sessions with status badges and last-update timestamps |
| **Real-Time Sync** | Pusher WebSockets broadcast every form change with 400ms debounce |
| **Status Indicators** | Three distinct statuses — **Submitted** (green), **Actively Filling** (teal), **Inactive** (gray) |
| **Live Activity Feed** | Timeline feed showing the most recent patient activities |
| **Patient Detail Sheet** | Slide-in side panel displaying all 13 fields for a selected patient, updating in real-time |
| **Idle Detection** | Automatically sets a patient's status to "Inactive" after 60 seconds of no interaction |
| **Responsive Design** | Fully responsive across mobile, tablet, and desktop viewports |
| **Toast Notifications** | Success/error feedback on form submission via Sonner |

---

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server-rendered React framework |
| **Language** | TypeScript | Type-safe development |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Accessible, composable UI primitives |
| **Form Management** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Performant form handling with schema validation |
| **Real-Time** | [Pusher](https://pusher.com/) (WebSocket) | Bi-directional real-time communication |
| **Database** | [PostgreSQL 17](https://www.postgresql.org/) | Relational database |
| **ORM** | [Prisma 7](https://www.prisma.io/) | Type-safe database client |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern icon library |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) | Toast notification system |
| **HTTP Client** | [Axios](https://axios-http.com/) | API requests from client to server |
| **Fonts** | Poppins, IBM Plex Sans Thai, Geist (Google Fonts) | Custom typography |
| **Hosting** | [Vercel](https://vercel.com/) | Serverless deployment platform |
| **Containerization** | [Docker](https://www.docker.com/) | Local PostgreSQL database container |

---

## Project Structure

```
frontend-patient-nextjs-platform-dev/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (fonts, metadata, Toaster)
│   ├── page.tsx                      # Landing page ("I am a Patient" / "I am Staff")
│   ├── globals.css                   # Tailwind config, custom colors, typography utilities
│   ├── staff/
│   │   └── page.tsx                  # Staff Dashboard (server component, fetches initial data)
│   └── api/
│       └── patients/
│           ├── route.ts              # POST: upsert session + Pusher trigger | GET: fetch all sessions
│           └── typing/
│               └── route.ts          # Typing indicator endpoint
│
├── components/
│   ├── Navbar.tsx                    # Responsive navbar with mobile Sheet menu
│   ├── patient/
│   │   └── PatientForm.tsx           # Patient registration form (react-hook-form + Zod)
│   ├── staff/
│   │   └── StaffView.tsx             # Staff dashboard (table, live feed, detail sheet)
│   └── ui/                           # shadcn/ui components
│       ├── button.tsx
│       ├── dropdown-menu.tsx
│       ├── field.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── navigation-menu.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sonner.tsx
│       └── table.tsx
│
├── lib/
│   ├── prisma.ts                     # Prisma client singleton
│   ├── pusher.ts                     # Pusher server + client instances, channel/event constants
│   ├── type.ts                       # TypeScript types, form defaults, dropdown options
│   ├── utils.ts                      # Utility functions (cn, generateSessionId)
│   └── validations/
│       └── patient.ts                # Zod validation schema for patient form
│
├── prisma/
│   └── schema.prisma                 # Database schema (PatientSession model)
│
├── docker-compose.yml                # PostgreSQL container for local development
├── .env.example                      # Environment variable template
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration (Tailwind)
└── components.json                   # shadcn/ui configuration
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** ≥ 18.x
- **pnpm** (recommended) or npm/yarn
- **Docker** (for local PostgreSQL database)
- A **Pusher** account ([pusher.com](https://pusher.com/)) — free tier is sufficient

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/weerr12/patient-system.git
   cd patient-system
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

   > This will also automatically run `prisma generate` via the `postinstall` script.

### Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:

```env
# Application
PORT=3000

# PostgreSQL Database
POSTGRES_PASSWORD=your_password
POSTGRES_USER=your_username
POSTGRES_DB=patientdb
POSTGRES_PORT=5432
POSTGRES_HOST=localhost

# Prisma Database URL
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/patientdb"

# Pusher (get these from your Pusher dashboard)
PUSHER_APP_ID="your_pusher_app_id"
PUSHER_SECRET="your_pusher_secret"
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="ap1"
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. The Pusher key and cluster are safe to expose; the secret is server-only.

### Database Setup

1. **Start the PostgreSQL container**

   ```bash
   pnpm db:up
   ```

   This runs `docker-compose up -d`, starting a PostgreSQL 17 Alpine container on port 5432.

2. **Push the Prisma schema to the database**

   ```bash
   npx prisma db push
   ```

   This creates the `PatientSession` table in your database.

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You will see the landing page with two options:

- **"I am a Patient"** → navigates to `/patient` (the registration form)
- **"I am Staff"** → navigates to `/staff` (the monitoring dashboard)

> **Tip:** Open both pages in separate browser tabs/windows to see real-time synchronization in action.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `pnpm dev` | Start Next.js development server |
| `build` | `pnpm build` | Build for production |
| `start` | `pnpm start` | Start production server |
| `lint` | `pnpm lint` | Run ESLint |
| `db:up` | `pnpm db:up` | Start PostgreSQL Docker container |
| `db:down` | `pnpm db:down` | Stop PostgreSQL Docker container |
| `db:restart` | `pnpm db:restart` | Restart PostgreSQL container |
| `db:logs` | `pnpm db:logs` | View PostgreSQL container logs |
| `db:migrate` | `pnpm db:migrate` | Run Prisma migrations |
| `db:generate` | `pnpm db:generate` | Regenerate Prisma client |
| `db:studio` | `pnpm db:studio` | Open Prisma Studio (database GUI) |
| `db:reset` | `pnpm db:reset` | Reset database and re-run migrations |

---

## Development Planning Documentation

### 1. Design Decisions (UI/UX)

#### Color System

The project uses a custom OKLCH-based color palette defined in `globals.css`:

| Token | Purpose | Example Usage |
|-------|---------|---------------|
| `ci-primary` | Primary brand color (deep blue) | Submit button, active nav links |
| `ci-secondary` | Light accent (soft blue) | Avatar backgrounds |
| `ci-tertiary` | Teal accent | "Actively Filling" status |
| `ci-neutral` | Muted blue | Hover states |
| `basic-gray-10` to `basic-gray-90` | Grayscale palette | Backgrounds, borders, text hierarchy |
| `basic-base-black` / `basic-base-white` | Base contrast colors | Primary text, card backgrounds |

#### Typography

A custom utility system (`hl-{size}px-{weight}`) provides consistent typography across the application:

- **Font stack:** Poppins (Latin) + IBM Plex Sans Thai (Thai) + Geist (fallback)
- **Usage pattern:** `hl-14px-500` = 14px font-size, 500 weight
- **Sizes available:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 32px, 40px, 48px, 80px, 120px
- **Weights available:** 400, 500, 600, 700

#### Responsive Breakpoints

The design adapts to three main breakpoints using Tailwind's responsive utilities:

| Breakpoint | Layout | Example |
|------------|--------|---------|
| **Mobile** (< 640px) | Single column, stacked elements, Sheet-based navigation | Form fields stack vertically; Staff table is scrollable |
| **Tablet** (640px – 1024px) | Two-column form layout, expanded table view | Field pairs side-by-side; Navbar shows full links |
| **Desktop** (> 1024px) | Three-column staff dashboard (table + live feed sidebar) | Full dashboard layout with side panel |

#### Micro-Interactions

- **Hover effects** on table rows, buttons, and navigation links
- **Slide-in Sheet** panels for mobile menu and patient detail view
- **Status badge animations** with colored dots for active/inactive states
- **Smooth transitions** (`transition-colors duration-150`) throughout the UI
- **Toast notifications** for form submission feedback

---

### 2. Component Architecture

#### `PatientForm.tsx` — Patient Registration

| Aspect | Detail |
|--------|--------|
| **Form library** | `react-hook-form` with `zodResolver` for validation |
| **Validation schema** | Zod schema in `lib/validations/patient.ts` |
| **Mode** | `onChange` — validates and syncs on every change |
| **Fields** | 13 fields organized in 4 sections: Personal Details, Contact Information, Additional Details, Emergency Contact |
| **Sync mechanism** | `watch()` subscription → 400ms debounced `POST /api/patients` |
| **Idle tracking** | 60-second inactivity timer sends `idle` status |
| **Session management** | Unique session ID generated and stored in `sessionStorage` |

**Form Fields and Validation Rules:**

| Field | Type | Validation |
|-------|------|------------|
| First Name | `Input` | Required, `min(1)` |
| Middle Name | `Input` | Optional |
| Last Name | `Input` | Required, `min(1)` |
| Date of Birth | `input[type="date"]` | Required, `min(1)` |
| Gender | `Select` (shadcn) | Required, `min(1)` |
| Phone Number | `Input[type="tel"]` | Required, regex `/^\+?[\d\s\-().]{7,20}$/` |
| Email | `Input[type="email"]` | Required, `z.email()` |
| Address | `textarea` | Required, `min(1)` |
| Preferred Language | `Select` (shadcn) | Required, `min(1)` |
| Nationality | `Input` | Required, `min(1)` |
| Emergency Contact Name | `Input` | Optional |
| Emergency Contact Relationship | `Input` | Optional |
| Religion | `Input` | Optional |

#### `StaffView.tsx` — Staff Monitoring Dashboard

| Aspect | Detail |
|--------|--------|
| **Data source** | Server-fetched `initialSessions` (SSR) + real-time Pusher updates |
| **State management** | `Map<sessionId, PatientSession>` for O(1) lookups and updates |
| **Sections** | Patient table (sortable by `lastActivity`) + Live activity feed (latest 4) |
| **Detail view** | shadcn `Sheet` side panel with all 13 form fields |
| **Status badges** | Three variants: Submitted (green + checkmark), Filling (teal + dot), Inactive (gray + dot) |

#### `Navbar.tsx` — Navigation

| Aspect | Detail |
|--------|--------|
| **Desktop** | Horizontal link bar with "Staff Dashboard" and "Patient Registration" |
| **Mobile** | Hamburger menu → slide-in `Sheet` panel |
| **Style** | Sticky, backdrop-blur, border-bottom |

#### UI Components (shadcn/ui)

All UI primitives are installed via `shadcn` and located in `components/ui/`:

| Component | Usage |
|-----------|-------|
| `Button` | Submit button, navbar actions |
| `Input` | Text fields in patient form |
| `Select` | Dropdown fields (Gender, Language) |
| `Table` | Staff dashboard patient list |
| `Sheet` | Mobile nav menu, patient detail panel |
| `Sonner` | Toast notifications |

---

### 3. Real-Time Synchronization Flow

The system uses **Pusher** (WebSocket-based) for instant bi-directional communication between the patient form and staff dashboard.

```
┌──────────────────┐     POST /api/patients      ┌──────────────────┐
│                  │ ──────────────────────────▶  │                  │
│   Patient Form   │    (debounced 400ms)         │   Next.js API    │
│   (Client)       │                              │   Route Handler  │
│                  │                              │                  │
└──────────────────┘                              └────────┬─────────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │             │
                                                    │  PostgreSQL │
                                                    │  (Prisma    │
                                                    │   upsert)   │
                                                    │             │
                                                    └──────┬──────┘
                                                           │
                                                    ┌──────▼──────┐
                                                    │             │
                                                    │   Pusher    │
                                                    │   Server    │
                                                    │  (trigger)  │
                                                    │             │
                                                    └──────┬──────┘
                                                           │
                                                    WebSocket push
                                                           │
                                                    ┌──────▼──────────┐
                                                    │                 │
                                                    │  Staff Dashboard│
                                                    │  (Pusher Client)│
                                                    │  State update   │
                                                    │  → Re-render    │
                                                    │                 │
                                                    └─────────────────┘
```

**Step-by-step flow:**

1. **Patient types** → `react-hook-form`'s `watch()` detects changes
2. **Debounce (400ms)** → Prevents excessive API calls on every keystroke
3. **API Request** → `POST /api/patients` sends `{ sessionId, status, data }`
4. **Database Upsert** → Prisma upserts the `PatientSession` record in PostgreSQL
5. **Pusher Trigger** → Server triggers `form-update` event on `patient-updates` channel with the full session data
6. **Staff Receives** → `StaffView` listens via `getPusherClient()`, updates its `Map` state, and React re-renders the table, live feed, and detail sheet instantly

**Status Lifecycle:**

```
[Patient opens form] → idle
[Patient starts typing] → filling (synced on each change)
[Patient stops for 60s] → idle (automatic idle detection)
[Patient submits form] → submitted
```

---

## Deployment

The application is deployed on **Vercel** with the following configuration:

| Setting | Value |
|---------|-------|
| **Platform** | Vercel |
| **Framework** | Next.js (auto-detected) |
| **Build command** | `next build` (default) |
| **Install command** | `pnpm install` |
| **Node.js version** | 18.x |
| **Environment variables** | Set in Vercel dashboard (DATABASE_URL, Pusher keys) |

**Live URLs:**

- Production: [patient-system-seven.vercel.app](https://patient-system-seven.vercel.app)

> **Note:** For production deployment, the `DATABASE_URL` should point to a cloud-hosted PostgreSQL instance (e.g., Vercel Postgres, Supabase, Neon, or Railway) rather than a local Docker container.

---

## Bonus Features

Beyond the core requirements, the following enhancements were implemented:

| Feature | Description |
|---------|-------------|
| **Idle Detection** | Automatically transitions patient status to "Inactive" after 60 seconds of no keyboard/mouse activity |
| **Debounced Sync** | 400ms debounce prevents excessive API calls while maintaining near-instant updates |
| **Session Persistence** | Session ID stored in `sessionStorage` so refreshing the page continues the same session |
| **Live Activity Feed** | Timeline-style feed on the staff dashboard showing the most recent 4 patient actions |
| **Slide-in Detail Panel** | Click any patient row to open a `Sheet` side panel with all 13 fields updating in real-time |
| **Custom Typography System** | `hl-{size}px-{weight}` utility classes for consistent, scalable typography |
| **Multi-Language Font Support** | Poppins (Latin) + IBM Plex Sans Thai (Thai) for bilingual support |
| **Docker Compose** | One-command local database setup with `pnpm db:up` |
| **Toast Notifications** | Success/error feedback on form submission via Sonner |
