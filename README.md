# Patient Platform - Real-time Registration & Staff Monitoring

A real-time patient registration and staff monitoring system built with Next.js, TailwindCSS, Pusher, and PostgreSQL via Prisma.

## Features

- **Patient Form** — Responsive form with extensive validation (react-hook-form + Zod). Includes all required and optional fields.
- **Staff Dashboard** — Live view of all patient sessions with real-time status indicators (Submitted, Actively Filling, Inactive).
- **Live Details View** — Click on any patient row to view every single form field in real-time as it updates.
- **Real-time Sync** — Pusher WebSockets broadcast every keystroke seamlessly.
- **Responsive Design** — Fully tailored for mobile, tablet, and desktop viewing.

## Development Planning Documentation

### 1. Project Structure

The project leverages the Next.js App Router for server-rendered and statically generated routes.

- `app/`: Contains the main application routes (`/patient`, `/staff`, etc).
- `components/`: Modular, reusable UI components.
  - `patient/`: Patient-specific components like the `PatientForm`.
  - `staff/`: Staff-specific components like the `StaffView` and real-time live feed.
  - `ui/`: Core shadcn/ui components (buttons, inputs, sheets, tables).
- `lib/`: Utility functions, Prisma database configuration, Zod validation schemas, and Pusher configurations.

### 2. Design Decisions

- **UI/UX Strategy**: Focused on a clean, modern aesthetic using a bespoke color palette (teal primary accents, slate/gray base).
- **Responsiveness**: Used TailwindCSS utility classes (`sm:`, `md:`, `lg:`) heavily. The Staff Dashboard transitions from a stacked list view to a multi-column table/feed view. The Patient Form scales input fields from 1 column on mobile to 2 columns on larger screens.
- **Micro-interactions**: Added hover states, slide-in sheets for mobile navigation and detail viewing, to ensure the UI feels responsive and alive.

### 3. Component Architecture

- `PatientForm.tsx`: Uses `react-hook-form` coupled with `@hookform/resolvers/zod` for robust client-side validation. Listens to field changes and debounces payload dispatches to the server.
- `StaffView.tsx`: Acts as the central hub for monitoring. Maintains a `Map` of session IDs to patient data. Subscribes to Pusher events and updates the state instantaneously.
- `Navbar.tsx`: Implements responsive navigation with a collapsible menu for mobile using the `Sheet` component.

### 4. Real-Time Synchronization Flow

1. **Client Input**: As the patient types into the `PatientForm`, the `watch` function from `react-hook-form` captures the current form state.
2. **Debounced Sync**: An API request is sent to the backend `/api/sync` route via a debounced function (to prevent overwhelming the server with every single keystroke).
3. **Database Update**: Prisma updates the corresponding `patientSession` record in PostgreSQL with the latest `data` payload and sets `lastActivity`.
4. **WebSocket Broadcast**: The backend utilizes the Pusher Server SDK to trigger a `PATIENT_EVENT` to the `PATIENT_CHANNEL` containing the updated session object.
5. **Staff View Update**: The `StaffView` component, mounted on the staff dashboard, listens for this event via the Pusher Client SDK. When received, it updates the local state Map, instantaneously re-rendering the tables, live feed, and detailed `Sheet` views.

## Setup Instructions

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL Database

The project uses Docker to run a local PostgreSQL database. Make sure you have Docker installed and running, then start the container:

```bash
docker compose up -d
```

### 3. Run migrations

Once the database is running, push the Prisma schema to the database:

```bash
pnpm db:push
```

### 4. Run development server

```bash
pnpm dev
```

## Environment Variables

Create a `.env.local` file in the project root and add the following:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/patientdb"

# Pusher
PUSHER_APP_ID=""
PUSHER_SECRET=""
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER=""
```
