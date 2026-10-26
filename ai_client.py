"""OpenAI integration for the two AI endpoints (Responses API).

Everything here is deliberately boring and testable:
  * the OpenAI client is created lazily and lives in a single seam
    (`get_client`) so automated tests can replace it with a fake without
    spending money;
  * every function returns a *validated* Python dict (it never returns the raw
    model string), so callers can trust the shape;
  * error handling maps OpenAI failures to controlled, safe messages that
    NEVER contain the API key (the key is only ever read from the environment
    and sent to OpenAI by the SDK; it is not echoed anywhere).

The model id comes from the OPENAI_MODEL environment variable (default gpt-5.5),
so an account that does not support gpt-5.5 can point at another model in .env
and restart.
"""

import json
import os

# --- configuration -----------------------------------------------------------

DEFAULT_MODEL = "gpt-5.5"
# Reasonable wall-clock cap for a single request. OpenAI is called with this as
# the HTTP timeout; the caller (Flask) also enforces its own request limits.
REQUEST_TIMEOUT_SECONDS = 90

# A stable, user-safe error raised when the API key is missing.
class ConfigError(Exception):
    pass


class ModelError(Exception):
    """Raised for an OpenAI API failure that is safe to show the user."""

    def __init__(self, code, message):
        super().__init__(message)
        self.code = code
        self.message = message


def model_name():
    return (os.environ.get("OPENAI_MODEL") or DEFAULT_MODEL).strip() or DEFAULT_MODEL


def api_key_configured():
    """True when an OPENAI_API_KEY is present in the environment. The value
    itself is never returned or logged by this module."""
    return bool((os.environ.get("OPENAI_API_KEY") or "").strip())


# --- Gemini provider (free tier) --------------------------------------------
# Gemini is supported alongside OpenAI so the app can run on a free Render
# deployment with only a Google AI Studio key (GEMINI_API_KEY). The OpenAI path
# is unchanged; Gemini uses the classic generateContent REST API via the
# standard library (no new dependency). Credentials live only in the
# environment (set by Render) and are never returned, logged, or written to a
# file by this module.

GEMINI_DEFAULT_MODEL = "gemini-2.5-flash"   # stable, free-tier model; override via GEMINI_MODEL
GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def gemini_model_name():
    return (os.environ.get("GEMINI_MODEL") or GEMINI_DEFAULT_MODEL).strip() or GEMINI_DEFAULT_MODEL


def gemini_key_configured():
    """True when a GEMINI_API_KEY is present. The value is never returned or logged."""
    return bool((os.environ.get("GEMINI_API_KEY") or "").strip())


def _gemini_key():
    return (os.environ.get("GEMINI_API_KEY") or "").strip()


def active_provider():
    """Which provider the AI endpoints use. `AI_PROVIDER` forces one of
    'openai'/'gemini'; 'auto' (the default) prefers OpenAI when its key is set,
    otherwise Gemini. Returns 'openai' even when no key is present so callers
    still surface a clear OpenAI 'no_key' config error by default.
    """
    p = (os.environ.get("AI_PROVIDER") or "auto").strip().lower()
    if p in ("openai", "gemini"):
        return p
    # auto
    if api_key_configured():
        return "openai"
    return "openai" if not gemini_key_configured() else "gemini"


def active_model_name():
    """The model id the active provider will use (safe to surface in /api/health)."""
    return gemini_model_name() if active_provider() == "gemini" else model_name()


def active_key_configured():
    """Whether the ACTIVE provider's key is present (boolean only, never the key)."""
    return (gemini_key_configured() if active_provider() == "gemini"
            else api_key_configured())


# --- the client seam ---------------------------------------------------------

_client = None


def get_client():
    """Return a shared OpenAI client. Raises ConfigError if no key is set.

    Tests replace this (monkeypatch `ai_client.get_client`) with a fake that
    returns a canned `responses` object — no live calls, no charges.
    """
    global _client
    if _client is None:
        key = (os.environ.get("OPENAI_API_KEY") or "").strip()
        if not key:
            raise ConfigError(
                "OPENAI_API_KEY is not configured. Put it in the .env file at the "
                "project root (see .env.example), then restart the server.")
        from openai import OpenAI  # import lazily so the module loads without it
        _client = OpenAI(api_key=key, timeout=REQUEST_TIMEOUT_SECONDS)
    return _client


