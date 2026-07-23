from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


class Settings:
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    business_email = os.getenv("BUSINESS_EMAIL", "hello@sambaram.events")
    business_whatsapp = os.getenv("BUSINESS_WHATSAPP", "+919876543210")
    telegram_bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID")
    twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
    twilio_whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM", "")
    resend_api_key = os.getenv("RESEND_API_KEY", "")
    jwt_secret_key = os.getenv("JWT_SECRET_KEY")
    jwt_algorithm = "HS256"
    jwt_expire_minutes = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))
    cors_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]


settings = Settings()
