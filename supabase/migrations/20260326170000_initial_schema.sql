begin;

create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'instructor', 'admin');
create type public.course_enrollment_status as enum ('active', 'dropped');
create type public.attendance_session_status as enum ('draft', 'open', 'closed', 'archived');
create type public.face_enrollment_status as enum ('not_started', 'pending', 'complete', 'reset_required');

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  title text not null,
  semester text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint courses_code_semester_key unique (code, semester)
);

create table public.course_instructors (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  instructor_profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  constraint course_instructors_unique_assignment unique (course_id, instructor_profile_id)
);

create table public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  student_profile_id uuid not null references public.profiles (id) on delete cascade,
  status public.course_enrollment_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  constraint course_enrollments_unique_student unique (course_id, student_profile_id)
);

create table public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  created_by_profile_id uuid not null references public.profiles (id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.attendance_session_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint attendance_sessions_valid_window check (ends_at > starts_at)
);

create table public.attendance_events (
  id uuid primary key default gen_random_uuid(),
  attendance_session_id uuid not null references public.attendance_sessions (id) on delete cascade,
  student_profile_id uuid not null references public.profiles (id) on delete cascade,
  matched_by text not null default 'manual',
  confidence_score numeric(5,4),
  recorded_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  constraint attendance_events_unique_student_per_session unique (attendance_session_id, student_profile_id),
  constraint attendance_events_confidence_range check (
    confidence_score is null or (confidence_score >= 0 and confidence_score <= 1)
  )
);

create table public.face_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  enrollment_status public.face_enrollment_status not null default 'not_started',
  last_enrolled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.face_templates (
  id uuid primary key default gen_random_uuid(),
  face_profile_id uuid not null unique references public.face_profiles (id) on delete cascade,
  storage_object_path text not null unique,
  template_version text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index course_instructors_course_id_idx on public.course_instructors (course_id);
create index course_instructors_instructor_profile_id_idx on public.course_instructors (instructor_profile_id);
create index course_enrollments_course_id_idx on public.course_enrollments (course_id);
create index course_enrollments_student_profile_id_idx on public.course_enrollments (student_profile_id);
create index attendance_sessions_course_id_idx on public.attendance_sessions (course_id);
create index attendance_events_student_profile_id_idx on public.attendance_events (student_profile_id);
create index attendance_events_session_id_idx on public.attendance_events (attendance_session_id);
create index face_profiles_profile_id_idx on public.face_profiles (profile_id);

create function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

create function public.is_instructor_for_course(course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.course_instructors
    where course_instructors.course_id = is_instructor_for_course.course_id
      and course_instructors.instructor_profile_id = auth.uid()
  );
$$;

create function public.is_enrolled_in_course(course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.course_enrollments
    where course_enrollments.course_id = is_enrolled_in_course.course_id
      and course_enrollments.student_profile_id = auth.uid()
      and course_enrollments.status = 'active'
  );
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

create trigger set_courses_updated_at
before update on public.courses
for each row
execute procedure public.set_updated_at();

create trigger set_attendance_sessions_updated_at
before update on public.attendance_sessions
for each row
execute procedure public.set_updated_at();

create trigger set_face_profiles_updated_at
before update on public.face_profiles
for each row
execute procedure public.set_updated_at();

create trigger set_face_templates_updated_at
before update on public.face_templates
for each row
execute procedure public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set email = excluded.email;

  insert into public.face_profiles (profile_id)
  values (new.id)
  on conflict (profile_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_instructors enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.attendance_events enable row level security;
alter table public.face_profiles enable row level security;
alter table public.face_templates enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or public.is_admin()
);

create policy "profiles_update_own_non_role_fields"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
  and role = public.current_user_role()
);

create policy "profiles_admin_manage"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "courses_admin_manage"
on public.courses
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "courses_select_related"
on public.courses
for select
to authenticated
using (
  public.is_admin()
  or public.is_instructor_for_course(id)
  or public.is_enrolled_in_course(id)
);

create policy "course_instructors_admin_manage"
on public.course_instructors
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "course_instructors_select_related"
on public.course_instructors
for select
to authenticated
using (
  public.is_admin()
  or instructor_profile_id = auth.uid()
  or public.is_enrolled_in_course(course_id)
);

create policy "course_enrollments_admin_manage"
on public.course_enrollments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "course_enrollments_select_related"
on public.course_enrollments
for select
to authenticated
using (
  public.is_admin()
  or student_profile_id = auth.uid()
  or public.is_instructor_for_course(course_id)
);

create policy "attendance_sessions_admin_manage"
on public.attendance_sessions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "attendance_sessions_select_related"
on public.attendance_sessions
for select
to authenticated
using (
  public.is_admin()
  or public.is_instructor_for_course(course_id)
  or public.is_enrolled_in_course(course_id)
);

create policy "attendance_sessions_instructor_insert"
on public.attendance_sessions
for insert
to authenticated
with check (
  created_by_profile_id = auth.uid()
  and public.is_instructor_for_course(course_id)
);

create policy "attendance_sessions_instructor_update"
on public.attendance_sessions
for update
to authenticated
using (
  created_by_profile_id = auth.uid()
  and public.is_instructor_for_course(course_id)
)
with check (
  created_by_profile_id = auth.uid()
  and public.is_instructor_for_course(course_id)
);

create policy "attendance_events_admin_manage"
on public.attendance_events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "attendance_events_select_related"
on public.attendance_events
for select
to authenticated
using (
  public.is_admin()
  or student_profile_id = auth.uid()
  or exists (
    select 1
    from public.attendance_sessions
    where attendance_sessions.id = attendance_events.attendance_session_id
      and public.is_instructor_for_course(attendance_sessions.course_id)
  )
);

create policy "attendance_events_instructor_insert"
on public.attendance_events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.attendance_sessions
    join public.course_enrollments
      on course_enrollments.course_id = attendance_sessions.course_id
    where attendance_sessions.id = attendance_events.attendance_session_id
      and public.is_instructor_for_course(attendance_sessions.course_id)
      and course_enrollments.student_profile_id = attendance_events.student_profile_id
      and course_enrollments.status = 'active'
  )
);

create policy "face_profiles_admin_manage"
on public.face_profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "face_profiles_select_own"
on public.face_profiles
for select
to authenticated
using (
  public.is_admin()
  or profile_id = auth.uid()
);

create policy "face_templates_admin_manage"
on public.face_templates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

commit;