def set_client_for_testing(fake_client):
    """Test hook: install a fake client and mark it so get_client() returns it."""
    global _client
    _client = fake_client


def reset_client_for_testing():
    global _client
    _client = None


# --- output schemas ----------------------------------------------------------
# OpenAI Structured Outputs: EVERY object node must set additionalProperties
# to false and list all property names in "required". Fields that may have no
# data are nullable (["string","null"] etc.) and still required, so the model
# emits the full structure every time and the parse step below coerces nulls.

ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "candidate_summary": {"type": ["string", "null"]},
        "employment_history": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "role": {"type": ["string", "null"]},
                    "employer": {"type": ["string", "null"]},
                    "dates": {"type": ["string", "null"]},
                    "notes": {"type": ["string", "null"]},
                },
                "required": ["role", "employer", "dates", "notes"],
                "additionalProperties": False,
            },
        },
        "experience_and_skills": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "item": {"type": ["string", "null"]},
                    "evidence": {"type": ["string", "null"]},
                    "confidence": {"type": "string", "enum": ["confirmed", "inferred"]},
                },
                "required": ["item", "evidence", "confidence"],
                "additionalProperties": False,
            },
        },
        "education_and_certifications": {"type": "array", "items": {"type": ["string", "null"]}},
        "achievements": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "achievement": {"type": ["string", "null"]},
                    "evidence": {"type": ["string", "null"]},
                    "stated": {"type": ["boolean", "null"]},
                },
                "required": ["achievement", "evidence", "stated"],
                "additionalProperties": False,
            },
        },
        "strengths": {"type": "array", "items": {"type": ["string", "null"]}},
        "transferable_skills": {"type": "array", "items": {"type": ["string", "null"]}},
        "missing_relative_to_jd": {"type": "array", "items": {"type": ["string", "null"]}},
        "ats_concerns": {"type": "array", "items": {"type": ["string", "null"]}},
        "missing_or_ambiguous": {"type": "array", "items": {"type": ["string", "null"]}},
        "recommendations": {"type": "array", "items": {"type": ["string", "null"]}},
    },
    "required": [
        "candidate_summary", "employment_history", "experience_and_skills",
        "education_and_certifications", "achievements", "strengths",
        "transferable_skills", "missing_relative_to_jd", "ats_concerns",
        "missing_or_ambiguous", "recommendations",
    ],
    "additionalProperties": False,
}

STUDIO_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": ["string", "null"]},
        "content": {"type": ["string", "null"]},
        "suggestions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "original": {"type": ["string", "null"]},
                    "suggested": {"type": ["string", "null"]},
                    "why": {"type": ["string", "null"]},
                },
                "required": ["original", "suggested", "why"],
                "additionalProperties": False,
            },
        },
        "questions": {"type": "array", "items": {"type": ["string", "null"]}},
    },
    "required": ["summary", "content", "suggestions", "questions"],
    "additionalProperties": False,
}

STUDIO_OPERATIONS = {
    "improve": "Improve the candidate's existing resume. Keep every real fact "
               "exactly as stated; tighten wording, reorder for impact, and flag "
               "weak bullets. Never invent employers, dates, numbers or skills.",
    "rewrite_bullets": "Rewrite ONLY the specific bullet points the user marked, "
                       "into stronger, verb-led lines that preserve the underlying "
                       "facts. Where a bullet has no measurable result, insert a "
                       "clearly-marked placeholder like [+ your metric] and ask "
                       "for the real number instead of inventing one.",
    "tailor": "Tailor the resume to the supplied job description. Align wording and "
               "emphasize matching experience and skills. Do NOT add skills, jobs, "
               "certifications or numbers the candidate did not state; where the "
               "JD wants something the resume lacks, list it under 'questions'.",
    "new_draft": "Compose a new, clean resume draft from the candidate's ACTUAL "
                  "information. Use real facts only; where a section has no data, "
                  "use a clearly-marked placeholder such as [Add your projects] "
                  "and list the gaps under 'questions'. Never fabricate content.",
    "explain": "Explain, in plain language, the specific improvements being "
                "recommended and WHY each one helps an ATS and a human recruiter. "
                "Cite the resume text being relied on. Do not invent new claims.",
}


