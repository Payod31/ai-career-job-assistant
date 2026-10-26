"""Local Flask server: serves the existing Career AI frontend AND the OpenAI
endpoints, all from one local process bound to 127.0.0.1.

Run:   .venv\\Scripts\\python server.py        (Windows)
       .venv/bin/python server.py             (mac/Linux)
Then open: http://127.0.0.1:8000/

Security:
  * The OpenAI key is loaded from .env via python-dotenv, used only server-side,
    and is never returned to the browser, logged, or included in any error.
  * The static file server refuses .env, .git, .venv and any hidden file.
  * The expensive AI routes carry a per-client rate limit (flask-limiter,
    in-memory storage; overridable via AI_RATE_LIMIT / RATELIMIT_STORAGE_URI).
    The frontend and API are served same-origin, so responses carry NO
    cross-origin headers. Set TRUSTED_PROXIES (comma-separated IPs) if you
    need per-client limits behind a trusted edge proxy; without it the limit
    is enforced per arriving connection IP only — spoofable headers are
    never trusted.

The frontend is fully client-side and keeps working without these endpoints; the
AI buttons simply report that the AI server is unavailable.
"""

import os

from dotenv import load_dotenv

from flask_limiter import Limiter
from werkzeug.middleware.proxy_fix import ProxyFix

# Load .env from the project root so OPENAI_API_KEY / OPENAI_MODEL are available
# as environment variables. load_dotenv() will NOT override keys that are
# already set in the real environment.
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

from flask import Flask, jsonify, request, send_from_directory  # noqa: E402

import ai_client  # noqa: E402
import doc_extract  # noqa: E402

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT") or 8000)
HOST = "127.0.0.1"

# Keep the request body bounded (raw resume text + optional JD). 1.5 MB is far
# more than any resume; anything bigger is rejected before it costs us.
MAX_BODY = 1_500_000
MAX_FIELD_LEN = 60_000        # resume text / JD / candidate info cap
MAX_JOB_LEN = 30_000

# Per-client limit for the EXPENSIVE AI routes only (never static files).
# Both are read inside create_app() so they stay overridable per instance.
DEFAULT_AI_RATE_LIMIT = "30/minute"     # generous locally; cap a public abuse
DEFAULT_RATE_STORAGE = "memory://"      # single-instance local / Render free

STATIC_MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".md": "text/markdown; charset=utf-8",
}

# Paths that must never be served, even though they live in the project root.
DENY_PREFIXES = (".env", ".git", ".venv", ".impeccable", ".c-disk-report")


