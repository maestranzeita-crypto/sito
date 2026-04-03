-- ============================================================
-- Maestranze.com — Foto portfolio professionisti
-- ============================================================

alter table professionals
  add column if not exists foto_lavori text[] not null default '{}';

-- ── Storage: bucket avatars (foto profilo) ────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- ── Storage: bucket portfolio (foto lavori) ───────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- ── RLS: lettura pubblica ─────────────────────────────────────────────────────
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "portfolio_public_read" on storage.objects
  for select using (bucket_id = 'portfolio');

-- ── RLS: scrittura/eliminazione via service_role (gestita lato server) ────────
create policy "avatars_service_all" on storage.objects
  for all to service_role using (bucket_id = 'avatars');

create policy "portfolio_service_all" on storage.objects
  for all to service_role using (bucket_id = 'portfolio');
