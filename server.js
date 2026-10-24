import { createHash, randomBytes } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const PORT = Number(process.env.PORT || 4173);
const ROOT = resolve('.');
const PUBLIC_DIR = join(ROOT, 'public');
const DATA_DIR = join(ROOT, 'data');
const DB_PATH = join(DATA_DIR, 'assessment.db');
const MAX_BODY_BYTES = 80 * 1024;

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS access_codes (
    id INTEGER PRIMARY KEY,
    code_hash TEXT NOT NULL UNIQUE,
    label TEXT,
    created_at TEXT NOT NULL,
    used_at TEXT
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY,
    code_id INTEGER NOT NULL UNIQUE,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    FOREIGN KEY (code_id) REFERENCES access_codes(id)
  );
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY,
    code_id INTEGER NOT NULL UNIQUE,
    public_id TEXT NOT NULL UNIQUE,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (code_id) REFERENCES access_codes(id)
  );
`);

const now = () => new Date().toISOString();
const hash = (value) => createHash('sha256').update(value).digest('hex');
const token = () => randomBytes(32).toString('base64url');
const publicId = () => randomBytes(9).toString('base64url');

function seedDemoCode() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM access_codes').get().count;
  if (count !== 0) return;
  db.prepare('INSERT INTO access_codes (code_hash, label, created_at) VALUES (?, ?, ?)')
    .run(hash('DEMO-LOVE-2026'), '本地演示密码', now());
  console.log('已初始化本地演示密码：DEMO-LOVE-2026');
}

seedDemoCode();

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

async function readJson(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) throw new Error('请求内容过大。');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('请求格式不正确。');
  }
}

function getSession(req) {
  const rawToken = req.headers['x-session-token'];
  if (typeof rawToken !== 'string' || rawToken.length < 20) return null;
  return db.prepare(`
    SELECT sessions.id, sessions.code_id
    FROM sessions
    WHERE sessions.token_hash = ?
  `).get(hash(rawToken));
}

function validateResult(body) {
  const allowedTypes = new Set([
    'emotional-translator', 'steady-anchor', 'repairer', 'expander',
    'boundary-love', 'memory-curator', 'high-fit-partner', 'shared-language', 'rebuilding'
  ]);
  if (!body || !allowedTypes.has(body.resultType)) return null;
  if (!body.scores || typeof body.scores !== 'object') return null;
  const scoreKeys = ['responsiveness', 'reliability', 'repair', 'growth', 'boundaries', 'memory'];
  const scores = {};
  for (const key of scoreKeys) {
    const value = Number(body.scores[key]);
    if (!Number.isFinite(value) || value < 1 || value > 5) return null;
    scores[key] = Math.round(value * 100) / 100;
  }
  return { resultType: body.resultType, scores, savedAt: now() };
}

function staticFile(res, pathname) {
  const requestPath = pathname === '/' ? '/index.html' : pathname;
  const candidate = resolve(PUBLIC_DIR, `.${requestPath}`);
  if (!candidate.startsWith(PUBLIC_DIR) || !existsSync(candidate) || statSync(candidate).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(candidate)] || 'application/octet-stream' });
  createReadStream(candidate).pipe(res);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  try {
    if (req.method === 'POST' && url.pathname === '/api/access') {
      const body = await readJson(req);
      const password = String(body.password || '').trim().toUpperCase();
      if (password.length < 4 || password.length > 100) return sendError(res, 400, '请输入有效的测试密码。');
      const accessCode = db.prepare('SELECT id, used_at FROM access_codes WHERE code_hash = ?').get(hash(password));
      if (!accessCode) return sendError(res, 401, '密码不正确，请检查后重试。');
      if (accessCode.used_at) return sendError(res, 409, '该密码已完成一次测试，请使用新的测试密码。');
      const sessionToken = token();
      db.prepare('UPDATE access_codes SET used_at = ? WHERE id = ?').run(now(), accessCode.id);
      db.prepare('INSERT INTO sessions (code_id, token_hash, created_at) VALUES (?, ?, ?)')
        .run(accessCode.id, hash(sessionToken), now());
      return sendJson(res, 200, { sessionToken });
    }

    if (req.method === 'POST' && url.pathname === '/api/result') {
      const session = getSession(req);
      if (!session) return sendError(res, 401, '本次测试会话已失效，请使用新的测试密码。');
      const body = await readJson(req);
      const result = validateResult(body);
      if (!result) return sendError(res, 400, '结果数据不完整。');
      const existing = db.prepare('SELECT public_id FROM results WHERE code_id = ?').get(session.code_id);
      if (existing) {
        db.prepare('UPDATE results SET payload = ?, updated_at = ? WHERE code_id = ?')
          .run(JSON.stringify(result), now(), session.code_id);
        return sendJson(res, 200, { publicId: existing.public_id });
      }
      const id = publicId();
      db.prepare('INSERT INTO results (code_id, public_id, payload, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
        .run(session.code_id, id, JSON.stringify(result), now(), now());
      return sendJson(res, 201, { publicId: id });
    }

    if (req.method === 'GET' && url.pathname.startsWith('/api/share/')) {
      const id = url.pathname.slice('/api/share/'.length);
      if (!/^[A-Za-z0-9_-]{8,32}$/.test(id)) return sendError(res, 404, '结果不存在。');
      const row = db.prepare('SELECT public_id, payload, created_at FROM results WHERE public_id = ?').get(id);
      if (!row) return sendError(res, 404, '该结果链接不存在或已失效。');
      return sendJson(res, 200, { publicId: row.public_id, ...JSON.parse(row.payload), createdAt: row.created_at });
    }

    if (req.method === 'GET' && url.pathname === '/vendor/html2canvas.min.js') {
      const vendor = join(ROOT, 'node_modules', 'html2canvas', 'dist', 'html2canvas.min.js');
      res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=86400' });
      createReadStream(vendor).pipe(res);
      return;
    }

    if (req.method === 'GET') return staticFile(res, url.pathname);
    return sendError(res, 405, '不支持的请求方式。');
  } catch (error) {
    console.error(error);
    return sendError(res, 500, error instanceof Error ? error.message : '服务器暂时不可用。');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`测评网站已启动：http://localhost:${PORT}`);
});