# --- prompt builders ---------------------------------------------------------

def _analysis_instructions(has_jd):
    base = (
        "You are a careful, honest resume analyst. Work ONLY from the resume text "
        "provided. You MUST NOT invent employers, job titles, dates, degrees, "
        "certifications, skills, metrics, or any other qualification that is not "
        "explicitly present. Distinguish CONFIRMED facts (stated plainly in the "
        "resume) from INFERENCES (things you deduce), and label each accordingly. "
        "Do arithmetic on dates yourself only where the resume gives two real "
        "dates; otherwise state the resume's own figure. If information is missing "
        "or ambiguous, say so under 'missing_or_ambiguous' — do not guess it into "
        "'achievements' or 'strengths'. Ground every skill/experience claim with a "
        "short quote or reference from the resume in 'evidence'. Be concise and "
        "specific. Respond in JSON only."
    )
    if has_jd:
        base += (
            " A job description is also provided: list concrete gaps under "
            "'missing_relative_to_jd' (skills/experience the JD asks for that are "
            "absent or unclear in the resume). Do not mark something as covered "
            "unless the resume actually shows it."
        )
    return base


def analysis_user_message(resume_text, job_description, target_role):
    parts = []
    if target_role:
        parts.append("Target role: " + target_role)
    parts.append("RESUME TEXT:\n---\n" + resume_text + "\n---")
    if job_description:
        parts.append("JOB DESCRIPTION:\n---\n" + job_description + "\n---")
    return "\n\n".join(parts)


def _studio_instructions(operation):
    task = STUDIO_OPERATIONS.get(operation, STUDIO_OPERATIONS["improve"])
    return (
        "You are an honest resume writer. " + task +
        " Return JSON only, with these keys: 'summary' (one or two sentences on "
        "what you did), 'content' (the rewritten/new resume text, or '' if not "
        "applicable), 'suggestions' (a list of {original, suggested, why} for "
        "bullet rewrites), and 'questions' (things the user must supply — use "
        "these instead of inventing facts)."
    )


def studio_user_message(operation, resume_text, job_description, instructions,
                        candidate_info, target_role):
    blocks = []
    if operation == "new_draft" and candidate_info:
        blocks.append("CANDIDATE INFORMATION (use ONLY real facts from here):\n---\n"
                      + candidate_info + "\n---")
    elif resume_text:
        blocks.append("CURRENT RESUME:\n---\n" + resume_text + "\n---")
    if job_description:
        blocks.append("JOB DESCRIPTION:\n---\n" + job_description + "\n---")
    if target_role:
        blocks.append("Target role: " + target_role)
    if instructions:
        blocks.append("INSTRUCTIONS: " + instructions)
    blocks.append("Operation: " + operation)
    return "\n\n".join(blocks)


# --- defensive JSON parsing --------------------------------------------------

def _extract_text(response):
    """Pull the textual output out of a Responses-API result across SDK versions."""
    out_text = getattr(response, "output_text", None)
    if out_text:
        return out_text
    parts = []
    for item in (getattr(response, "output", None) or []):
        if getattr(item, "type", None) == "message":
            for c in (getattr(item, "content", None) or []):
                if getattr(c, "type", None) == "output_text":
                    parts.append(getattr(c, "text", "") or "")
    return "\n".join(parts)


