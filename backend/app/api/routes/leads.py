from typing import Any

from fastapi import APIRouter, HTTPException

from app.core.database import db
from app.schemas.leads import AddNoteRequest, Lead, LeadCreate, UpdateFollowUpRequest, UpdateLeadPriceRequest, UpdateLeadStatusRequest
from app.services.notifications import notify_team
from app.utils import strip_mongo_id

router = APIRouter(tags=["leads"])


@router.post("/api/leads")
async def create_lead(payload: LeadCreate) -> dict[str, Any]:
    lead = Lead(**payload.model_dump()).model_dump()
    notification_result = await notify_team(lead)
    lead["notifications"] = notification_result
    await db["leads"].insert_one(lead)
    return {"id": lead["id"], "status": "received", "notifications": notification_result}


@router.get("/api/leads")
async def list_leads(limit: int = 50, search: str | None = None, status: str | None = None) -> list[dict[str, Any]]:
    query: dict[str, Any] = {"status": status} if status else {}
    if search:
        query["$or"] = [{field: {"$regex": search, "$options": "i"}} for field in ("name", "email", "phone")]
    cursor = db["leads"].find(query).sort("created_at", -1).limit(limit)
    return [strip_mongo_id(document) async for document in cursor]


@router.post("/api/leads/{lead_id}/notes")
async def add_note(lead_id: str, payload: AddNoteRequest) -> dict[str, Any]:
    from datetime import datetime, timezone
    note = {"created_at": datetime.now(timezone.utc).isoformat(), "author": payload.author, "note": payload.note}
    result = await db["leads"].update_one({"id": lead_id}, {"$push": {"internal_notes": note}})
    if result.matched_count == 0:
        raise HTTPException(404, "Lead not found")
    return {"status": "success", "note": note}


@router.patch("/api/leads/{lead_id}/status")
async def update_lead_status(lead_id: str, payload: UpdateLeadStatusRequest) -> dict[str, Any]:
    result = await db["leads"].update_one({"id": lead_id}, {"$set": {"status": payload.status}})
    if result.matched_count == 0:
        raise HTTPException(404, "Lead not found")
    return {"status": "success", "lead_status": payload.status}


@router.get("/api/leads/{lead_id}")
async def get_lead(lead_id: str) -> dict[str, Any]:
    lead = await db["leads"].find_one({"id": lead_id})
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return strip_mongo_id(lead)


@router.patch("/api/leads/{lead_id}/follow-up")
async def update_follow_up(lead_id: str, payload: UpdateFollowUpRequest) -> dict[str, str]:
    result = await db["leads"].update_one({"id": lead_id}, {"$set": {"follow_up_date": payload.follow_up_date}})
    if result.matched_count == 0:
        raise HTTPException(404, "Lead not found")
    return {"status": "success"}


@router.patch("/api/leads/{lead_id}/price")
async def update_lead_price(lead_id: str, payload: UpdateLeadPriceRequest) -> dict[str, Any]:
    result = await db["leads"].update_one({"id": lead_id}, {"$set": {"lead_price": payload.lead_price}})
    if result.matched_count == 0:
        raise HTTPException(404, "Lead not found")
    return {"status": "success", "lead_price": payload.lead_price}


@router.patch("/api/leads/{lead_id}/publish")
async def publish_lead(lead_id: str) -> dict[str, bool]:
    result = await db["leads"].update_one({"id": lead_id}, {"$set": {"marketplace_status": "available"}})
    if result.modified_count == 0:
        raise HTTPException(404, "Lead not found")
    return {"success": True}


@router.patch("/api/leads/{lead_id}/unpublish")
async def unpublish_lead(lead_id: str) -> dict[str, bool]:
    result = await db["leads"].update_one({"id": lead_id}, {"$set": {"marketplace_status": "draft"}})
    if result.matched_count == 0:
        raise HTTPException(404, "Lead not found")
    return {"success": True}
