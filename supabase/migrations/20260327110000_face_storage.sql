begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'face-templates',
  'face-templates',
  false,
  5242880,
  array[
    'application/octet-stream',
    'application/json',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "face_templates_bucket_admin_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'face-templates'
  and public.is_admin()
);

create policy "face_templates_bucket_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'face-templates'
  and public.is_admin()
);

create policy "face_templates_bucket_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'face-templates'
  and public.is_admin()
)
with check (
  bucket_id = 'face-templates'
  and public.is_admin()
);

create policy "face_templates_bucket_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'face-templates'
  and public.is_admin()
);

commit;