def _parse_json_loose(text):
    """Parse model output that may be fenced or padded. Returns dict or None."""
    if not text:
        return None
    t = text.strip()
    # Strip a leading/trailing code fence if present.
    if t.startswith("```"):
        t = t.strip("`")
        if t.lower().startswith("json"):
            t = t[4:]
        t = t.strip()
    try:
        val = json.loads(t)
        return val if isinstance(val, dict) else None
    except Exception:
        pass
    # Last resort: grab the outermost {...} block.
    start, end = t.find("{"), t.rfind("}")
    if start != -1 and end > start:
        try:
            val = json.loads(t[start:end + 1])
            return val if isinstance(val, dict) else None
        except Exception:
            return None
    return None


def _str_list(val, cap=40):
    out = []
    if isinstance(val, list):
        for x in val[:cap]:
            s = str(x).strip() if x is not None else ""
            if s:
                out.append(s)
    return out


def _str_dict_list(val, cap=40, keys=("original", "suggested", "why")):
    out = []
    if isinstance(val, list):
        for x in val[:cap]:
            if isinstance(x, dict):
                # `or ""` keeps JSON nulls from rendering as the string "None".
                out.append({k: str(x.get(k) or "").strip() for k in keys})
    return out


def _analyze_dict(raw):
    """Coerce a raw model dict into the exact shape the frontend expects."""
    def obj_list(items):
        out = []
        for x in (items or [])[:40]:
            if isinstance(x, dict):
                # `or ""` keeps JSON nulls from rendering as the string "None".
                out.append({k: str(x.get(k) or "").strip() for k in
                            ("role", "employer", "dates", "notes",
                             "item", "evidence", "confidence", "achievement")})
        return out
    a = raw if isinstance(raw, dict) else {}
    return {
        "candidate_summary": str(a.get("candidate_summary", "") or "").strip(),
        "employment_history": obj_list(a.get("employment_history")),
        "experience_and_skills": obj_list(a.get("experience_and_skills")),
        "education_and_certifications": _str_list(a.get("education_and_certifications")),
        "achievements": obj_list(a.get("achievements")),
        "strengths": _str_list(a.get("strengths")),
        "transferable_skills": _str_list(a.get("transferable_skills")),
        "missing_relative_to_jd": _str_list(a.get("missing_relative_to_jd")),
        "ats_concerns": _str_list(a.get("ats_concerns")),
        "missing_or_ambiguous": _str_list(a.get("missing_or_ambiguous")),
        "recommendations": _str_list(a.get("recommendations")),
    }


def _studio_dict(raw, operation):
    s = raw if isinstance(raw, dict) else {}
    return {
        "operation": operation,
        "summary": str(s.get("summary", "") or "").strip(),
        "content": str(s.get("content", "") or "").strip(),
        "suggestions": _str_dict_list(s.get("suggestions")),
        "questions": _str_list(s.get("questions")),
    }


# --- high-level operations ---------------------------------------------------

def _safe_call(fn, *args, **kwargs):
    """Run an OpenAI call and translate SDK exceptions into ModelError with a
    fixed, key-free message. The exception ladder is ordered from specific to
    broad so a single controlled message surfaces, and none of these messages
    ever contain the API key."""
    import openai  # only needed for the exception types
    try:
        return fn(*args, **kwargs)
    except openai.AuthenticationError:
        raise ModelError("auth",
            "OpenAI rejected the API key. Check OPENAI_API_KEY in .env and "
            "restart the server.")
    except openai.RateLimitError:
        raise ModelError("rate_limit",
            "Rate limit hit. Wait a moment and try again, or check your OpenAI "
            "usage/limits.")
    except openai.APITimeoutError:
        raise ModelError("timeout",
            "OpenAI did not respond in time. Try again; very large resumes can "
            "take a while.")
    except openai.APIConnectionError:
        raise ModelError("network",
            "Could not reach OpenAI (network error). Check your connection and "
            "try again.")
    except openai.APIStatusError as e:
        # Other 4xx/5xx, including 'unsupported model' (404) and server errors.
        status = getattr(e, "status_code", 0)
        if status == 404:
            raise ModelError("model_unsupported",
                "Model not available for this account. Set OPENAI_MODEL in .env to "
                "a model you can access, then restart.")
        raise ModelError("api",
            "OpenAI returned an error (HTTP %s). Try again; if it persists, check "
            "your account/limits." % (status or "n/a"))
    except openai.APIError:
        raise ModelError("api", "OpenAI request failed. Try again shortly.")


