-- Add the 8-digit distinct university_id to the profiles table
alter table public.profiles 
add column if not exists university_id text unique;

-- Create an index to ensure fast lookups when instructors enter the ID during face enrollment
create index if not exists profiles_university_id_idx on public.profiles (university_id);
