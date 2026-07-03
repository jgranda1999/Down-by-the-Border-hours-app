# Down By The Border — Volunteer Hours Tracker

Web app for **[Down By The Border](https://downbytheborder.org)** (Rio Grande Valley nonprofit) so high school volunteers can log service hours and staff can review logs, export data, and generate PDF verification letters for schools.

**Live app:** deployed on Vercel (production URL from your Vercel project).

---

## What it does

### Volunteers (students)

- Sign up with email and password
- Complete profile (phone, school; parent info optional on profile page)
- Log hours per event (date, sign-in/out, auto-calculated hours)
- View total hours and full history
- Edit or delete logs within **24 hours** of submission
- Update profile anytime

### Admins (nonprofit staff)

- Dashboard: volunteer count, hours this month, recent activity
- **All logs:** filter by volunteer, school, date range, event; edit/delete any log
- **Volunteers:** search and view full history per student
- **Service-hour letters:** PDF download per volunteer (optional date range)
- **CSV export** from filtered logs
- **Manage admins:** promote volunteers to admin or remove admin access

Hours are **auto-approved** — no separate approval step.

---

## Repository layout

```
dbtb-dev/
├── down-by-the-border-hours-app/   # React + Vite frontend (what Vercel builds)
├── supabase/
│   ├── schema.sql                  # Initial database + RLS (run once)
│   └── patches/                    # Optional SQL patches (run if needed)
├── docs/
│   └── ADMIN_LOCKOUT.md            # Recover admin access via SQL
├── PROJECT_CONTEXT.md              # Product spec and decisions
├── BUILD_PLAN.md                   # Build checklist (phases 0–8)
└── vercel.json                     # Vercel build config
```

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Supabase (Postgres, Auth, Row Level Security) |
| Forms | React Hook Form + Zod |
| PDF letters | `@react-pdf/renderer` (client-side, lazy-loaded) |
| Hosting | Vercel |

---

## Local development

### Prerequisites

- Node.js 20+
- A Supabase project with `schema.sql` applied

### Setup

```bash
cd down-by-the-border-hours-app
npm install
```

Create `down-by-the-border-hours-app/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get both values from **Supabase → Project Settings → API**.

### Run

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Build

```bash
npm run build
npm run preview   # optional: test production build locally
```

---

## Deployment (Vercel)

The repo root is `dbtb-dev/`. `vercel.json` builds the app subdirectory:

- **Install:** `cd down-by-the-border-hours-app && npm install`
- **Build:** `cd down-by-the-border-hours-app && npm run build`
- **Output:** `down-by-the-border-hours-app/dist`

**Required environment variables** (Production):

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |

Set these in **Vercel → Project → Settings → Environment Variables**. Redeploy after changes.

SPA routing is handled via `vercel.json` rewrites to `index.html`.

---

## Supabase setup

### New project

1. Create a Supabase project.
2. Run **`supabase/schema.sql`** in the SQL Editor (full script, once).
3. Create the first admin: sign up in the app, then follow **[docs/ADMIN_LOCKOUT.md](./docs/ADMIN_LOCKOUT.md)** to set `role = 'admin'`.

### Patches (run if not already applied)

| File | Purpose |
|------|---------|
| `supabase/patches/001_volunteer_delete_logs.sql` | Lets volunteers delete their own logs within 24h |
| `supabase/patches/002_profiles_title.sql` | Adds optional `title` on admin profiles (PDF signature line) |

Check in **Table Editor** or run the patch; `002` uses `add column if not exists` and is safe to re-run.

### Auth (MVP)

- Open signup; email confirmation disabled in Supabase for MVP
- Password reset uses Supabase’s default email (rate limits apply)
- Custom SMTP can be added later if volume grows

---

## Admin access

**Normal:** an existing admin uses **Manage admins** in the app.

**Lockout / first admin:** see **[docs/ADMIN_LOCKOUT.md](./docs/ADMIN_LOCKOUT.md)**.

---

## Documentation

| Doc | Contents |
|-----|----------|
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | User stories, product rules, data model |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | Phase-by-phase build history |
| [docs/STUDENT_GUIDE.md](./docs/STUDENT_GUIDE.md) | Students: signup, log hours, profile |
| [docs/STAFF_GUIDE.md](./docs/STAFF_GUIDE.md) | Nonprofit staff: dashboards, letters, CSV, admins |
| [docs/ADMIN_LOCKOUT.md](./docs/ADMIN_LOCKOUT.md) | SQL promote/demote admin |
| [down-by-the-border-hours-app/README.md](./down-by-the-border-hours-app/README.md) | App package quick reference |

---

## Handoff checklist (production)

- [x] Vercel env vars set
- [x] End-to-end flow tested on production
- [x] Admin credentials shared with nonprofit staff
- [x] Lockout recovery doc available (`docs/ADMIN_LOCKOUT.md`)

---

## License / ownership

Application built for Down By The Border. Contact the nonprofit for access and support questions.
