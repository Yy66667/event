"""Deterministic vendor-to-lead matching for the marketplace."""

from __future__ import annotations

import re
from datetime import date, datetime
from typing import Any


def _normalise(value: str) -> str:
    return value.strip().lower()


def _in_list(value: str | None, values: list[str] | None) -> bool:
    if not value or not values:
        return False
    expected = _normalise(value)
    return any(_normalise(item) in {expected, "all india", "pan india", "nationwide"} for item in values)


def _budget_to_lakhs(value: Any) -> float | None:
    if value is None:
        return None
    match = re.search(r"([\d,.]+)", str(value))
    if not match:
        return None
    amount = float(match.group(1).replace(",", ""))
    text = str(value).lower()
    if "crore" in text or " cr" in text:
        return amount * 100
    if "₹" in text and amount >= 100_000:
        return amount / 100_000
    if "lakh" in text or "lac" in text or "l" in text:
        return amount
    return amount / 100_000


def _lead_time_days(event_date: Any) -> int | None:
    if not event_date:
        return None
    text = str(event_date)
    for parser in (date.fromisoformat, lambda value: datetime.strptime(value, "%d/%m/%Y").date()):
        try:
            return (parser(text) - date.today()).days
        except ValueError:
            continue
    return None


def calculate_compatibility(vendor: dict[str, Any], lead: dict[str, Any]) -> dict[str, Any]:
    """Return an explainable 0–100 score for an approved vendor and a lead."""
    event = {**lead.get("planner_answers", {}), **lead.get("event_summary", {})}
    reasons: list[str] = []
    score = 0
    event_type = event.get("event_type")
    city = event.get("city")
    requested_services = event.get("services", event.get("requested_services", []))
    if isinstance(requested_services, str):
        requested_services = [requested_services]

    if _in_list(event_type, vendor.get("event_types")):
        score += 25; reasons.append("Experienced in this event type")
    if _in_list(city, vendor.get("service_cities")):
        score += 20; reasons.append("Covers the event city")
    guest_count = event.get("guest_count")
    try:
        if guest_count is not None and int(guest_count) <= int(vendor.get("max_guest_count", 0)):
            score += 15; reasons.append("Capacity fits the guest count")
    except (TypeError, ValueError):
        pass
    lead_budget = _budget_to_lakhs(event.get("budget"))
    vendor_minimum = _budget_to_lakhs(vendor.get("min_event_budget"))
    if lead_budget is not None and vendor_minimum is not None and lead_budget >= vendor_minimum:
        score += 15; reasons.append("Budget fits the studio's minimum")
    lead_time = _lead_time_days(event.get("event_date"))
    if lead_time is not None and lead_time >= int(vendor.get("minimum_notice_days", 0)):
        score += 15; reasons.append("Lead time matches availability")
    if requested_services and vendor.get("services"):
        vendor_services = {_normalise(service) for service in vendor["services"]}
        if any(_normalise(service) in vendor_services for service in requested_services):
            score += 10; reasons.append("Requested services align")
    return {"score": score, "reasons": reasons, "max_score": 100}
