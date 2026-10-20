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

## Libraries (loaded from CDN)

- [Bootstrap 5](https://getbootstrap.com/) — layout & components
- [PDF.js](https://mozilla.github.io/pdf.js/) — PDF text extraction
- [Mammoth.js](https://github.com/mammothjs/mammoth.js) — DOCX text extraction
- Google Fonts: [Sora](https://fonts.google.com/specimen/Sora) (headings) & [DM Sans](https://fonts.google.com/specimen/DM+Sans) (body)

## Privacy

All analysis runs locally in your browser. Resume and job text are never sent to a server — the only network requests are the CDN libraries and, if you use the "Fetch from URL" feature, the third-party reader service used to pull a public page.

The sole exception is the opt-in **AI coach** (see above): when you request AI rewrites, your resume text goes to whichever provider is configured — Groq/Gemini (free third-party cloud APIs with rate limits) or Ollama (your own machine, nothing leaves it).
