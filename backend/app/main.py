from fastapi import FastAPI
from app.api import twilio_webhook, detection, ws_media
# Load env etc
from app.core.config import settings


app = FastAPI()


app.include_router(twilio_webhook.router)
app.include_router(detection.router)
app.include_router(ws_media.router)


@app.get("/")
async def read_root():
    return{"message": "Hello World"}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}