def create_app():
    app = Flask(__name__, static_folder=None)
    app.config["MAX_CONTENT_LENGTH"] = MAX_BODY

    # The frontend and API are served from the same origin, so NO
    # cross-origin headers are sent. (Opening index.html from a different
    # local origin than the API will now be blocked by the browser —
    # open the app from the Flask server itself, or use render.yaml's
    # single-origin public deployment.)

    # ---------------------------------------------------------------- health
    @app.route("/api/health", methods=["GET"])
    def health():
        prov = ai_client.active_provider()
        key_conf = ai_client.active_key_configured()
        model = ai_client.active_model_name()
        label = prov.capitalize()
        return jsonify({
            "ok": True,
            "service": "career-ai",
            "provider": prov,
            "apiKeyConfigured": key_conf,
            "model": model,
            # Which providers have a key configured (booleans only, never the key).
            "providers": {"openai": ai_client.api_key_configured(),
                          "gemini": ai_client.gemini_key_configured()},
            "endpoints": ["/api/analyze-resume", "/api/resume-studio"],
            "note": ("%s key is configured." % label
                     if key_conf else
                     "%s key is NOT configured — AI features are disabled." % label),
        })

    # ------------------------------------------------- rate limiting
    # The EXPENSIVE AI routes only — static files and /api/health are
    # unlimited. In-memory storage by default (correct on Render's
    # single-instance free plan); set RATELIMIT_STORAGE_URI to use shared
    # storage when scaling out. Set TRUSTED_PROXIES (comma-separated
    # proxy IPs) to key limits by the real client IP behind a trusted
    # edge proxy; without it, only the arriving connection IP is used and
    # client-supplied X-Forwarded-For headers are NEVER trusted.
    # No default limit: only the AI routes below carry @limiter.limit, so
    # static files and /api/health stay unlimited.
    def _client_key():
        # Key the AI-route limits by the arriving client address. When
        # TRUSTED_PROXIES is set, request.remote_addr was already rewritten
        # to the real client by ProxyFix; otherwise it is the direct
        # connection IP and client-supplied forwarding headers are ignored.
        return request.remote_addr

    ai_rate_limit = os.environ.get("AI_RATE_LIMIT") or DEFAULT_AI_RATE_LIMIT
    storage_uri = os.environ.get("RATELIMIT_STORAGE_URI") or DEFAULT_RATE_STORAGE
    limiter = Limiter(_client_key, app=app, storage_uri=storage_uri,
                      headers_enabled=False)
    trusted_proxies = [s for s in
                       os.environ.get("TRUSTED_PROXIES", "").split(",") if s]
    if trusted_proxies:
        app.config["TRUSTED_PROXIES"] = trusted_proxies
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1,
                                host=1, port=1, trusted=trusted_proxies)

    @app.errorhandler(429)
    def _rate_limited(e):
        # Safe, key-free message; the client UI shows it and shows no stale
        # result (it has no way to know which request won).
        resp = jsonify({"ok": False, "code": "rate_limited",
                        "error": "Too many AI requests. Please wait a "
                                  "minute or two, then try again."})
        resp.status_code = 429
        return resp

    # ------------------------------------------------- shared helpers
    def _error(code, message, status):
        resp = jsonify({"ok": False, "code": code, "error": message})
        resp.status_code = status
        return resp

    def _json_payload():
        # Accept both a JSON body and (as a fallback) form fields, so the
        # frontend has one flexible contract.
        data = request.get_json(silent=True)
        if isinstance(data, dict):
            return data
        return request.form.to_dict()

    def _bounded(value, limit):
        s = ("" if value is None else str(value)).strip()
        if len(s) > limit:
            return s[:limit]
        return s

    def _resume_source():
        """Return (resume_text, note_or_error). Prefers resumeText; falls back
        to an uploaded file via server-side extraction. Raises a tuple form of
        a 400 error via `return None, (code, msg, status)`."""
        payload = _json_payload()
        text = _bounded(payload.get("resumeText"), MAX_FIELD_LEN)
        if text:
            return text, payload

        file = request.files.get("file")
        if file is not None and file.filename:
            raw = file.read(MAX_BODY)
            try:
                extracted, note = doc_extract.extract_text(
                    raw, file.filename, file.content_type or "")
                return extracted, dict(payload, note=note, fileUploaded=file.filename)
            except doc_extract.ExtractionError as e:
                return None, ("extract:" + e.code, e.message, 400)
            except Exception:
                return None, ("extract:corrupt", "The file could not be read.", 400)

        return None, ("no_input",
                      "Provide resumeText or upload a .pdf/.docx/.txt file.", 400)

    def _dispatch(fn, **kwargs):
        """Call an ai_client operation and wrap every failure as a clean JSON
        error. Success returns {ok:true, ...result, requestId, resumeChars}."""
        payload = kwargs.pop("_payload", None) or {}
        req_id = payload.get("requestId") if payload else None
        try:
            result = fn(**kwargs)
        except ai_client.ConfigError as e:
            # ConfigError carries no secrets (a fixed, key-free message).
            return _error("no_key", str(e), 503)
        except ai_client.ModelError as e:
            status = 400 if e.code in ("empty_input", "bad_operation", "invalid_response") else 502
            return _error(e.code, e.message, status)
        except doc_extract.ExtractionError as e:
            return _error("extract:" + e.code, e.message, 400)
        except Exception:
            # Never leak a stack trace or the key to the client.
            return _error("internal", "Unexpected server error. Try again.", 500)
        out = dict(result)
        out["ok"] = True
        out["requestId"] = req_id
        return jsonify(out)

    # ------------------------------------------------- analyze-resume
    @app.route("/api/analyze-resume", methods=["POST"])
    @limiter.limit(ai_rate_limit)
    def analyze_resume():
        text, payload = _resume_source()
        if isinstance(payload, tuple):  # it's an (code,msg,status) error tuple
            return _error(*payload)
        job = _bounded(payload.get("jobDescription"), MAX_JOB_LEN)
        role = _bounded(payload.get("targetRole"), 200)
        return _dispatch(
            ai_client.run_analysis,
            resume_text=text,
            job_description=job,
            target_role=role,
            _payload=payload,
        )

    # ------------------------------------------------- resume-studio
    @app.route("/api/resume-studio", methods=["POST"])
    @limiter.limit(ai_rate_limit)
    def resume_studio():
        payload = _json_payload()
        operation = (payload.get("operation") or "").strip()
        if operation not in ai_client.STUDIO_OPERATIONS:
            return _error("bad_operation",
                          "operation must be one of: " +
                          ", ".join(ai_client.STUDIO_OPERATIONS), 400)
        resume = _bounded(payload.get("resumeText"), MAX_FIELD_LEN)
        candidate = _bounded(payload.get("candidateInfo"), MAX_FIELD_LEN)
        job = _bounded(payload.get("jobDescription"), MAX_JOB_LEN)
        instr = _bounded(payload.get("instructions"), 8000)
        role = _bounded(payload.get("targetRole"), 200)
        # new_draft is sourced from the user's real entered data; the rest from
        # the current resume. Enforce the right input for each.
        if operation == "new_draft":
            source = candidate or resume
        else:
            source = resume
        if not source:
            need = "candidateInfo" if operation == "new_draft" else "resumeText"
            return _error("no_input",
                          "%s is required for the '%s' operation." % (need, operation),
                          400)
        return _dispatch(
            ai_client.run_studio,
            operation=operation,
            resume_text=resume,
            job_description=job,
            instructions=instr,
            candidate_info=candidate,
            target_role=role,
            _payload=payload,
        )

    # ------------------------------------------------- static frontend
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def static_files(path):
        # Refuse anything sensitive, case-insensitively, and any hidden file.
        norm = path.replace("\\", "/").lstrip("/")
        low = norm.lower()
        for prefix in DENY_PREFIXES:
            if low == prefix.lower() or low.startswith(prefix.lower() + ".") or \
               low.startswith(prefix.lower() + "/") or low.startswith(prefix.lower() + "."):
                return _error("forbidden", "Not found", 403)
        seg = norm.split("/")
        if any(s.startswith(".") for s in seg):
            return _error("forbidden", "Not found", 403)
        target = "index.html" if path in ("", None) else path
        full = os.path.normpath(os.path.join(ROOT, target))
        if os.path.abspath(full) != os.path.abspath(ROOT) and \
           not full.startswith(os.path.abspath(ROOT) + os.sep):
            return _error("forbidden", "Not found", 403)
        if not os.path.isfile(full):
            return _error("not_found", "Not found", 404)
        return send_from_directory(ROOT, target)

    # The node /api/coach route is intentionally NOT provided by this server.
    @app.route("/api/coach", methods=["GET", "POST"])
    @app.route("/api/coach/providers", methods=["GET"])
    def coach_unavailable():
        return _error("not_served",
                      "The free AI-coach route is provided by `node server.js`, "
                      "not this server. Use the AI analysis buttons above for "
                      "provider-powered analysis, or run `node server.js` "
                      "separately for the free coach.", 404)

    return app


app = create_app()


if __name__ == "__main__":
    prov = ai_client.active_provider()
    key_env = "GEMINI_API_KEY" if prov == "gemini" else "OPENAI_API_KEY"
    print("Career AI %s server on http://%s:%d/  (model: %s, key configured: %s)"
          % (prov.capitalize(), HOST, PORT, ai_client.active_model_name(),
             "yes" if ai_client.active_key_configured()
             else "NO — set %s in .env" % key_env))
    app.run(host=HOST, port=PORT, debug=False)
