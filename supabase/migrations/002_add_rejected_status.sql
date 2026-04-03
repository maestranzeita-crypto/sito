-- Aggiunge il valore 'rejected' all'enum professional_status
ALTER TYPE professional_status ADD VALUE IF NOT EXISTS 'rejected';
