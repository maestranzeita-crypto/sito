-- ============================================================
-- Maestranze.com — Blog posts generati automaticamente
-- ============================================================

create table if not exists blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text not null,
  category      text not null default 'generale',
  tags          text[] not null default '{}',
  published_at  timestamptz not null default now(),
  reading_time  int not null default 5,
  author_name   text not null default 'Redazione Maestranze',
  sections      jsonb not null default '[]',
  image_url     text,
  image_alt     text,
  status        text not null default 'published',
  seo_title     text,
  seo_description text
);

create index if not exists blog_posts_published_at_idx on blog_posts(published_at desc);
create index if not exists blog_posts_status_idx       on blog_posts(status);
create index if not exists blog_posts_category_idx     on blog_posts(category);
