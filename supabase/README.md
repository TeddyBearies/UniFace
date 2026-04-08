# Supabase Folder

This folder holds the database setup for Haga-FaceID.

## What is here

- `migrations/`: versioned SQL migrations

## Current baseline

- `20260326170000_initial_schema.sql`
  Creates the first app schema, auth profile trigger, indexes, and Row Level Security policies.
- `20260327110000_face_storage.sql`
  Creates a private `face-templates` storage bucket and locks access down to admins.

## Recommended flow

1. Create your Supabase project.
2. Add your project keys to `.env.local`.
3. Run the SQL migration with either:
   - Supabase CLI: `npx supabase db push`
   - Supabase dashboard SQL editor: paste the migration file and run it once
4. Create users from the Supabase Auth dashboard or your app login flow.
5. Change user roles in the `profiles` table for instructor and admin accounts after signup.
6. Keep face-template files in the `face-templates` bucket instead of storing file blobs in relational tables.

Keep database changes in migrations so the schema stays reproducible.
