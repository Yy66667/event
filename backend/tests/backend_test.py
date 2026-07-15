"""Backend tests for SAMBARAM Events API."""
import os
import json
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://5afe999f-17df-41b8-833d-59a58f54b9de.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# ---- Health ----
def test_health():
    r = requests.get(f"{API}/health", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d.get("status") == "ok"


# ---- Portfolio ----
def test_portfolio_list():
    r = requests.get(f"{API}/portfolio", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 7
    slugs = {p["slug"] for p in data}
    assert "royal-warangal-wedding" in slugs
    # ensure no _id
    for p in data:
        assert "_id" not in p
        assert "title" in p and "category" in p


def test_portfolio_filter_weddings():
    r = requests.get(f"{API}/portfolio", params={"category": "Weddings"}, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert all(p["category"] == "Weddings" for p in data)
    assert len(data) >= 1


def test_portfolio_detail():
    r = requests.get(f"{API}/portfolio/royal-warangal-wedding", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["slug"] == "royal-warangal-wedding"
    assert d["guests"] == 500


def test_portfolio_detail_404():
    r = requests.get(f"{API}/portfolio/does-not-exist", timeout=15)
    assert r.status_code == 404


# ---- Testimonials ----
def test_testimonials():
    r = requests.get(f"{API}/testimonials", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 5
    for t in data:
        assert "_id" not in t
        assert "name" in t and "quote" in t


# ---- FAQs ----
def test_faqs():
    r = requests.get(f"{API}/faqs", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 6
    for f in data:
        assert "_id" not in f
        assert "q" in f and "a" in f


# ---- Stats ----
def test_stats():
    r = requests.get(f"{API}/stats", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d.get("events_delivered") == 320
    assert "_id" not in d


# ---- Leads ----
def test_create_lead_and_get():
    payload = {
        "name": "TEST_User",
        "phone": "+919000000000",
        "whatsapp": "+919000000000",
        "email": "test_user@example.com",
        "planner_answers": {"event_type": "Wedding", "city": "Warangal"},
        "event_summary": {"event_type": "Wedding", "city": "Warangal", "guest_count": 200, "budget": "₹15L"},
    }
    r = requests.post(f"{API}/leads", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    assert "id" in d
    assert d["status"] == "received"
    # Twilio/Resend absent => queued
    assert d["notifications"]["whatsapp"] == "queued"
    assert d["notifications"]["email"] == "queued"

    lead_id = d["id"]
    # Verify persistence
    g = requests.get(f"{API}/leads/{lead_id}", timeout=15)
    assert g.status_code == 200
    lead = g.json()
    assert lead["name"] == "TEST_User"
    assert lead["planner_answers"]["event_type"] == "Wedding"
    assert "_id" not in lead


def test_lead_invalid_email():
    payload = {"name": "X", "phone": "123", "email": "not-an-email"}
    r = requests.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code in (400, 422)


def test_list_leads():
    r = requests.get(f"{API}/leads", timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ---- AI Suggest (streaming SSE) ----
def test_ai_suggest_stream():
    payload = {
        "topic": "theme",
        "context": {"event_type": "Wedding", "city": "Warangal", "guest_count": 300, "budget": "₹20L"},
    }
    got_delta = False
    got_done = False
    err = None
    with requests.post(f"{API}/ai/suggest", json=payload, stream=True, timeout=45) as r:
        assert r.status_code == 200
        assert "text/event-stream" in r.headers.get("content-type", "")
        start = time.time()
        for raw in r.iter_lines(decode_unicode=True):
            if not raw:
                continue
            if raw.startswith("data:"):
                try:
                    obj = json.loads(raw[5:].strip())
                except Exception:
                    continue
                if "delta" in obj:
                    got_delta = True
                if obj.get("done"):
                    got_done = True
                    break
                if "error" in obj:
                    err = obj["error"]
                    break
            if time.time() - start > 40:
                break
    assert err is None, f"AI stream error: {err}"
    assert got_delta, "No delta chunk received from AI stream"
