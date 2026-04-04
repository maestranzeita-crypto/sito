-- ============================================================
-- Maestranze.com — Aumenta limite dimensione bucket a 15 MB
-- ============================================================

update storage.buckets
  set file_size_limit = 15728640  -- 15 MB
where id in ('avatars', 'portfolio');
