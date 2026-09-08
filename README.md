# Brew-Note V3.0 — Supabase Cloud

Brew-Note is now backed by Supabase so the same recipes, beans and journal data can sync across laptop and phone.

## What changed

- Supabase Auth (email + password)
- One cloud data row per authenticated user
- Row Level Security (RLS): users can only read/write their own Brew-Note data
- Existing browser `localStorage` data is automatically migrated the first time a new cloud account has no server data
- `localStorage` remains as a local browser backup
- Debounced cloud autosave
- Cloud sync status shown in the header
- No Supabase secret keys are committed to the repository

## 1. Create a Supabase project

Create a project in Supabase.

Then open:

**SQL Editor → New query**

Copy all SQL from:

`supabase/schema.sql`

and press **Run**.

## 2. Get the project credentials

In the Supabase dashboard, use the project's Connect/API details and copy:

- Project URL
- Publishable key

Create `.env.local` in the Brew-Note project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

You may copy `.env.example` and rename it to `.env.local`.

**Do not use or expose the service-role key.**

## 3. Install + run

```powershell
$env:NODE_OPTIONS="--use-system-ca"
npm.cmd install
npm.cmd run dev
```

Open:

`http://localhost:3000`

Create an account, or sign in.

If email confirmation is enabled in Supabase Auth settings, confirm the email before the first sign-in.

## 4. Existing Brew-Note data migration

On the laptop/browser where your current Brew-Note recipes already exist:

1. Open Brew-Note V3.0.
2. Sign up / sign in.
3. If your Supabase account has no cloud row yet, Brew-Note reads `brew-note-v1` from `localStorage`.
4. It uploads that local data to your Supabase account automatically.
5. Sign into the same account on your phone.
6. The phone will now receive the same cloud data.

Important: do the first migration on the device/browser that contains the data you want to keep.

## 5. Vercel environment variables

In Vercel:

**Project → Settings → Environment Variables**

Add both:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Apply them to **Production**, **Preview**, and **Development** if you want all environments connected.

Then redeploy. A normal Git push will trigger a new deployment.

## Storage design

V3.0 intentionally stores the Brew-Note state as one Postgres `jsonb` document:

```text
auth.users
    │
    └── brew_note_state
            user_id
            data JSONB
            updated_at
```

This was chosen so the existing Brew-Note UI can migrate to cloud sync with minimal risk.

A future V4 can normalize this into separate relational tables such as:

- recipes
- recipe_steps
- beans
- brew_logs
- journal_notes

That becomes useful for large-scale analytics, sharing, collaboration and server-side querying.

## Security

The public/publishable Supabase key is designed to be used by frontend applications. Security comes from Row Level Security policies.

The SQL in `supabase/schema.sql` restricts every row to:

```sql
auth.uid() = user_id
```

Never expose a Supabase service-role key in a browser app or GitHub repository.
