from typing import Any, Optional

from pydantic import BaseModel, Field


class AISuggestRequest(BaseModel):
    topic: str
    context: dict[str, Any] = Field(default_factory=dict)
    session_id: Optional[str] = None
