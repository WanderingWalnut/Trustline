from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["control"])

# simple in-memory flag (authoritative at runtime)
_state = {"enabled": getattr(settings, 'DETECTION_ENABLED', False)}

@router.post("/start")
def start_detection():
    _state["enabled"] = True
    return {"enabled": True}

@router.post("/stop")
def stop_detection():
    _state["enabled"] = False
    return {"enabled": False}

@router.get("/status")
def status():
    return {"enabled": _state["enabled"]}
    
def is_enabled() -> bool:
    return _state["enabled"]
