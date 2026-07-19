"""SAMBARAM Events - FastAPI backend.

Endpoints:
  GET  /api/health                -> health check
  GET  /api/portfolio             -> list portfolio projects
  GET  /api/portfolio/{slug}      -> single project
  GET  /api/testimonials          -> list testimonials
  GET  /api/faqs                  -> list FAQs
  GET  /api/stats                 -> aggregate site stats
  POST /api/ai/suggest            -> AI planner suggestions (streaming SSE)
  POST /api/leads                 -> submit lead + planner answers
  GET  /api/leads                 -> list leads (admin, minimal)
"""

from __future__ import annotations

import json
import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from google import genai

# Load env
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("sambaram")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
BUSINESS_EMAIL = os.environ.get("BUSINESS_EMAIL", "hello@sambaram.events")
BUSINESS_WHATSAPP = os.environ.get("BUSINESS_WHATSAPP", "+919876543210")

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_FROM = os.environ.get("TWILIO_WHATSAPP_FROM", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")

# ---------- Mongo ----------
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]

# ---------- App ----------
app = FastAPI(title="SAMBARAM Events API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Models ----------

class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    whatsapp: Optional[str] = None
    email: EmailStr
    planner_answers: dict[str, Any] = Field(default_factory=dict)
    ai_recommendations: list[str] = Field(default_factory=list)
    event_summary: dict[str, Any] = Field(default_factory=dict)
    status: str = "new"
    notifications: dict[str, Any] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    name: str
    phone: str
    whatsapp: Optional[str] = None
    email: EmailStr
    planner_answers: dict[str, Any] = Field(default_factory=dict)
    ai_recommendations: list[str] = Field(default_factory=list)
    event_summary: dict[str, Any] = Field(default_factory=dict)


class AISuggestRequest(BaseModel):
    topic: str  # theme | budget | timeline | decor | services | summary
    context: dict[str, Any] = Field(default_factory=dict)
    session_id: Optional[str] = None


# ---------- Seed data (portfolio, testimonials, faqs) ----------

PORTFOLIO_SEED: list[dict[str, Any]] = [
    {
        "slug": "royal-warangal-wedding",
        "title": "A Royal Warangal Wedding",
        "category": "Weddings",
        "venue": "Fort Warangal Palace Grounds",
        "city": "Warangal",
        "theme": "Royal Kakatiya Traditional",
        "guests": 500,
        "duration": "3 days",
        "story": "A three-day celebration honouring Kakatiya heritage — draped mandaps, jasmine-heavy pathways, and a live nadaswaram procession. Every detail curated for a bride who wanted her grandmother's era, retold in gold.",
        "highlights": [
            "Traditional Muhurtham with 40+ family rituals",
            "Sangeet with live orchestra & choreographed sets",
            "Custom brass-and-marigold mandap installation",
            "Signature 12-course South Indian tasting menu",
        ],
        "images": [],  # left empty for user upload
        "accent": "#C04A24",
        "featured": True,
    },
    {
        "slug": "hyderabad-milestone-birthday",
        "title": "A Midnight Garden 50th",
        "category": "Birthdays",
        "venue": "Jubilee Hills Residence, Hyderabad",
        "city": "Hyderabad",
        "theme": "Midnight Botanical",
        "guests": 120,
        "duration": "1 evening",
        "story": "An intimate 50th where guests entered through a candle-lit banyan arch into a garden dressed in indigo velvet, hanging orchids, and a moon-shaped dessert table crafted by a Michelin pastry chef.",
        "highlights": [
            "Curated live jazz trio",
            "Personalised menu with the guest of honour's childhood dishes",
            "Custom fragrance diffused throughout the venue",
        ],
        "images": [],
        "accent": "#3B3228",
        "featured": True,
    },
    {
        "slug": "beachside-engagement-goa",
        "title": "Sunset Sangeet by the Sea",
        "category": "Engagements",
        "venue": "Private beach cove, Goa",
        "city": "Goa",
        "theme": "Sunset Terracotta",
        "guests": 80,
        "duration": "1 evening",
        "story": "An engagement designed around one perfect frame: the couple, backlit by a Goan sunset, framed by rattan arches and thousands of clay diyas lining the sand.",
        "highlights": [
            "Choreographed sangeet on the sand",
            "Beach-to-plate seafood tasting",
            "Cinematic drone videography",
        ],
        "images": [],
        "accent": "#E67E22",
        "featured": True,
    },
    {
        "slug": "bengaluru-tech-summit",
        "title": "Bengaluru Founders Summit",
        "category": "Corporate Events",
        "venue": "Taj West End, Bengaluru",
        "city": "Bengaluru",
        "theme": "Modern Minimalist",
        "guests": 300,
        "duration": "2 days",
        "story": "A two-day founders' summit produced for a Series-B fintech — from stage design and lighting to a curated speaker lineup, breakout lounges, and an after-party in the palm court.",
        "highlights": [
            "Full AV, LED wall & broadcast production",
            "Speaker green-room with private catering",
            "Networking lounges with brand activations",
        ],
        "images": [],
        "accent": "#0F1F2E",
    },
    {
        "slug": "housewarming-hyderabad",
        "title": "A Modern Griha Pravesham",
        "category": "Housewarming",
        "venue": "Kokapet Villa, Hyderabad",
        "city": "Hyderabad",
        "theme": "Contemporary South Indian",
        "guests": 90,
        "duration": "1 afternoon",
        "story": "A modern griha pravesham blending Vastu traditions with contemporary design — kolams hand-drawn by artisans, a live vaadhyam ensemble, and a tea-and-tiffin brunch honouring family recipes.",
        "highlights": [
            "Priest-led ceremony coordination",
            "Signature filter-coffee bar",
            "Hand-painted kolam pathway",
        ],
        "images": [],
        "accent": "#D4A44E",
    },
    {
        "slug": "baby-shower-cloud-nine",
        "title": "Cloud Nine — A Seemantham",
        "category": "Baby Shower",
        "venue": "Private farmhouse, Hyderabad",
        "city": "Hyderabad",
        "theme": "Pastel Cloud Dream",
        "guests": 60,
        "duration": "1 afternoon",
        "story": "A dreamy seemantham with a hand-crafted cloud installation, pastel florals, and traditional bangle ceremony reimagined with modern styling.",
        "highlights": [
            "Custom cloud-and-balloon installation",
            "Live tabla & flute duet",
            "Bespoke bangle bar for guests",
        ],
        "images": [],
        "accent": "#F4B6C2",
    },
    {
        "slug": "farmhouse-anniversary",
        "title": "Farmhouse Anniversary Soirée",
        "category": "Private Parties",
        "venue": "Shamirpet Farmhouse",
        "city": "Hyderabad",
        "theme": "Rustic Italian",
        "guests": 45,
        "duration": "1 evening",
        "story": "A 25th anniversary reimagined as a Tuscan long-table dinner — vine-wrapped pergolas, hand-thrown ceramics, and a five-course meal by a visiting chef.",
        "highlights": [
            "Wine pairing with sommelier",
            "Live acoustic guitarist",
            "Personalised keepsake for each guest",
        ],
        "images": [],
        "accent": "#7A5C3E",
    },
]

TESTIMONIALS_SEED = [
    {
        "name": "Ananya & Rohit",
        "event": "Wedding · Warangal",
        "rating": 5,
        "quote": "SAMBARAM didn't just plan our wedding — they translated our family's memories into a three-day story. Every ritual felt personal, every frame felt cinematic.",
    },
    {
        "name": "Priya M.",
        "event": "50th Birthday · Hyderabad",
        "rating": 5,
        "quote": "I asked for 'a garden that feels like a novel'. What they built brought my mother to tears. Zero decisions on the day. Pure presence.",
    },
    {
        "name": "Karthik R., Founder",
        "event": "Founders Summit · Bengaluru",
        "rating": 5,
        "quote": "We evaluated four agencies. SAMBARAM was the only team that treated our brand like their own. Flawless production, on budget.",
    },
    {
        "name": "The Reddy Family",
        "event": "Housewarming · Hyderabad",
        "rating": 5,
        "quote": "A gruhapravesam that honoured tradition and felt fresh. My grandmother said it was the most beautiful one she had ever attended.",
    },
    {
        "name": "Sana & Ayaan",
        "event": "Engagement · Goa",
        "rating": 5,
        "quote": "They took our Pinterest board, threw half of it out, and gave us something ten times better. The sunset moment is now our home screen.",
    },
]

FAQS_SEED = [
    {
        "q": "Do I book vendors directly through you?",
        "a": "No. You share your vision with us and we recommend and coordinate the right vendors from our vetted network — décor, catering, photography, music, makeup, and more. You get one point of contact: us.",
    },
    {
        "q": "How does the AI-powered planner work?",
        "a": "Our planner asks a few smart questions about your event and uses AI to suggest realistic themes, budgets, timelines, and services. You edit anything you like, and we build the final proposal around your preferences.",
    },
    {
        "q": "What cities do you serve?",
        "a": "Primarily Warangal, Hyderabad, Bengaluru and destination events across India. We've produced weddings and celebrations from Goa to the Himalayas.",
    },
    {
        "q": "What is your typical budget range?",
        "a": "We produce intimate celebrations from ₹3 lakhs and full-scale weddings up to ₹1 crore+. Our team will build a realistic budget with you during consultation.",
    },
    {
        "q": "How soon should I book?",
        "a": "For weddings we recommend 4–9 months of lead time. For milestone birthdays and corporate events, 6–10 weeks. Rush events are possible with a dedicated team.",
    },
    {
        "q": "What happens after I submit my plan?",
        "a": "Our event specialist reviews your requirements within 12 hours and calls you to walk through options and recommended vendors — no obligation.",
    },
]

STATS_SEED = {
    "events_delivered": 320,
    "years_experience": 11,
    "happy_couples": 180,
    "cities_served": 14,
    "vendor_network": 220,
    "awards": 7,
}


# ---------- Startup ----------

@app.on_event("startup")
async def startup() -> None:
    # Idempotent seed
    portfolio = db["portfolio"]
    for project in PORTFOLIO_SEED:
        await portfolio.update_one({"slug": project["slug"]}, {"$set": project}, upsert=True)
    logger.info("Seeded %d portfolio projects", len(PORTFOLIO_SEED))

    testimonials = db["testimonials"]
    if await testimonials.count_documents({}) == 0:
        await testimonials.insert_many([{**t, "id": str(uuid.uuid4())} for t in TESTIMONIALS_SEED])

    faqs = db["faqs"]
    if await faqs.count_documents({}) == 0:
        await faqs.insert_many([{**f, "id": str(uuid.uuid4())} for f in FAQS_SEED])

    stats = db["stats"]
    await stats.update_one({"_key": "site"}, {"$set": {**STATS_SEED, "_key": "site"}}, upsert=True)


# ---------- Helpers ----------

def _strip_mongo(doc: dict[str, Any]) -> dict[str, Any]:
    doc.pop("_id", None)
    return doc

async def _send_telegram(message: str) -> bool:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram credentials missing")
        return False

    import httpx

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(
            url,
            json={
                "chat_id": TELEGRAM_CHAT_ID,
                "text": message,
            },
        )

    print("Telegram status:", r.status_code)
    print("Telegram response:", r.text)

    return r.status_code == 200
async def _notify_team(lead: dict[str, Any]) -> dict[str, Any]:
    """Send WhatsApp + email notifications. Falls back to DB queue when creds absent."""
    result: dict[str, Any] = {"whatsapp": "queued", "email": "queued"}

    # Compose message
    summary = lead.get("event_summary", {})
    planner = lead.get("planner_answers", {})
    message_lines = [
        "New SAMBARAM lead",
        f"Name: {lead.get('name')}",
        f"Phone: {lead.get('phone')}",
        f"Email: {lead.get('email')}",
        f"WhatsApp: {lead.get('whatsapp') or lead.get('phone')}",
        "",
        f"Event: {summary.get('event_type') or planner.get('event_type', 'N/A')}",
        f"Date: {summary.get('event_date') or planner.get('event_date', 'N/A')}",
        f"City: {summary.get('city') or planner.get('city', 'N/A')}",
        f"Guests: {summary.get('guest_count') or planner.get('guest_count', 'N/A')}",
        f"Budget: {summary.get('budget') or planner.get('budget', 'N/A')}",
        f"Theme: {summary.get('theme') or planner.get('theme', 'N/A')}",
    ]
    message = "\n".join(message_lines)
    telegram_ok = await _send_telegram(message)
    result["telegram"] = "sent" if telegram_ok else "failed"

    # WhatsApp
    if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_WHATSAPP_FROM:
        try:
            from twilio.rest import Client
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            client.messages.create(
                from_=TWILIO_WHATSAPP_FROM,
                to=f"whatsapp:{BUSINESS_WHATSAPP}",
                body=message,
            )
            result["whatsapp"] = "sent"
        except Exception as exc:  # noqa: BLE001
            logger.exception("WhatsApp send failed")
            result["whatsapp"] = f"failed: {exc}"

    # Email via Resend
    if RESEND_API_KEY:
        try:
            import httpx
            async with httpx.AsyncClient(timeout=10.0) as http:
                r = await http.post(
                    "https://api.resend.com/emails",
                    headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
                    json={
                        "from": "SAMBARAM Leads <leads@sambaram.events>",
                        "to": [BUSINESS_EMAIL],
                        "subject": f"New Lead — {lead.get('name')} — {summary.get('event_type', 'Event')}",
                        "text": message,
                    },
                )
                result["email"] = "sent" if r.status_code < 400 else f"failed: {r.status_code}"
        except Exception as exc:  # noqa: BLE001
            logger.exception("Email send failed")
            result["email"] = f"failed: {exc}"

    return result


# ---------- Routes ----------

@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "sambaram-api"}


