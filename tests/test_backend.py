"""Automated backend tests for the OpenAI endpoints.

These use a FAKE OpenAI client (monkeypatched into ai_client), so they never
hit the real API and never incur charges. Run them with:

    .venv\\Scripts\\python tests\\test_backend.py        (Windows)
    .venv/bin/python tests/test_backend.py              (mac/Linux)

They require the dependencies from requirements.txt to be installed (flask,
openai, pypdf, python-docx). The openai package is needed only so its
exception types can be imported; no live call is made.
"""

import io
import json
import os
import sys
import types
import unittest

# Make the project root importable (server.py / ai_client.py / doc_extract.py).
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

import ai_client      # noqa: E402
import server         # noqa: E402

# A distinctive key we put in the environment for the "never leak the key"
# test. It is a fake; it is NEVER sent anywhere (all responses are mocked).
FAKE_KEY = "sk-test-dont-ship-0001112223"
FAKE_MODEL = "gpt-5.5"

# A marker so we can prove WHICH resume text was sent on which call.
MARK_A = "UNIQUE_RESUME_MARKER_ALPHA"
MARK_B = "UNIQUE_RESUME_MARKER_BETA"


# ------------------------------------------------------------------ fakes
class FakeResponse:
    def __init__(self, output_text):
        self.output_text = output_text
        self.output = []


def _sim_api_error(message, cls_name="APIError"):
    """Build a real openai exception instance without a network response.

    This SDK's exception constructors require an httpx request/response, so we
    subclass with a permissive __init__. The result is still an instance of the
    requested openai error type, so the real exception ladder in ai_client
    maps it exactly as a live failure would.
    """
    import openai
    base = getattr(openai, cls_name)
    klass = type("Sim" + cls_name, (base,),
                 {"__init__": lambda self, msg: Exception.__init__(self, msg)})
    obj = klass(message)
    obj.message = message
    return obj


class FakeClient:
    """Mimics `client.responses.create(**kwargs)` and records every call."""

    def __init__(self):
        self.calls = []
        self._behavior = None  # optional callable(kwargs) -> FakeResponse or Exception

    class _Responses:
        def __init__(self, fake):
            self._fake = fake

        def create(self, **kwargs):
            self._fake.calls.append(kwargs)
            if self._fake._behavior:
                result = self._fake._behavior(kwargs)
                if isinstance(result, Exception):
                    raise result
                return result
            # Default: return a well-formed analysis/studio payload.
            which = "studio" if "studio_result" in json.dumps(kwargs.get("text", {})) else "analysis"
            if which == "studio":
                payload = {
                    "summary": "Improved the resume.",
                    "content": "Rewritten resume body...",
                    "suggestions": [{"original": "o", "suggested": "s", "why": "w"}],
                    "questions": ["What is your biggest metric?"],
                }
            else:
                payload = {
                    "candidate_summary": "A capable analyst.",
                    "employment_history": [{"role": "Analyst", "employer": "X", "dates": "2020-2023"}],
                    "experience_and_skills": [{"item": "SQL", "evidence": "used SQL daily",
                                                "confidence": "confirmed"}],
                    "education_and_certifications": ["B.Sc Computer Science"],
                    "achievements": [{"achievement": "Cut costs 20%", "evidence": "20%",
                                       "stated": True}],
                    "strengths": ["Data analysis"],
                    "transferable_skills": ["Communication"],
                    "missing_relative_to_jd": ["Power BI"],
                    "ats_concerns": ["No summary section"],
                    "missing_or_ambiguous": ["Start date of role 2"],
                    "recommendations": ["Add a 2-line summary"],
                }
            return FakeResponse(json.dumps(payload))

    responses = None  # replaced below


def install_fake(fake_client):
    def fake_get():
        return fake_client

    ai_client.set_client_for_testing(fake_client)
    return fake_get


def reset_env(key=FAKE_KEY, model=FAKE_MODEL):
    os.environ["OPENAI_API_KEY"] = key
    os.environ["OPENAI_MODEL"] = model


# ---------------------------------------------------------------------------
# Test-isolation tripwire (prevents accidental real API calls / charges).
#
# From the moment this module is imported, BOTH provider network paths are
# replaced with guards that raise AssertionError immediately:
#   * the OpenAI client seam (a client whose .responses.create raises),
#   * the Gemini transport seam (a request function that raises).
# Test classes that exercise a provider install their OWN mocks on top of the
# guards (BackendTests -> fake OpenAI client, GeminiBackendTests -> fake
# Gemini transport), and their tearDown re-arms the guards. As a result, no
# test can reach the real OpenAI or Gemini APIs — and therefore no test run
# can incur any API charges — regardless of .env or inherited environment
# variables.
# ---------------------------------------------------------------------------
class _OpenAIUnmockedGuard:
    """Stands in for the real OpenAI client: touching it = a real call was
    about to happen. Fail loudly instead."""
    class _Responses:
        def create(self, *args, **kwargs):
            raise AssertionError(
                "OpenAI network request attempted WITHOUT a mock — test "
                "isolation broken; refusing to call the real API.")
    responses = _Responses()


def _gemini_unmocked_guard(payload, model, key, timeout):
    raise AssertionError(
        "Gemini network request attempted WITHOUT a mock — test isolation "
        "broken; refusing to call the real API.")


ai_client.set_client_for_testing(_OpenAIUnmockedGuard())
ai_client.set_gemini_request_for_testing(_gemini_unmocked_guard)


