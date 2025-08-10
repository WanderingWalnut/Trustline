from typing import Optional

from app.core.config import settings
from twilio.rest import Client


def send_sms(to_number: str, body: str) -> Optional[str]:
    """Send an SMS using Twilio. Returns the Message SID on success, None on failure."""
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN or not settings.TWILIO_PHONE_NUMBER:
        print("Notifier: Missing Twilio credentials in environment")
        return None

    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        msg = client.messages.create(
            to=to_number,
            from_=settings.TWILIO_PHONE_NUMBER,
            body=body,
        )
        print(f"Notifier: SMS sent to {to_number}, sid={msg.sid}")
        return msg.sid
    except Exception as exc:  # pragma: no cover
        print(f"Notifier: Failed to send SMS to {to_number}: {exc}")
        return None


def notify_scam_call(to_number: str, call_sid: str, score: Optional[float]) -> Optional[str]:
    """Send a concise scam alert SMS to the callee when a call is flagged as MANIPULATED."""
    score_text = f" (score {score:.2f})" if isinstance(score, (float, int)) else ""
    body = f"Alert: Potential scam call detected{score_text}. Call SID: {call_sid}."
    return send_sms(to_number, body)


def notify_detection_result(
    to_number: str,
    call_sid: str,
    status: str,
    score: Optional[float],
) -> Optional[str]:
    """Notify outcome regardless of status (AUTHENTIC or MANIPULATED)."""
    status_up = (status or "").upper()
    label = "Potential scam detected" if status_up == "MANIPULATED" else "Call appears authentic"
    score_text = f" (score {score:.2f})" if isinstance(score, (float, int)) else ""
    body = f"{label}{score_text}. Call SID: {call_sid}."
    return send_sms(to_number, body)



