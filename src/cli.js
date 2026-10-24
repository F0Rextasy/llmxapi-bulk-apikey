#!/usr/bin/env node
'use strict';
/**
 * hk.llmxapi.com — zero-dependency bulk-account / key CLI.
 *
 * Panel: 一码科技 (new-api fork v1.0.0-rc.44).
 *
 * NOTE: sign-up credit is small (quota_per_unit 500000 -> ~$0.20/key) and check-in is OFF on this panel.
 *
 * The panel is a new-api fork with **no captcha** (`turnstile_check=false`), e-mail
 * verification, and **daily check-in funding** (no sign-up bonus): `POST /api/user/checkin` paid
 * {"quota_awarded":54438} (≈ $0.109 at quota_per_unit 500000) on 2026-10-21, so one account is worth
 * exactly one day's check-in — mint a key, then keep checking in to top it up.
 *
 *   node public-cli.js --count 3                 # register -> checkin -> token -> chat-200 -> keys.txt
 *   node public-cli.js --verify                  # re-verify every key already in keys.txt
 *   node public-cli.js --pool proxies.txt        # optional: rotate exits (http/https CONNECT + socks5)
 *   node public-cli.js --connect-9router         # register the provider on a local 9Router
 *
 * Nothing here needs a browser, a captcha solver or a third-party npm package.
 */
const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');
const os = require('os');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const BASE = (process.env.LLMXAPI_BASE || 'https://hk.llmxapi.com').replace(/\/$/, '');
const KEYS = path.join(HERE, 'keys.txt');
const KEYS_DEAD = path.join(HERE, 'keys-dead.txt');
/** The statuses that are the key's own verdict (quota and ban included). */
const REFUSED = new Set([401, 402, 403]);
const ACCOUNTS = path.join(HERE, 'accounts.jsonl');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const MAILBOX_API = 'https://www.emailnator.com';

const argv = process.argv.slice(2);
const has = (n) => argv.includes('--' + n) || argv.some((a) => a.startsWith('--' + n + '='));
const one = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const COUNT = parseInt(one('count', '1'), 10);
const MODEL = one('model', 'deepseek-v4.1-flash');
const ALT_MODELS = one('alt-models', 'deepseek-v4-flash,glm-5.2').split(',').filter(Boolean);
const POOL_FILE = one('pool', process.env.LLMXAPI_PROXIES || '');
const TIMEOUT_MS = parseInt(one('timeout', '25000'), 10);
const CODE_WAIT_MS = parseInt(one('code-wait', '420000'), 10); // the panel's SMTP can be slow (code TTL 10 min)

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ proxy plumbing (optional)
function parseProxy(line) {
  const m = /^(?:(socks5|socks4|https?):\/\/)?(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)$/.exec(String(line).trim());
  if (!m) return null;
  return { proto: (m[1] || 'http').toLowerCase(), user: m[2] || '', pass: m[3] || '', host: m[4], port: Number(m[5]) };
}
const pool = (() => {
  if (!POOL_FILE) return [];
  try { return fs.readFileSync(POOL_FILE, 'utf8').split(/\r?\n/).map(parseProxy).filter(Boolean); } catch { return []; }
})();
let poolIdx = 0;
function nextExit() { if (!pool.length) return null; const e = pool[poolIdx++ % pool.length]; return e; }

