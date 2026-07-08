-- Hour log verification selfie (run in Supabase SQL Editor).

alter table public.hour_logs
  add column if not exists verification_photo_path text;

comment on column public.hour_logs.verification_photo_path is
  'Storage path in hour-log-photos bucket for volunteer event selfie.';

-- Private bucket for verification photos (5 MB max, images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hour-log-photos',
  'hour-log-photos',
  false,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies
create policy "Volunteers upload own hour log photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'hour-log-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Volunteers read own hour log photos"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'hour-log-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

create policy "Volunteers update own hour log photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'hour-log-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Admins delete hour log photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'hour-log-photos'
    and public.is_admin()
  );
