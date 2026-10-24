create extension if not exists pgcrypto with schema extensions;

create table public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique check (code_hash ~ '^[0-9a-f]{64}$'),
  label text,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

create table public.assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null unique references public.access_codes(id) on delete restrict,
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

create table public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null unique references public.access_codes(id) on delete restrict,
  public_id text not null unique check (public_id ~ '^[A-Za-z0-9_-]{8,32}$'),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.access_codes enable row level security;
alter table public.assessment_sessions enable row level security;
alter table public.assessment_results enable row level security;

revoke all on public.access_codes, public.assessment_sessions, public.assessment_results from anon, authenticated;

create schema if not exists private;
revoke all on schema private from public;

create or replace function private.claim_access_code(
  p_code_hash text,
  p_token_hash text
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  claimed_code_id uuid;
begin
  update public.access_codes
  set used_at = now()
  where code_hash = p_code_hash and used_at is null
  returning id into claimed_code_id;

  if claimed_code_id is null then
    if exists (select 1 from public.access_codes where code_hash = p_code_hash) then
      return 'used';
    end if;
    return 'invalid';
  end if;

  insert into public.assessment_sessions (code_id, token_hash)
  values (claimed_code_id, p_token_hash);

  return 'ok';
end;
$$;

revoke all on function private.claim_access_code(text, text) from public;
grant usage on schema private to service_role;
grant execute on function private.claim_access_code(text, text) to service_role;
