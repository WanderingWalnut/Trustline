import base64
import json
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.config import settings
from app.services.google_stt import GoogleSTTStreamer

router = APIRouter(tags=["media"])

@router.websocket("/media")
async def media_ws(ws: WebSocket):
    """
    WebSocket endpoint for handling real-time media streams from Twilio.

    Twilio sends base64-encoded G.711 MULAW audio at 8 kHz. We stream
    the decoded bytes (raw MULAW) directly to Google STT with encoding=MULAW.
    """
    await ws.accept()
    
    # Track call and stream identifiers for logging and debugging
    call_sid = None
    stream_sid = None
    frames = 0

    stt: Optional[GoogleSTTStreamer] = None

    print("WS: client connected")
    
    last_interim = ""

    def on_transcript(text: str, is_final: bool) -> None:
        nonlocal last_interim
        t = text.strip()
        if is_final:
            print(f"STT[FINAL]: {t}")
            last_interim = "" # Reset between utterances
        
        else:
            # If it's not the same text then print it
            if t and t != last_interim:
                print(f"STT[INTERIM]: {t}")
                last_interim = t

    try:
        while True:
            # Receive raw JSON message from WebSocket
            raw = await ws.receive_text()

            try:
                msg = json.loads(raw)
            except json.JSONDecodeError as e:
                print(f"WS: Invalid JSON received: {e}")
                continue

            # Extract event type from the message
            event = msg.get("event")

            if event == "start":
                # Handle media stream start event
                # This event contains metadata about the call and stream
                start_data = msg.get("start", {})
                call_sid = start_data.get("callSid")
                stream_sid = start_data.get("streamSid")

                print(f"MEDIA START callSid={call_sid}, streamSid={stream_sid}")

                # Initialize Google STT streaming session
                try:
                    stt = GoogleSTTStreamer(
                        language_code=settings.STT_LANGUAGE_CODE,
                        sample_rate_hz=8000,
                        enable_interim_results=True,
                        enable_automatic_punctuation=True,
                        audio_encoding="MULAW",
                    )
                    stt.start(callback=on_transcript)
                    print("STT: streaming session started (MULAW@8kHz)")
                except Exception as e:
                    print(f"STT: failed to start streaming session: {e}")
                    stt = None

            elif event == "media":
                # Handle incoming audio data
                frames += 1
                
                # Extract base64-encoded audio payload
                media_data = msg.get("media", {})
                payload_b64 = media_data.get("payload")

                if not payload_b64:
                    print("WS: Received media event without payload")
                    continue

                try:
                    mulaw_bytes = base64.b64decode(payload_b64)
                except Exception as e:
                    print(f"WS: Failed to decode base64 payload: {e}")
                    continue

                if stt is not None:
                    try:
                        stt.write(mulaw_bytes)
                    except Exception as e:
                        print(f"STT: failed to process audio chunk: {e}")

                if frames % 50 == 0:
                    print(f"MEDIA frames received: {frames}")

            elif event == "stop":
                print(f"MEDIA STOP callSid={call_sid}, streamSid={stream_sid}")
                if stt is not None:
                    try:
                        stt.close()
                        print("STT: streaming session closed")
                    except Exception as e:
                        print(f"STT: error while closing session: {e}")
                    finally:
                        stt = None
                break

            else:
                # Twilio may send 'mark' or other diagnostic events
                # These are typically used for debugging and can be ignored
                print(f"WS: Received unknown event type: {event}")

    except WebSocketDisconnect:
        print("WS: Client disconnected")
    except Exception as e:
        print(f"WS: Unexpected error: {e}")
    finally:
        if stt is not None:
            try:
                stt.close()
                print("STT: streaming session closed (finally)")
            except Exception:
                pass
        print(f"WS: Connection ended for callSid={call_sid}, streamSid={stream_sid}")