@app.get("/api/portfolio")
async def list_portfolio(category: Optional[str] = None) -> list[dict[str, Any]]:
    query: dict[str, Any] = {}
    if category and category.lower() != "all":
        query["category"] = category
    cursor = db["portfolio"].find(query)
    return [_strip_mongo(d) async for d in cursor]


@app.get("/api/portfolio/{slug}")
async def get_portfolio(slug: str) -> dict[str, Any]:
    doc = await db["portfolio"].find_one({"slug": slug})
    if not doc:
        raise HTTPException(404, "Project not found")
    return _strip_mongo(doc)


@app.get("/api/testimonials")
async def list_testimonials() -> list[dict[str, Any]]:
    return [_strip_mongo(d) async for d in db["testimonials"].find()]


@app.get("/api/faqs")
async def list_faqs() -> list[dict[str, Any]]:
    return [_strip_mongo(d) async for d in db["faqs"].find()]


@app.get("/api/stats")
async def get_stats() -> dict[str, Any]:
    doc = await db["stats"].find_one({"_key": "site"})
    return _strip_mongo(doc or STATS_SEED)


# ---------- AI Assistant ----------

def _build_ai_prompt(topic: str, context: dict[str, Any]) -> tuple[str, str]:
    """Return (system_message, user_message) for the given topic."""
    system = (
        "You are the SAMBARAM Events AI Concierge — a warm, elegant, thoughtful "
        "advisor for a premium South-Indian event planning studio. Give crisp, "
        "specific, actionable answers grounded in Indian cultural context "
        "(Warangal, Hyderabad, Bengaluru). Never hallucinate specific vendor names. "
        "Format your response as a short intro (1 sentence) followed by a bulleted "
        "list. Use ₹ for currency. Keep the whole response under 180 words."
    )

    def _ctx() -> str:
        # Human-friendly context serialisation
        keys = [
            ("event_type", "Event"), ("event_date", "Date"), ("city", "City"),
            ("venue_type", "Venue"), ("indoor_outdoor", "Setting"),
            ("guest_count", "Guests"), ("budget", "Budget"),
            ("theme", "Theme"), ("decoration_style", "Decor"),
        ]
        parts = [f"{label}: {context[key]}" for key, label in keys if context.get(key)]
        return "\n".join(parts) or "No details provided yet."

    prompts = {
        "theme": f"Suggest 4 distinct theme ideas for this event.\n\n{_ctx()}",
        "budget": f"Give a realistic budget breakdown across the major categories (venue, decor, catering, photography, entertainment, misc).\n\n{_ctx()}",
        "timeline": f"Suggest a planning timeline from today to event day. Use weeks/months from event.\n\n{_ctx()}",
        "decor": f"Suggest 5 signature decoration ideas that fit the theme and venue.\n\n{_ctx()}",
        "services": f"Recommend which optional services this event should invest in (photography, videography, entertainment, makeup, transport, etc.) and why.\n\n{_ctx()}",
        "summary": (
            "Write a short (max 5 lines) elegant event summary paragraph that our "
            f"team would present back to the client.\n\n{_ctx()}"
        ),
    }

    user_msg = prompts.get(topic, f"Give thoughtful guidance for this event.\n\n{_ctx()}")
    return system, user_msg

