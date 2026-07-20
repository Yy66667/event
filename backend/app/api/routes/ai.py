from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.ai import AISuggestRequest
from app.services.ai import ensure_ai_is_configured, stream_suggestion

router = APIRouter(tags=["ai"])


@router.post("/api/ai/suggest")
async def ai_suggest(request: AISuggestRequest) -> StreamingResponse:
    ensure_ai_is_configured()
    return StreamingResponse(stream_suggestion(request.topic, request.context, request.session_id), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
