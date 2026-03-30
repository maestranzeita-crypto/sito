-- ============================================================
-- Maestranze.com — Schema iniziale
-- ============================================================

-- Estensioni
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type lead_status as enum ('pending', 'contacted', 'closed');
create type professional_status as enum ('pending', 'active', 'suspended');
create type listing_status as enum ('pending', 'active', 'closed', 'expired');
create type urgenza_type as enum ('urgente', 'settimana', 'mese', 'nessuna');
create type contratto_type as enum ('Dipendente', 'Subappalto', 'Progetto');

-- ============================================================
-- TABELLA: lead_requests
-- Richieste di preventivo inviate dai clienti
-- ============================================================

create table lead_requests (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  -- Dati del lavoro
  categoria     text not null,
  citta         text not null,
  descrizione   text not null,
  urgenza       urgenza_type not null default 'settimana',

  -- Contatti cliente
  nome          text not null,
  telefono      text not null,
  email         text not null,

  -- Gestione interna
  status        lead_status not null default 'pending',
  notes         text,
  contacted_at  timestamptz
);

comment on table lead_requests is 'Richieste di preventivo inviate dai clienti tramite il form';

-- ============================================================
-- TABELLA: professionals
-- Profili dei professionisti registrati
-- ============================================================

create table professionals (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),

  -- Specializzazione e zona
  categorie       text[] not null,                   -- slug categorie (es. ['elettricista','fotovoltaico'])
  citta           text not null,
  raggio_km       text not null default '50',

  -- Dati aziendali
  ragione_sociale text not null,
  piva            text not null,
  forma_giuridica text not null,

  -- Contatti
  telefono        text not null,
  email           text not null unique,

  -- Profilo pubblico
  anni_esperienza text not null,
  bio             text not null,
  foto_url        text,                              -- URL avatar (futuro)

  -- Stato e reputazione
  status          professional_status not null default 'pending',
  is_top_rated    boolean not null default false,
  rating_avg      numeric(3,2),                      -- aggiornato via trigger/funzione
  review_count    integer not null default 0,
  verified_at     timestamptz,

  constraint piva_format check (piva ~ '^\d{11}$')
);

comment on table professionals is 'Profili professionisti registrati, verificati prima della pubblicazione';
create index idx_professionals_categorie on professionals using gin(categorie);
create index idx_professionals_citta on professionals(citta);
create index idx_professionals_status on professionals(status);

-- ============================================================
-- TABELLA: job_listings
-- Annunci di lavoro pubblicati da imprese/artigiani
-- ============================================================

create table job_listings (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),

  -- Dati annuncio
  categoria       text not null,
  tipo_contratto  contratto_type not null,
  titolo          text not null,
  citta           text not null,
  raggio          text not null default '30',
  descrizione     text not null,
  requisiti       text,
  retribuzione    text,                              -- null se non vuole mostrarla

  -- Chi pubblica
  ragione_sociale text not null,
  telefono        text not null,
  email           text not null,

  -- Gestione
  status          listing_status not null default 'pending',
  expires_at      timestamptz default (now() + interval '30 days')
);

comment on table job_listings is 'Offerte di lavoro pubblicate da imprese e artigiani';
create index idx_job_listings_categoria on job_listings(categoria);
create index idx_job_listings_status on job_listings(status);
create index idx_job_listings_expires on job_listings(expires_at);

-- ============================================================
-- TABELLA: job_applications
-- Candidature alle offerte di lavoro
-- ============================================================

create table job_applications (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),

  job_listing_id  uuid not null references job_listings(id) on delete cascade,

  nome            text not null,
  telefono        text not null,
  email           text not null,
  messaggio       text,

  viewed_at       timestamptz                        -- quando l'azienda ha visto la candidatura
);

comment on table job_applications is 'Candidature ricevute per ogni offerta di lavoro';
create index idx_applications_listing on job_applications(job_listing_id);

