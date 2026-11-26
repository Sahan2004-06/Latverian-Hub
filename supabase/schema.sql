-- The Latverian Hub: database schema
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

-- Allowed values live in the database as enums, so `supabase gen types`
-- turns them into TypeScript union types for us.
create type petition_category as enum ('food', 'infrastructure', 'medical', 'protection', 'other');
create type petition_status   as enum ('pending', 'under_review', 'granted', 'denied');

create table petitions (
  id            bigint generated always as identity primary key,
  citizen_name  text not null check (char_length(citizen_name) between 1 and 100),
  title         text not null check (char_length(title) between 1 and 150),
  description   text not null check (char_length(description) between 1 and 2000),
  category      petition_category not null default 'other',
  status        petition_status   not null default 'pending',
  doom_response text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Keep updated_at current on every UPDATE.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger petitions_set_updated_at
before update on petitions
for each row execute function set_updated_at();

-- Row Level Security on, with NO policies: the public anon key can read/write nothing.
-- Our Express server uses the service-role key (server-side only), which bypasses RLS.
alter table petitions enable row level security;

-- Seed data: the people speak, Doom listens.
insert into petitions (citizen_name, title, description, category, status, doom_response) values
  ('Valeria Petrova', 'Repair the Doomstadt bridge', 'The old stone bridge over the river cracked after the spring floods.', 'infrastructure', 'granted', 'Doom''s engineers will have it rebuilt by the new moon. In titanium.'),
  ('Boris Novak',     'More bread for the winter',   'The harvest was poor in the eastern villages. We ask for grain reserves.', 'food', 'pending', null),
  ('Mila Horvath',    'A clinic in Hassenstadt',     'The nearest doctor is a day''s ride away.', 'medical', 'under_review', null),
  ('Anton Kral',      'Protection from Symkarian raiders', 'Raiders crossed the border twice this month.', 'protection', 'granted', 'The Doombots will patrol the border. The raiders will not return.'),
  ('Ivan Ruzicka',    'Statue of Reed Richards in the square', 'For balance and fairness.', 'other', 'denied', 'No.');
