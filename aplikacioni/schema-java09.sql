-- Ekzekutoje në Neon pas schema.sql dhe schema-java05.sql.
CREATE TABLE IF NOT EXISTS preferimet (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT preferimet_user_udhetim_unique UNIQUE (user_id, udhetim_id)
);

CREATE INDEX IF NOT EXISTS preferimet_user_id_idx ON preferimet(user_id);
