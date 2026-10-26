// Headless fixture harness: loads the REAL script.js with a minimal DOM shim,
// drives the real analyzeResumeBtn click handler, and inspects the real
// saveResumeProfile localStorage output. Production code paths
// (handler -> parseResume -> save -> template render) are what execute.
//
// Repo-resident copy of the verified harness; run with:  node tests/fixture-harness.cjs
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'script.js');

// Pinned "today" for the date-dependent checks. The production parser resolves
// "– Present" date ranges with `new Date()` AT ANALYSIS TIME, so any absolute
// number (e.g. B11d's "11.32 years") would drift as calendar time passes. To
// keep the suite deterministic on ANY run date, the context under test gets a
// PinnedDate whose arg-less `new Date()` and `Date.now()` return PINNED_NOW;
// every host-side expectation must compare against PINNED_NOW, never the live
// `new Date()`. Production code is unchanged.
const PINNED_NOW = new Date(2026, 9, 15); // 2026-10-15, local midnight
class PinnedDate extends Date {
  constructor(...args) { args.length ? super(...args) : super(PINNED_NOW); }
  static now() { return PINNED_NOW.getTime(); }
}

// ---------- generic element stub ----------
function makeEl(id) {
  const listeners = {};
  const el = {
    id,
    value: '',
    disabled: false,
    textContent: '',
    _innerHTML: '',
    innerHTML: {
      get: () => el._innerHTML,
      set: v => { el._innerHTML = String(v); }
    },
    dataset: {},
    style: { setProperty() {}, },
    classList: {
      _s: new Set(),
      add(...c) { c.forEach(x => this._s.add(x)); },
      remove(...c) { c.forEach(x => this._s.delete(x)); },
      toggle(c) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); },
      contains(c) { return this._s.has(c); }
    },
    children: [],
    attributes: {},
    addEventListener(t, fn) { (listeners[t] = listeners[t] || []).push(fn); },
    removeEventListener() {},
    get listeners() { return listeners; },
    fire(t, ev) { (listeners[t] || []).forEach(fn => fn(ev || { target: el, preventDefault() {}, stopPropagation() {} })); },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    removeAttribute(k) { delete this.attributes[k]; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    scrollIntoView() {},
    focus() {},
    click() { this.fire('click', { target: el, currentTarget: el, preventDefault() {}, stopPropagation() {} }); },
    appendChild() {},
    removeChild() {},
    get parentElement() { return null; },
    get offsetWidth() { return 800; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 800, height: 600 }; },
    dispatchEvent() { return true; },
    matches() { return false; },
    remove() {},
    insertBefore() {},
    contains() { return false; }
  };
  return el;
}

function buildSandbox(localStorageObj) {
  const elements = {};
  const doc = {
    _ls: localStorageObj,
    documentElement: Object.assign(makeEl('documentElement'), {
      style: { setProperty() {}, getPropertyValue: () => '' },
      getAttribute(k) { return k === 'data-theme' ? 'ink' : null; },
      setAttribute(k, v) { this.attributes[k] = v; }
    }),
    body: makeEl('body'),
    createElement(tag) { return makeEl('<' + tag + '>'); },
    createTextNode(t) { return { textContent: t }; },
    getElementById(id) { return (elements[id] = elements[id] || makeEl(id)); },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener(type, fn) { (this._l = this._l || {})[type] = fn; },
    removeEventListener() {},
    fireDOMContentLoaded() { const f = (this._l || {}).DOMContentLoaded; if (f) f(); },
    location: { href: 'http://127.0.0.1:8000/', origin: 'http://127.0.0.1:8000', reload() {} },
    title: 'test'
  };

  const lsShim = {
    store: localStorageObj,
    getItem(k) { return k in this.store ? this.store[k] : null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; },
    clear() { this.store = {}; }
  };

  const sandbox = {
    document: doc,
    localStorage: lsShim,
    navigator: { clipboard: { writeText: () => Promise.resolve() }, userAgent: 'node-harness' },
    fetch: () => Promise.reject(new Error('no network in harness')),
    Event: class Event { constructor(t) { this.type = t; } },
    DataTransfer: class { constructor() { this.items = { add() {} }; this.files = []; } },
    File: class {},
    URL: URL,
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    performance,
    Date: PinnedDate,
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    requestAnimationFrame: fn => setTimeout(fn, 0),
    alert: m => { sandbox.__alerts.push(String(m)); },
    confirm: () => true,
    atob: s => Buffer.from(s, 'base64').toString('binary'),
    btoa: s => Buffer.from(s, 'binary').toString('base64'),
    Uint8Array, ArrayBuffer, TextDecoder, TextEncoder,
    __alerts: [],
    __doc: doc,
    __elements: elements,
    __ls: lsShim
  };
  // Browsers auto-expose every element id as a window global; mirror that so
  // legacy bare-name references (e.g. discoveryResumeUpload) resolve.
  //
  // Trap invariants that matter here:
  //  - `has` must be HONEST. V8's contextify skips installing a realm
  //    built-in (Object, Array, JSON, ...) when the global reports it is
  //    already present; an always-true `has` makes every built-in resolve
  //    through `get` instead, which breaks `Object.values` inside the
  //    script under test.
  //  - `get` must never shadow a host built-in name with an element stub;
  //    only names the host realm does not know (i.e. genuine DOM element
  //    ids) may fall back to the lazy element registry.
  const globalProxy = new Proxy(sandbox, {
    get(t, k) {
      if (typeof k !== 'string' || k in t) return t[k];
      if (k in globalThis) return globalThis[k];
      return t.__doc.getElementById(k);
    },
    set(t, k, v) { t[k] = v; return true; },
    has(t, k) {
      if (typeof k !== 'string') return k in t;
      return (k in t) || !(k in globalThis);
    }
  });
  sandbox.window = globalProxy;
  sandbox.globalThis = globalProxy;
  return globalProxy;
}