class BackendTests(unittest.TestCase):
    """OpenAI-path tests. They pin AI_PROVIDER=openai and neutralize any real
    Gemini key inherited from .env (via server.load_dotenv), so these tests are
    hermetic: they can NEVER reach a real network call, regardless of the
    user's local .env contents."""

    def setUp(self):
        reset_env()
        self._env_saved = {k: os.environ.get(k) for k in
                           ("AI_PROVIDER", "GEMINI_API_KEY", "GEMINI_MODEL")}
        os.environ["AI_PROVIDER"] = "openai"       # never dispatch to Gemini here
        os.environ["GEMINI_API_KEY"] = "gem-disabled-in-openai-tests"
        self.fake = FakeClient()
        self.fake.responses = self.fake._Responses(self.fake)
        install_fake(self.fake)
        self.app = server.create_app().test_client()

    def tearDown(self):
        # Re-arm the tripwire (never leave a real-client path open).
        ai_client.set_client_for_testing(_OpenAIUnmockedGuard())
        for k, v in self._env_saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    # 1. Missing API key -------------------------------------------------
    def test_missing_api_key_reports_config_error(self):
        # Remove the key, reset the client seam so get_client() re-reads env.
        old = os.environ.get("OPENAI_API_KEY")
        os.environ.pop("OPENAI_API_KEY", None)
        ai_client.reset_client_for_testing()
        try:
            r = self.app.post("/api/analyze-resume",
                              json={"resumeText": "Name\n- did stuff", "requestId": "x"})
            self.assertEqual(r.status_code, 503)
            body = r.get_json()
            self.assertFalse(body["ok"])
            self.assertEqual(body["code"], "no_key")
            self.assertFalse(FAKE_KEY in json.dumps(body))
        finally:
            if old is not None:
                os.environ["OPENAI_API_KEY"] = old
            reset_env()

    def test_health_reports_key_state_without_exposing_it(self):
        r = self.app.get("/api/health")
        self.assertEqual(r.status_code, 200)
        body = r.get_json()
        self.assertTrue(body["ok"])
        self.assertTrue(body["apiKeyConfigured"])
        # The key value must not appear anywhere in the health payload.
        self.assertNotIn(FAKE_KEY, json.dumps(body))
        self.assertEqual(body["model"], FAKE_MODEL)

    # 2. Empty / invalid resume content --------------------------------
    def test_empty_resume_rejected(self):
        r = self.app.post("/api/analyze-resume", json={"resumeText": "   "})
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.get_json()["code"], "no_input")
        self.assertEqual(len(self.fake.calls), 0)  # no AI call made

    def test_no_input_at_all_rejected(self):
        r = self.app.post("/api/analyze-resume", json={})
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.get_json()["code"], "no_input")

    def test_ai_client_rejects_empty_directly(self):
        with self.assertRaises(ai_client.ModelError) as ctx:
            ai_client.run_analysis("")
        self.assertEqual(ctx.exception.code, "empty_input")

    # 3. Correct current-resume content is sent ------------------------
    def test_current_resume_text_is_sent(self):
        resume = MARK_A + "\nLed a team.\nSkills: SQL"
        r = self.app.post("/api/analyze-resume",
                          json={"resumeText": resume, "requestId": "req-1"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(self.fake.calls), 1)
        sent_input = self.fake.calls[0]["input"]
        self.assertIn(MARK_A, sent_input)
        self.assertNotIn(MARK_B, sent_input)
        self.assertEqual(r.get_json()["requestId"], "req-1")

    # 4. Second resume does not reuse the first ------------------------
    def test_second_resume_does_not_reuse_first(self):
        r1 = self.app.post("/api/analyze-resume", json={"resumeText": MARK_A + "\nx"})
        r2 = self.app.post("/api/analyze-resume", json={"resumeText": MARK_B + "\ny"})
        self.assertEqual(len(self.fake.calls), 2)
        self.assertIn(MARK_A, self.fake.calls[0]["input"])
        self.assertNotIn(MARK_B, self.fake.calls[0]["input"])
        self.assertIn(MARK_B, self.fake.calls[1]["input"])
        self.assertNotIn(MARK_A, self.fake.calls[1]["input"])
        # Both returned ok:true with real (mocked) structured analysis.
        self.assertTrue(r1.get_json()["ok"])
        self.assertTrue(r2.get_json()["ok"])

    # 5. Every user-triggered analysis invokes the AI ------------------
    def test_each_request_invokes_ai(self):
        for i in range(3):
            self.app.post("/api/analyze-resume",
                          json={"resumeText": "resume %d" % i})
        self.assertEqual(len(self.fake.calls), 3)

    # 6. Studio uses the current resume and the chosen task ------------
    def test_studio_uses_current_resume_and_operation(self):
        resume = MARK_A + "\n- improved dashboards"
        r = self.app.post("/api/resume-studio",
                          json={"operation": "tailor", "resumeText": resume,
                                "jobDescription": "Needs Power BI", "requestId": "s1"})
        self.assertEqual(r.status_code, 200)
        body = r.get_json()
        self.assertTrue(body["ok"])
        self.assertEqual(body["result"]["operation"], "tailor")
        sent = self.fake.calls[0]["input"]
        self.assertIn(MARK_A, sent)
        self.assertIn("Needs Power BI", sent)
        self.assertIn("tailor", sent)

    def test_studio_new_draft_uses_candidate_info(self):
        cand = "Name: Jane\nRole: Analyst\nYears: 3\nSkills: SQL, Excel"
        r = self.app.post("/api/resume-studio",
                          json={"operation": "new_draft", "candidateInfo": cand})
        self.assertEqual(r.status_code, 200)
        sent = self.fake.calls[0]["input"]
        self.assertIn("Jane", sent)
        # new_draft is sourced from the user's real entered data, labeled as such.
        self.assertIn("CANDIDATE INFORMATION", sent)

    def test_studio_bad_operation_rejected(self):
        r = self.app.post("/api/resume-studio",
                          json={"operation": "nope", "resumeText": "x"})
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.get_json()["code"], "bad_operation")

    # 7. API failure must not present a stale result as fresh ----------
    def test_api_failure_yields_error_not_result(self):
        def boom(kwargs):
            return _sim_api_error("simulated provider failure")
        self.fake._behavior = boom
        r = self.app.post("/api/analyze-resume", json={"resumeText": MARK_A + "\nx"})
        self.assertEqual(r.status_code, 502)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "api")
        self.assertNotIn("analysis", body)   # no result payload -> nothing stale to show

    def test_rate_limit_yields_clear_error(self):
        def boom(kwargs):
            return _sim_api_error("rate limited", "RateLimitError")
        self.fake._behavior = boom
        r = self.app.post("/api/resume-studio",
                          json={"operation": "improve", "resumeText": MARK_A + "\nx"})
        self.assertEqual(r.status_code, 502)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "rate_limit")
        self.assertNotIn("result", body)

    # 8. Malformed model response handled safely -----------------------
    def test_malformed_model_response_rejected(self):
        def junk(kwargs):
            return FakeResponse("this is not json at all {{{")
        self.fake._behavior = junk
        r = self.app.post("/api/analyze-resume", json={"resumeText": MARK_A + "\nx"})
        self.assertEqual(r.status_code, 400)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "invalid_response")

    def test_studio_malformed_response_rejected(self):
        def junk(kwargs):
            return FakeResponse("")
        self.fake._behavior = junk
        r = self.app.post("/api/resume-studio",
                          json={"operation": "improve", "resumeText": MARK_A + "\nx"})
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.get_json()["code"], "invalid_response")

    # 9. The API key is never exposed to the frontend ------------------
    def test_key_never_leaks_to_client(self):
        # Make the provider fail so the error path is exercised, then scan every
        # byte the client received for the key.
        self.fake._behavior = lambda k: _sim_api_error("simulated")
        r = self.app.post("/api/analyze-resume", json={"resumeText": MARK_A + "\nx"})
        self.assertNotIn(FAKE_KEY, r.get_data(as_text=True))
        r2 = self.app.get("/api/health")
        self.assertNotIn(FAKE_KEY, r2.get_data(as_text=True))
        # Also: a successful response never contains the key.
        self.fake._behavior = None
        r3 = self.app.post("/api/analyze-resume", json={"resumeText": MARK_A + "\nx"})
        self.assertNotIn(FAKE_KEY, r3.get_data(as_text=True))

    # -------------------------------------------------------------------
    # File-upload extraction (server-side) -----------------------------
    def test_txt_file_upload_is_extracted(self):
        txt = ("NAME\n- built SQL reports\nSkills: Excel".encode("utf-8"))
        r = self.app.post(
            "/api/analyze-resume",
            data={"file": (io.BytesIO(txt), "resume.txt")},
            content_type="multipart/form-data",
        )
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        sent = self.fake.calls[-1]["input"]
        self.assertIn("SQL reports", sent)

    def test_unsupported_binary_rejected(self):
        r = self.app.post(
            "/api/analyze-resume",
            data={"file": (io.BytesIO(b"\x00\x01\x02BINARY"), "blob.bin")},
            content_type="multipart/form-data",
        )
        self.assertEqual(r.status_code, 400)
        self.assertTrue(r.get_json()["code"].startswith("extract:"))

    def test_static_dotenv_never_served(self):
        r = self.app.get("/.env")
        self.assertEqual(r.status_code, 403)
        r2 = self.app.get("/.git/config")
        self.assertEqual(r2.status_code, 403)