function openTunnel(proxy, host, port) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: proxy.host, port: proxy.port });
    const fail = (e) => { try { sock.destroy(); } catch { /* noop */ } reject(e); };
    sock.setTimeout(TIMEOUT_MS, () => fail(new Error('proxy timeout')));
    sock.once('error', fail);
    sock.once('connect', () => {
      if (proxy.proto.startsWith('socks')) {
        const target = Buffer.from(host);
        const req = proxy.user
          ? Buffer.concat([Buffer.from([5, 1, 2]), Buffer.from([1, proxy.user.length]), Buffer.from(proxy.user), Buffer.from([proxy.pass.length]), Buffer.from(proxy.pass)])
          : Buffer.from([5, 1, 0]);
        sock.write(req);
        let stage = 0;
        const onData = (b) => {
          if (stage === 0) {
            if (b[1] === 2) { sock.removeListener('data', onData); fail(new Error('socks5 wants auth but none given')); return; }
            if (b[1] !== 0) { sock.removeListener('data', onData); fail(new Error('socks5 method ' + b[1])); return; }
            stage = 1;
            sock.write(Buffer.concat([Buffer.from([5, 1, 0, 3, target.length]), target, Buffer.from([port >> 8, port & 0xff])]));
          } else if (stage === 1) {
            if (b[1] !== 0) { sock.removeListener('data', onData); fail(new Error('socks5 connect ' + b[1])); return; }
            const replyLen = 4 + (b[3] === 1 ? 4 : b[3] === 4 ? 16 : 1 + b[4]) + 2;
            if (b.length < replyLen) return; // wait for the full reply
            sock.removeListener('data', onData);
            sock.setTimeout(0);
            resolve(sock);
          }
        };
        sock.on('data', onData);
        return;
      }
      sock.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n${proxy.user ? `Proxy-Authorization: Basic ${Buffer.from(`${proxy.user}:${proxy.pass}`).toString('base64')}\r\n` : ''}Connection: keep-alive\r\n\r\n`);
      let buf = '';
      const onData = (b) => {
        buf += b.toString('latin1');
        if (!buf.includes('\r\n\r\n')) return;
        sock.removeListener('data', onData);
        if (!/^HTTP\/1\.[01] 2\d\d/.test(buf)) { fail(new Error('CONNECT ' + buf.split('\r\n')[0])); return; }
        sock.setTimeout(0);
        resolve(sock);
      };
      sock.on('data', onData);
    });
  });
}

/** tiny HTTP(S) JSON client: direct by default, through the pool when one is configured */
async function req(method, url, { body, headers = {}, exit = null } = {}) {
  const u = new URL(url);
  const payload = body === undefined ? null : Buffer.from(JSON.stringify(body));
  const baseHeaders = {
    accept: 'application/json, text/plain, */*',
    'user-agent': UA,
    origin: u.origin,
    referer: u.origin + '/',
    ...(payload ? { 'content-type': 'application/json', 'content-length': payload.length } : {}),
    ...headers,
  };
  const proxy = exit || nextExit();
  if (!proxy) { // direct
    const mod = u.protocol === 'https:' ? https : http;
    return new Promise((resolve, reject) => {
      const r = mod.request({ method, host: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + u.search, headers: baseHeaders, timeout: TIMEOUT_MS }, (res) => {
        let t = ''; res.setEncoding('utf8');
        res.on('data', (c) => { t += c; });
        res.on('end', () => resolve({ status: res.statusCode, text: t }));
      });
      r.on('timeout', () => r.destroy(new Error('timeout')));
      r.on('error', reject);
      if (payload) r.write(payload);
      r.end();
    });
  }
  const sock = await openTunnel(proxy, u.hostname, u.port || (u.protocol === 'https:' ? 443 : 80));
  // Hand-parsing the raw tunnel corrupted chunked bodies (measured 2026-10-24:
  // chunk-size lines landed *inside* the JSON and the body capped at 4096 bytes, so
  // every `/api/message-list` parse threw and the shared box read as empty while the
  // mail was sitting in it). Node's own client over the same tunnel frames it right —
  // the hand framing is deleted, not patched.
  const secure = u.protocol === 'https:'
    ? await new Promise((res, rej) => { const t = tls.connect({ socket: sock, servername: u.hostname }, () => res(t)); t.on('error', rej); })
    : sock;
  return new Promise((resolve, reject) => {
    const mod = u.protocol === 'https:' ? https : http;
    const r = mod.request(
      { method, host: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + u.search, headers: baseHeaders, createConnection: () => secure, timeout: TIMEOUT_MS },
      (res) => {
        let t = '';
        res.setEncoding('utf8');
        res.on('data', (c) => { t += c; });
        res.on('end', () => resolve({ status: res.statusCode, text: t }));
      }
    );
    r.on('timeout', () => r.destroy(new Error('timeout ' + u.hostname)));
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}
/** JSON body or `text/event-stream` deltas -> the reply text (some panels answer stream-shaped even for stream:false). */
function chatText(r) {
  const j = r.json;
  if (j && j.choices && j.choices[0]) {
    const m = j.choices[0].message || j.choices[0].delta || j.choices[0];
    const t = m.content || m.reasoning_content || m.text;
    if (t) return String(t);
  }
  const acc = [];
  for (const line of String(r.text || '').split(/\r?\n/)) {
    if (!line.startsWith('data:')) continue;
    const p = line.slice(5).trim();
    if (!p || p === '[DONE]') continue;
    try { const e = JSON.parse(p); const c = e.choices && e.choices[0]; const d = (c && (c.delta || c.message)) || {}; const t = d.content || d.reasoning_content; if (t) acc.push(t); } catch { /* skip */ }
  }
  return acc.join('');
}
async function api(method, p, opts = {}) {
  const r = await req(method, BASE + p, opts);
  let json = null; try { json = JSON.parse(r.text); } catch { /* not json */ }
  return { ...r, json };
}

// ------------------------------------------------------------------ mailbox (public gmail pool)
async function newGmail(exit) {
  const r = await req('POST', `${MAILBOX_API}/api/generate-email`, { body: { ids: [3] }, exit });
  const j = JSON.parse(r.text);
  const plain = String(j.email || j.address || '').replace(/\.(?=[^@]*@)/g, '');
  if (!plain.includes('@')) throw new Error('mailbox: ' + r.text.slice(0, 80));
  return plain;
}
async function inbox(address, exit) {
  // emailnator: POST /api/message-list {email,limit} -> json.messages[]; GET /api/message/<id> -> json.content
  const r = await req('POST', `${MAILBOX_API}/api/message-list`, { body: { email: address, limit: 20 }, exit });
  let j = null; try { j = JSON.parse(r.text); } catch { throw new Error('message-list: ' + r.text.slice(0, 80)); }
  const rows = j.messages || [];
  const out = [];
  for (const m of rows.slice(0, 10)) {
    let body = String(m.content || m.preview || '');
    try {
      const d = await req('GET', `${MAILBOX_API}/api/message/${encodeURIComponent(m.id)}`, { exit });
      const jd = JSON.parse(d.text);
      body = String(jd.content || jd.html || jd.text || body);
    } catch { /* keep the preview */ }
    out.push({ id: String(m.id || ''), from: m.from || '', subject: m.subject || '', body });
  }
  return out;
}
/**
 * Ids already in the box, taken BEFORE the code is asked for. The gmail pool is
 * shared and recycled: a mail that was already there belongs to another tenant
 * (a stale code submitted this way answered `Verification code is incorrect or
 * has expired`). A failed snapshot is not an empty box — it throws.
 */
async function snapshotIds(address, exit) {
  let last = null;
  for (let k = 0; k < 5; k++) {
    try { return new Set((await inbox(address, exit)).map((m) => m.id).filter(Boolean)); } catch (e) { last = e; await sleep(4000); }
  }
  throw new Error(`inbox snapshot failed: ${String((last && last.message) || last).slice(0, 90)}`);
}

/** the brand filter that took two lanes to learn: match the SENDER (a recycled box carries other panels' mail) */
const OURS = (m) => /llmxapi|一码/i.test(String(m.from)) || /llmxapi|一码/i.test(String(m.subject));
function codeOf(text) {
  const t = String(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const m = /验证码为[:：]?\s*([A-Za-z0-9]{4,8})/.exec(t) || /code[^0-9a-z]{0,20}([A-Za-z0-9]{4,8})/i.exec(t) || /\b([0-9a-f]{6})\b/i.exec(t) || /\b(\d{6})\b/.exec(t);
  return m ? m[1] : null;
}

// ------------------------------------------------------------------ mint one account
async function mintOne(idx) {
  const exit = nextExit();
  let email = null;
  for (let k = 0; k < 12 && !email; k++) {
    try { email = await newGmail(nextExit()); } catch (e) { log(`#${idx} mailbox ${k}: ${String(e.message).slice(0, 60)}`); }
  }
  if (!email) throw new Error('no mailbox');
  const baseline = await snapshotIds(email, exit);
  const sent = await api('GET', `/api/verification?email=${encodeURIComponent(email)}`, { exit });
  log(`#${idx} send-code`, sent.text.replace(/\s+/g, ' ').slice(0, 90));
  if (!(sent.json && sent.json.success)) {
    if (/already in use|already taken/i.test(sent.text)) return null; // recycled box: caller retries
    throw new Error('send-code: ' + sent.text.slice(0, 80));
  }

  const t0 = Date.now();
  let code = null;
  while (Date.now() - t0 < CODE_WAIT_MS && !code) {
    await sleep(8000);
    try {
      for (const m of await inbox(email, exit)) if (!baseline.has(m.id) && OURS(m)) { const c = codeOf(`${m.subject} ${m.body}`); if (c) { code = c; break; } }
    } catch { /* keep polling */ }
  }
  if (!code) throw new Error('no code mail (sender-brand filter: llmxapi|一码|YimaCode)');
  log(`#${idx} code`, code, 'box', email);

  const user = email.split('@')[0].replace(/[^A-Za-z0-9._-]/g, '').slice(0, 16) + Math.floor(Math.random() * 900 + 100);
  const pass = `Mx!${Math.random().toString(36).slice(2, 9)}9Z`;
  let reg = null;
  for (const v of [code, code.toLowerCase(), code.toUpperCase()]) {
    reg = await api('POST', '/api/user/register', { body: { username: user, password: pass, password2: pass, email, verification_code: v }, exit });
    log(`#${idx} register`, reg.text.replace(/\s+/g, ' ').slice(0, 110));
    if (reg.json && reg.json.success) break;
  }
  if (!(reg.json && reg.json.success)) return null;

  let access = reg.json.data && reg.json.data.access_token;
  if (!access) {
    for (const who of [user, email]) {
      const li = await api('POST', '/api/user/login', { body: { username: who, password: pass }, exit });
      access = (li.json && li.json.data && li.json.data.access_token) || (li.json && li.json.access_token);
      if (access) break;
    }
  }
  if (!access) throw new Error('no session');
  const auth = { authorization: `Bearer ${access}` };

  const self = await api('GET', '/api/user/self', { headers: auth, exit });
  const q0 = self.json && self.json.data && self.json.data.quota;
  const ci = await api('POST', '/api/user/checkin', { headers: auth, exit });
  const awarded = ci.json && ci.json.data && ci.json.data.quota_awarded;
  log(`#${idx} checkin`, `quota ${q0} + ${awarded === undefined ? '?' : awarded}`);
  const self2 = await api('GET', '/api/user/self', { headers: auth, exit });
  const q1 = self2.json && self2.json.data && self2.json.data.quota;

  await api('POST', '/api/token/', { headers: auth, exit, body: { name: 'auto', remain_quota: 500000, expired_time: -1, unlimited_quota: false, model_limits_enabled: false, model_limits: '', allow_ips: '', group: 'default' } });
  const list = await api('GET', '/api/token/?p=0&size=20', { headers: auth, exit });
  const items = (list.json && list.json.data && (list.json.data.items || list.json.data)) || [];
  let key = items.length ? (items[0].key || items[0].token) : null;
  const id = items.length ? items[0].id : undefined;
  if (key && key.includes('*') && id) {
    const rev = await api('POST', `/api/token/${id}/key`, { headers: auth, exit });
    key = (rev.json && rev.json.data && rev.json.data.key) || key;
  }
  if (!key) throw new Error('no key');
  const keyVariants = /^sk-/.test(key) ? [key, key.slice(3)] : [key, 'sk-' + key];

  for (const model of [MODEL, ...ALT_MODELS]) {
    let content = null;
    for (const kk of keyVariants) {
      const c = await api('POST', '/v1/chat/completions', {
        headers: { authorization: `Bearer ${kk}`, 'content-type': 'application/json' }, exit,
        body: { model, messages: [{ role: 'user', content: 'Reply with exactly: PONG' }], max_tokens: 64, stream: false },
      });
      content = chatText(c);
      if (content) { key = kk; break; }
      log(`#${idx} chat ${model}`, c.text.replace(/\s+/g, ' ').slice(0, 110));
    }
    log(`#${idx} chat ${model}`, content ? 'CONTENT ' + String(content).slice(0, 40) : c.text.replace(/\s+/g, ' ').slice(0, 110));
    if (content) {
      fs.appendFileSync(KEYS, key + '\n');
      fs.appendFileSync(ACCOUNTS, JSON.stringify({ ts: new Date().toISOString(), email, user, key, quotaBefore: q0, quotaAwarded: awarded ?? null, quota: q1, model, chat: 200, exit: exit ? `${exit.proto}://${exit.host}:${exit.port}` : 'direct' }) + '\n');
      return { email, key, model, quota: q1, awarded: awarded ?? null };
    }
  }
  return null;
}