function loadApp(lsSeed) {
  const code = fs.readFileSync(SRC, 'utf8');
  const ctx = buildSandbox(lsSeed || {});
  vm.createContext(ctx);
  // Studio content data (templates / examples / resource links), loaded the
  // same way index.html loads it: before script.js, exposing window.STUDIO_*.
  const DATA = path.join(ROOT, 'studio-data.js');
  if (fs.existsSync(DATA)) {
    vm.runInContext(fs.readFileSync(DATA, 'utf8'), ctx, { filename: 'studio-data.js' });
  }
  vm.runInContext(code, ctx, { filename: 'script.js' });
  ctx.__doc.fireDOMContentLoaded();
  return ctx;
}

// Run one fixture through the REAL Analyze click handler and return the saved
// profile (parsed from the real localStorage shim the app wrote to).
function runFixture(fixtureText, label, prep) {
  const sb = loadApp({});
  if (prep) prep(sb);
  const input = sb.__doc.getElementById('resumeInput');
  input.value = fixtureText;
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', { target: input, preventDefault() {}, stopPropagation() {} });
  const raw = sb.__ls.getItem('resumeProfile');
  if (!raw) throw new Error(label + ': resumeProfile was NOT saved');
  const p = JSON.parse(raw);
  const alerts = sb.__alerts;
  return { p, alerts, alertsEmpty: alerts.length === 0, sb };
}

// ---------- fixtures (exact contents of resume-fixtures/*.txt) ----------
const FIX = path.join(ROOT, 'resume-fixtures');
const fx = n => fs.readFileSync(path.join(FIX, n), 'utf8');

const results = [];
function check(name, cond, detail) {
  results.push({ name, pass: !!cond, detail });
}

// 1. no-dates: stated fallback
{
  const { p, alertsEmpty } = runFixture(fx('no-dates.txt'), 'no-dates');
  check('no-dates: statedExperience = 9', p.statedExperience === 9, JSON.stringify(p.statedExperience));
  check('no-dates: experienceSource = stated', p.experienceSource === 'stated', p.experienceSource);
  check('no-dates: totalExperience = 0 (no parseable dates)', p.totalExperience === 0, p.totalExperience);
  check('no-dates: skills deduped & include keyword hits', new Set(p.skills.map(s => s.toLowerCase().trim())).size === p.skills.length && p.skills.some(s => /excel/i.test(s)), JSON.stringify(p.skills));
  check('no-dates: no alerts fired', alertsEmpty, JSON.stringify([]));
}

// 2. overlapping-dates: union sweep-line unchanged (approx 5.8 yrs)
{
  const { p } = runFixture(fx('overlapping-dates.txt'), 'overlapping');
  check('overlapping: union totalExperience ~5.8 yrs', Math.abs(p.totalExperience - 5.8) < 0.25, Math.round(p.totalExperience * 100) / 100);
  check('overlapping: experienceSource = dates', p.experienceSource === 'dates', p.experienceSource);
}

// 3. it-manager: stated skills + dedupe + multi-word intact
{
  const { p } = runFixture(fx('it-manager.txt'), 'it-manager');
  check('it-manager: totalExperience ~11.3 yrs', Math.abs(p.totalExperience - 11.3) < 0.4, Math.round(p.totalExperience * 100) / 100);
  check('it-manager: statedExperience null or 12 (dates win)', p.statedExperience === null || p.statedExperience === 12, JSON.stringify(p.statedExperience));
  check('it-manager: "active directory" intact (fixed splitter)', p.statedSkills.includes('active directory'), JSON.stringify(p.statedSkills));
  check('it-manager: "vendor management" intact', p.statedSkills.includes('vendor management'), JSON.stringify(p.statedSkills));
  check('it-manager: no duplicates in allSkills', new Set(p.allSkills.map(s => s.toLowerCase().replace(/\s+/g, ' '))).size === p.allSkills.length, p.allSkills.length + ' items');
  check('it-manager: "aws" appears exactly once in allSkills', p.allSkills.filter(s => s.toLowerCase() === 'aws').length === 1, JSON.stringify(p.allSkills.filter(s => /aws/i.test(s))));
  check('it-manager: "express" not mangled (splitter regression check)', !p.statedSkills.some(s => /^expre/.test(s)), JSON.stringify(p.statedSkills.filter(s => /expre/.test(s))));
}

