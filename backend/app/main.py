from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .db.user_login import send_otp, verify_otp  # import your signup functions

app = FastAPI()

class SignUpRequest(BaseModel):
    phone_number: str
    otp_code: str | None = None

@app.post("/signup")
async def sign_up(request: SignUpRequest):
    if not request.otp_code:
        response = send_otp(request.phone_number)
        if not response:
            raise HTTPException(status_code=400, detail="Failed to send OTP")
        return {"message": f"OTP sent to {request.phone_number}"}
    else:
        result = verify_otp(request.phone_number, request.otp_code)
        user = getattr(result, "user", None)
        phone_confirmed_at = getattr(user, "phone_confirmed_at", None) if user else None
        if not result or not user or not phone_confirmed_at:
            raise HTTPException(status_code=400, detail="OTP verification failed")
        return {"message": "Sign up successful", "user_id": user.id}