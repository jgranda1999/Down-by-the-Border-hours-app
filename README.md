# Down By The Border — Cursor Harness

Drop these files into the root of your Cursor project. They give Cursor full context about what you're building so its suggestions are accurate and consistent.

## What's in here

```
.cursor/rules/
  project.mdc           - Always-on rules (stack, conventions)
  supabase-api.mdc      - Auto-applies in src/lib/api/**
  ui-components.mdc     - Auto-applies in src/components/** and src/pages/**

PROJECT_CONTEXT.md      - Product spec, user stories, decisions
BUILD_PLAN.md           - Phase-by-phase checklist
supabase/schema.sql     - Database schema (already run in Supabase)
README.md               - This file
```

## How to use

1. Copy these files into your new Cursor project root
2. Open Cursor — it auto-loads everything in `.cursor/rules/`
3. When prompting, you can reference files explicitly: `@PROJECT_CONTEXT.md` or `@BUILD_PLAN.md`
4. Work through `BUILD_PLAN.md` phase by phase

## Prompting tips

**Good prompt:**
> Build Phase 2 step 1: the `useAuth` hook. It should expose `session`, `user`, `isLoading`, `signIn`, `signUp`, and `signOut`. Use the Supabase client from `src/lib/supabase.ts`. Follow the conventions in `@supabase-api.mdc`.

**Bad prompt:**
> make auth

**Good prompt:**
> Build the Log Hours form per Phase 3. Use React Hook Form + Zod as specified in `@ui-components.mdc`. The form fields are event_name, event_date, sign_in_time, sign_out_time, notes. Auto-calculate hours from sign-in/out. Submit via a new `createHourLog` function in `src/lib/api/hourLogs.ts`.

**Bad prompt:**
> build the form

## When to update the harness

If the product changes (new feature, new constraint, new decision), update `PROJECT_CONTEXT.md` immediately. Cursor reads these on every interaction — keeping them current keeps Cursor accurate.