@app.post("/api/ai/suggest")
async def ai_suggest(req: AISuggestRequest) -> StreamingResponse:
    if not GEMINI_API_KEY:
        raise HTTPException(500, "Gemini API is not configured")

    client = genai.Client(api_key=GEMINI_API_KEY)

    system_msg, user_text = _build_ai_prompt(req.topic, req.context)

    prompt = f"""
{system_msg}

{user_text}
"""

    session_id = req.session_id or str(uuid.uuid4())

    async def event_gen():
        full = []

        try:
            stream = client.models.generate_content_stream(
               model="gemini-3.5-flash",
                contents=prompt,
            )

            for chunk in stream:
                if chunk.text:
                    full.append(chunk.text)

                    yield (
                        f"data: {json.dumps({'delta': chunk.text})}\n\n"
                    )

        except Exception as exc:
            logger.exception("Gemini stream failed")

            yield (
                f"data: {json.dumps({'error': str(exc)})}\n\n"
            )

        await db["ai_logs"].insert_one({
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "topic": req.topic,
            "context": req.context,
            "response": "".join(full),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )

# ---------- Leads ----------

@app.post("/api/leads")
async def create_lead(payload: LeadCreate) -> dict[str, Any]:
    lead = Lead(**payload.model_dump()).model_dump()
    notify_result = await _notify_team(lead)
    lead["notifications"] = notify_result
    await db["leads"].insert_one(lead)
    return {"id": lead["id"], "status": "received", "notifications": notify_result}


@app.get("/api/leads")
async def list_leads(limit: int = 50) -> list[dict[str, Any]]:
    cursor = db["leads"].find().sort("created_at", -1).limit(limit)
    return [_strip_mongo(d) async for d in cursor]


@app.get("/api/leads/{lead_id}")
async def get_lead(lead_id: str) -> dict[str, Any]:
    doc = await db["leads"].find_one({"id": lead_id})
    if not doc:
        raise HTTPException(404, "Lead not found")
    return _strip_mongo(doc)
