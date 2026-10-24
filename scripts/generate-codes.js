import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const countIndex = process.argv.indexOf('--count');
const requestedCount = countIndex > -1 ? Number(process.argv[countIndex + 1]) : 10;
const count = Number.isInteger(requestedCount) && requestedCount > 0 && requestedCount <= 10000 ? requestedCount : 10;
const ROOT = resolve('.');
const DATA_DIR = join(ROOT, 'data');
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(join(DATA_DIR, 'assessment.db'));
db.exec(`CREATE TABLE IF NOT EXISTS access_codes (
  id INTEGER PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  label TEXT,
  created_at TEXT NOT NULL,
  used_at TEXT
)`);

const hash = (value) => createHash('sha256').update(value).digest('hex');
const codes = [];
while (codes.length < count) {
  const code = `LOVE-${randomBytes(4).toString('hex').toUpperCase()}`;
  try {
    db.prepare('INSERT INTO access_codes (code_hash, label, created_at) VALUES (?, ?, ?)')
      .run(hash(code), '批量生成', new Date().toISOString());
    codes.push(code);
  } catch {
    // 极低概率碰撞时重新生成。
  }
}
console.log(codes.join('\n'));
