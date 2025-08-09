from typing import Any, Dict, Optional
import asyncio
import sys

from app.core.config import settings
from realitydefender import RealityDefender


class RealityDefenderService:
    """
    Minimal wrapper around the Reality Defender Python SDK.

    Usage:
      svc = RealityDefenderService()
      result = await svc.analyze_file("/path/to/audio_or_video.ext")
    """

    def __init__(self, api_key: Optional[str] = None) -> None:
        key = api_key or settings.REALITY_DEFENDER_API_KEY
        if not key:
            raise RuntimeError("REALITY_DEFENDER_API_KEY is not set in environment or passed explicitly")
        self._client = RealityDefender(api_key=key)

    async def analyze_file(self, file_path: str) -> Dict[str, Any]:
        """
        Upload a media file for analysis and wait for the result.

        Returns the SDK result dict, e.g. {"status": str, "score": float, "models": [...]}
        """
        resp = await self._client.upload(file_path=file_path)
        request_id = resp["request_id"]
        result = await self._client.get_result(request_id)
        return result


async def main(file_path: str) -> None:
    svc = RealityDefenderService()
    print(f"Submitting file to Reality Defender: {file_path}")
    result = await svc.analyze_file(file_path)
    # Pretty-print a concise summary
    status = result.get("status")
    score = result.get("score")
    models = result.get("models", [])
    print("\nReality Defender Result:")
    print(f"Status: {status}")
    print(f"Score:  {score}")
    if models:
        print("Models:")
        for m in models:
            name = m.get("name")
            m_status = m.get("status")
            m_score = m.get("score")
            print(f"  - {name}: {m_status} (score={m_score})")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python -m app.services.reality_defender /absolute/path/to/file")
        sys.exit(1)
    asyncio.run(main(sys.argv[1]))
