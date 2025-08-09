import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # Twilio Configuration
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_API_KEY_SID: str = os.getenv("TWILIO_API_KEY_SID", "")
    TWILIO_API_KEY_SECRET: str = os.getenv("TWILIO_API_KEY_SECRET", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")
    
    # Google Configuration
    GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
    STT_LANGUAGE_CODE: str = os.getenv("STT_LANGUAGE_CODE", "en-US")
    
    # WebSocket and Media Configuration
    PUBLIC_WS_MEDIA_URL: str = os.getenv("PUBLIC_WS_MEDIA_URL", "ws://localhost:8000/media")
    FORWARD_TO_NUMBER: str = os.getenv("FORWARD_TO_NUMBER", "")
    
    # Detection Service Control
    DETECTION_ENABLED: bool = os.getenv("DETECTION_ENABLED", "false").lower() == "true"
    
    @classmethod
    def validate_twilio_config(cls) -> bool:
        """Validate that all required Twilio credentials are set"""
        required_fields = [
            cls.TWILIO_ACCOUNT_SID,
            cls.TWILIO_AUTH_TOKEN,
            cls.TWILIO_API_KEY_SID,
            cls.TWILIO_API_KEY_SECRET,
            cls.TWILIO_PHONE_NUMBER
        ]
        return all(field for field in required_fields)
    
    @classmethod
    def validate_google_config(cls) -> bool:
        """Validate that Google Application Credentials are set"""
        return bool(cls.GOOGLE_APPLICATION_CREDENTIALS)

# Create a global settings instance
settings = Settings()



