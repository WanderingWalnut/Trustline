import asyncio
import wave
import os
import time
import base64
import json
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.reality_defender import RealityDefenderService

from app.core.config import settings
from app.services.google_stt import GoogleSTTStreamer

router = APIRouter(tags=["media"])

_BIAS = 0x84
_CLIP = 32635
_EXP_LUT = [0, 132, 396, 924, 1980, 4092, 8316, 16764]
capture_buf: Optional[bytearray] = None
CAPTURE_TARGET_BYTES = 8000 * 10  # 10s of MULAW at 8kHz, mono
captured = False

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

    def mulaw_to_linear16(mulaw_bytes: bytes) -> bytes:
        out = bytearray(len(mulaw_bytes)*2)
        j = 0 

        for b in mulaw_bytes:
            mu = (~b) & 0xFF
            sign = mu & 0x80
            exponent = (mu >> 4) & 0x07
            mantissa = mu & 0x0F
            magnitude = _EXP_LUT[exponent] + (mantissa << (exponent + 3))
            
            if magnitude > _CLIP:
                magnitude = _CLIP
            
            sample = magnitude - _BIAS

            if sign:
                sample = -sample
            
            out[j] = sample & 0xFF
            out[j+1] = (sample >> 8) & 0xFF
            j += 2
        
        return bytes(out)
    
    async def save_and_submit_wav(call_sid: str, mulaw_bytes: bytes) -> None:
        # Convert to PCM 16
        pcm = mulaw_to_linear16(mulaw_bytes)

        # Write WAV (mono, 8khz, 16-bit)
        ts = int(time.time()) # timestamp
        out_dir = settings.CAPTURE_DIR
        os.makedirs(out_dir, exist_ok=True) # Make sure the directory exists
        fname = f"call_{call_sid or 'unknown'}_{ts}.wav"
        path = os.path.join(out_dir, fname)

        with wave.open(path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(8000)
            wf.writeframes(pcm)
        
        print(f"WAV written: {path}")

        # Submit to reality defender (non-block here, but we await once)
        svc = RealityDefenderService()
        result = await svc.analyze_file(path)
        print("Reality Defender:", {"status": result.get("status"), "score": result.get("score")})

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

                # Vars for reality defender check
                capture_buf = bytearray()
                captured = False

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
                
                if capture_buf is not None and not captured:
                    capture_buf.extend(mulaw_bytes)
                    if len(capture_buf) >= CAPTURE_TARGET_BYTES:
                        captured = True
                        # Run save + submit in background so we don't block streaming
                        asyncio.create_task(save_and_submit_wav(call_sid or "", bytes(capture_buf)))

            elif event == "stop":
                print(f"MEDIA STOP callSid={call_sid}, streamSid={stream_sid}")
                
                if capture_buf and not captured and len(capture_buf) > 0:  # If ended under 10s, grab whatever is there and process
                    asyncio.create_task(save_and_submit_wav(call_sid or "", bytes(capture_buf)))

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

