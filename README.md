# AI Career & Job Match Assistant

A client-side tool for analyzing your resume, job descriptions, and how well they match — all in the browser, with no backend and no data leaving your machine.

## Features

- **Resume Analysis** — paste, upload (PDF / DOCX / TXT), or drag-and-drop a resume to get a health score, detected skills (by category), experience, and improvement suggestions.
- **Job Description** — paste a JD, fetch it from a URL, or upload a file. See detected key skills, must-have skills, requirements, and a JD quality score.
- **Match Analysis** — compare your resume against a job description with a weighted score, per-dimension bars, and a skill-gap breakdown.
- **Application Tracker** — log applications (company, role, date, status, notes); stored locally in your browser.
- **Job Discovery** — build a resume profile and get pre-filled job-board search links.

## How to run

There is no build step and no backend. Just open `index.html` in a browser:

```bash
# Option 1 — open directly
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

> **Note:** Some browsers restrict features (like fetching URLs or reading PDFs) when a page is opened via `file://`. For the full experience, serve it over HTTP:
>
> ```bash
> # any static server, e.g. Python:
> python -m http.server 8000
> # then visit http://localhost:8000
> ```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and all UI |
| `script.js` | App logic, parsing, and analysis |
| `style.css` | Premium dark-theme styling |
| `server.js` | Optional dev server: static files + `/api/coach` (AI rewrites, free providers) |
| `sample-data.json` | Sample resumes and job descriptions (also embedded in `script.js` for `file://` use) |

## Optional: AI coach (free, zero-cost)

The **AI coach** card in Resume Analysis asks an LLM for full, personalized rewrites of your weak bullets. It costs nothing to run — the server (`node server.js`) routes to the first available **free** route:

| Route | What it is | Setup |
|-------|-----------|-------|
| **Groq free tier** | Llama 3.3 70B, ~1,000 requests/day free, no card | free key at console.groq.com → `setx GROQ_API_KEY gsk_...` |
| **Gemini free tier** | Google's flash models, free daily quota | free key at aistudio.google.com → `setx GEMINI_API_KEY ...` |
| **Ollama (local)** | runs on your own machine: no cloud, no limit, fully private | install Ollama, then `ollama pull qwen2.5:14b` — no key at all |

Then `node server.js` and open `http://127.0.0.1:8000`. The card shows which route is live. Force one with `AI_COACH_PROVIDER=groq|gemini|ollama|anthropic`. A paid Anthropic key (`ANTHROPIC_API_KEY`) is also accepted for quality comparisons, but is never required.

> **Note:** the AI coach is opt-in. When you click "Get AI rewrites", the resume text goes to the selected provider (Groq/Gemini are third-party cloud APIs; Ollama keeps it on your machine). Everything else in the app still runs 100% locally.

## OpenAI AI analysis & writing (Python backend)

The **AI analysis (OpenAI)** card in Resume Analysis and the **AI writing (OpenAI)** block in
Resume Studio call a small local Python (Flask) server that talks to the OpenAI
Responses API. Your OpenAI key stays on this machine in `.env` and is **never** sent
to the browser.

**Setup (one time, Windows PowerShell):**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

**Configure your key & model** in `.env` (copy `.env.example` if you don't have one):

```ini
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-5.5
```

**Run** (this also serves the whole app):

```powershell
python server.py
```

Then open **http://127.0.0.1:8000/** — the AI cards appear in the Resume and Studio tabs.

- If your account can't use `gpt-5.5`, change `OPENAI_MODEL` in `.env` to a model
  you have access to, then restart the server.
- To confirm your model id works with ONE live (paid) call: `python smoke_test.py`.
- Automated tests are mocked and cost nothing: `python tests\test_backend.py`.
- The node-based free "AI coach" above is unchanged and can run separately via `node server.js`.

> Your resume text is sent to OpenAI **only** when you click an AI button — the app
> never uploads it automatically. Each click is a fresh request; a failed request
> shows an error and never presents an old result as new.

## Deploy to Render (free tier, Gemini)

The same Flask app (`server.py`) can be deployed to a **free Render web service**
and powered by the **Gemini free API tier** (Google AI Studio), so you can run the
whole app in the browser with no paid OpenAI calls.

**How the provider is chosen** (all server-side, via environment variables — never in
the browser or in Git):

- `AI_PROVIDER` — `openai`, `gemini`, or `auto` (default). Set **`gemini`** for the free deploy.
- `GEMINI_API_KEY` — your Google AI Studio key (free key at aistudio.google.com/apikey).
- `GEMINI_MODEL` — e.g. `gemini-2.5-flash` (default). Change to any model your account can access.
- A Gemini failure **never** silently falls back to OpenAI.

### Render settings

| Setting | Value |
|---|---|
| Runtime / Language | Python 3 |
| Build command | `pip install -r requirements.txt` |
| Start command | `gunicorn --bind 0.0.0.0:$PORT server:app` |
| Region | any (pick the closest) |
| Plan | Free (Basic) web service |

**Environment variables to set in Render (not in the repo):**
- `AI_PROVIDER=gemini`
- `GEMINI_API_KEY=<your Google AI Studio key>`
- `GEMINI_MODEL=gemini-2.5-flash` (or another model you have access to)
- Do **not** set `OPENAI_API_KEY` on the free deploy (so no paid OpenAI calls occur).

The app serves the frontend **and** the `/api/...` endpoints from the same origin,
so no CORS is required and no database is used. Gunicorn (in `requirements.txt`) is
the production WSGI server; `python server.py` still works for local development.

> **Free-tier notes:** the free web service sleeps after ~15 min idle (the next
> request wakes it in ~30–60s), and the Gemini free tier has per-minute/per-day
> request limits. Hitting a limit surfaces a clear "rate/quota limit reached" message
> in the UI rather than a crash.

## Libraries (loaded from CDN)

- [Bootstrap 5](https://getbootstrap.com/) — layout & components
- [PDF.js](https://mozilla.github.io/pdf.js/) — PDF text extraction
- [Mammoth.js](https://github.com/mammothjs/mammoth.js) — DOCX text extraction
- Google Fonts: [Sora](https://fonts.google.com/specimen/Sora) (headings) & [DM Sans](https://fonts.google.com/specimen/DM+Sans) (body)

## Privacy

All analysis runs locally in your browser. Resume and job text are never sent to a server — the only network requests are the CDN libraries and, if you use the "Fetch from URL" feature, the third-party reader service used to pull a public page.

The sole exception is the opt-in **AI coach** (see above): when you request AI rewrites, your resume text goes to whichever provider is configured — Groq/Gemini (free third-party cloud APIs with rate limits) or Ollama (your own machine, nothing leaves it).