async function verifyKeys() {
  const keys = fs.existsSync(KEYS) ? fs.readFileSync(KEYS, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
  let live = 0;
  const dead = [];
  for (const key of keys) {
    const exit = nextExit();
    const m = await api('GET', '/v1/models', { headers: { authorization: `Bearer ${key}` }, exit });
    const ids = (m.json && (m.json.data || m.json.models) || []).map((x) => x.id);
    const c = await api('POST', '/v1/chat/completions', {
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, exit,
      body: { model: MODEL, messages: [{ role: 'user', content: 'Reply with the single word: ok' }], max_tokens: 16, stream: false },
    });
    const content = chatText(c);
    if (content) live++;
    // 401/402/403 is this key's own verdict (quota and ban included); 429 and a
    // 5xx are a rate limit or a bad night for the panel, never a dead key. The
    // report line is `key<TAB>sebep<TAB>ISO`.
    else if (REFUSED.has(Number(m.status)) || REFUSED.has(Number(c.status))) dead.push({ key, why: REFUSED.has(Number(c.status)) ? c.status : m.status });
    log(`verify ${key.slice(0, 12)}… models=${ids.length} chat=${content ? '200 ' + JSON.stringify(String(content).slice(0, 20)) : c.text.replace(/\s+/g, ' ').slice(0, 80)}`);
  }
  if (dead.length) {
    const seen = fs.existsSync(KEYS_DEAD) ? fs.readFileSync(KEYS_DEAD, 'utf8') : '';
    for (const d of dead) if (!seen.includes(d.key)) fs.appendFileSync(KEYS_DEAD, `${d.key}\t${d.why}\t${new Date().toISOString()}\n`);
    const keep = keys.filter((k) => !dead.some((d) => d.key === k));
    fs.writeFileSync(KEYS, keep.length ? keep.join('\n') + '\n' : '');
    log(`dead keys: ${dead.length} → ${KEYS_DEAD} (out of keys.txt)`);
  }
  log(`verify done: ${live}/${keys.length} live`);
}

/** Revive stored accounts: log in with the credentials in `accounts.jsonl`, take the daily
 * check-in credit, create a token in group `default`, reveal the key and keep it only when a live
 * chat call succeeds. */
async function reviveKeys() {
  const file = one('acct', ACCOUNTS);
  if (!fs.existsSync(file)) { log('accounts.jsonl not found — nothing to revive'); return; }
  const rows = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l.trim().startsWith('{'))
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const have = new Set(fs.existsSync(KEYS) ? fs.readFileSync(KEYS, 'utf8').split(/\r?\n/).map((s2) => s2.trim()).filter(Boolean) : []);
  let live = 0;
  for (const a of rows) {
    if (!a.username || !a.password) continue;
    const exit = nextExit();
    const li = await api('POST', '/api/user/login', { exit, body: { username: a.username, password: a.password } });
    if (!(li.json && li.json.success)) { log('revive', a.email || a.username, 'login:', li.text.replace(/\s+/g, ' ').slice(0, 70)); continue; }
    const auth = { authorization: 'Bearer ' + li.json.data.access_token };
    const ci = await api('POST', '/api/user/checkin', { headers: auth, exit });
    await api('POST', '/api/token/', { headers: auth, exit, body: { name: 'auto', remain_quota: 500000, expired_time: -1, unlimited_quota: false, model_limits_enabled: false, model_limits: '', allow_ips: '', group: 'default' } });
    const list = await api('GET', '/api/token/?p=0&size=50', { headers: auth, exit });
    const items = (list.json && list.json.data && (list.json.data.items || list.json.data)) || [];
    const row = items.filter((t) => t.name === 'auto').pop() || items[0];
    let key = row && row.key;
    if (key && key.includes('*') && row.id) {
      const rev = await api('POST', `/api/token/${row.id}/key`, { headers: auth, exit });
      key = (rev.json && rev.json.data && rev.json.data.key) || key;
    }
    const variants = !key ? [] : /^sk-/.test(key) ? [key, key.slice(3)] : [key, 'sk-' + key];
    let ok = null;
    for (const kk of variants) {
      const c = await api('POST', '/v1/chat/completions', { headers: { authorization: 'Bearer ' + kk, 'content-type': 'application/json' }, exit, body: { model: MODEL, messages: [{ role: 'user', content: 'Reply with the single word: ok' }], max_tokens: 16, stream: false } });
      const content = chatText(c);
      if (content) { ok = kk; break; }
    }
    if (ok) { live++; if (!have.has(ok)) { fs.appendFileSync(KEYS, ok + '\n'); have.add(ok); } log('revive', a.email || a.username, 'LIVE', ok.slice(0, 12) + '…', 'checkin:', ci.text.replace(/s+/g, ' ').slice(0, 50)); }
    else log('revive', a.email || a.username, 'no live chat with a fresh token');
    await sleep(1500);
  }
  log(`revive done: ${live}/${rows.length} live -> ${KEYS}`);
}

