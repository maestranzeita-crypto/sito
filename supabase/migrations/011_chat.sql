-- Chat messages tra professionisti
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  sender_email text NOT NULL,
  receiver_email text NOT NULL,
  message text NOT NULL,
  read_at timestamptz
);

-- Indice per recuperare velocemente i thread
CREATE INDEX IF NOT EXISTS idx_chat_thread ON chat_messages (
  LEAST(sender_email, receiver_email),
  GREATEST(sender_email, receiver_email),
  created_at
);

-- Abilita Realtime sulla tabella
ALTER TABLE chat_messages REPLICA IDENTITY FULL;