def _run_analysis_openai(resume_text, job_description=None, target_role=None):
    """OpenAI provider: analyze a resume. Returns a validated dict + metadata."""
    client = get_client()
    resume_text = (resume_text or "").strip()
    if not resume_text:
        raise ModelError("empty_input", "No resume text to analyze.")
    # Keep the payload bounded — a giant document wastes money and tokens.
    if len(resume_text) > 24000:
        resume_text = resume_text[:24000]

    resp = _safe_call(
        client.responses.create,
        model=model_name(),
        instructions=_analysis_instructions(bool(job_description)),
        input=analysis_user_message(resume_text, job_description, target_role),
        # Structured Outputs: force a JSON reply matching ANALYSIS_SCHEMA.
        text={"format": {"type": "json_schema", "name": "resume_analysis",
                         "schema": ANALYSIS_SCHEMA}},
    )
    raw = _parse_json_loose(_extract_text(resp))
    if raw is None:
        raise ModelError("invalid_response",
            "The model's reply could not be read as structured data. Try again.")
    data = _analyze_dict(raw)
    return {
        "analysis": data,
        "model": model_name(),
        "had_jd": bool(job_description),
        "resume_chars_used": len(resume_text),
    }


def _run_studio_openai(operation, resume_text="", job_description=None,
                       instructions=None, candidate_info=None, target_role=None):
    """OpenAI provider: run one Resume-Studio AI operation. Returns a validated
    dict + metadata.

    For 'new_draft' the source of truth is `candidate_info` (the user's real,
    entered data); for every other operation it is the CURRENT resume text. This
    function never reads a previously generated result, so a slow/stale response
    cannot masquerade as a fresh one.
    """
    if operation not in STUDIO_OPERATIONS:
        raise ModelError("bad_operation", "Unknown studio operation: " + str(operation))
    client = get_client()
    source = candidate_info if operation == "new_draft" else resume_text
    source = (source or "").strip()
    if not source:
        raise ModelError("empty_input",
            "No resume/candidate data to work on for this operation.")
    if len(source) > 24000:
        source = source[:24000]

    resp = _safe_call(
        client.responses.create,
        model=model_name(),
        instructions=_studio_instructions(operation),
        input=studio_user_message(operation, source, job_description,
                                  instructions, candidate_info if operation == "new_draft" else None,
                                  target_role),
        # Structured Outputs: force a JSON reply matching STUDIO_SCHEMA.
        text={"format": {"type": "json_schema", "name": "studio_result",
                         "schema": STUDIO_SCHEMA}},
    )
    raw = _parse_json_loose(_extract_text(resp))
    if raw is None:
        raise ModelError("invalid_response",
            "The model's reply could not be read as structured data. Try again.")
    data = _studio_dict(raw, operation)
    return {
        "result": data,
        "model": model_name(),
        "operation": operation,
    }


# ============================================================================
# Gemini provider (free tier) — classic generateContent REST API.
#
# Implemented with the standard library (urllib) so it adds NO new dependency.
# A provider is chosen by AI_PROVIDER (see active_provider()); when 'gemini' is
# active ONLY the Gemini path runs — we never fall back to OpenAI on a Gemini
# failure. The API key is read from the environment, sent only to Google, and
# is never returned, logged, or written anywhere. Resume contents are never
# logged.
# ============================================================================

class GeminiHTTPError(Exception):
    """A non-2xx response from the Gemini API. Carries the status code and the
    (sanitized) error payload; never the API key."""

    def __init__(self, status, payload):
        super().__init__("gemini http %s" % status)
        self.status = status
        self.payload = payload if isinstance(payload, dict) else {}


# --- transport seam (monkeypatchable in tests) -----------------------------
_gemini_request_override = None


def set_gemini_request_for_testing(fn):
    """Install a fake _gemini_request so tests never hit the network."""
    global _gemini_request_override
    _gemini_request_override = fn


