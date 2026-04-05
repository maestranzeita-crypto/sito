-- ============================================================
-- Maestranze.com — Manodopera: richieste imprese e disponibilità artigiani
-- ============================================================

create table if not exists manodopera_requests (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- Chi cerca
  nome              text not null,
  email             text not null,
  telefono          text not null,

  -- Cosa cerca
  specializzazione  text not null,
  zona_cantiere     text not null,
  periodo_da        date not null,
  periodo_a         date not null,
  tipo_ingaggio     text not null,
  compenso          text not null,

  -- Requisiti (array di stringhe: DURC, Patentino, Attrezzatura propria, Certificazione sicurezza)
  requisiti         text[] not null default '{}'
);

create table if not exists manodopera_availability (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),

  -- Chi è disponibile
  nome                      text not null,
  email                     text not null,
  telefono                  text not null,

  -- Disponibilità
  specializzazione          text not null,
  zona_operativa            text not null,
  disponibile_da            date not null,
  disponibile_a             date not null,

  -- Tipo collaborazione (array: Giornata, Settimana, Progetto)
  tipo_collaborazione       text[] not null default '{}',

  tariffa                   text not null,
  attrezzatura_propria      boolean not null default false,
  durc_valido               boolean not null default false
);
