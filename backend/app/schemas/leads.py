from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field


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
    internal_notes: list[dict[str, Any]] = Field(default_factory=list)
    assigned_to: Optional[str] = None
    follow_up_date: Optional[str] = None
    notifications: dict[str, bool] = Field(default_factory=lambda: {
        "telegram_sent": False,
        "customer_notified": False,
        "vendor_notified": False,
    })
    lead_price: int | None = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    marketplace_status: str = "draft"
    sold_to_vendor: Optional[str] = None
    purchased_at: Optional[str] = None


class LeadCreate(BaseModel):
    name: str
    phone: str
    whatsapp: Optional[str] = None
    email: EmailStr
    planner_answers: dict[str, Any] = Field(default_factory=dict)
    ai_recommendations: list[str] = Field(default_factory=list)
    event_summary: dict[str, Any] = Field(default_factory=dict)


class UpdateLeadStatusRequest(BaseModel):
    status: str


class UpdateFollowUpRequest(BaseModel):
    follow_up_date: datetime | None


class UpdateLeadPriceRequest(BaseModel):
    lead_price: int


class AddNoteRequest(BaseModel):
    author: str
    note: str
