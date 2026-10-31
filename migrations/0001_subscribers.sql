CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT NOT NULL,
  page_url TEXT NOT NULL,
  purpose TEXT NOT NULL,
  extra TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  PRIMARY KEY (email, purpose)
);

CREATE TABLE IF NOT EXISTS submit_buckets (
  ip_hash TEXT NOT NULL,
  bucket TEXT NOT NULL,
  hits INTEGER NOT NULL,
  PRIMARY KEY (ip_hash, bucket)
);
