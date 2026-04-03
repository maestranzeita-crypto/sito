-- ─── Funzionalità 1: Modalità Pausa ─────────────────────────────────────────

alter table professionals
  add column if not exists available boolean not null default true,
  add column if not exists reputation_points integer not null default 0;

-- Tabella waitlist: clienti che vogliono essere avvisati quando il pro torna disponibile
create table if not exists waitlist (
  id uuid primary key default uuid_generate_v4(),
  professional_id uuid not null references professionals(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  unique(professional_id, email)
);

alter table waitlist enable row level security;

create policy "Accesso completo service_role su waitlist"
  on waitlist for all
  using (true)
  with check (true);

-- ─── Funzionalità 2: Cessione lavoro ────────────────────────────────────────

-- Assegnazione opzionale a un professionista specifico (null = visibile a tutti nella zona)
alter table lead_requests
  add column if not exists assigned_professional_id uuid references professionals(id);
