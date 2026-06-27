# Down By The Border — Volunteer Hours Tracker

## What this is

A web application for **Down By The Border**, a nonprofit that organizes volunteer events for high school students in the Rio Grande Valley. The app replaces a Google Form-based hour tracking system with a proper account-based platform.

## Who uses it

- **Volunteers**: High school students who sign up, log their volunteer hours after events, view their history, and download verification letters for their schools.
- **Admins**: Nonprofit staff who oversee logs, generate per-school reports, and produce PDF service-hour letters for schools/counselors.

## Core user stories

### Volunteer
- As a volunteer, I can create an account with my email and a password (or magic link)
- As a volunteer, I complete my profile once (name, phone, school, parent contact) instead of re-entering on every form submission
- As a volunteer, I can log hours for an event (event name, date, sign-in time, sign-out time → hours auto-calculated)
- As a volunteer, I can see my total hours and full history
- As a volunteer, I can edit/delete a log I made within the last 24 hours (to fix mistakes)
- As a volunteer, I can update my profile info anytime

### Admin
- As an admin, I can see all logs across all volunteers, filter by school, date range, or event
- As an admin, I can edit or delete any log if needed
- As an admin, I can view any volunteer's profile and full history
- As an admin, I can generate a printable PDF service-hour letter for any volunteer (date range, total hours, itemized list)
- As an admin, I can export logs to CSV
- As an admin, I can promote another user to admin or demote them

## Key product decisions (DO NOT change without asking)

1. **Hours are auto-approved.** No approval workflow. Every submitted log counts immediately. The nonprofit trusts its volunteers.
2. **Free-text event names.** Volunteers type the event name. No predefined event list (for MVP).
3. **Free-text school field.** Common schools (Veterans High School, SJA, Porter, Hanna, Pace, Rivera, Jubilee, IDEA, Harmony, UTRGV) should be suggested via autocomplete/datalist, but anything is allowed.
4. **24-hour edit window.** Volunteers can fix recent mistakes, but past logs are locked (admins can still edit).
5. **`sign_out_time` is nullable.** This supports a future QR-code check-in feature where volunteers check in (creating a row with only `sign_in_time`) and add duration later.
6. **Open signup.** Anyone with an email can sign up. No domain restrictions.
7. **Admins are promoted by other admins** through the UI. The first admin is set manually via SQL.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Backend | Supabase (Postgres + Auth + Row-Level Security) |
| Routing | React Router v6 |
| PDF | `@react-pdf/renderer` (client-side generation) |
| CSV | Plain JS — no library needed |
| Hosting | Vercel |
| Forms | React Hook Form + Zod for validation |
| UI primitives | shadcn/ui patterns (composable, accessible) |

## Project structure

```
/src
  /lib
    supabase.ts          - Supabase client (singleton)
    /api                 - Typed query functions, one file per resource
      profiles.ts
      hourLogs.ts
    /utils               - Pure helpers (date formatting, hour calc, CSV)
  /types
    database.ts          - Generated from Supabase schema
    index.ts             - Shared app types
  /hooks
    useAuth.ts           - Current user + session
    useProfile.ts        - Current user's profile
    useIsAdmin.ts        - Role check
  /components
    /ui                  - Generic primitives (Button, Input, Card, etc.)
    /layout              - Header, Sidebar, ProtectedRoute, AdminRoute
    /forms               - Reusable form fields
  /pages
    /auth                - Login, Signup, ProfileSetup
    /volunteer           - Dashboard, LogHours, MyHours, Profile
    /admin               - Dashboard, AllLogs, Volunteers, VolunteerDetail, Reports, ManageAdmins
  /pdf
    ServiceHourLetter.tsx
  App.tsx                - Router
  main.tsx               - Entry
```

## Data model (already in Supabase)

### profiles
- `id` (uuid, PK, FK to auth.users)
- `first_name`, `last_name` (text, required)
- `email` (text, required)
- `phone` (text, nullable)
- `school` (text, nullable)
- `parent_name`, `parent_phone`, `parent_email` (text, nullable)
- `role` ('volunteer' | 'admin', default 'volunteer')
- `created_at`, `updated_at` (timestamptz)

### hour_logs
- `id` (uuid, PK)
- `volunteer_id` (uuid, FK to profiles)
- `event_name` (text, required)
- `event_date` (date, required)
- `sign_in_time` (timestamptz, required)
- `sign_out_time` (timestamptz, nullable — future QR flow)
- `hours` (numeric, required, > 0 and <= 24)
- `notes` (text, nullable)
- `created_at`, `updated_at` (timestamptz)

### RLS rules (enforced in DB, do not re-implement in code)
- Volunteers see/edit only their own data
- Admins see/edit everything
- Volunteer edits to `hour_logs` only allowed within 24 hours of creation
- Profile `role` cannot be self-modified — only by admins

## Hour calculation

When `sign_out_time` is provided, hours = `(sign_out_time - sign_in_time) / 3600`, rounded to 2 decimal places. When `sign_out_time` is null (future QR flow), the volunteer types `hours` directly.

For the MVP, **always require both sign-in and sign-out times** in the form. The nullable column just leaves room for the future flow.

## Out of scope for MVP

- QR-code check-in (foundation laid; not built)
- Email notifications
- Event management (admin-defined event list)
- Photo uploads / waivers
- Mobile native apps (web is mobile-responsive)
- Bulk import of historical data (none exists)
- Multi-org / multi-nonprofit support

## Tone & UX principles

- Volunteers are high schoolers — keep copy clear and friendly, not corporate
- Mobile-first; many volunteers will log hours on their phone
- Loading states and empty states are required, not optional
- Errors are surfaced as user-friendly toasts, never raw error objects
- Forms validate inline as the user types, not just on submit
