# Admin lockout recovery

Use this guide if **no one can sign in as an admin** — for example, the only admin left the organization, was demoted by mistake, or passwords were lost.

The app stores roles in Supabase. You can promote any existing user to admin with SQL.

## Before you start

You need access to the **Supabase dashboard** for this project (project owner or someone with SQL Editor access).

The person you promote must **already have an account** in the app (they signed up at least once). If they have not signed up yet, ask them to create an account first, then run the SQL below.

## Promote a user to admin

1. Open [Supabase](https://supabase.com/dashboard) and select the **Down By The Border** project.
2. Go to **SQL Editor** → **New query**.
3. Run (replace the email with the staff member’s login email):

```sql
update public.profiles
set role = 'admin'
where email = 'staff-member@example.com';
```

4. Confirm one row was updated (Supabase shows “Success” and `1 row` affected).
5. That user signs out and signs back in (or opens the app in a fresh tab). They should land on the **Admin dashboard** and see admin navigation.

## Verify it worked

In Supabase **Table Editor** → `profiles`, find the user’s row and check `role` is `admin`.

Or sign in as that user and confirm you see:

- Dashboard, All logs, Volunteers, Manage admins (not the volunteer “Log hours” flow)

## First admin on a new project

If this is a **brand-new** database and no admin exists yet, the same SQL applies after the user signs up once:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

The signup trigger creates their `profiles` row automatically; you only change `role`.

## Promote via the app (normal path)

When at least one admin can still sign in:

1. Go to **Manage admins**.
2. Search for the volunteer by name or email.
3. Click **Make admin**.

You cannot change your own role on that page (prevents locking yourself out by accident).

## Demote an admin

**In the app:** Manage admins → **Remove admin** next to the user (not yourself).

**In SQL** (emergency or no UI access):

```sql
update public.profiles
set role = 'volunteer'
where email = 'former-admin@example.com';
```

## Common issues

| Problem | What to do |
|--------|------------|
| `0 rows` updated | Email typo, or user never signed up. Check `profiles` in Table Editor for their exact email. |
| Still see volunteer UI after SQL | Sign out completely, then sign in again. |
| “Profile could not be saved” / title errors | Run `supabase/patches/002_profiles_title.sql` in SQL Editor. |
| No Supabase access | Contact whoever owns the Supabase project or Vercel deployment. |

## Security notes

- Only share Supabase dashboard access with trusted staff.
- Prefer promoting admins through the app when possible; reserve SQL for lockouts.
- Do not commit service role keys or passwords to git.
