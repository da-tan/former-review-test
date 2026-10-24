import { createHash, randomBytes } from 'node:crypto';

const countIndex = process.argv.indexOf('--count');
const requestedCount = countIndex > -1 ? Number(process.argv[countIndex + 1]) : 10;
const count = Number.isInteger(requestedCount) && requestedCount > 0 && requestedCount <= 10000 ? requestedCount : 10;
const labelIndex = process.argv.indexOf('--label');
const label = labelIndex > -1 ? String(process.argv[labelIndex + 1] || '').trim() : '批量生成';
const url = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');

if (!url || !serviceKey) {
  throw new Error('请设置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 后再生成密码。');
}

const hash = (value) => createHash('sha256').update(value).digest('hex');
const codes = [];
while (codes.length < count) {
  const code = `LOVE-${randomBytes(4).toString('hex').toUpperCase()}`;
  if (!codes.includes(code)) codes.push(code);
}

const response = await fetch(`${url}/rest/v1/access_codes`, {
  method: 'POST',
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal'
  },
  body: JSON.stringify(codes.map((code) => ({ code_hash: hash(code), label: label || null })))
});

if (!response.ok) throw new Error(`密码写入失败：${await response.text()}`);
console.log(codes.join('\n'));
