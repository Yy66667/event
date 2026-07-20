import logging
import uuid

from app.core.database import db
from app.data.seeds import FAQS_SEED, PORTFOLIO_SEED, STATS_SEED, TESTIMONIALS_SEED

logger = logging.getLogger("sambaram.seed")


async def seed_database() -> None:
    for project in PORTFOLIO_SEED:
        await db["portfolio"].update_one({"slug": project["slug"]}, {"$set": project}, upsert=True)
    if await db["testimonials"].count_documents({}) == 0:
        await db["testimonials"].insert_many([{**item, "id": str(uuid.uuid4())} for item in TESTIMONIALS_SEED])
    if await db["faqs"].count_documents({}) == 0:
        await db["faqs"].insert_many([{**item, "id": str(uuid.uuid4())} for item in FAQS_SEED])
    await db["stats"].update_one({"_key": "site"}, {"$set": {**STATS_SEED, "_key": "site"}}, upsert=True)
    logger.info("Seeded %d portfolio projects", len(PORTFOLIO_SEED))
