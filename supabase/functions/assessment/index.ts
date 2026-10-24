import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, x-session-token',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Vary': 'Origin'
};
const MAX_BODY_BYTES = 80 * 1024;
const RESULT_TYPES = new Set([
  'emotional-translator', 'steady-anchor', 'repairer', 'expander',
  'boundary-love', 'memory-curator', 'high-fit-partner', 'shared-language', 'rebuilding'
]);
const SCORE_KEYS = ['responsiveness', 'reliability', 'repair', 'growth', 'boundaries', 'memory'];

function secretKey() {
  const configured = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (configured) return JSON.parse(configured).default as string;
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY');
  if (!legacy) throw new Error('Supabase 服务密钥不可用。');
  return legacy;
}

function adminClient() {
  const url = Deno.env.get('SUPABASE_URL');
  if (!url) throw new Error('Supabase URL 不可用。');
  return createClient(url, secretKey(), { auth: { autoRefreshToken: false, persistSession: false } });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

function fail(status: number, error: string) {
  return json({ error }, status);
}

function randomBase64Url(byteLength: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function readJson(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) throw new Error('请求内容过大。');
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new Error('请求内容过大。');
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('请求格式不正确。');
  }
}

function validateResult(body: unknown) {
  if (!body || typeof body !== 'object') return null;
  const candidate = body as { resultType?: unknown; scores?: unknown };
  if (typeof candidate.resultType !== 'string' || !RESULT_TYPES.has(candidate.resultType)) return null;
  if (!candidate.scores || typeof candidate.scores !== 'object') return null;
  const rawScores = candidate.scores as Record<string, unknown>;
  const scores: Record<string, number> = {};
  for (const key of SCORE_KEYS) {
    const value = Number(rawScores[key]);
    if (!Number.isFinite(value) || value < 1 || value > 5) return null;
    scores[key] = Math.round(value * 100) / 100;
  }
  return { resultType: candidate.resultType, scores, savedAt: new Date().toISOString() };
}

async function access(request: Request) {
  if (request.method !== 'POST') return fail(405, '不支持的请求方法。');
  const body = await readJson(request);
  const password = String(body?.password || '').trim().toUpperCase();
  if (password.length < 4 || password.length > 100) return fail(400, '请输入有效的测试密码。');

  const sessionToken = randomBase64Url(32);
  const supabase = adminClient();
  const { data, error } = await supabase.rpc('claim_access_code', {
    p_code_hash: await sha256(password),
    p_token_hash: await sha256(sessionToken)
  });
  if (error) throw error;
  if (data === 'invalid') return fail(401, '密码不正确，请检查后重试。');
  if (data === 'used') return fail(409, '该密码已完成一次测试，请使用新的测试密码。');
  if (data !== 'ok') throw new Error('密码状态异常。');
  return json({ sessionToken });
}

async function saveResult(request: Request) {
  if (request.method !== 'POST') return fail(405, '不支持的请求方法。');
  const rawToken = request.headers.get('x-session-token');
  if (!rawToken || rawToken.length < 20) return fail(401, '本次测试会话已失效，请使用新的测试密码。');
  const result = validateResult(await readJson(request));
  if (!result) return fail(400, '结果数据不完整。');

  const supabase = adminClient();
  const { data: session, error: sessionError } = await supabase
    .from('assessment_sessions')
    .select('code_id')
    .eq('token_hash', await sha256(rawToken))
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session) return fail(401, '本次测试会话已失效，请使用新的测试密码。');

  const { data: existing, error: existingError } = await supabase
    .from('assessment_results')
    .select('public_id')
    .eq('code_id', session.code_id)
    .maybeSingle();
  if (existingError) throw existingError;

  if (existing) {
    const { error } = await supabase
      .from('assessment_results')
      .update({ payload: result, updated_at: new Date().toISOString() })
      .eq('code_id', session.code_id);
    if (error) throw error;
    return json({ publicId: existing.public_id });
  }

  const publicId = randomBase64Url(12);
  const { error } = await supabase.from('assessment_results').insert({
    code_id: session.code_id,
    public_id: publicId,
    payload: result
  });
  if (error) throw error;
  return json({ publicId }, 201);
}

async function share(request: Request, url: URL) {
  if (request.method !== 'GET') return fail(405, '不支持的请求方法。');
  const id = url.searchParams.get('id') || '';
  if (!/^[A-Za-z0-9_-]{8,32}$/.test(id)) return fail(404, '结果不存在。');

  const { data, error } = await adminClient()
    .from('assessment_results')
    .select('public_id, payload, created_at')
    .eq('public_id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data || !data.payload) return fail(404, '该结果链接不存在或已失效。');
  const payload = validateResult(data.payload);
  if (!payload) return fail(404, '该结果链接不存在或已失效。');
  return json({ publicId: data.public_id, ...payload, createdAt: data.created_at });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  try {
    if (action === 'access') return await access(request);
    if (action === 'result') return await saveResult(request);
    if (action === 'share') return await share(request, url);
    if (request.method === 'GET') return json({ ok: true });
    return fail(404, '接口不存在。');
  } catch (error) {
    console.error(error);
    return fail(500, '服务暂时不可用。');
  }
});
