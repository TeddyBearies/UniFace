begin;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invited_role public.app_role;
  invited_university_id text;
begin
  invited_role := coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'student')::public.app_role;
  invited_university_id := nullif(new.raw_user_meta_data ->> 'university_id', '');

  insert into public.profiles (id, email, full_name, role, university_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    invited_role,
    invited_university_id
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      role = excluded.role,
      university_id = coalesce(excluded.university_id, public.profiles.university_id);

  insert into public.face_profiles (profile_id)
  values (new.id)
  on conflict (profile_id) do nothing;

  return new;
end;
$$;

commit;
