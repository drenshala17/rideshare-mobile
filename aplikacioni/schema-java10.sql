-- Java 10: kërkesat e udhëtarëve për udhëtime.
-- Ekzekutoje manualisht në Neon vetëm pasi ta konfirmosh.
CREATE TABLE IF NOT EXISTS kerkesat (
  id BIGSERIAL PRIMARY KEY,
  udhetim_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  udhetar_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Në pritje'
    CHECK (status IN ('Në pritje', 'E pranuar')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT kerkesat_udhetar_udhetim_unique UNIQUE (udhetim_id, udhetar_id)
);

CREATE INDEX IF NOT EXISTS kerkesat_udhetim_id_idx
  ON kerkesat(udhetim_id);

CREATE INDEX IF NOT EXISTS kerkesat_udhetar_id_idx
  ON kerkesat(udhetar_id);

CREATE INDEX IF NOT EXISTS kerkesat_status_idx
  ON kerkesat(status);
