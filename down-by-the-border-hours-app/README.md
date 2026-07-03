# Down By The Border — Hours App (frontend)

React + Vite single-page app for the volunteer hours tracker. Deployed via the parent repo’s [vercel.json](../vercel.json).

Full project overview: **[../README.md](../README.md)**

## Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve dist/ locally
npm run lint     # ESLint
```

## Environment

Create `.env.local` in this directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never commit `.env.local`.

## Source layout

```
src/
├── components/     # UI, layout, forms
├── context/        # AuthProvider
├── hooks/          # useAuth, useProfile, useIsAdmin
├── lib/
│   ├── api/        # Supabase queries (profiles, hourLogs)
│   ├── pdf/        # Service-hour letter download
│   └── utils/      # dates, hours, csv, toast, etc.
├── pages/
│   ├── auth/       # login, signup, profile setup
│   ├── volunteer/  # dashboard, log hours, my hours
│   ├── admin/      # dashboard, logs, volunteers, manage admins
│   └── shared/     # profile
├── pdf/            # ServiceHourLetter PDF template
├── types/          # database.ts, shared types
├── App.tsx         # routes
└── main.tsx        # entry + Toaster + ErrorBoundary
```

## Conventions

- All Supabase calls live in `src/lib/api/`
- Forms use React Hook Form + Zod
- Tailwind only (no extra CSS except `index.css`)
- Form inputs use 16px font size (`text-base`) to avoid iOS Safari zoom on focus

See [../.cursor/rules/project.mdc](../.cursor/rules/project.mdc) for Cursor/editor rules.
