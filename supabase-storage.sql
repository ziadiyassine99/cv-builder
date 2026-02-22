-- Run this in Supabase SQL Editor to set up photo storage
-- NOTE: If you already ran the old version, drop the old policies first:
--   DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
--   DROP POLICY IF EXISTS "Public read access for cv-assets" ON storage.objects;
--   DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

-- Create the storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cv-assets',
  'cv-assets',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Users can only upload to their own folder: cv-assets/{user_id}/...
create policy "Users can upload to their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'cv-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read access (photos need to be viewable in generated CVs)
create policy "Public read access for cv-assets"
  on storage.objects for select
  to public
  using (bucket_id = 'cv-assets');

-- Users can only delete files in their own folder
create policy "Users can delete their own photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'cv-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can only update files in their own folder
create policy "Users can update their own photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'cv-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