# ---------------------------------------------------------------------------
# Gemini provider tests (mocked — no live calls, no charges).
# A fake _gemini_request is injected via ai_client.set_gemini_request_for_testing,
# so the standard-library urllib transport is never exercised in tests.
# ---------------------------------------------------------------------------
GEMINI_FAKE_KEY = "gem-test-dont-ship-000"


def _gemini_ok(payload):
    """Build a canned generateContent response carrying `payload` as JSON text."""
    return {"candidates": [{"content": {"parts": [{"text": json.dumps(payload)}]}}]}


class GeminiBackendTests(unittest.TestCase):

    def setUp(self):
        # Force the Gemini provider and give it a fake key; clear OpenAI so the
        # OpenAI path can never be taken.
        self._saved = {}
        for k in ("AI_PROVIDER", "GEMINI_API_KEY", "GEMINI_MODEL", "OPENAI_API_KEY"):
            self._saved[k] = os.environ.get(k)
        os.environ["AI_PROVIDER"] = "gemini"
        os.environ["GEMINI_API_KEY"] = GEMINI_FAKE_KEY
        os.environ["GEMINI_MODEL"] = "gemini-2.5-flash"
        os.environ.pop("OPENAI_API_KEY", None)

        # Capture every request the fake transport sees.
        self.requests = []
        self.behavior = None  # callable(payload, model, key, timeout) -> dict | Exception

        def fake(payload, model, key, timeout):
            self.requests.append((payload, model, key))
            if self.behavior:
                res = self.behavior(payload, model, key, timeout)
                if isinstance(res, Exception):
                    raise res
                return res
            # Default: pick the payload shape from the system instruction so both
            # the analysis and studio endpoints get a well-formed response.
            sys_txt = (payload.get("systemInstruction", {}).get("parts", [{}])[0].get("text", ""))
            if "resume writer" in sys_txt:
                return _gemini_ok({
                    "summary": "Improved the resume.",
                    "content": "Rewritten resume body...",
                    "suggestions": [{"original": "o", "suggested": "s", "why": "w"}],
                    "questions": ["What is your biggest metric?"],
                })
            return _gemini_ok({
                "candidate_summary": "A capable analyst.",
                "employment_history": [{"role": "Analyst", "employer": "X", "dates": "2020-2023"}],
                "experience_and_skills": [{"item": "SQL", "evidence": "daily", "confidence": "confirmed"}],
                "education_and_certifications": ["B.Sc CS"],
                "achievements": [{"achievement": "Cut costs 20%", "evidence": "20%", "stated": True}],
                "strengths": ["Data analysis"], "transferable_skills": ["Communication"],
                "missing_relative_to_jd": ["Power BI"], "ats_concerns": ["No summary"],
                "missing_or_ambiguous": ["start date"], "recommendations": ["Add summary"],
            })

        ai_client.set_gemini_request_for_testing(fake)
        self.app = server.create_app().test_client()

    def tearDown(self):
        # Re-arm the tripwire (never leave a real-transport path open).
        ai_client.set_gemini_request_for_testing(_gemini_unmocked_guard)
        for k, v in self._saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    def _gc(self, payload):
        return payload  # identity

    # 1. Success: a valid structured response is parsed (no live call).
    def test_gemini_success_returns_structured_analysis(self):
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- built SQL reports"})
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        body = r.get_json()
        self.assertTrue(body["ok"])
        self.assertEqual(body["model"], "gemini-2.5-flash")
        self.assertEqual(body["provider"], "gemini")
        self.assertIn("candidate_summary", body["analysis"])
        self.assertEqual(len(self.requests), 1)

    # 2. The Gemini schema has NO type arrays and NO additionalProperties
    #    (both verified live as rejected by the classic generateContent proto),
    #    while preserving the supported constraints (enum, required).
    def test_gemini_schema_no_type_unions_preserves_supported_constraints(self):
        self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        payload, model, key = self.requests[0]
        schema = payload["generationConfig"]["responseSchema"]
        self.assertEqual(payload["generationConfig"]["responseMimeType"], "application/json")

        # Nullable unions flattened to their non-null type.
        self.assertEqual(schema["properties"]["candidate_summary"]["type"], "string")
        self.assertEqual(
            schema["properties"]["achievements"]["items"]["properties"]["stated"]["type"],
            "boolean")

        def check(node):
            if isinstance(node, dict):
                ty = node.get("type")
                self.assertNotIsInstance(ty, list,
                    "type arrays must not be sent to Gemini (proto rejects lists): %r" % (ty,))
                for bad in ("oneOf", "allOf", "minLength", "maxLength",
                            "minProperties", "maxProperties", "uniqueItems",
                            "contains", "minContains", "maxContains",
                            "additionalProperties"):
                    self.assertNotIn(bad, node, "%s should not be sent to Gemini" % bad)
                for v in node.get("properties", {}).values():
                    check(v)
                if "items" in node:
                    check(node["items"])
            elif isinstance(node, list):
                for v in node:
                    check(v)
        check(schema)

        # Supported constraints preserved.
        self.assertEqual(set(schema["required"]), set(schema["properties"].keys()))
        conf = schema["properties"]["experience_and_skills"]["items"]["properties"]["confidence"]
        self.assertEqual(conf.get("enum"), ["confirmed", "inferred"])
        self.assertIn("required", schema["properties"]["employment_history"]["items"])

    # 2b. The OpenAI source schemas are not mutated by the Gemini adapter.
    def test_openai_schemas_unchanged_by_gemini_adapter(self):
        import copy
        before_a = copy.deepcopy(ai_client.ANALYSIS_SCHEMA)
        before_s = copy.deepcopy(ai_client.STUDIO_SCHEMA)
        ai_client._to_gemini_schema(ai_client.ANALYSIS_SCHEMA)
        ai_client._to_gemini_schema(ai_client.STUDIO_SCHEMA)
        self.assertEqual(ai_client.ANALYSIS_SCHEMA, before_a, "ANALYSIS_SCHEMA was mutated")
        self.assertEqual(ai_client.STUDIO_SCHEMA, before_s, "STUDIO_SCHEMA was mutated")
        # OpenAI's strict schema keeps additionalProperties:false + enum intact.
        self.assertIs(ai_client.ANALYSIS_SCHEMA["additionalProperties"], False)
        self.assertIn("enum", ai_client.ANALYSIS_SCHEMA["properties"]["experience_and_skills"]["items"]["properties"]["confidence"])

    # 3. The resume text is sent as the user message; key is NOT the model string.
    def test_gemini_sends_current_resume_and_keeps_key_hidden(self):
        resume = MARK_A + "\n- improved dashboards"
        r = self.app.post("/api/resume-studio",
                          json={"operation": "improve", "resumeText": resume})
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        payload, model, key = self.requests[0]
        user_text = payload["contents"][0]["parts"][0]["text"]
        self.assertIn(MARK_A, user_text)
        # The key passed to the transport is the env key; assert it's the expected
        # fake, and that it is NOT embedded in the request body or response.
        self.assertEqual(key, GEMINI_FAKE_KEY)
        self.assertNotIn(GEMINI_FAKE_KEY, json.dumps(payload))
        self.assertNotIn(GEMINI_FAKE_KEY, r.get_data(as_text=True))

    # 4. Missing GEMINI key -> 503 no_key (clear config error).
    def test_gemini_missing_key_reports_config_error(self):
        os.environ.pop("GEMINI_API_KEY", None)
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 503)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "no_key")
        self.assertEqual(len(self.requests), 0)  # no HTTP call attempted

    # 5. HTTP 429 -> clear rate/quota error, no stale result.
    def test_gemini_429_rate_limit(self):
        self.behavior = lambda p, m, k, t: ai_client.GeminiHTTPError(
            429, {"error": {"status": "RESOURCE_EXHAUSTED", "message": "quota"}})
        r = self.app.post("/api/analyze-resume", json={"resumeText": MARK_A + "\nx"})
        self.assertEqual(r.status_code, 502)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "rate_limit")
        self.assertNotIn("analysis", body)

    # 6. HTTP 404 -> model_unsupported (invalid model name / no access).
    def test_gemini_404_model_unsupported(self):
        self.behavior = lambda p, m, k, t: ai_client.GeminiHTTPError(
            404, {"error": {"status": "NOT_FOUND", "message": "model not found"}})
        r = self.app.post("/api/analyze-resume", json={"resumeText": MARK_A + "\nx"})
        self.assertEqual(r.status_code, 502)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "model_unsupported")

    # 7. Malformed (non-JSON) model output -> invalid_response, handled safely.
    def test_gemini_malformed_response_rejected(self):
        self.behavior = lambda p, m, k, t: _gemini_ok_raw("this is not json {{{")
        r = self.app.post("/api/analyze-resume", json={"resumeText": MARK_A + "\nx"})
        self.assertEqual(r.status_code, 400)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "invalid_response")

    # 8. No silent fallback to OpenAI: with AI_PROVIDER=gemini a Gemini failure
    #    must surface a Gemini error, and OpenAI must never be contacted.
    def test_gemini_failure_does_not_fall_back_to_openai(self):
        self.behavior = lambda p, m, k, t: ai_client.GeminiHTTPError(
            429, {"error": {"status": "RESOURCE_EXHAUSTED"}})
        r = self.app.post("/api/resume-studio",
                          json={"operation": "improve", "resumeText": MARK_A + "\nx"})
        body = r.get_json()
        self.assertEqual(body["code"], "rate_limit")
        self.assertIn("Gemini", body["error"])  # gemini-specific, not an OpenAI message
        # And no openai client was requested: only our gemini transport saw a call.
        self.assertEqual(len(self.requests), 1)

    # 9. Studio new_draft is sourced from candidateInfo under Gemini.
    def test_gemini_new_draft_uses_candidate_info(self):
        r = self.app.post("/api/resume-studio",
                          json={"operation": "new_draft", "candidateInfo": "Name: Jane\nSkills: SQL"})
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        payload, model, key = self.requests[0]
        user_text = payload["contents"][0]["parts"][0]["text"]
        self.assertIn("Jane", user_text)
        self.assertIn("CANDIDATE INFORMATION", user_text)


