/*
# Create shows and roster tables for Road Roster

Road Roster is a tour-management app. This migration adds the two core data sets: the tour's shows (gigs) and the people travelling with the tour.

1. New Tables
- `shows`: one row per gig.
  - `id` (uuid, primary key)
  - `venue` (text, required) - name of the venue
  - `city` (text, required)
  - `show_date` (date, required)
  - `show_time` (text, optional) - performance time such as "20:00"
  - `load_in` (text, optional) - load-in time such as "16:00"
  - `pay_cents` (integer, default 0, never negative) - agreed fee in cents
  - `status` (text, default 'confirmed') - one of confirmed, pending, cancelled
  - `notes` (text, optional)
  - `created_at` (timestamptz)
- `roster_members`: people on the tour.
  - `id` (uuid, primary key)
  - `name` (text, required)
  - `role` (text, required) - job on the tour, e.g. "Lead vocals" or "FOH engineer"
  - `category` (text, default 'Crew') - one of Band, Crew, Management
  - `phone` (text, optional)
  - `email` (text, optional)
  - `created_at` (timestamptz)

2. Security
- Row level security is enabled on both tables.
- The app has no sign-in screen, so every request runs as the `anon` role. Policies are granted to `anon` and `authenticated` for select, insert, update and delete. The data is intentionally shared across the tour party.

3. Important Notes
- 1. Only new objects are created; no existing data is modified.
- 2. Check constraints keep status and category to their allowed values and stop negative pay.
- 3. An index on `shows.show_date` keeps the date-ordered schedule fast.
*/

CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue text NOT NULL,
  city text NOT NULL,
  show_date date NOT NULL,
  show_time text,
  load_in text,
  pay_cents integer NOT NULL DEFAULT 0 CHECK (pay_cents >= 0),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shows_show_date_idx ON shows (show_date);

CREATE TABLE IF NOT EXISTS roster_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  category text NOT NULL DEFAULT 'Crew' CHECK (category IN ('Band', 'Crew', 'Management')),
  phone text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_members ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON shows TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON roster_members TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_shows" ON shows;
CREATE POLICY "anon_select_shows" ON shows FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_shows" ON shows;
CREATE POLICY "anon_insert_shows" ON shows FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_shows" ON shows;
CREATE POLICY "anon_update_shows" ON shows FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_shows" ON shows;
CREATE POLICY "anon_delete_shows" ON shows FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_roster_members" ON roster_members;
CREATE POLICY "anon_select_roster_members" ON roster_members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_roster_members" ON roster_members;
CREATE POLICY "anon_insert_roster_members" ON roster_members FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_roster_members" ON roster_members;
CREATE POLICY "anon_update_roster_members" ON roster_members FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_roster_members" ON roster_members;
CREATE POLICY "anon_delete_roster_members" ON roster_members FOR DELETE
  TO anon, authenticated USING (true);
