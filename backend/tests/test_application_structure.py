"""Route-contract checks that run without connecting to MongoDB."""

from server import app


def test_expected_api_routes_are_registered():
    paths = app.openapi()["paths"]
    expected = {
        "/api/health",
        "/api/portfolio",
        "/api/portfolio/{slug}",
        "/api/testimonials",
        "/api/faqs",
        "/api/stats",
        "/api/ai/suggest",
        "/api/leads",
        "/api/leads/{lead_id}",
        "/api/vendors",
        "/api/vendor-applications",
        "/api/vendor/login",
        "/api/vendor/leads",
        "/api/vendor/leads/{lead_id}",
    }
    assert expected <= set(paths)