def _gemini_ok_raw(text):
    """A generateContent response whose candidate text is the raw string `text`."""
    return {"candidates": [{"content": {"parts": [{"text": text}]}}]}


class TestUnmockedNetworkGuard(unittest.TestCase):
    """Proof the tripwire fires: with only the guards installed (no explicit
    mocks) and neutral fake keys, both provider runners refuse to run instead
    of touching the real APIs. This is the 'fail immediately' guarantee that
    running the suite can never incur API charges."""

    def setUp(self):
        self._saved = {}
        for k in ("AI_PROVIDER", "OPENAI_API_KEY", "GEMINI_API_KEY"):
            self._saved[k] = os.environ.get(k)
        # Neutral fakes: even if a guard were missing, no real key is usable.
        os.environ["OPENAI_API_KEY"] = "sk-neutral-fake"
        os.environ["GEMINI_API_KEY"] = "gem-neutral-fake"

    def tearDown(self):
        for k, v in self._saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v
        ai_client.set_client_for_testing(_OpenAIUnmockedGuard())
        ai_client.set_gemini_request_for_testing(_gemini_unmocked_guard)

    def test_openai_guard_blocks_unmocked_call(self):
        os.environ["AI_PROVIDER"] = "openai"
        ai_client.set_client_for_testing(_OpenAIUnmockedGuard())
        with self.assertRaises(AssertionError):
            ai_client._run_analysis_openai("Some resume text")

    def test_gemini_guard_blocks_unmocked_call(self):
        os.environ["AI_PROVIDER"] = "gemini"
        ai_client.set_gemini_request_for_testing(_gemini_unmocked_guard)
        with self.assertRaises(AssertionError):
            ai_client._run_analysis_gemini("Some resume text")


