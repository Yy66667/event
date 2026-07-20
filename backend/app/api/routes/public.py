from typing import Any, Optional

from fastapi import APIRouter, HTTPException

from app.core.database import db
from app.data.seeds import FAQS_SEED, STATS_SEED
from app.utils import strip_mongo_id

router = APIRouter(tags=["public"])


@router.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "sambaram-api"}


@router.get("/api/portfolio")
async def list_portfolio(category: Optional[str] = None) -> list[dict[str, Any]]:
    query: dict[str, Any] = {} if not category or category.lower() == "all" else {"category": category}
    return [strip_mongo_id(document) async for document in db["portfolio"].find(query)]


@router.get("/api/portfolio/{slug}")
async def get_portfolio(slug: str) -> dict[str, Any]:
    document = await db["portfolio"].find_one({"slug": slug})
    if not document:
        raise HTTPException(404, "Project not found")
    return strip_mongo_id(document)


@router.get("/api/testimonials")
async def list_testimonials() -> list[dict[str, Any]]:
    return [strip_mongo_id(document) async for document in db["testimonials"].find()]


@router.get("/api/faqs")
async def list_faqs() -> list[dict[str, Any]]:
    return [strip_mongo_id(document) async for document in db["faqs"].find()]


@router.get("/api/stats")
async def get_stats() -> dict[str, Any]:
    return strip_mongo_id(await db["stats"].find_one({"_key": "site"}) or STATS_SEED.copy())