// 4. fresher: intern-only -> small, NOT zero-penalized as 'none'
{
  const { p } = runFixture(fx('fresher.txt'), 'fresher');
  check('fresher: totalExperience > 0 (internship counted)', p.totalExperience > 0, Math.round(p.totalExperience * 1000) / 1000);
  // Rule: 'dates' only when parsed total >= 0.5y; fresher parses 0.167y and
  // states no "N years" claim -> 'unknown' is correct (the 0.167 value is
  // still carried in totalExperience). Also assert no stated fabrication.
  check('fresher: experienceSource = unknown (0.167y < 0.5 gate, no stated claim)',
        p.experienceSource === 'unknown' && p.statedExperience === null,
        p.experienceSource + ' / stated=' + p.statedExperience);
}

// 5. no-metrics-short: honest zeros/unknown
{
  const { p } = runFixture(fx('no-metrics-short.txt'), 'no-metrics');
  check('no-metrics: totalExperience = 0', p.totalExperience === 0, p.totalExperience);
  check('no-metrics: statedExperience = null', p.statedExperience === null, JSON.stringify(p.statedExperience));
  check('no-metrics: experienceSource = unknown', p.experienceSource === 'unknown', p.experienceSource);
}

// 6. special-chars: no crash (crash check + French dates stay unparsed)
{
  let crashed = false;
  let p = null;
  try { const r = runFixture(fx('special-chars.txt'), 'special-chars'); p = r.p; } catch (e) { crashed = true; }
  check('special-chars: no crash', !crashed, crashed ? 'threw' : 'ok');
  if (p) check('special-chars: French dates not fabricated (totalExp 0)', p.totalExperience === 0, p.totalExperience);
}

// 7. career-switcher: dated range wins over stated "6 years"
{
  const { p } = runFixture(fx('career-switcher.txt'), 'career-switcher');
  check('career-switcher: dates ~5.0 yrs beat stated 6', Math.abs(p.totalExperience - 5) < 0.3 && p.experienceSource === 'dates', Math.round(p.totalExperience * 100) / 100 + ' / ' + p.experienceSource);
}

// 8. unusual-headings: 01/2018-12/2021 parsed (~3.92)
{
  const { p } = runFixture(fx('unusual-headings.txt'), 'unusual');
  check('unusual-headings: totalExperience ~3.92 yrs', Math.abs(p.totalExperience - 3.92) < 0.2, Math.round(p.totalExperience * 100) / 100);
}

// 9. legacy saved profile (pre-rebuild shape): app boots + no crash
{
  const legacy = {
    rawText: 'Old candidate\nSenior Dev (2015 - 2020)',
    skills: ['excel', 'excel'],
    totalExperience: 4.5,
    education: [{ degree: 'B.Sc', field: 'CS', institution: 'X' }],
    contactInfo: {}
  };
  const sb = loadApp({ resumeProfile: JSON.stringify(legacy), resumeProfileMeta: JSON.stringify({ source: 'user', label: 'legacy', savedAt: '2026-01-01' }) });
  const errs = sb.__alerts;
  check('legacy: app boots without alerts', errs.length === 0, JSON.stringify(errs));
  const p = JSON.parse(sb.__ls.getItem('resumeProfile'));
  check('legacy: profile load kept (not dropped)', !!p && p.totalExperience === 4.5, JSON.stringify(p && p.totalExperience));
}

// 10. AI coach wiring survives: handlers registered on resumeResults
{
  const sb = loadApp({});
  sb.__doc.getElementById('resumeInput').value = 'x\n- led team of 4';
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', {});
  const rr = sb.__doc.getElementById('resumeResults');
  const hasCoachUi = rr.innerHTML.includes('aiCoachBtn') && rr.innerHTML.includes('aiCoachProviders');
  check('ai-coach: card still rendered after analyze', hasCoachUi, hasCoachUi ? 'aiCoachBtn + aiCoachProviders present' : 'MISSING');
  const clickHandlers = (rr.listeners['click'] || []).length;
  check('ai-coach: click handler (Apply/Copy/AI) still registered', clickHandlers >= 1, clickHandlers + ' handlers');
}

// ================= Commit B: extended assertions =================
// (display labels, "As listed by you", role-aware ATS, bulletSource — the
// 27 checks above remain the unmodified Commit A suite.)

