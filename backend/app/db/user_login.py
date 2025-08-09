from .connect import supabase

def sign_up(ph_number: str, care_giver_number=None)->bool:
    '''
    Using user's phone number and optionally the number of their care giver, creates a new user.
    Returns a boolean confirming whether or not signing up was successful.
    '''

    '''
    Since Vonage API (SMS provider) is a paid service, we cannot send an SMS to a number without 
    first registering it as a test number (Galvin can register these numbers). We also have a 
    limited number of free SMS messages to send.
    '''

    response = supabase.auth.sign_in_with_otp( # If the user doesn't exist, sign_in_with_otp() will signup the user instead.
        {"phone": ph_number}
    )
    # print(f"response is: {response}")
    # print(f"OTP sent to: {ph_number}")

    otp_code = input("Enter the code you received: ") 

    verify_otp_response = supabase.auth.verify_otp( # this should verify the user by confirming their number and OTP that was sent to them.
        {
        "phone": ph_number,
        "token": otp_code,
        "type": "sms",
        }
    ) 

    print(verify_otp_response)

    if verify_otp_response:
        return True
    else:
        return False

def main():
    phone_number = "<phone-number>" # change this to a valid number
    sign_up(phone_number)

main()
