// CareerAI dev server: static files + a local AI coach endpoint with
// FREE-FIRST provider routing.
//
//   node server.js            (PORT defaults to 8000)
//
// The app itself is 100% client-side; this server adds one extra thing:
// POST /api/coach, which sends the analyzed resume text to an LLM and gets
// back full, personalized rewrites of the weak bullets. Provider order:
//
//   GROQ_API_KEY        → Groq free tier (llama-3.3-70b, ~1,000 req/day,
//                         free key at console.groq.com)  ← default free path
//   GEMINI_API_KEY      → Gemini free tier (aistudio.google.com, free key)
//   Ollama (no key)     → model on YOUR machine: zero cloud, zero limit,
//                         private (install Ollama, `ollama pull qwen2.5:14b`)
//   ANTHROPIC_API_KEY   → Claude Opus (paid; only used if you set it)
//
// Force a provider with AI_COACH_PROVIDER=groq|gemini|ollama|anthropic.
// Keys go in the environment, never in the repo:
//   setx GROQ_API_KEY gsk_...     (Windows, persistent)
//   $env:GROQ_API_KEY = 'gsk_...' (current PowerShell session)

const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';

// ---------------------------------------------------------------- client
// Only the Anthropic call uses the official SDK; the free providers are
// plain OpenAI-style / Google REST endpoints, no dependency needed.
let AnthropicClient = null;
if (process.env.ANTHROPIC_API_KEY) {
  try { AnthropicClient = new (require('@anthropic-ai/sdk').default || require('@anthropic-ai/sdk'))(); }
  catch { /* sdk missing — anthropic route just reports unavailable */ }
}

// ---------------------------------------------------------------- prompts
const COACH_SYSTEM =
  'You are a pragmatic resume coach who knows current ATS filters and how ' +
  'human recruiters actually screen. You are NOT a generic bullet-list ' +
  'generator: every suggestion must be grounded in a specific bullet from the ' +
  'resume the user pasted. Rewrite weak bullets to open with an action verb, ' +
  'and add a concrete metric only where the bullet is missing one — use a ' +
  'clearly editable placeholder like "N%" / "₹X" when the user’s real number ' +
  'is unknown, and never invent numbers as facts. Reply with JSON ONLY, ' +
  'exactly this shape: ' +
  '{"notes":"one-paragraph summary of the biggest ATS/HR issues you found","suggestions":[{"original":"the exact bullet text from the resume","suggested":"the full rewritten bullet","why":"one short sentence"}]}' +
  ' — top-level keys must be exactly "notes" and "suggestions".';

function coachUserMsg(targetRole, text) {
  return (targetRole ? 'Target role: ' + targetRole + '\n\n' : '') +
    'Resume text:\n---\n' + String(text).slice(0, 60000) + '\n---\n\n' +
    'Return the JSON now. Limit to the 12 weakest bullets.';
}

