# UniFace (Haga-FaceID)

Project Description goes here to explain your code to the viewer.

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. If you need admin-only database operations later, also fill in `SUPABASE_SECRET_KEY`.
4. Restart the dev server after changing environment variables.

The login page is wired for Supabase email/password auth once those keys are present.
