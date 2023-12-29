/*
Postgres v16 schema migration file
*/

/*
Create types if not exist
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'film_type') THEN
    CREATE TYPE film_type AS ENUM ('bw', 'color');
  END IF;
END$$;

/*
Create tables if not exist
*/
CREATE TABLE IF NOT EXISTS mounts (
  id TEXT PRIMARY KEY,
  make TEXT,
  mount TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cameras (
  id TEXT PRIMARY KEY,
  model TEXT NOT NULL,
  make TEXT,
  mount TEXT REFERENCES mounts(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lenses (
  id TEXT PRIMARY KEY,
  model TEXT NOT NULL,
  make TEXT NOT NULL,
  mount TEXT NOT NULL REFERENCES mounts(id) ON DELETE RESTRICT,
  max_aperture REAL NOT NULL,
  min_focal_length SMALLINT NOT NULL,
  max_focal_length SMALLINT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS films (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  iso SMALLINT NOT NULL,
  type film_type NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS images_meta (
  id TEXT PRIMARY KEY REFERENCES images(id) ON DELETE CASCADE,
  alt TEXT NOT NULL,
  aperture REAL,
  camera TEXT NOT NULL REFERENCES cameras(id) ON DELETE RESTRICT,
  color TEXT,
  date TIMESTAMP,
  film TEXT NOT NULL REFERENCES films(id) ON DELETE RESTRICT,
  focal_length SMALLINT NOT NULL,
  hash TEXT,
  height SMALLINT NOT NULL,
  iso SMALLINT NOT NULL,
  lens TEXT REFERENCES lenses(id) ON DELETE SET NULL,
  shutter REAL,
  width SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS developers (
  name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS developers_images_meta (
  image TEXT PRIMARY KEY REFERENCES images(id) ON DELETE CASCADE,
  developer TEXT REFERENCES developers(name) ON DELETE CASCADE,
  duration REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS points (
  image TEXT PRIMARY KEY REFERENCES images(id) ON DELETE CASCADE,
  coordinates POINT NOT NULL,
  place TEXT
);

/*
Create extensions if not exist
*/
CREATE EXTENSION IF NOT EXISTS pg_trgm;

/*
Function and trigger for setting min_focal_width as default value for max_focal_width in lenses
*/
CREATE OR REPLACE FUNCTION set_default_max_focal_length() RETURNS TRIGGER AS $$
BEGIN
    NEW.max_focal_length := NEW.min_focal_length;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_max_value_trigger
    BEFORE INSERT ON lenses
    FOR EACH ROW
    WHEN (NEW.max_focal_length IS NULL)
    EXECUTE FUNCTION set_default_max_focal_length();