# ---------------------------------------------------------------------------
# Per-client rate limiting on the expensive AI routes (flask-limiter).
# The provider stays mocked (FakeClient / fake Gemini transport), so these
# tests make NO live call and NO charge. Limits are configured via env vars
# read inside create_app(), so each test gets a fresh, isolated app instance
# with its own in-memory limiter storage.
# ---------------------------------------------------------------------------
class RateLimitTests(unittest.TestCase):

    def setUp(self):
        self._saved = {}
        for k in ("AI_PROVIDER", "OPENAI_API_KEY", "OPENAI_MODEL",
                  "GEMINI_API_KEY", "AI_RATE_LIMIT", "RATELIMIT_STORAGE_URI",
                  "TRUSTED_PROXIES"):
            self._saved[k] = os.environ.get(k)
        reset_env()
        os.environ["AI_PROVIDER"] = "openai"   # OpenAI path, mocked
        os.environ["GEMINI_API_KEY"] = "gem-disabled-in-rl-tests"
        os.environ["AI_RATE_LIMIT"] = "2/minute"
        self.fake = FakeClient()
        self.fake.responses = self.fake._Responses(self.fake)
        install_fake(self.fake)
        self.flask_app = server.create_app()
        self.app = self.flask_app.test_client()

    def tearDown(self):
        ai_client.set_client_for_testing(_OpenAIUnmockedGuard())
        for k, v in self._saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    def _analyze(self, marker):
        return self.app.post("/api/analyze-resume", json={"resumeText": marker + "\nx"})

    # 1. Burst over the limit -> 429 with a safe, key-free, resume-free body.
    def test_ai_route_rate_limited_after_burst(self):
        self.assertEqual(self._analyze(MARK_A).status_code, 200)
        self.assertEqual(self._analyze(MARK_A).status_code, 200)
        r = self._analyze(MARK_A)
        self.assertEqual(r.status_code, 429)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "rate_limited")
        text = r.get_data(as_text=True)
        self.assertNotIn(FAKE_KEY, text)          # no key leaked
        self.assertNotIn(MARK_A, text)            # no resume content echoed
        self.assertIn("wait", body["error"].lower())  # understandable message

    # 2. The limit is per client and applies to BOTH expensive routes.
    def test_rate_limit_applies_to_studio_route(self):
        for _ in range(2):  # limit is 2/minute: first two go through
            self.assertEqual(
                self.app.post("/api/resume-studio",
                              json={"operation": "improve", "resumeText": MARK_B + "\nx"})
                .status_code, 200)
        r = self.app.post("/api/resume-studio",
                          json={"operation": "improve", "resumeText": MARK_B + "\nx"})
        self.assertEqual(r.status_code, 429)
        self.assertEqual(r.get_json()["code"], "rate_limited")

    # 3. The limit is per remote address, not global — two clients with
    #    different IPs do not share each other's quota.
    def test_rate_limit_is_per_client(self):
        self._analyze(MARK_A)
        self._analyze(MARK_A)
        # A second client with a different remote address starts fresh.
        other = self.flask_app.test_client()
        other.environ_base = {"REMOTE_ADDR": "10.1.2.3"}
        r = other.post("/api/analyze-resume", json={"resumeText": MARK_B + "\nx"})
        self.assertEqual(r.status_code, 200)

    # 4. Default limit (env unset) allows ordinary multi-request use.
    def test_default_limit_allows_normal_use(self):
        os.environ.pop("AI_RATE_LIMIT", None)     # -> 30/minute default
        app = server.create_app().test_client()
        for i in range(5):
            r = app.post("/api/analyze-resume", json={"resumeText": "r%d" % i})
            self.assertEqual(r.status_code, 200, "default limit must not trip at 5")

    # 5. Static files and /api/health are NOT rate-limited.
    def test_static_and_health_unlimited(self):
        self._analyze(MARK_A)
        self._analyze(MARK_A)
        for _ in range(40):   # well past any default; must still work
            self.assertEqual(self.app.get("/api/health").status_code, 200)
            self.assertEqual(self.app.get("/style.css").status_code, 200)


