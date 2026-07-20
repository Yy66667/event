from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, AsyncIterator

from fastapi import HTTPException
from google import genai

from app.core.config import settings
from app.core.database import db

logger = logging.getLogger("sambaram.ai")


def build_prompt(topic: str, context: dict[str, Any]) -> tuple[str, str]:
    system = ("You are the SAMBARAM Events AI Concierge — a warm, elegant, thoughtful advisor for a premium South-Indian event planning studio. Give crisp, specific, actionable answers grounded in Indian cultural context (Warangal, Hyderabad, Bengaluru). Never hallucinate specific vendor names. Format your response as a short intro (1 sentence) followed by a bulleted list. Use ₹ for currency. Keep the whole response under 180 words.")
    keys = [("event_type", "Event"), ("event_date", "Date"), ("city", "City"), ("venue_type", "Venue"), ("indoor_outdoor", "Setting"), ("guest_count", "Guests"), ("budget", "Budget"), ("theme", "Theme"), ("decoration_style", "Decor")]
    context_text = "\n".join(f"{label}: {context[key]}" for key, label in keys if context.get(key)) or "No details provided yet."
    prompts = {
        "theme": f"Suggest 4 distinct theme ideas for this event.\n\n{context_text}",
        "budget": f"Give a realistic budget breakdown across the major categories (venue, decor, catering, photography, entertainment, misc).\n\n{context_text}",
        "timeline": f"Suggest a planning timeline from today to event day. Use weeks/months from event.\n\n{context_text}",
        "decor": f"Suggest 5 signature decoration ideas that fit the theme and venue.\n\n{context_text}",
        "services": f"Recommend which optional services this event should invest in (photography, videography, entertainment, makeup, transport, etc.) and why.\n\n{context_text}",
        "summary": f"Write a short (max 5 lines) elegant event summary paragraph that our team would present back to the client.\n\n{context_text}",
    }
    return system, prompts.get(topic, f"Give thoughtful guidance for this event.\n\n{context_text}")


def ensure_ai_is_configured() -> None:
    if not settings.gemini_api_key:
        raise HTTPException(500, "Gemini API is not configured")


async def stream_suggestion(topic: str, context: dict[str, Any], session_id: str | None) -> AsyncIterator[str]:
    system, user_text = build_prompt(topic, context)
    full: list[str] = []
    try:
        client = genai.Client(api_key=settings.gemini_api_key)
        for chunk in client.models.generate_content_stream(model="gemini-3.5-flash", contents=f"{system}\n\n{user_text}"):
            if chunk.text:
                full.append(chunk.text)
                yield f"data: {json.dumps({'delta': chunk.text})}\n\n"
    except Exception as exc:  # noqa: BLE001
        logger.exception("Gemini stream failed")
        yield f"data: {json.dumps({'error': str(exc)})}\n\n"
    await db["ai_logs"].insert_one({"id": str(uuid.uuid4()), "session_id": session_id or str(uuid.uuid4()), "topic": topic, "context": context, "response": "".join(full), "created_at": datetime.now(timezone.utc).isoformat()})
    yield f"data: {json.dumps({'done': True})}\n\n"