-- ============================================================
-- TABELLA: reviews
-- Recensioni dei clienti sui professionisti
-- ============================================================

create table reviews (
  id                uuid primary key default uuid_generate_v4(),
  created_at        timestamptz not null default now(),

  professional_id   uuid not null references professionals(id) on delete cascade,
  lead_request_id   uuid references lead_requests(id) on delete set null,

  rating            smallint not null check (rating between 1 and 5),
  testo             text not null,
  nome_cliente      text not null,

  verified          boolean not null default false,  -- true solo dopo verifica
  verified_at       timestamptz
);

comment on table reviews is 'Recensioni dei clienti sui professionisti, pubblicate solo dopo verifica';
create index idx_reviews_professional on reviews(professional_id);
create index idx_reviews_verified on reviews(verified);

-- ============================================================
-- FUNZIONE: aggiorna rating medio professionista
-- ============================================================

create or replace function update_professional_rating()
returns trigger language plpgsql as $$
begin
  update professionals
  set
    rating_avg   = (select round(avg(rating)::numeric, 2) from reviews where professional_id = new.professional_id and verified = true),
    review_count = (select count(*) from reviews where professional_id = new.professional_id and verified = true),
    is_top_rated = (
      (select count(*) from reviews where professional_id = new.professional_id and verified = true) >= 10
      and
      (select avg(rating) from reviews where professional_id = new.professional_id and verified = true) >= 4.7
    )
  where id = new.professional_id;
  return new;
end;
$$;

create trigger trg_update_rating
after insert or update on reviews
for each row execute function update_professional_rating();

-- ============================================================
-- FUNZIONE: scade annunci alla data expires_at
-- ============================================================

create or replace function expire_job_listings()
returns void language plpgsql as $$
begin
  update job_listings
  set status = 'expired'
  where status = 'active' and expires_at < now();
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table lead_requests    enable row level security;
alter table professionals    enable row level security;
alter table job_listings     enable row level security;
alter table job_applications enable row level security;
alter table reviews          enable row level security;

-- lead_requests: chiunque può inserire, solo service role legge/modifica
create policy "lead_requests_insert" on lead_requests
  for insert to anon, authenticated with check (true);

create policy "lead_requests_select_service" on lead_requests
  for select to service_role using (true);

create policy "lead_requests_update_service" on lead_requests
  for update to service_role using (true);

-- professionals: chiunque può inserire (registrazione), tutti possono leggere quelli attivi
create policy "professionals_insert" on professionals
  for insert to anon, authenticated with check (true);

create policy "professionals_select_active" on professionals
  for select to anon, authenticated using (status = 'active');

create policy "professionals_select_service" on professionals
  for select to service_role using (true);

create policy "professionals_update_service" on professionals
  for update to service_role using (true);

-- job_listings: chiunque può inserire, tutti possono leggere quelle attive
create policy "job_listings_insert" on job_listings
  for insert to anon, authenticated with check (true);

create policy "job_listings_select_active" on job_listings
  for select to anon, authenticated using (status = 'active');

create policy "job_listings_select_service" on job_listings
  for select to service_role using (true);

create policy "job_listings_update_service" on job_listings
  for update to service_role using (true);

-- job_applications: chiunque può candidarsi, solo service role legge
create policy "applications_insert" on job_applications
  for insert to anon, authenticated with check (true);

create policy "applications_select_service" on job_applications
  for select to service_role using (true);

create policy "applications_update_service" on job_applications
  for update to service_role using (true);

-- reviews: solo autenticati possono inserire, tutti leggono quelle verificate
create policy "reviews_insert" on reviews
  for insert to authenticated with check (true);

create policy "reviews_select_verified" on reviews
  for select to anon, authenticated using (verified = true);

create policy "reviews_select_service" on reviews
  for select to service_role using (true);

create policy "reviews_update_service" on reviews
  for update to service_role using (true);