# ---------------------------------------------------------------------------
# 500 hardening: no framework HTML error page, ever.
#
# The fake _gemini_request stands in for the real urllib transport; these
# tests pin the contract that ANY exception a transport-level failure can
# produce maps to a controlled JSON error, that a truly unexpected failure
# is logged server-side (so a production 500 is diagnosable from the deploy
# logs instead of disappearing), and that the last-resort @app.errorhandler
# keeps every error page in the app's JSON shape. No live calls, no charges.
# ---------------------------------------------------------------------------
import logging
import ssl


class _CaptureHandler(logging.Handler):
    def __init__(self):
        super().__init__(level=logging.DEBUG)
        self.records = []

    def emit(self, record):
        self.records.append(record)


class FiveHundredHardeningTests(unittest.TestCase):

    def setUp(self):
        self._saved = {}
        for k in ("AI_PROVIDER", "GEMINI_API_KEY", "GEMINI_MODEL", "OPENAI_API_KEY"):
            self._saved[k] = os.environ.get(k)
        os.environ["AI_PROVIDER"] = "gemini"
        os.environ["GEMINI_API_KEY"] = GEMINI_FAKE_KEY
        os.environ["GEMINI_MODEL"] = "gemini-2.5-flash"
        os.environ.pop("OPENAI_API_KEY", None)

        self.behavior = None
        def fake(payload, model, key, timeout):
            if self.behavior:
                res = self.behavior(payload, model, key, timeout)
                if isinstance(res, Exception):
                    raise res
                return res
            return _gemini_ok({})
        ai_client.set_gemini_request_for_testing(fake)

        self.flask_app = server.create_app()
        self.app = self.flask_app.test_client()

        self.captures = _CaptureHandler()
        self.logger = logging.getLogger("career-ai")
        self._old_level = self.logger.level
        self.logger.addHandler(self.captures)
        self.logger.setLevel(logging.DEBUG)

    def tearDown(self):
        ai_client.set_gemini_request_for_testing(_gemini_unmocked_guard)
        self.logger.removeHandler(self.captures)
        self.logger.setLevel(self._old_level)
        for k, v in self._saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    def _logged_errors(self):
        return [r for r in self.captures.records if r.levelno >= logging.ERROR]

    # 1. A socket-level read timeout is a controlled 502 JSON error.
    def test_timeout_maps_to_clean_error(self):
        self.behavior = lambda p, m, k, t: TimeoutError("read timed out")
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 502)
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "timeout")
        self.assertIn("time", body["error"].lower())

    # 2. A reset connection (OSError family, not URLError) is a clean error.
    def test_connection_reset_maps_to_network_error(self):
        self.behavior = lambda p, m, k, t: ConnectionResetError("peer reset")
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 502)
        self.assertEqual(r.get_json()["code"], "network")

    # 3. A TLS failure is a clean error, not a crash.
    def test_ssl_error_maps_to_network_error(self):
        self.behavior = lambda p, m, k, t: ssl.SSLCertVerificationError("bad cert")
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 502)
        self.assertEqual(r.get_json()["code"], "network")

    # 4. An arbitrary uncaught exception: JSON 500 (never HTML), and the
    #    traceback is logged server-side so the cause is diagnosable.
    def test_unexpected_exception_returns_json_500_and_logs_traceback(self):
        self.behavior = lambda p, m, k, t: RuntimeError("boom")
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 500)
        self.assertEqual(r.content_type, "application/json")
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "internal")
        errs = self._logged_errors()
        self.assertTrue(
            any(r.exc_info and r.exc_info[0] is RuntimeError for r in errs),
            "the traceback must be logged server-side (no payload, no key)")

    # 5. An exception that escapes the views entirely (e.g. a request hook)
    #    also gets the JSON 500 shape — the app never emits a framework page.
    def test_hook_exception_returns_json_500_never_html(self):
        def _crash():
            raise KeyError("missing hook value")
        self.flask_app.before_request(_crash)
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 500)
        self.assertEqual(r.content_type, "application/json")
        body = r.get_json()
        self.assertFalse(body["ok"])
        self.assertEqual(body["code"], "internal")
        self.assertTrue(
            any(r.exc_info and r.exc_info[0] is KeyError for r in self._logged_errors()))

    # 6. Even a missing static file renders in the app's JSON shape.
    def test_missing_static_file_is_json_404(self):
        r = self.app.get("/definitely-missing-file.css")
        self.assertEqual(r.status_code, 404)
        self.assertEqual(r.content_type, "application/json")
        self.assertFalse(r.get_json()["ok"])


