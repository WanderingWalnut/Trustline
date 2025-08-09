from fastapi import APIRouter, Request, Response
from app.core.config import settings
# from app.core.security import validate_twilio_request  # Commented out for development
from app.api.detection import is_enabled
from twilio.twiml.voice_response import VoiceResponse, Start, Stream, Dial, Say

router = APIRouter(tags=["twilio"])

@router.post("/twilio/voice")
async def voice_webhook(request: Request):
    # Optional: validate Twilio signature (disable during first smoke tests)
    body = await request.body()
    # validate_twilio_request(request, body)  # Commented out for development - see explanation below
    
    """
    Twilio Signature Validation (Currently Disabled):
    
    Purpose: Twilio includes a cryptographic signature with each webhook request to verify
    that the request actually came from Twilio and wasn't forged by a malicious actor.
    
    How it works:
    1. Twilio creates a signature using your Auth Token and the request URL/body
    2. This signature is sent in the 'X-Twilio-Signature' header
    3. Your server recalculates the signature and compares it to the received one
    4. If they match, the request is authentic; if not, it's rejected
    
    Security benefits:
    - Prevents webhook spoofing attacks
    - Ensures only Twilio can trigger your webhook endpoints
    - Protects against replay attacks
    
    When to enable:
    - In production environments
    - When you want to ensure webhook security
    - After initial testing is complete
    
    Implementation needed in app/core/security.py:
    - Use Twilio's validation library or implement HMAC-SHA1 validation
    - Compare signatures using your TWILIO_AUTH_TOKEN
    """
    
    vr = VoiceResponse()

    if is_enabled():
        # 1) Start media streaming to your FastAPI WS
        start = Start()
        start.append(Stream(url=settings.PUBLIC_WS_MEDIA_URL))
        vr.append(start)

        # Optional: brief notice for compliance (region-specific)
        vr.append(Say("This call may be monitored and transcribed for demo purposes."))

        # 2) (Optional) Dial your mobile so a phone visibly rings
        if settings.FORWARD_TO_NUMBER:
            dial = Dial(caller_id=settings.TWILIO_PHONE_NUMBER)
            dial.number(settings.FORWARD_TO_NUMBER)
            vr.append(dial)
        else:
            # Keep the call open for ~60s if you're not dialing out
            vr.pause(length=60)
    else:
        # OFF mode: normal flow (no stream)
        if settings.FORWARD_TO_NUMBER:
            dial = Dial(caller_id=settings.TWILIO_PHONE_NUMBER)
            dial.number(settings.FORWARD_TO_NUMBER)
            vr.append(dial)
        else:
            vr.append(Say("Streaming is currently disabled."))

    # Return as XML
    return Response(content=str(vr), media_type="application/xml")
