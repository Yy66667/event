from __future__ import annotations

import uuid
from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field


class Vendor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_name: str
    owner_name: str
    email: EmailStr
    phone: str
    password: str
    category: str
    city: str
    verified: bool = False
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


class VendorLoginRequest(BaseModel):
    email: EmailStr
    password: str


class VendorApplication(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    partner_type: str
    business_name: str
    owner_name: str
    email: EmailStr
    phone: str
    whatsapp: str
    instagram: str
    city: str
    years_in_business: str
    events_per_year: str
    team_size: str
    portfolio_url: str
    event_types: list[str]
    services: list[str]
    service_cities: list[str]
    travel_scope: str
    min_event_budget: str
    max_guest_count: int
    minimum_notice_days: int
    availability: str
    premium_experience: str
    portfolio_highlights: str
    client_references: str
    business_description: str
    differentiator: str
    consent: bool
    status: str = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