# ---------------------------------------------------------------------------
# Gemini bounded-timeout regression (2026-10-27 production WORKER TIMEOUTs):
# the Gemini (urllib) request cap must stay below Gunicorn's DEFAULT worker
# timeout (30s) so a slow provider call ends in the clean JSON 'timeout'
# error, never a SIGKILLed worker and a router-level 502.
# ---------------------------------------------------------------------------
class GeminiTimeoutBoundsTests(unittest.TestCase):

    def setUp(self):
        self._saved = {}
        for k in ("AI_PROVIDER", "GEMINI_API_KEY", "GEMINI_MODEL",
                   "OPENAI_API_KEY", "GEMINI_TIMEOUT"):
            self._saved[k] = os.environ.get(k)
        os.environ["AI_PROVIDER"] = "gemini"
        os.environ["GEMINI_API_KEY"] = GEMINI_FAKE_KEY
        os.environ["GEMINI_MODEL"] = "gemini-2.5-flash"
        os.environ.pop("OPENAI_API_KEY", None)
        os.environ.pop("GEMINI_TIMEOUT", None)

        self.timeouts = []
        def fake(payload, model, key, timeout):
            self.timeouts.append(timeout)
            return _gemini_ok({})
        ai_client.set_gemini_request_for_testing(fake)
        self.app = server.create_app().test_client()

    def tearDown(self):
        ai_client.set_gemini_request_for_testing(_gemini_unmocked_guard)
        for k, v in self._saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    # 1. The default cap is below gunicorn's default 30s worker timeout.
    def test_default_cap_preempts_default_worker_timeout(self):
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        self.assertEqual(self.timeouts, [ai_client.gemini_timeout_seconds()])
        cap = ai_client.gemini_timeout_seconds()
        self.assertLess(cap, 30, "provider cap must beat gunicorn's 30s default")
        self.assertGreater(cap, 10, "cap still leaves room for a real response")

    # 2. GEMINI_TIMEOUT overrides the cap per deployment (clamped to >=5s).
    def test_env_override_is_respected(self):
        os.environ["GEMINI_TIMEOUT"] = "45"
        self.assertEqual(ai_client.gemini_timeout_seconds(), 45)
        os.environ["GEMINI_TIMEOUT"] = "2"  # too short is clamped, never 0/negative
        self.assertEqual(ai_client.gemini_timeout_seconds(), 5)
        os.environ["GEMINI_TIMEOUT"] = "garbage"
        self.assertEqual(ai_client.gemini_timeout_seconds(),
                         ai_client.GEMINI_TIMEOUT_DEFAULT)

    # 3. A socket timeout at the cap is a clean 502 JSON 'timeout' error,
    #    and the message names the cap that actually fired.
    def test_provider_timeout_is_a_clean_json_error(self):
        self.timeouts.clear()
        os.environ["GEMINI_TIMEOUT"] = "25"
        def slow(payload, model, key, timeout):
            self.timeouts.append(timeout)
            raise TimeoutError("read timed out")
        ai_client.set_gemini_request_for_testing(slow)
        r = self.app.post("/api/analyze-resume", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 502)
        body = r.get_json()
        self.assertEqual(body["code"], "timeout")
        # The escape-mapping site cannot know the cap, so assert the shared
        # "timed out" wording, not a number.
        self.assertIn("timed out", body["error"])
        self.assertNotIn(GEMINI_FAKE_KEY, r.get_data(as_text=True))


# ---------------------------------------------------------------------------
# /api/match-insight (explain_match) — mocked provider tests, same safety
# guarantees: no live calls, no charges, keys never in responses.
# ---------------------------------------------------------------------------
MATCH_FAKE_INSIGHT = {
    "summary": "Solid skills overlap; experience falls just short of the stated range.",
    "evidence": [
        {"claim": "SQL reporting experience", "resume_quote": "Built SQL reports weekly",
         "jd_requirement": "SQL reporting", "status": "supported"},
        {"claim": "Stated 5 years of management", "resume_quote": "",
         "jd_requirement": "5+ years team leadership", "status": "missing"},
    ],
    "gaps": ["Team leadership duration not evidenced in the resume"],
    "next_steps": ["Add a line quantifying team size and tenure under the leadership role"],
}


