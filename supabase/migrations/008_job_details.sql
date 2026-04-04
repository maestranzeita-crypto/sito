-- ============================================================
-- Maestranze.com — job_details e request_type su lead_requests
-- ============================================================

alter table lead_requests
  add column if not exists job_details   jsonb,
  add column if not exists request_type  text not null default 'online';
