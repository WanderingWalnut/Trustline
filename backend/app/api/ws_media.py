import base64
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["media"])

@router.websocket("/media")
async def media_ws(ws: WebSocket):
    """
    WebSocket endpoint for handling real-time media streams from Twilio.
    
    This endpoint receives audio data from Twilio's Media Streams API and
    processes it for speech-to-text conversion. The audio comes in as
    base64-encoded MULAW format at 8kHz sample rate.
    """
    await ws.accept()
    
    # Track call and stream identifiers for logging and debugging
    call_sid = None
    stream_sid = None
    frames = 0

    print("WS: client connected")

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

                print(f"MEDIA START callSid = {call_sid}, streamSid = {stream_sid}")

                # TODO: Open google STT streaming session here (encoding = MULAW, rate = 8000)
                # Note: Google STT expects LINEAR16 format, so MULAW needs conversion

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
                    # Decode base64 to get raw MULAW audio bytes
                    mulaw_bytes = base64.b64decode(payload_b64)
                except Exception as e:
                    print(f"WS: Failed to decode base64 payload: {e}")
                    continue

                # TODO: write mulaw_bytes into Google STT stream
                # Note: Google STT requires LINEAR16 format, so MULAW needs conversion
                # For now, just log every 50 frames (~1 second at 8kHz)
                if frames % 50 == 0:
                    print(f"MEDIA frames received: {frames}")
                
            elif event == "stop":
                # Handle media stream stop event
                print(f"MEDIA STOP callSid={call_sid}, streamSid = {stream_sid}")
                # TODO: close Google STT streaming session + drain final results
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
        # Clean up any resources when the connection ends
        print(f"WS: Connection ended for callSid={call_sid}, streamSid={stream_sid}")