class MatchInsightTests(unittest.TestCase):

    def setUp(self):
        self._saved = {}
        for k in ("AI_PROVIDER", "GEMINI_API_KEY", "GEMINI_MODEL", "OPENAI_API_KEY"):
            self._saved[k] = os.environ.get(k)
        os.environ["AI_PROVIDER"] = "gemini"
        os.environ["GEMINI_API_KEY"] = GEMINI_FAKE_KEY
        os.environ["GEMINI_MODEL"] = "gemini-2.5-flash"
        os.environ.pop("OPENAI_API_KEY", None)

        self.requests = []
        self.behavior = None

        def fake(payload, model, key, timeout):
            self.requests.append((payload, model, key))
            if self.behavior:
                res = self.behavior(payload, model, key, timeout)
                if isinstance(res, Exception):
                    raise res
                return res
            return _gemini_ok(MATCH_FAKE_INSIGHT)

        ai_client.set_gemini_request_for_testing(fake)
        self.app = server.create_app().test_client()

    def tearDown(self):
        ai_client.set_gemini_request_for_testing(_gemini_unmocked_guard)
        for k, v in self._saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    def _post(self, payload):
        return self.app.post("/api/match-insight", json=payload)

    # 1. Success: structured, validated insight + provenance fields.
    def test_success_returns_structured_insight(self):
        r = self._post({"resumeText": "Jane\n- Built SQL reports weekly",
                        "jobDescription": "SQL reporting required",
                        "scoreBreakdown": {"skills": 80, "experience": 40,
                                           "education": 100, "overall": 72,
                                           "verdict": "Good match"},
                        "requestId": "mi1"})
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        body = r.get_json()
        self.assertTrue(body["ok"])
        self.assertEqual(body["provider"], "gemini")
        self.assertEqual(body["requestId"], "mi1")
        ins = body["insight"]
        self.assertEqual(ins["summary"], MATCH_FAKE_INSIGHT["summary"])
        self.assertEqual(len(ins["evidence"]), 2)
        self.assertEqual(ins["evidence"][0]["status"], "supported")
        self.assertEqual(ins["evidence"][1]["status"], "missing")
        # Evidence rows keep their four exact keys, coerced to strings.
        self.assertEqual(set(ins["evidence"][0].keys()),
                         {"claim", "resume_quote", "jd_requirement", "status"})

    # 2. The local score breakdown is carried to the model as CONTEXT only,
    #    and the current resume text is what gets sent.
    def test_sends_local_breakdown_as_context_and_current_resume(self):
        marker = "UNIQUE_RESUME_MARKER_GAMMA"
        r = self._post({"resumeText": marker + "\n- built things",
                        "jobDescription": "JD", "scoreBreakdown": {"skills": 42}})
        self.assertEqual(r.status_code, 200)
        user_text = self.requests[0][0]["contents"][0]["parts"][0]["text"]
        self.assertIn(marker, user_text)
        self.assertIn("SCORE BREAKDOWN", user_text)
        self.assertIn("skills", user_text)
        self.assertIn("context only", user_text.lower())

    # 3. Inputs: resume is mandatory; junk breakdowns never crash the route.
    def test_missing_resume_rejected(self):
        r = self._post({"jobDescription": "JD"})
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.get_json()["code"], "no_input")

    def test_non_dict_breakdown_ignored(self):
        r = self._post({"resumeText": "Jane\n- x", "scoreBreakdown": "not-a-dict"})
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        user_text = self.requests[0][0]["contents"][0]["parts"][0]["text"]
        self.assertNotIn("SCORE BREAKDOWN", user_text)

    def test_breakdown_values_clamped_and_bounded(self):
        r = self._post({"resumeText": "Jane\n- x",
                        "scoreBreakdown": {"skills": 250, "experience": -5,
                                           "overall": "junk", "verdict": "x" * 500}})
        self.assertEqual(r.status_code, 200)
        user_text = self.requests[0][0]["contents"][0]["parts"][0]["text"]
        self.assertNotIn("250", user_text)          # out-of-range scores dropped
        self.assertNotIn("-5", user_text)
        self.assertNotIn("x" * 41, user_text)       # verdict truncated to 40 chars
        self.assertIn("x" * 40, user_text)          # ...but not dropped entirely

    def test_non_finite_breakdown_values_are_safe(self):
        # Regression: "Infinity" / "1e999" parse to ±inf and made
        # int(round(±inf)) raise OverflowError, which the route's except
        # clause used to miss — a generic 500 instead of clean handling.
        r = self._post({"resumeText": "Jane\n- x",
                        "scoreBreakdown": {"skills": "Infinity", "experience": "1e999",
                                            "education": "NaN", "overall": 50}})
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        self.assertTrue(r.get_json()["ok"])
        user_text = self.requests[0][0]["contents"][0]["parts"][0]["text"]
        self.assertNotIn("Infinity", user_text)
        self.assertNotIn("1e999", user_text)
        self.assertNotIn("NaN", user_text)
        self.assertIn("SCORE BREAKDOWN", user_text)  # the in-bounds 50 survived
        self.assertIn("50", user_text)
        # All four non-finite -> no breakdown context at all, still a 200.
        r2 = self._post({"resumeText": "Jane\n- x",
                         "scoreBreakdown": {"skills": "inf", "experience": "-Infinity",
                                            "education": "1e999", "overall": "inf"}})
        self.assertEqual(r2.status_code, 200, r2.get_data(as_text=True))
        self.assertNotIn("SCORE BREAKDOWN",
                         self.requests[1][0]["contents"][0]["parts"][0]["text"])

    # 4. Provider failures map to the established controlled errors.
    def test_gemini_429_maps_to_rate_limit(self):
        self.behavior = lambda p, m, k, t: ai_client.GeminiHTTPError(
            429, {"error": {"status": "RESOURCE_EXHAUSTED"}})
        r = self._post({"resumeText": "Jane\n- x", "jobDescription": "JD"})
        self.assertEqual(r.status_code, 502)
        self.assertEqual(r.get_json()["code"], "rate_limit")

    def test_timeout_maps_to_clean_error(self):
        self.behavior = lambda p, m, k, t: TimeoutError("read timed out")
        r = self._post({"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 502)
        self.assertEqual(r.get_json()["code"], "timeout")

    def test_malformed_model_output_rejected(self):
        self.behavior = lambda p, m, k, t: _gemini_ok_raw("this is not json {{{")
        r = self._post({"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.get_json()["code"], "invalid_response")

    def test_missing_gemini_key_reports_config_error(self):
        os.environ["GEMINI_API_KEY"] = ""
        r = self._post({"resumeText": "Jane\n- x"})
        self.assertEqual(r.status_code, 503)
        self.assertEqual(r.get_json()["code"], "no_key")

    def test_key_never_leaks_to_client(self):
        r = self._post({"resumeText": "Jane\n- x"})
        self.assertNotIn(GEMINI_FAKE_KEY, r.get_data(as_text=True))

    # 5. OpenAI path (mocked client): success + a provider error mapping.
    def test_openai_success_and_provider_error(self):
        os.environ["AI_PROVIDER"] = "openai"
        os.environ["OPENAI_API_KEY"] = FAKE_KEY
        os.environ["OPENAI_MODEL"] = FAKE_MODEL
        os.environ.pop("GEMINI_API_KEY", None)
        self.fake = FakeClient()
        self.fake.responses = self.fake._Responses(self.fake)
        install_fake(self.fake)
        app = server.create_app().test_client()
        r = app.post("/api/match-insight",
                     json={"resumeText": "Jane\n- x", "jobDescription": "JD"})
        self.assertEqual(r.status_code, 200, r.get_data(as_text=True))
        body = r.get_json()
        self.assertIn("insight", body)
        self.assertEqual(body["model"], FAKE_MODEL)
        # And a simulated provider error maps to a clean 502, never a 500.
        self.fake._behavior = lambda kwargs: _sim_api_error("boom", "APIError")
        r2 = app.post("/api/match-insight", json={"resumeText": "Jane\n- x"})
        self.assertEqual(r2.status_code, 502)
        self.assertFalse(r2.get_json()["ok"])


# ---------------------------------------------------------------------------
# /api/match-insight joins the per-client rate limit on the expensive routes.
# ---------------------------------------------------------------------------
class MatchInsightRateLimitTests(unittest.TestCase):

    def setUp(self):
        self._saved = {}
        for k in ("AI_PROVIDER", "OPENAI_API_KEY", "OPENAI_MODEL",
                  "GEMINI_API_KEY", "AI_RATE_LIMIT", "RATELIMIT_STORAGE_URI",
                  "TRUSTED_PROXIES"):
            self._saved[k] = os.environ.get(k)
        reset_env()
        os.environ["AI_PROVIDER"] = "openai"
        os.environ["GEMINI_API_KEY"] = "gem-disabled-in-mi-tests"
        os.environ["AI_RATE_LIMIT"] = "2/minute"
        self.fake = FakeClient()
        self.fake.responses = self.fake._Responses(self.fake)
        install_fake(self.fake)
        self.flask_app = server.create_app()
        self.app = self.flask_app.test_client()

    def tearDown(self):
        ai_client.set_client_for_testing(_OpenAIUnmockedGuard())
        for k, v in self._saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    def test_match_insight_rate_limited(self):
        self.assertEqual(self.app.post("/api/match-insight",
                                       json={"resumeText": "a\n- x"}).status_code, 200)
        self.assertEqual(self.app.post("/api/match-insight",
                                       json={"resumeText": "b\n- y"}).status_code, 200)
        r = self.app.post("/api/match-insight", json={"resumeText": "c\n- z"})
        self.assertEqual(r.status_code, 429)
        self.assertFalse(r.get_json()["ok"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
