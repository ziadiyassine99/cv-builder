-- Run this in Supabase SQL Editor to set up photo storage

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

-- Allow authenticated users to upload files
create policy "Authenticated users can upload photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cv-assets');

-- Allow public read access
create policy "Public read access for cv-assets"
  on storage.objects for select
  to public
  using (bucket_id = 'cv-assets');

-- Allow users to delete their own uploads
create policy "Users can delete their own photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cv-assets');
