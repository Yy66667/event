from typing import Any

from fastapi import APIRouter, HTTPException

from app.core.database import db
from app.schemas.vendors import Vendor, VendorApplication, VendorLoginRequest, AddNoteRequest
from app.services.compatibility import calculate_compatibility
from app.services.notifications import notify_vendor_application

router = APIRouter(tags=["vendors"])


@router.post("/api/vendors")
async def create_vendor(vendor: Vendor) -> dict[str, Any]:
    if await db["vendors"].find_one({"email": vendor.email}):
        raise HTTPException(status_code=400, detail="Vendor already exists")
    vendor_data = vendor.model_dump()
    await db["vendors"].insert_one(vendor_data)
    return {"success": True, "vendor": vendor_data}


@router.post("/api/vendor-applications")
async def create_vendor_application(application: VendorApplication) -> dict[str, str]:
    if not application.consent:
        raise HTTPException(status_code=400, detail="Consent is required to submit an application.")
    if await db["vendor_applications"].find_one({"email": application.email}):
        raise HTTPException(status_code=409, detail="An application with this email has already been received.")
    application_data = application.model_dump()
    application_data["notifications"] = {
        "telegram": "sent" if await notify_vendor_application(application_data) else "failed"
    }
    await db["vendor_applications"].insert_one(application_data)
    return {"message": "Application received", "application_id": application.id}



@router.post("/api/vendor/login")
async def vendor_login(payload: VendorLoginRequest) -> dict[str, Any]:
    vendor = await db["vendors"].find_one({"email": payload.email})
    if not vendor or vendor["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not vendor.get("active", True):
        raise HTTPException(status_code=403, detail="Vendor account is disabled")
    if not vendor.get("verified", False):
        raise HTTPException(status_code=403, detail="Vendor account is not verified")
    vendor.pop("_id", None)
    vendor.pop("password", None)
    return {"success": True, "vendor": vendor}


def _marketplace_lead(lead: dict[str, Any]) -> dict[str, Any]:
    return {"id": lead["id"], "event_summary": lead.get("event_summary", {}), "planner_answers": lead.get("planner_answers", {}), "lead_price": lead.get("lead_price"), "created_at": lead.get("created_at"), "name": None, "phone": None, "email": None, "whatsapp": None}


@router.get("/api/vendor/leads")
async def get_vendor_leads() -> list[dict[str, Any]]:
    leads = await db["leads"].find({"status": "verified"}).to_list(100)
    return [_marketplace_lead(lead) for lead in leads]


@router.get("/api/vendor/leads/{lead_id}")
async def get_vendor_lead(lead_id: str) -> dict[str, Any]:
    lead = await db["leads"].find_one({"id": lead_id, "status": "verified"})
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _marketplace_lead(lead)


@router.get("/api/vendors/{vendor_id}/marketplace-leads")
async def get_compatible_marketplace_leads(vendor_id: str) -> list[dict[str, Any]]:
    """Marketplace-ready feed with an explainable compatibility score per lead."""
    vendor = await db["vendors"].find_one({"id": vendor_id})
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    leads = await db["leads"].find({"status": "verified"}).to_list(100)
    return [{**_marketplace_lead(lead), "compatibility": calculate_compatibility(vendor, lead)} for lead in leads]


@router.get("/api/vendor-applications")
async def get_vendor_applications() -> list[dict[str, Any]]:
    applications = await db["vendor_applications"].find().sort("created_at", -1).to_list(100)

    for application in applications:
        application.pop("_id", None)

    return applications

@router.get("/api/vendor-applications/{application_id}")
async def get_vendor_application(application_id: str):
    application = await db["vendor_applications"].find_one(
        {"id": application_id}
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    application.pop("_id", None)

    return application


@router.post("/api/vendor-applications/{application_id}/notes")
async def add_note(application_id: str, payload: AddNoteRequest) -> dict[str, Any]:
    from datetime import datetime, timezone
    note = {"created_at": datetime.now(timezone.utc).isoformat(), "author": payload.author, "note": payload.note}
    result = await db["vendor_applications"].update_one({"id": application_id}, {"$push": {"internal_notes": note}})
    if result.matched_count == 0:
        raise HTTPException(404, "Application not found")
    return {"status": "success", "note": note}