// 11. Experience-source display labels (fresher 0.167y case included)
{
  const { sb } = runFixture(fx('no-dates.txt'), 'B11a');
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  const careerFitStat = sb.__doc.getElementById('total-experience').textContent;
  check('B11a no-dates: stated label "≈9.00 years stated exp." on career-fit stat',
        careerFitStat.includes('≈9.00') && careerFitStat.toLowerCase().includes('stated exp.'), careerFitStat);
  check('B11a no-dates: score stat carries the stated prefix', html.includes('≈9.00 years') && html.toLowerCase().includes('stated exp.'), 'resumeResults');
}
{
  const { sb } = runFixture(fx('fresher.txt'), 'B11b');
  const careerFitStat = sb.__doc.getElementById('total-experience').textContent;
  check('B11b fresher 0.167y: shows "2 months" with the thin-dated label',
        careerFitStat.includes('2 months') && careerFitStat.toLowerCase().includes('<0.5y dated'), careerFitStat);
  check('B11b fresher 0.167y: NOT "no dates found" and NOT a stated label',
        !careerFitStat.toLowerCase().includes('no dates found') && !careerFitStat.includes('≈'), careerFitStat);
}
{
  const { sb } = runFixture(fx('no-metrics-short.txt'), 'B11c');
  const careerFitStat = sb.__doc.getElementById('total-experience').textContent;
  check('B11c no-metrics: honest "0 months no dates found"',
        careerFitStat.includes('0 months') && careerFitStat.toLowerCase().includes('no dates found'), careerFitStat);
}
{
  const { sb } = runFixture(fx('it-manager.txt'), 'B11d');
  const careerFitStat = sb.__doc.getElementById('total-experience').textContent;
  check('B11d it-manager: plain dated label "11.30 years" as of pinned today 2026-10-15 (no ≈, no thin/no-dates wording)',
        careerFitStat.includes('11.30') && !careerFitStat.includes('≈') && !careerFitStat.toLowerCase().includes('no dates found'), careerFitStat);
}

// 12. "As listed by you" skill group (canonicalSkill-separated)
{
  const { sb } = runFixture(fx('it-manager.txt'), 'B12a');
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  const g0 = html.indexOf('As listed by you');
  // Slice exactly the group's own chip container: the "skill-chips" div that
  // follows the "As listed by you" header, up to its closing tag.
  const chipStart = g0 >= 0 ? html.indexOf('skill-chips', g0) : -1;
  const chipEnd = chipStart >= 0 ? html.indexOf('</div>', chipStart) : -1;
  const groupChips = (chipStart >= 0 && chipEnd > chipStart) ? html.slice(chipStart, chipEnd) : '';
  check('B12a it-manager: dedicated "As listed by you" group present', g0 >= 0, 'index ' + g0);
  // Keyword-detected skills (aws, azure, kubernetes, jira, "active directory",
  // "vendor management") are correctly EXCLUDED from the stated-only group;
  // the group holds exactly the tokens detection missed.
  check('B12a it-manager: stated-only chips are exactly the undetected ones',
        groupChips.includes('itil') && groupChips.includes('iso 27001')
        && groupChips.includes('servicenow') && groupChips.includes('powershell')
        && !groupChips.includes('active directory') && !groupChips.includes('vendor management'),
        groupChips.slice(0, 200));
  check('B12a it-manager: keyword-detected "aws" NOT in the stated-only group', !groupChips.includes('aws'), '');
}
{
  const { sb } = runFixture(fx('no-dates.txt'), 'B12b');
  check('B12b no-dates: no "As listed by you" group (inline Tools line is not a section)',
        !sb.__doc.getElementById('resumeResults').innerHTML.includes('As listed by you'), 'resumeResults');
}

// 13. Role-aware ATS labeling
{
  const { sb } = runFixture(fx('it-manager.txt'), 'B13a');
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  check('B13a no role selected: generic, clearly-labeled vocabulary',
        html.includes('Generic keyword coverage') && html.includes('in-demand set'), 'generic labels present');
}
{
  const { sb } = runFixture(fx('it-manager.txt'), 'B13b',
    prep => { prep.__doc.getElementById('targetRoleSelect').value = 'data-analyst'; });
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  check('B13b role selected: target-role ATS labeling',
        html.includes('Target-role keywords') && html.includes('Against') && !html.includes('Generic keyword coverage'), 'target labels present');
}

