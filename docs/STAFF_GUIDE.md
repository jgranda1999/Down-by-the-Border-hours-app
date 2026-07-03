# Staff quick start guide

A short guide for **Down By The Border** staff using the volunteer hours app as an **admin**. Share this with anyone who needs to review hours, download letters for schools, or help students get set up.

For technical lockout recovery (lost admin access), see [ADMIN_LOCKOUT.md](./ADMIN_LOCKOUT.md).

Students: see [STUDENT_GUIDE.md](./STUDENT_GUIDE.md).

---

## Signing in

1. Open the app URL (from your team lead or Vercel deployment).
2. Click **Sign in** and enter your email and password.
3. After sign-in you should see the **Admin dashboard** and a top menu: Dashboard, All logs, Volunteers, Manage admins, Profile.

If you see the student view (Log hours, My hours) instead, your account is still a volunteer — ask another admin to promote you under **Manage admins**, or see [ADMIN_LOCKOUT.md](./ADMIN_LOCKOUT.md).

**Tip:** Use **Profile** to add your **title** (e.g. “Volunteer Coordinator”). It appears on PDF service-hour letters you generate.

---

## Dashboard

The home screen shows:

- **Total volunteers** — students with accounts
- **Hours this month** — all logged hours in the current calendar month
- **Recent activity** — latest hour entries across everyone

Use **View all logs** to dig deeper or filter.

---

## All logs

Use this page to see and manage **every** hour entry.

### Filters

- **Volunteer** — one student or everyone
- **School** — partial name match
- **Event search** — search event names
- **From / To date** — date range on the event date

Click **Apply filters** after changing filters.

### Actions

- **Edit** — fix a student’s entry (wrong time, event name, etc.)
- **Delete** — remove a bad entry (you’ll be asked to confirm)
- **Export CSV** — download a spreadsheet of the **currently filtered** list (open in Excel or Google Sheets)

CSV columns include date, volunteer name, school, event, times, hours, and notes.

---

## Volunteers

1. Open **Volunteers** in the top menu.
2. Search by **name or email**, optionally filter by **school**.
3. Click **Apply filters**.
4. Click **View** on a student to open their profile and full hour history.

---

## Service-hour letters (PDF)

Schools and counselors often need a signed letter listing a student’s volunteer hours.

1. Go to **Volunteers** and open the student’s page (**View**).
2. Scroll to **Service-hour letter**.
3. Optionally set **From date** and **To date** (leave blank to include **all** their logged hours).
4. Click **Download letter**.

The PDF includes:

- Down By The Border header and logo  
- Student name and school  
- Date range and itemized events  
- Total hours  
- Your name and title (from **Profile**) as the signature line  

Give the PDF to the student or send it directly to their school.

---

## Manage admins

Add or remove staff who can use the admin tools.

### Current admins (top of page)

Lists everyone with admin access. **Remove admin** demotes them to a regular volunteer account. You **cannot** change your own role on this page.

### Promote a volunteer (bottom of page)

1. Search by the person’s **name or email**.
2. Click **Search**.
3. Click **Make admin** next to their name.

They must **sign up first** as a volunteer before you can promote them. After promotion, they should sign out and sign back in to see the admin menu.

---

## Helping students (volunteers)

Students use a simpler menu: **Dashboard**, **Log hours**, **My hours**, **Profile**.

### Getting started

1. **Create account** — email, password, first and last name.
2. **Complete profile** — phone and school (required). Parent/guardian info can be added later under **Profile**.
3. **Log hours** after each event — event name, date, sign-in and sign-out times (hours calculate automatically).

### Rules students should know

- They can **edit or delete** a log only for **24 hours** after submitting it.
- After 24 hours, only **staff** can fix entries (via **All logs** or **Volunteers** → **View**).
- Hours count immediately — there is no separate “approval” step.

---

## Profile

Under **Profile**, staff can update:

- Name, phone, school  
- **Title** (optional) — used on PDF letters  

Email cannot be changed in the app; contact your technical contact if a login email must change.

---

## Password reset

On the sign-in page, use **Forgot password** (if enabled in Supabase) or ask your technical contact to send a reset from the Supabase dashboard.

---

## Quick reference

| I want to… | Go to… |
|------------|--------|
| See what’s new | **Dashboard** |
| Fix or delete any log | **All logs** → Edit / Delete |
| Export data for records | **All logs** → filter → **Export CSV** |
| Look up one student | **Volunteers** → search → **View** |
| Letter for a school | **Volunteers** → **View** → **Download letter** |
| Add another staff admin | **Manage admins** → search → **Make admin** |
| Update my title for letters | **Profile** |

---

## Need help?

- **App or login issues** — contact whoever manages the Vercel/Supabase project for your organization.
- **No admin can sign in** — [ADMIN_LOCKOUT.md](./ADMIN_LOCKOUT.md).
- **Student can’t find their hours** — confirm they’re signed into the correct email and check **Volunteers** for their account.
