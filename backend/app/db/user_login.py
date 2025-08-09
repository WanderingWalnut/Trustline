import os
from .connect import supabase
from supabase import create_client

def send_otp(ph_number: str) -> bool:
    response = supabase.auth.sign_in_with_otp( # If the user doesn't exist, sign_in_with_otp() will signup the user instead.
        {"phone": ph_number}
    )
    print(f"response is: {response}")
    return response


def verify_otp(ph_number: str, otp_code: str) -> bool:
    sign_in_response = supabase.auth.verify_otp({
        "phone": ph_number,
        "token": otp_code,
        "type": "sms"
    })
    user_id = getattr(sign_in_response.user, "id", None)
    access_token = getattr(getattr(sign_in_response, "session", None), "access_token", None)
    print(f"user_id: {user_id}, access_token: {access_token}")
    if user_id and access_token:
        # Recreate the client with the access token
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        authed_client = create_client(url, key)
        authed_client.auth.session = sign_in_response.session  # Set the session with access token
        existing = authed_client.table("users").select("UUID").eq("UUID", user_id).execute()
        
        print(f"existing.data: {existing.data}")
        if not existing.data:
            authed_client.table("users").insert({"UUID": user_id, "phone_number": ph_number}).execute()
    print(f"sign_in_response: {sign_in_response}")
    return sign_in_response