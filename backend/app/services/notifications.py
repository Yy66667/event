from __future__ import annotations

import logging
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger("sambaram.notifications")


async def _send_telegram(message: str) -> bool:
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        logger.info("Telegram credentials are not configured; notification will remain queued")
        return False

    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(url, json={"chat_id": settings.telegram_chat_id, "text": message})
    return response.status_code == 200


async def notify_team(lead: dict[str, Any]) -> dict[str, Any]:
    """Send lead notifications, retaining the prior queued fallback behavior."""
    result: dict[str, Any] = {"whatsapp": "queued", "email": "queued"}
    summary = lead.get("event_summary", {})
    planner = lead.get("planner_answers", {})
    message = "\n".join([
        "New SAMBARAM lead", f"Name: {lead.get('name')}", f"Phone: {lead.get('phone')}",
        f"Email: {lead.get('email')}", f"WhatsApp: {lead.get('whatsapp') or lead.get('phone')}", "",
        f"Event: {summary.get('event_type') or planner.get('event_type', 'N/A')}",
        f"Date: {summary.get('event_date') or planner.get('event_date', 'N/A')}",
        f"City: {summary.get('city') or planner.get('city', 'N/A')}",
        f"Guests: {summary.get('guest_count') or planner.get('guest_count', 'N/A')}",
        f"Budget: {summary.get('budget') or planner.get('budget', 'N/A')}",
        f"Theme: {summary.get('theme') or planner.get('theme', 'N/A')}",
    ])
    result["telegram"] = "sent" if await _send_telegram(message) else "failed"

    if settings.twilio_account_sid and settings.twilio_auth_token and settings.twilio_whatsapp_from:
        try:
            from twilio.rest import Client
            Client(settings.twilio_account_sid, settings.twilio_auth_token).messages.create(
                from_=settings.twilio_whatsapp_from, to=f"whatsapp:{settings.business_whatsapp}", body=message,
            )
            result["whatsapp"] = "sent"
        except Exception as exc:  # noqa: BLE001
            logger.exception("WhatsApp send failed")
            result["whatsapp"] = f"failed: {exc}"

    if settings.resend_api_key:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(
                    "https://api.resend.com/emails",
                    headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                    json={"from": "SAMBARAM Leads <leads@sambaram.events>", "to": [settings.business_email], "subject": f"New Lead — {lead.get('name')} — {summary.get('event_type', 'Event')}", "text": message},
                )
            result["email"] = "sent" if response.status_code < 400 else f"failed: {response.status_code}"
        except Exception as exc:  # noqa: BLE001
            logger.exception("Email send failed")
            result["email"] = f"failed: {exc}"
    return result


async def notify_vendor_application(application: dict[str, Any]) -> bool:
    """Alert the team when a studio applies to the SAMBARAM partner network."""
    partner_type = {
        "event_partner": "Full-Service Event Partner",
        "photography_studio": "Photography & Cinematography Studio",
    }.get(application.get("partner_type"), application.get("partner_type", "N/A"))
    message = "\n".join([
        "New SAMBARAM partner application",
        "",
        f"Business: {application.get('business_name', 'N/A')}",
        f"Partner type: {partner_type}",
        f"Owner: {application.get('owner_name', 'N/A')}",
        f"City: {application.get('city', 'N/A')}",
        f"Email: {application.get('email', 'N/A')}",
        f"Phone: {application.get('phone', 'N/A')}",
        f"WhatsApp: {application.get('whatsapp', 'N/A')}",
        f"Instagram: {application.get('instagram', 'N/A')}",
        f"Portfolio: {application.get('portfolio_url', 'N/A')}",
        f"Events: {', '.join(application.get('event_types', [])) or 'N/A'}",
        f"Services: {', '.join(application.get('services', [])) or 'N/A'}",
        f"Service cities: {', '.join(application.get('service_cities', [])) or 'N/A'}",
        "",
        f"Experience: {application.get('years_in_business', 'N/A')} years · {application.get('events_per_year', 'N/A')} events/year · team of {application.get('team_size', 'N/A')}",
        "",
        f"About: {application.get('business_description', 'N/A')}",
        f"What makes them different: {application.get('differentiator', 'N/A')}",
    ])
    return await _send_telegram(message)
