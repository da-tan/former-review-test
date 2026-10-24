-- 将 claim_access_code 从 private 模式移动到 public 模式，
-- 以便 Edge Function 通过 supabase-js 的 rpc('claim_access_code') 默认在 public 模式中解析到它。
-- 执行权限仍仅授予 service_role，匿名/已登录用户无 execute 权限，安全性不变。

drop function if exists private.claim_access_code(text, text);

create or replace function public.claim_access_code(
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

revoke all on function public.claim_access_code(text, text) from public;
grant usage on schema public to service_role;
grant execute on function public.claim_access_code(text, text) to service_role;