function connect9Router() {
  const base = one('router9', 'http://localhost:20128');
  const keys = fs.existsSync(KEYS) ? fs.readFileSync(KEYS, 'utf8').trim() : '';
  if (!keys) { log('keys.txt is empty — mint first'); return; }
  const tmp = path.join(os.tmpdir(), `llmxapi-keys-${Date.now()}.txt`);
  fs.writeFileSync(tmp, keys + '\n');
  const r = spawnSync('npx', ['--yes', '9router', 'add-provider', '--name', 'Moxin Studio', '--prefix', 'moxin-studio',
    '--base-url', `${BASE}/v1`, '--keys-file', tmp, '--base', base, '--password', one('password', '123456')], { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) log('9router add-provider failed — install 9router or pass --router9 <url>');
}

(async () => {
  if (has('help') || argv.includes('-h')) {
    console.log(`hk.llmxapi.com (new-api) bulk-account CLI — zero dependencies, no captcha, no browser.

  node public-cli.js --count 3                  register accounts: e-mail code -> check-in -> key -> live chat check
  node public-cli.js --revive                   re-login stored accounts (accounts.jsonl), check in, mint a fresh key, verify
  node public-cli.js --verify                   re-test every key in keys.txt (models + a real completion)
  node public-cli.js --pool proxies.txt         optional exit pool (http/https CONNECT + socks5), one exit per account
  node public-cli.js --connect-9router          register the provider on a local 9Router (--router9 <url>, --password <pw>)

Flags: --count N --model <id> --alt-models a,b --timeout ms --code-wait ms --verify --revive --pool <file> --help

Panel: 一码科技 (new-api fork v1.0.0-rc.44). Live-verified model: deepseek-v4.1-flash. Mailboxes: the public Gmail pool
(https://www.emailnator.com) by default; only mail whose SENDER carries the brand (llmxapi|一码|YimaCode) is accepted,
because recycled boxes deliver other panels' codes. A key reaches keys.txt only after a real chat completion.`);
    return;
  }
  if (has('verify')) return verifyKeys();
  if (has('revive')) return reviveKeys();
  if (has('connect-9router')) return connect9Router();
  const ok = [];
  for (let i = 1; i <= COUNT; i++) {
    let got = null;
    for (let t = 1; t <= 3 && !got; t++) {
      try { got = await mintOne(`${i}.${t}`); } catch (e) { log(`#${i}.${t} FAIL`, String(e.message).slice(0, 90)); }
      if (!got && t < 3) await sleep(5000);
    }
    if (got) { ok.push(got); log(`#${i} OK`, got.key.slice(0, 12) + '…', 'quota', got.quota, '(+' + got.awarded + ')'); }
    else log(`#${i} gave up`);
    if (i < COUNT) await sleep(15000);
  }
  log(`done: ${ok.length}/${COUNT} key(s) -> ${KEYS}`);
  for (const k of ok) log('  ', k.email, k.key.slice(0, 12) + '…', 'model', k.model, 'quota', k.quota);
})().catch((e) => { console.error('FAIL:', e.stack || e.message); process.exit(1); });