// 14. bulletSource fallback + preserved Apply/Copy
{
  const { sb } = runFixture(
    'J. Doe\njd@x.com\nManaged a small team and produced weekly reports for leadership.\nTools: Excel',
    'B14a');
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  check('B14a no markers + no dates: "No bullets detected" (honest zero, not silent)',
        html.includes('No bullets detected') && html.includes('no bullets detected'), 'labels present');
}
{
  const { sb } = runFixture(
    'S. Dev\nsdev@x.com\n\nDeveloper, Acme Corp (Jan 2021 – Present)\nBuilt REST APIs serving 40 services\nAutomated the CI pipeline, cutting build time 35%\n\nSkills\nJavaScript, Node.js, PostgreSQL',
    'B14b');
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  check('B14b unmarked job entries: bullets parsed from responsibilities, labeled as such',
        html.includes('(parsed from your job entries)') && !html.includes('No bullets detected'), 'parsed label present');
}
{
  const { sb } = runFixture(fx('it-manager.txt'), 'B14c');
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  check('B14c marker path regression: quantified bullets shown, NO parsed annotation',
        html.includes('quantified bullets') && !html.includes('(parsed from your job entries)'), 'markers path clean');
}
{
  // Indicator-bearing lines under a dated entry so the parsed-responsibility
  // path produces bullets (extractResponsibilities matches "built"/"improved");
  // none carry a number, so impact-fix rows must be generated from them.
  const { sb } = runFixture(
    'D. Person\ndp@x.com\n\nJunior Analyst, Co (Jan 2023 – Present)\nBuilt monthly reporting templates for the team\nImproved the archive filing process end to end\n\nSkills\nExcel',
    'B14d');
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  // The range line is stripped from parsed responsibilities (P6), so this
  // numberless bullet gets BOTH an impact row and a verb row; anchor on the
  // verb-kind attributes (rf-fix-input also occurs in the AI-coach block).
  check('B14d Apply/Copy machinery preserved (parsed bullet -> verb rf-fix row + Apply + Copy)',
        html.includes('rf-fix-input" data-kind="verb"')
        && html.includes('data-kind="verb" data-apply-fix="0"')
        && html.includes('data-kind="verb" data-copy-fix="0"'),
        'verb rf-fix input + Apply + Copy buttons');
}

// ================= Phase 1: resume-analysis accuracy fixes =================

// P1. Multi-line education block (degree / institution / dates) must not
// count as work experience; the job range above it must still count.
{
  const { p } = runFixture(fx('edu-block.txt'), 'P1');
  const expected = (PINNED_NOW - new Date(2019, 0, 1)) / (365.25 * 86400000); // Jan 2019 -> pinned today
  check('P1a edu-block: "B.Tech / IIT Delhi / 2015 – 2019" excluded from experience',
        Math.abs(p.totalExperience - expected) < 0.3,
        Math.round(p.totalExperience * 100) / 100 + ' (expected ~' + expected.toFixed(2) + ', +4.0 if education leaked in)');
}

// P2. A flipped range ("Jun 2023 – Jan 2021") is normalized, not dropped.
{
  const { p } = runFixture(fx('inverted-range.txt'), 'P2');
  const expected = (new Date(2023, 5, 1) - new Date(2021, 0, 1)) / (365.25 * 86400000); // ≈ 2.42
  check('P2 inverted range normalized (Jan 2021 -> Jun 2023 ≈ 2.42 yrs)',
        Math.abs(p.totalExperience - expected) < 0.25,
        Math.round(p.totalExperience * 100) / 100 + ' (0 before the fix)');
}

// P3. A fresher's "0 – 2 years" range is a lower bound of 0, not a 2-year claim.
{
  const { p, sb } = runFixture(fx('fresher-range.txt'), 'P3');
  const stat = sb.__doc.getElementById('total-experience').textContent;
  check('P3a "0 - 2 years" -> statedExperience = 0, not the upper bound 2',
        p.statedExperience === 0 && p.totalExperience === 0,
        'stated=' + p.statedExperience + ' total=' + p.totalExperience);
  check('P3b no 2-year claim shown in the career-fit stat',
        !stat.includes('2.00'), stat);
}

// P4. Match flow must honor the stated figure when no dates parse.
// (no-dates.txt claims 9 years; JD needs 5.)
{
  const sb = loadApp({});
  sb.__doc.getElementById('resumeInput').value = fx('no-dates.txt');
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', {});
  // "5 years of experience" is the wording extractExperienceRequired actually
  // recognizes ("Experience required: 5 years" is NOT — it reads as no
  // requirement, which would hand out the full experience credit).
  sb.__doc.getElementById('jobInput').value =
    'Business Analyst\n5 years of experience required\nSkills: Excel, Power BI, SQL, reporting';
  sb.__doc.getElementById('analyzeJobBtn').fire('click', {});
  sb.__doc.getElementById('calculateMatchBtn').fire('click', {});
  const stat = sb.__doc.getElementById('total-experience').textContent;
  const fb = sb.__doc.getElementById('career-fit-feedback').textContent;
  check('P4a career-fit stat shows the stated ≈9.00 years (was "0.00 years" before)',
        stat.includes('≈9.00'), stat);
  check('P4b stated 9 yrs counts in the experience match (Excellent, not Fair/Limited)',
        fb.startsWith('Excellent match'), fb);
}