// Defensively parse the model output: some providers wrap JSON in fences or
// bury it in a longer answer.
function parseCoachJson(text) {
  let t = String(text || '').trim().replace(/^```(json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(t); } catch { /* fall through */ }
  const m = t.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* fall through */ } }
  return null;
}

// ---------------------------------------------------------------- providers
function providerStatus() {
  const list = [
    { id: 'groq', free: true, ready: !!process.env.GROQ_API_KEY,
      label: 'Groq free tier', model: 'llama-3.3-70b-versatile',
      hint: 'Free key at console.groq.com → set GROQ_API_KEY and restart' },
    { id: 'gemini', free: true, ready: !!process.env.GEMINI_API_KEY,
      label: 'Gemini free tier', model: 'gemini-2.5-flash',
      hint: 'Free key at aistudio.google.com → set GEMINI_API_KEY and restart' },
    { id: 'ollama', free: true, ready: false, live: true,
      label: 'Ollama on your machine', model: process.env.OLLAMA_MODEL || '(first installed)',
      hint: 'Install Ollama and run `ollama pull qwen2.5:14b` — no key, no cloud, no limit' },
    { id: 'anthropic', free: false, ready: !!process.env.ANTHROPIC_API_KEY && !!AnthropicClient,
      label: 'Claude Opus (paid)', model: 'claude-opus-5-5',
      hint: 'Set ANTHROPIC_API_KEY — costs money, only for quality comparisons' }
  ];
  return list;
}

async function checkOllama() {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 1200);
    const res = await fetch(OLLAMA_URL + '/api/tags', { signal: ctl.signal });
    clearTimeout(t);
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data.models) && data.models.length > 0;
  } catch { return false; }
}

async function selectedProvider() {
  const forced = process.env.AI_COACH_PROVIDER;
  const order = ['groq', 'gemini', 'ollama', 'anthropic'];
  const isReady = async p => {
    if (p === 'ollama') return checkOllama();
    if (p === 'anthropic') return !!(process.env.ANTHROPIC_API_KEY && AnthropicClient);
    return !!process.env[p.toUpperCase() + '_API_KEY'];
  };
  if (forced && order.includes(forced) && await isReady(forced)) return forced;
  for (const p of order) if (await isReady(p)) return p;
  return null;
}

async function callGroq(system, user) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.GROQ_API_KEY },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.4,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    })
  });
  if (!res.ok) throw new Error('Groq ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callGemini(system, user) {
  const key = process.env.GEMINI_API_KEY;
  let lastErr = null;
  // Stable id first, rolling alias as the safety net.
  for (const model of ['gemini-2.5-flash', 'gemini-flash-latest']) {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 4096, responseMimeType: 'application/json' }
        })
      });
    if (res.status === 404) { lastErr = new Error('Gemini model not found: ' + model); continue; }
    if (!res.ok) throw new Error('Gemini ' + res.status + ': ' + (await res.text()).slice(0, 200));
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  }
  throw lastErr || new Error('Gemini: no flash model available on free tier');
}

async function callOllama(system, user) {
  let model = process.env.OLLAMA_MODEL;
  let res;
  try {
    if (!model) {
      const tags = await (await fetch(OLLAMA_URL + '/api/tags')).json();
      model = (tags.models || [])[0]?.name;
      if (!model) throw new Error('No Ollama models installed — run `ollama pull qwen2.5:14b`');
    }
    res = await fetch(OLLAMA_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model, stream: false, format: 'json',
        options: { temperature: 0.4 },
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
      })
    });
  } catch (e) {
    if (e instanceof TypeError || /fetch|connect/i.test(String(e.message))) {
      throw new Error('Ollama is not responding at ' + OLLAMA_URL + ' — start Ollama, or use a free key instead (GROQ_API_KEY / GEMINI_API_KEY).');
    }
    throw e;
  }
  if (!res.ok) throw new Error('Ollama ' + res.status + ': ' + (await res.text()).slice(0, 200));
  const data = await res.json();
  return data.message?.content || '';
}

async function callAnthropic(system, user) {
  const response = await AnthropicClient.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    output_config: { effort: 'medium' },
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }]
  });
  if (response.stop_reason === 'refusal') throw new Error('The model refused this request; try again or trim the resume text.');
  return (response.content || [])
    .filter(b => b.type === 'text').map(b => b.text).join('');
}

const CALLERS = { groq: callGroq, gemini: callGemini, ollama: callOllama, anthropic: callAnthropic };

async function runCoach(resumeText, targetRole) {
  const p = await selectedProvider();
  if (!p) throw new Error('No AI route available. Free options: set GROQ_API_KEY (console.groq.com) or GEMINI_API_KEY (aistudio.google.com), or install Ollama and pull a model — zero cost, no cloud.');
  const raw = await CALLERS[p](COACH_SYSTEM, coachUserMsg(targetRole, resumeText));
  const data = parseCoachJson(raw);
  if (!data) throw new Error('Unparseable model output: ' + String(raw).slice(0, 200));
  const suggestions = Array.isArray(data.suggestions)
    ? data.suggestions.filter(s => s && s.original && s.suggested).slice(0, 20)
    : [];
  return { provider: p, notes: typeof data.notes === 'string' ? data.notes : '', suggestions };
}

// ---------------------------------------------------------------- http
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8'
};

function serveStatic(req, res) {
  let file = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (file === '/') file = '/index.html';
  if (file.split('/').some(seg => seg === '.git')) { res.writeHead(403); res.end('Forbidden'); return; }
  const full = path.normalize(path.join(ROOT, file));
  if (!full.startsWith(ROOT + path.sep) && full !== ROOT) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(full, (err, buf) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(full).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(buf);
  });
}

async function handleCoach(req, res) {
  let body = '';
  req.on('data', c => { body += c; if (body.length > 1_000_000) req.destroy(); });
  req.on('end', async () => {
    const send = (status, obj) => {
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://127.0.0.1:' + PORT
      });
      res.end(JSON.stringify(obj));
    };
    try {
      const { resumeText, targetRole } = JSON.parse(body || '{}');
      if (!resumeText || !String(resumeText).trim()) {
        return send(400, { ok: false, error: 'resumeText is required' });
      }
      const out = await runCoach(resumeText, targetRole);
      send(200, { ok: true, provider: out.provider, notes: out.notes, suggestions: out.suggestions });
    } catch (err) {
      console.error('[/api/coach]', err.message);
      send(502, { ok: false, error: err.message });
    }
  });
}

function handleProviders(res) {
  (async () => {
    const list = providerStatus();
    const ollama = list.find(p => p.id === 'ollama');
    ollama.ready = await checkOllama();
    const selected = await selectedProvider();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      selected,
      providers: list.map(p => ({ id: p.id, free: p.free, ready: p.ready, label: p.label, hint: p.hint }))
    }));
  })();
}

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/coach') return handleCoach(req, res);
  if (req.method === 'GET' && req.url === '/api/coach/providers') return handleProviders(res);
  if (req.method === 'OPTIONS' && req.url && req.url.startsWith('/api/coach')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://127.0.0.1:' + PORT,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    });
    return res.end();
  }
  serveStatic(req, res);
}).listen(PORT, '127.0.0.1', async () => {
  const freeOn = providerStatus().filter(p => p.id !== 'ollama' && p.ready).map(p => p.id);
  const localOn = await checkOllama();
  const who = freeOn.length ? 'free: ' + freeOn.join(' + ') : (localOn ? 'local: ollama' : 'NONE — set a free key (GROQ_API_KEY) or install Ollama');
  console.log('CareerAI dev server on http://127.0.0.1:' + PORT + ' — AI coach ' + who);
});
