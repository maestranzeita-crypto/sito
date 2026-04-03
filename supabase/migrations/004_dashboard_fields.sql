-- ============================================================
-- Maestranze.com — Dashboard Pro: nuovi campi
-- ============================================================

-- Nuovi campi sui professionisti
alter table professionals
  add column if not exists gmb_link          text,
  add column if not exists certificazioni    text[] not null default '{}',
  add column if not exists plan_type         text   not null default 'free',
  add column if not exists plan_expires_at   timestamptz;

-- Risposta del professionista alle recensioni
alter table reviews
  add column if not exists risposta_professionista text;

-- ============================================================
-- TABELLA: profile_views
-- Visualizzazioni del profilo da parte degli utenti
-- ============================================================

create table if not exists profile_views (
  id              uuid        primary key default uuid_generate_v4(),
  professional_id uuid        not null references professionals(id) on delete cascade,
  viewed_at       timestamptz not null    default now()
);

create index if not exists idx_profile_views_professional on profile_views(professional_id);
create index if not exists idx_profile_views_date         on profile_views(viewed_at);

alter table profile_views enable row level security;

create policy "profile_views_insert" on profile_views
  for insert to anon, authenticated with check (true);

create policy "profile_views_select_service" on profile_views
  for select to service_role using (true);

-- ============================================================
-- Politiche aggiuntive: professionista può leggere i propri lead
-- Filtra per email tramite JWT
-- ============================================================

-- Permetti a un professionista autenticato di aggiornare le proprie lead
create policy "lead_requests_update_by_pro" on lead_requests
  for update to authenticated
  using (
    exists (
      select 1 from professionals p
      where p.email = auth.jwt() ->> 'email'
        and categoria = any(p.categorie)
        and citta = p.citta
    )
  );

-- Permetti a un professionista autenticato di leggere le lead della sua area
create policy "lead_requests_select_by_pro" on lead_requests
  for select to authenticated
  using (
    exists (
      select 1 from professionals p
      where p.email = auth.jwt() ->> 'email'
        and categoria = any(p.categorie)
        and citta = p.citta
    )
  );

-- Permetti al professionista di leggere il proprio profilo
create policy "professionals_select_own" on professionals
  for select to authenticated
  using (email = auth.jwt() ->> 'email');

-- Permetti al professionista di aggiornare il proprio profilo
create policy "professionals_update_own" on professionals
  for update to authenticated
  using (email = auth.jwt() ->> 'email');

-- Permetti al professionista di leggere le proprie recensioni (anche non verificate)
create policy "reviews_select_own_pro" on reviews
  for select to authenticated
  using (
    exists (
      select 1 from professionals p
      where p.id = professional_id
        and p.email = auth.jwt() ->> 'email'
    )
  );

-- Permetti al professionista di aggiornare le proprie recensioni (solo risposta)
create policy "reviews_update_own_pro" on reviews
  for update to authenticated
  using (
    exists (
      select 1 from professionals p
      where p.id = professional_id
        and p.email = auth.jwt() ->> 'email'
    )
  );