// P5. C++ / C# written in prose are keyword-detected (trailing \b bug).
{
  const { p } = runFixture(
    'C. Plus\nc.plus@example.com\nMaintained C++ microservices and C# web services\nBuilt data pipelines in SQL',
    'P5');
  check('P5 C++ and C# detected in prose',
        p.skills.some(s => s.toLowerCase() === 'c++') && p.skills.some(s => s.toLowerCase() === 'c#'),
        JSON.stringify(p.skills));
}

// P6. Parsed (unmarked) responsibility bullets: the date range must not leak
// into the bullet, so a numberless bullet is NOT falsely quantified.
{
  const { sb } = runFixture(
    'S. Dev\ns.dev@example.com\nJunior Ops, WidgetCo (Jan 2023 – Present)\nBuilt weekly cost dashboards for leadership\nImproved the filing process end to end\n\nSkills\nExcel',
    'P6');
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  check('P6 parsed numberless bullet: 0/1 quantified + an impact fix row offered',
        html.includes('0/1 quantified') && html.includes('rf-fix-input" data-kind="impact"'),
        'impact row + 0/1 quantified strip');
}

// P7. A single-letter JD skill ("R") must not substring-match resume skills
// ("reporting" contains "r").
{
  const sb = loadApp({});
  sb.__doc.getElementById('resumeInput').value = 'T. Test\nt.t@example.com\nSkills\nExcel, reporting';
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', {});
  sb.__doc.getElementById('jobInput').value =
    'Business Analyst\n3 years of experience required\nSkills: R, Excel';
  sb.__doc.getElementById('analyzeJobBtn').fire('click', {});
  sb.__doc.getElementById('calculateMatchBtn').fire('click', {});
  const fb = sb.__doc.getElementById('career-fit-feedback').textContent;
  check('P7 single-char "R" not matched via substring (Fair, not Good)',
        fb.startsWith('Fair match'), fb);
}

// P8. Different target role -> its own ATS vocabulary in the check.
{
  const { sb } = runFixture(fx('it-manager.txt'), 'P8',
    prep => { prep.__doc.getElementById('targetRoleSelect').value = 'business-intelligence-analyst'; });
  const html = sb.__doc.getElementById('resumeResults').innerHTML;
  check('P8 different role: "Against" + "Business Intelligence Analyst" vocabulary',
        html.includes('Against') && html.includes('Business Intelligence Analyst'), 'role label present');
}

// P9. Education fallbacks no longer invent a field of study.
{
  const { p } = runFixture(fx('no-dates.txt'), 'P9');
  check('P9 "B.Com, Pune" entry has an empty (uninvented) field',
        Array.isArray(p.education) && p.education.length === 1 && p.education[0].field === '',
        JSON.stringify(p.education));
}

// ================= Phase 2: Resume Studio =================