def reset_gemini_request_for_testing():
    global _gemini_request_override
    _gemini_request_override = None


def _gemini_request(payload, model, key, timeout):
    """POST a generateContent request. Returns the parsed JSON response dict.
    Raises GeminiHTTPError on non-2xx, and a CONTROLLED ModelError on
    timeouts, network failures and unreadable success bodies — so no raw
    exception can reach the HTTP layer (every failure maps to a clean
    JSON error the frontend can display). The API key only ever appears in
    the request header; it is not part of any exception or error message."""
    if _gemini_request_override is not None:
        return _gemini_request_override(payload, model, key, timeout)
    import socket
    import ssl
    import urllib.request
    import urllib.error
    url = GEMINI_API_BASE + "/" + model + ":generateContent"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json", "x-goog-api-key": key})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw_body = r.read()
    except urllib.error.HTTPError as e:
        # Read the error body for a stable status; it is an error payload and
        # does not contain our key.
        err_payload = {}
        try:
            body = e.read().decode("utf-8", "replace")
            try:
                err_payload = json.loads(body)
            except Exception:
                err_payload = {"raw": body[:500]}
        except Exception:
            pass
        raise GeminiHTTPError(e.code, err_payload)
    except urllib.error.URLError:
        raise ModelError("network",
            "Could not reach Google (network error). Check your connection and "
            "try again.")
    except (TimeoutError, socket.timeout):
        # socket.timeout is aliased to TimeoutError on py3.10+; listing both
        # keeps this explicit. A socket-level read/connect timeout is a
        # controlled 'timeout' error, not a server crash.
        raise ModelError("timeout",
            "Google's API did not respond in time. Try again — very large "
            "resumes can take a while.")
    except ssl.SSLError:
        raise ModelError("network",
            "TLS error while contacting Google. Check your connection and "
            "try again.")
    except OSError:
        # Any remaining socket-level failure (reset connection, no route,
        # broken pipe ...) is a controlled network error, never a crash.
        raise ModelError("network",
            "Could not reach Google (network error). Check your connection and "
            "try again.")
    try:
        return json.loads(raw_body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        # A 200 response whose body is not readable JSON: controlled, not 500.
        raise ModelError("invalid_response",
            "Google's reply could not be read. Try again.")


def _to_gemini_schema(schema):
    """Return a Gemini `responseSchema`-compatible copy of `schema`.

    The classic generateContent REST endpoint takes the schema as a proto
    `Schema` type. LIVE VERIFIED (HTTP 400 INVALID_ARGUMENT,
    "Proto field is not repeating, cannot start list"): its `type` field is a
    SINGLE enum value — nullable type ARRAYS (["string","null"]) are rejected.
    So we flatten those unions to their non-null type. Missing data then comes
    back as "" / empty, which the parsers already handle.

    LIVE VERIFIED (HTTP 400 INVALID_ARGUMENT, "Unknown name
    'additionalProperties' ... Cannot find field"): this endpoint's proto has
    NO additionalProperties field, so it is removed from the Gemini copy only
    (the OpenAI schemas keep it; OpenAI's structured outputs require it).

    Everything else the endpoint accepts is preserved as-is: `enum`,
    `required`, `properties`, `items`, `anyOf`, and the usual constraints.
    Other keywords are dropped only for a documented reason: `oneOf`/`allOf`
    (unsupported composition) and the silently-ignored constraint keywords
    (`minLength`, `maxLength`, `minProperties`, `maxProperties`,
    `uniqueItems`, `contains`, `minContains`, `maxContains`).

    A recursive copy is returned, so the shared OpenAI schemas are never
    mutated and the OpenAI provider's behavior is unchanged.
    """
    import copy
    _KEEP = {
        # structure
        "type", "properties", "items", "required", "anyOf",
        # supported constraints (additionalProperties removed: live 400 proves
        # the classic generateContent proto does not have this field)
        "enum", "format",
        "minimum", "maximum", "minItems", "maxItems", "prefixItems",
        "default", "title", "description",
    }

    def t(node):
        if isinstance(node, dict):
            out = {}
            for k, v in node.items():
                if k not in _KEEP:
                    continue
                if k == "properties":
                    # name -> schema map: recurse into each value (a schema node)
                    out[k] = {name: t(sub) for name, sub in v.items()}
                elif k == "type" and isinstance(v, list):
                    # Flatten nullable unions (["string","null"] -> "string").
                    out[k] = next((x for x in v if x != "null"), "string")
                elif isinstance(v, dict):
                    out[k] = t(v)          # e.g. items, anyOf alternatives, additionalProperties
                elif isinstance(v, list):
                    out[k] = [t(x) for x in v]   # required, enum, anyOf
                else:
                    out[k] = copy.deepcopy(v)     # scalars: type str, min/max, format...
            return out
        if isinstance(node, list):
            return [t(x) for x in node]
        return copy.deepcopy(node)

    return t(schema)


def _map_gemini_http(e):
    """Translate a GeminiHTTPError into a key-free ModelError."""
    s = e.status
    p = e.payload
    gerr = p.get("error") if isinstance(p.get("error"), dict) else {}
    status_str = str(gerr.get("status", "")).upper()
    if s == 429 or status_str in ("RESOURCE_EXHAUSTED", "QUOTA_EXCEEDED"):
        return ModelError("rate_limit",
            "Gemini free-tier rate/quota limit reached. Wait a moment and try "
            "again, or check your Google AI Studio usage limits.")
    if s == 404 or status_str == "NOT_FOUND":
        return ModelError("model_unsupported",
            "Gemini model not available for this account. Set GEMINI_MODEL in "
            "your environment to a model you can access, then restart.")
    if s == 403 or status_str == "PERMISSION_DENIED":
        return ModelError("auth",
            "Gemini rejected the API key (HTTP 403). Check GEMINI_API_KEY.")
    if s == 400:
        return ModelError("api",
            "Gemini rejected the request (HTTP 400). This can mean an "
            "unsupported model or an unsupported request field. Check GEMINI_MODEL "
            "and try again.")
    if s in (500, 503):
        return ModelError("api",
            "Google's API is temporarily unavailable (HTTP %s). Try again "
            "shortly." % s)
    return ModelError("api", "Gemini returned an error (HTTP %s). Try again." % s)


def _gemini_generate(model, system_instruction, user_text, gemini_schema, key, timeout):
    payload = {
        "contents": [{"role": "user", "parts": [{"text": user_text}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": gemini_schema,
        },
    }
    if system_instruction:
        payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}
    data = _gemini_request(payload, model, key, timeout)
    cands = data.get("candidates") if isinstance(data, dict) else None
    if not cands:
        pfb = data.get("promptFeedback") or data.get("prompt_feedback") or {}
        reason = str(pfb.get("reason", "")).upper() if isinstance(pfb, dict) else ""
        if reason in ("SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST"):
            raise ModelError("refused",
                "Gemini declined this request for content-policy reasons "
                "(%s). Try again with different input." % (reason or "policy"))
        raise ModelError("invalid_response",
            "Gemini returned no usable candidates. Try again.")
    c0 = cands[0] or {}
    content = c0.get("content") or {}
    parts = content.get("parts") or []
    text = "".join((pt.get("text") or "") for pt in parts if isinstance(pt, dict))
    if not text.strip():
        raise ModelError("invalid_response",
            "Gemini returned an empty response. Try again.")
    return text


def _map_transport_escapes(e):
    """Translate a socket-level failure that escaped the transport's own
    except-clauses into a controlled ModelError, so the AI path can never
    surface a generic 500 for a network problem. Returns None for anything
    that is genuinely unexpected (those still reach the server's logged
    500 catch-all)."""
    import socket
    import ssl
    if isinstance(e, (TimeoutError, socket.timeout)):
        return ModelError("timeout",
            "Google's API did not respond in time. Try again — very large "
            "resumes can take a while.")
    if isinstance(e, ssl.SSLError):
        return ModelError("network",
            "TLS error while contacting Google. Check your connection and "
            "try again.")
    if isinstance(e, OSError):
        return ModelError("network",
            "Could not reach Google (network error). Check your connection and "
            "try again.")
    return None


def _gemini_generate_guarded(fn, *args, **kwargs):
    """Run a _gemini_generate call and map transport-level failures to the
    controlled errors callers can display (GeminiHTTPError -> provider
    errors; OSError/timeout family -> clean network errors)."""
    try:
        return fn(*args, **kwargs)
    except GeminiHTTPError as e:
        raise _map_gemini_http(e)
    except ModelError:
        raise
    except Exception as e:
        mapped = _map_transport_escapes(e)
        if mapped is not None:
            raise mapped
        raise


def _run_analysis_gemini(resume_text, job_description=None, target_role=None):
    key = _gemini_key()
    if not key:
        raise ConfigError(
            "GEMINI_API_KEY is not configured. Set it in your environment (or "
            "Render's env vars) and restart the server.")
    resume_text = (resume_text or "").strip()
    if not resume_text:
        raise ModelError("empty_input", "No resume text to analyze.")
    if len(resume_text) > 24000:
        resume_text = resume_text[:24000]
    model = gemini_model_name()
    text = _gemini_generate_guarded(
        _gemini_generate,
        model,
        _analysis_instructions(bool(job_description)),
        analysis_user_message(resume_text, job_description, target_role),
        _to_gemini_schema(ANALYSIS_SCHEMA), key, REQUEST_TIMEOUT_SECONDS)
    raw = _parse_json_loose(text)
    if raw is None:
        raise ModelError("invalid_response",
            "Gemini's reply could not be read as structured data. Try again.")
    return {
        "analysis": _analyze_dict(raw),
        "model": model,
        "provider": "gemini",
        "had_jd": bool(job_description),
        "resume_chars_used": len(resume_text),
    }


def _run_studio_gemini(operation, resume_text="", job_description=None,
                      instructions=None, candidate_info=None, target_role=None):
    if operation not in STUDIO_OPERATIONS:
        raise ModelError("bad_operation", "Unknown studio operation: " + str(operation))
    key = _gemini_key()
    if not key:
        raise ConfigError(
            "GEMINI_API_KEY is not configured. Set it in your environment (or "
            "Render's env vars) and restart the server.")
    source = candidate_info if operation == "new_draft" else resume_text
    source = (source or "").strip()
    if not source:
        raise ModelError("empty_input",
            "No resume/candidate data to work on for this operation.")
    if len(source) > 24000:
        source = source[:24000]
    model = gemini_model_name()
    text = _gemini_generate_guarded(
        _gemini_generate,
        model,
        _studio_instructions(operation),
        studio_user_message(operation, source, job_description,
                            instructions,
                            candidate_info if operation == "new_draft" else None,
                            target_role),
        _to_gemini_schema(STUDIO_SCHEMA), key, REQUEST_TIMEOUT_SECONDS)
    raw = _parse_json_loose(text)
    if raw is None:
        raise ModelError("invalid_response",
            "Gemini's reply could not be read as structured data. Try again.")
    return {
        "result": _studio_dict(raw, operation),
        "model": model,
        "provider": "gemini",
        "operation": operation,
    }


# --- public dispatchers (provider chosen by AI_PROVIDER; never fall back) ---

def run_analysis(resume_text, job_description=None, target_role=None):
    """Analyze a resume with the ACTIVE provider (OpenAI or Gemini)."""
    if active_provider() == "gemini":
        return _run_analysis_gemini(resume_text, job_description, target_role)
    return _run_analysis_openai(resume_text, job_description, target_role)


def run_studio(operation, resume_text="", job_description=None,
               instructions=None, candidate_info=None, target_role=None):
    """Run a Resume-Studio operation with the ACTIVE provider (OpenAI or Gemini)."""
    if active_provider() == "gemini":
        return _run_studio_gemini(operation, resume_text, job_description,
                                  instructions, candidate_info, target_role)
    return _run_studio_openai(operation, resume_text, job_description,
                              instructions, candidate_info, target_role)
