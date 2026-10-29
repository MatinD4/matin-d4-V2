-- Run this in Supabase SQL Editor. Never put a service-role key in the website.
create table if not exists public.site_content (
  id text primary key check (id = 'main'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null default '' check (char_length(email) <= 254),
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create or replace function public.is_site_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content" on public.site_content for select to anon, authenticated using (true);
drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content" on public.site_content for insert to authenticated with check (public.is_site_admin());
drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content" on public.site_content for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
drop policy if exists "Admins can delete site content" on public.site_content;
create policy "Admins can delete site content" on public.site_content for delete to authenticated using (public.is_site_admin());

drop policy if exists "Admins can see their admin row" on public.admin_users;
create policy "Admins can see their admin row" on public.admin_users for select to authenticated using (user_id = auth.uid());

drop policy if exists "Anyone can send a contact message" on public.contact_messages;
create policy "Anyone can send a contact message" on public.contact_messages for insert to anon, authenticated with check (char_length(name) between 1 and 100 and char_length(email) <= 254 and char_length(message) between 1 and 5000);
drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages" on public.contact_messages for select to authenticated using (public.is_site_admin());
drop policy if exists "Admins can mark messages read" on public.contact_messages;
create policy "Admins can update contact messages" on public.contact_messages for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages" on public.contact_messages for delete to authenticated using (public.is_site_admin());

-- Public media bucket for images and licensed audio; uploads and deletes are restricted to approved admin users.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 26214400, array['image/png','image/jpeg','image/webp','image/avif','image/gif','audio/mpeg','audio/mp3','audio/mp4','audio/aac','audio/ogg','audio/wav','audio/webm','audio/flac','audio/x-m4a'])
on conflict (id) do update set public = true, file_size_limit = 26214400, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view site assets" on storage.objects;
create policy "Public can view site assets" on storage.objects for select to anon, authenticated using (bucket_id = 'site-assets');
drop policy if exists "Admins can upload site assets" on storage.objects;
create policy "Admins can upload site assets" on storage.objects for insert to authenticated with check (bucket_id = 'site-assets' and public.is_site_admin());
drop policy if exists "Admins can update site assets" on storage.objects;
create policy "Admins can update site assets" on storage.objects for update to authenticated using (bucket_id = 'site-assets' and public.is_site_admin()) with check (bucket_id = 'site-assets' and public.is_site_admin());
drop policy if exists "Admins can delete site assets" on storage.objects;
create policy "Admins can delete site assets" on storage.objects for delete to authenticated using (bucket_id = 'site-assets' and public.is_site_admin());

-- Bootstrap: create your user in Supabase Authentication first, then run this with that user's UUID.
-- insert into public.admin_users (user_id) values ('PASTE-AUTH-USER-UUID-HERE');

-- Explicit table grants for PostgREST; RLS above remains the actual authorization layer.
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant select on public.admin_users to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