// Studio helpers: the pane re-renders itself into #studioContent and wires
// ONE delegated click/change/input listener on that host, so tests fire the
// host with a fake target that emulates closest('[data-studio-*]').
function openStudio(sb) {
  sb.__doc.getElementById('studio-tab').fire('click');
  return sb.__doc.getElementById('studioContent').innerHTML;
}
// attr is the full attribute, e.g. 'data-studio-improve-go'. The app's
// delegated handler resolves elements via target.closest('[data-studio-…]')
// and reads el.dataset.studio<Part> (dataset camelCases the part after
// 'data-studio-').
function studioAttrKey(attr) {
  // data-studio-wf -> studioWf; data-studio-improve-go -> studioImproveGo
  const rest = attr.replace(/^data-studio-/, '');
  return 'studio' + rest.charAt(0).toUpperCase() + rest.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
function studioClick(sb, attr, value) {
  const host = sb.__doc.getElementById('studioContent');
  const sel = '[' + attr + ']';
  const fake = {
    dataset: {},
    closest(s) { return s === sel ? fake : null; }
  };
  fake.dataset[studioAttrKey(attr)] = value;
  host.fire('click', { target: fake, preventDefault() {}, stopPropagation() {} });
}
function studioChangeAccept(sb, suggId) {
  const host = sb.__doc.getElementById('studioContent');
  const fake = {
    dataset: { studioAccept: suggId },
    checked: true,
    closest(sel) { return sel === '[data-studio-accept]' ? fake : null; }
  };
  host.fire('change', { target: fake });
}
// Textarea contents live in the pane's innerHTML (the harness element stubs
// do not hydrate <textarea value> from HTML), so read them from there.
function studioTextarea(sb, id) {
  const host = sb.__doc.getElementById('studioContent').innerHTML;
  const m = host.match(new RegExp('<textarea id="' + id + '"[^>]*>([\\s\\S]*?)</textarea>'));
  return m ? m[1] : '';
}

// S1. Studio opens with NO saved profile: honest empty state + workflows.
{
  const sb = loadApp({});
  const html = openStudio(sb);
  check('S1 studio opens with no profile: empty state points to Resume tab',
        html.includes('No saved resume profile yet') && html.includes('data-studio-goresume'),
        'empty state + go-resume button');
  check('S1b studio: three workflows rendered',
        html.includes('data-studio-wf="improve"') && html.includes('data-studio-wf="new"') && html.includes('data-studio-wf="examples"'),
        'workflow buttons');
}

// S2. Improve: rule-based suggestions from the shared saved profile.
{
  const sb = loadApp({});
  sb.__doc.getElementById('resumeInput').value = fx('it-manager.txt');
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', {});
  openStudio(sb);
  sb.__doc.getElementById('studioRole').value = 'data-analyst';
  studioClick(sb, 'data-studio-improve-go');
  const html = sb.__doc.getElementById('studioContent').innerHTML;
  const acceptIds = (html.match(/data-studio-accept="([^"]+)"/g) || []).map(x => x.match(/"([^"]+)"/)[1]);
  // it-manager's bullets are all strong and quantified, so its suggestions
  // are the informational role-gap hints (no Accept boxes) — the actionable
  // Accept-box path is exercised by S3/S4 with the weak-opener fixture.
  check('S2 improve: suggestions rendered with evidence labels',
        html.includes('Rule-based suggestions') && html.includes('needs your input')
        && (html.match(/class="studio-sugg /g) || []).length >= 3,
        (html.match(/class="studio-sugg /g) || []).length + ' suggestion cards');
  check('S2b improve: role-gap hints labeled "needs your input"',
        html.includes('needs your input') && html.includes('Data Analyst'),
        'needs-input chip + role name');
}

// S3. Accepting a suggestion changes ONLY the draft; source profile intact.
// (The weak-opener fixture produces a factual-rewrite suggestion with an
// Accept box; it-manager's bullets are all strong/quantified, so its
// suggestions are informational-only and offer nothing to apply.)
{
  const fixtureText = 'W. Ops\nw.ops@example.com\n- responsible for managing the monthly close\n- led a small finance team\nSkills\nExcel';
  const sb = loadApp({});
  sb.__doc.getElementById('resumeInput').value = fixtureText;
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', {});
  openStudio(sb);
  studioClick(sb, 'data-studio-improve-go');
  const html0 = sb.__doc.getElementById('studioContent').innerHTML;
  const firstId = (html0.match(/data-studio-accept="([^"]+)"/) || [])[1];
  check('S3a weak opener: a factual-rewrite suggestion with Accept box exists',
        !!firstId && html0.includes('factual rewrite'), 'acceptable suggestion present');
  studioChangeAccept(sb, firstId);
  studioClick(sb, 'data-studio-apply');
  const draft = studioTextarea(sb, 'studioDraft');
  const source = JSON.parse(sb.__ls.getItem('resumeProfile')).rawText;
  check('S3 apply: weak opener rewritten to "Managed the monthly close" in the draft',
        draft.includes('• Managed the monthly close') && !draft.includes('responsible for managing'),
        'rewrite applied to draft only');
  check('S3b apply: saved source resume UNCHANGED', source === fixtureText.trim(), 'rawText identical (analyze trims pasted text)');
  check('S3c apply: flash confirms the apply', sb.__doc.getElementById('studioFlash').textContent.includes('applied'), 'flash text');
}

// S4. Rejecting (accepting nothing) leaves the draft untouched.
{
  const fixtureText = 'W. Ops\nw.ops@example.com\n- responsible for managing the monthly close\n- led a small finance team\nSkills\nExcel';
  const sb = loadApp({});
  sb.__doc.getElementById('resumeInput').value = fixtureText;
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', {});
  openStudio(sb);
  studioClick(sb, 'data-studio-improve-go');
  studioClick(sb, 'data-studio-apply');
  const draft = studioTextarea(sb, 'studioDraft');
  check('S4 no acceptance: draft equals the source text',
        draft === fixtureText && sb.__doc.getElementById('studioFlash').textContent.includes('Nothing accepted'),
        'draft untouched');
}

// S5/S6. New draft built from the profile: real data in, explicit placeholders,
// source profile never overwritten.
{
  const fixtureText = fx('it-manager.txt');
  const sb = loadApp({});
  sb.__doc.getElementById('resumeInput').value = fixtureText;
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', {});
  openStudio(sb);
  studioClick(sb, 'data-studio-wf', 'new');
  studioClick(sb, 'data-studio-new-go');
  const draft = studioTextarea(sb, 'studioNewDraft');
  const pv = sb.__doc.getElementById('studioContent').innerHTML;
  check('S5 new draft: profile facts carried into the draft',
        draft.includes('Vikram Iyer') && draft.includes('Senior IT Manager') && /\baws\b/i.test(draft),
        'name + role + skills present');
  check('S5b new draft: missing data are explicit placeholders, not inventions',
        draft.includes('[Add your projects]') && !draft.includes('FabricatedCorp'),
        '[Add …] placeholders');
  check('S5c preview reflects the selected structure',
        pv.includes('data-template="ats-single-column"') && pv.includes('studio-pv'),
        'preview data-template attr');
  const source = JSON.parse(sb.__ls.getItem('resumeProfile')).rawText;
  check('S6 new draft did NOT overwrite the source profile', source === fixtureText.trim(), 'rawText identical (analyze trims pasted text)');
}

// S7/S8. Named drafts persist; duplicate + delete work; reload keeps them.
{
  const sb = loadApp({});
  sb.__doc.getElementById('resumeInput').value = fx('it-manager.txt');
  sb.__doc.getElementById('analyzeResumeBtn').fire('click', {});
  openStudio(sb);
  studioClick(sb, 'data-studio-wf', 'new');
  studioClick(sb, 'data-studio-new-go');
  sb.__doc.getElementById('studioNewName').value = 'Ops v1';
  studioClick(sb, 'data-studio-save-new');
  studioClick(sb, 'data-studio-new-go');
  sb.__doc.getElementById('studioNewName').value = 'Ops v2';
  studioClick(sb, 'data-studio-save-new');
  const stored = sb.__ls.getItem('studioDrafts');

  // Reload a fresh app seeded with the persisted drafts: shelf survives.
  const sb2 = loadApp({ studioDrafts: stored });
  const html2 = openStudio(sb2);
  check('S7 two named drafts persist after reload',
        html2.includes('Saved drafts (2)') && html2.includes('Ops v1') && html2.includes('Ops v2'),
        'shelf shows both drafts');
  // Duplicate one -> 3 rows
  const dupAttr = (html2.match(/data-studio-dup="([^"]+)"/) || [])[1];
  studioClick(sb2, 'data-studio-dup', dupAttr);
  check('S8a duplicate adds a copy named "(copy)"',
        sb2.__doc.getElementById('studioContent').innerHTML.includes('Ops v1 (copy)'),
        'copy row present');
  // Delete the copy (the LAST row, appended by duplicate) -> 2 rows again
  const dels = sb2.__doc.getElementById('studioContent').innerHTML.match(/data-studio-del="([^"]+)"/g) || [];
  const delAttr = dels.length ? dels[dels.length - 1].match(/"([^"]+)"/)[1] : null;
  studioClick(sb2, 'data-studio-del', delAttr);
  check('S8b confirmed delete removes one draft',
        sb2.__doc.getElementById('studioContent').innerHTML.includes('Saved drafts (2)'),
        'back to 2 drafts');
}

// S9. Malformed studioDrafts in localStorage degrades gracefully (no crash,
// no bogus rows, no alerts).
{
  const sb = loadApp({ studioDrafts: '{this is not json' });
  const html = openStudio(sb);
  check('S9 malformed drafts: app boots, shelf empty, no alerts',
        sb.__alerts.length === 0 && html.includes('Nothing saved yet'),
        'graceful degradation');
}

// S10. Examples & templates workflow: local content + labeled external links.
{
  const sb = loadApp({});
  openStudio(sb);
  studioClick(sb, 'data-studio-wf', 'examples');
  const html = sb.__doc.getElementById('studioContent').innerHTML;
  check('S10 examples: category + template pickers + example bullets',
        html.includes('studio-ex-bullet') && html.includes('data-studio-copy-ex') && html.includes('Role category'),
        'example pane rendered');
  check('S10b examples: external resources labeled as external reading',
        html.includes('careerservices.fas.harvard.edu') && html.includes('External reading'),
        'resource labels');
  check('S10c examples: "no universal best structure" framing present',
        html.includes('no universally “best” resume structure'),
        'template note');
}

// S11. Reload with the studio tab persisted: init() must activate it without
// crashing on uninitialized studio state (the browser hit this exact TDZ).
{
  const sb = loadApp({ careeraiActiveTab: 'studioAnalysis' });
  const html = sb.__doc.getElementById('studioContent').innerHTML;
  check('S11 reload on persisted studio tab boots cleanly',
        sb.__alerts.length === 0 && html.includes('data-studio-wf="improve"'),
        'studio pane rendered, no alerts');
}

// ---------- report ----------
let pass = 0, fail = 0;
for (const r of results) {
  const mark = r.pass ? 'PASS' : 'FAIL';
  if (r.pass) pass++; else fail++;
  console.log(`[${mark}] ${r.name}  →  ${r.detail}`);
}
console.log(`\n${pass} passed, ${fail} failed (${results.length} checks)`);
process.exit(fail ? 1 : 0);
