# Build Plan

A staged checklist for building the MVP. Work top-to-bottom. Each phase should produce something runnable.

## Phase 0 — Backend (already done if you've run schema.sql)

- [x] Supabase project created
- [x] `supabase/schema.sql` applied
- [x] Test user created via Supabase Auth dashboard
- [x] Verified profile auto-creation trigger works
- [x] First admin promoted via SQL

## Phase 1 — Project setup (~30 min)

- [x] `npm create vite@latest dbtb -- --template react-ts`
- [x] Install deps: `@supabase/supabase-js react-router-dom react-hook-form zod @hookform/resolvers @react-pdf/renderer`
- [x] Install dev deps: `tailwindcss postcss autoprefixer`
- [x] Set up Tailwind (`npx tailwindcss init -p`, configure `tailwind.config.js`, add directives to `index.css`)
- [x] Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [x] Generate types: `npx supabase gen types typescript --project-id YOUR_ID > src/types/database.ts` *(hand-written from schema; re-run CLI after `supabase login` to refresh)*
- [x] Create `src/lib/supabase.ts`
- [X] Push to GitHub
- [X] Connect to Vercel, verify deploy works

## Phase 2 — Auth (~2 hrs)

- [x] `useAuth` hook (session, loading, signIn, signUp, signOut)
- [x] `useProfile` hook (current user's profile row)
- [x] `useIsAdmin` hook
- [x] `<ProtectedRoute>` component (redirects to login if not authed)
- [x] `<AdminRoute>` component (redirects to dashboard if not admin)
- [x] Login page
- [x] Signup page (email, password, first name, last name)
- [x] Profile setup page (shown if profile missing required fields — phone, school, parent info)
- [x] Logout button in header

## Phase 3 — Volunteer flows (~3 hrs)

- [x] Volunteer dashboard: total hours, recent 5 logs, "Log Hours" CTA
- [x] Log Hours form (event name, date, sign-in time, sign-out time, notes)
  - Auto-calculate hours from sign-in/out
  - Validate sign-out > sign-in
- [x] My Hours page: full history, sortable by date
- [x] Edit log (only within 24 hours of creation)
- [x] Delete log (only within 24 hours — UI-gated; RLS would block anyway)
- [x] Shared `/profile` page: edit own info (volunteers + admins)

## Phase 4 — Admin flows (~3 hrs)

- [x] Admin dashboard: total volunteers, total hours this month, recent activity
- [x] All Logs page: table with filters (volunteer, school, date range, event search)
- [x] Edit / delete any log
- [x] Volunteers list: searchable, filter by school
- [x] Volunteer detail page: their profile + full hour history + "Generate Letter" button
- [x] Manage Admins: list of all users with role toggle

## Phase 5 — Reports (~2 hrs)

- [X] CSV export from All Logs (respects current filters)
- [X] PDF service-hour letter component (`@react-pdf/renderer`)
  - Header with nonprofit name + logo
  - "To Whom It May Concern"
  - Student name, school, date range
  - Table of approved hours
  - Total
  - Admin signature line
- [X] "Download Letter" from volunteer detail page

## Phase 6 — Auto Sign-up change 
- [X] Open signup, no email confirmation required for MVP. Password reset uses Supabase default email (2/hour cap) — acceptable at this scale. Can add custom SMTP later if needed.

## Phase 7 — Polish (~2 hrs)

- [X] Loading skeletons (not just spinners) on tables and dashboards
- [X] Empty states with helpful copy
- [X] Toast notifications for success/error (use `sonner` or roll your own)
- [X] Mobile responsiveness pass (test at 375px)
- [X] Form validation messages user-friendly
- [X] Error boundary at app root
- [X] Favicon + page title
- [X] Add Nonprofit logos and more customization to the design 

## Phase 8 — Ship

- [x] Production env vars in Vercel
- [x] Test full flow: signup → log hours → admin sees it → admin downloads letter
- [x] Hand off admin credentials to nonprofit
- [x] Document how to add an admin manually (in case of lockout) — see `docs/ADMIN_LOCKOUT.md`
