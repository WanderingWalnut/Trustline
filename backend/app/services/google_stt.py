import threading
import queue
from typing import Callable, Optional

from google.cloud import speech


# Map simple string values to Google Cloud Speech AudioEncoding enums.
# This lets callers specify encodings like "MULAW" or "LINEAR16" without
# importing/knowing the SDK enums.
_ENCODING_MAP = {
    "LINEAR16": speech.RecognitionConfig.AudioEncoding.LINEAR16,
    "MULAW": speech.RecognitionConfig.AudioEncoding.MULAW,
}


class GoogleSTTStreamer:
    """
    Thin wrapper around Google Cloud Speech-to-Text StreamingRecognize API.

    Responsibilities:
    - Build the streaming config (encoding, sample rate, language)
    - Run a background reader thread to consume streaming responses
    - Provide a simple write(audio_bytes) method to push audio chunks
    - Ensure clean shutdown via close()

    Typical usage:
      stt = GoogleSTTStreamer(language_code="en-US", sample_rate_hz=8000, audio_encoding="MULAW")
      stt.start(callback=lambda text, is_final: print(text, is_final))
      stt.write(audio_bytes)  # call repeatedly as chunks arrive
      stt.close()
    """

    def __init__(
        self,
        language_code: str,
        sample_rate_hz: int = 8000,
        enable_interim_results: bool = True,
        enable_automatic_punctuation: bool = True,
        audio_encoding: str = "LINEAR16",
    ) -> None:
        """
        Construct a streaming recognizer client.

        - language_code: BCP-47 code like "en-US" or "en-GB"
        - sample_rate_hz: Input sample rate (Twilio Media Streams use 8000 Hz)
        - enable_interim_results: Emit partial (non-final) hypotheses
        - enable_automatic_punctuation: Insert punctuation in transcripts
        - audio_encoding: One of {"LINEAR16", "MULAW"}
        """
        # Google Cloud Speech client
        self._client = speech.SpeechClient()

        # Queue to feed audio chunks to Google's request generator
        self._requests_queue: "queue.Queue[Optional[bytes]]" = queue.Queue()

        # Orchestration for shutdown and background reader thread
        self._stop_event = threading.Event()
        self._response_thread: Optional[threading.Thread] = None

        # Callback to deliver transcripts (text, is_final)
        self._callback: Optional[Callable[[str, bool], None]] = None

        # Resolve caller-provided encoding string to Google enum
        encoding_enum = _ENCODING_MAP.get(audio_encoding.upper(), speech.RecognitionConfig.AudioEncoding.LINEAR16)

        # RecognitionConfig describes the audio format and language
        self._config = speech.RecognitionConfig(
            encoding=encoding_enum,
            sample_rate_hertz=sample_rate_hz,
            language_code=language_code,
            enable_automatic_punctuation=enable_automatic_punctuation,
        )
        # StreamingRecognitionConfig toggles streaming behavior (e.g., interim results)
        self._streaming_config = speech.StreamingRecognitionConfig(
            config=self._config,
            interim_results=enable_interim_results,
            single_utterance=False,
        )

    def _requests_with_config(self):
        """Yield the initial config request, then stream audio_content chunks.
        For API signatures that expect the first request to carry config.
        """
        yield speech.StreamingRecognizeRequest(streaming_config=self._streaming_config)
        yield from self._audio_only_requests()

    def _audio_only_requests(self):
        """Yield only audio_content chunks (no config).
        For API signatures that pass config as a separate argument.
        """
        while not self._stop_event.is_set():
            chunk = self._requests_queue.get()
            if chunk is None:  # sentinel for shutdown
                break
            if not chunk:  # skip empty payloads
                continue
            yield speech.StreamingRecognizeRequest(audio_content=chunk)

    def _response_loop(self):
        """Read streaming responses and invoke the transcript callback.
        Runs in a background daemon thread so writes do not block reads.
        """
        try:
            # First try the "requests only" signature where the config is in the first request
            try:
                iterator = self._client.streaming_recognize(requests=self._requests_with_config())
            except TypeError:
                # Fallback for versions that require config as a separate parameter
                iterator = self._client.streaming_recognize(
                    config=self._streaming_config,
                    requests=self._audio_only_requests(),
                )

            for response in iterator:
                if self._callback is None:
                    continue
                for result in response.results:
                    if not result.alternatives:
                        continue
                    transcript = result.alternatives[0].transcript
                    self._callback(transcript, result.is_final)
        except Exception as exc:
            print(f"STT: response loop error: {exc}")

    def start(self, callback: Callable[[str, bool], None]) -> None:
        """Begin recognition.
        - callback: function(text, is_final) called for each hypothesis.
        """
        self._callback = callback
        self._response_thread = threading.Thread(target=self._response_loop, daemon=True)
        self._response_thread.start()

    def write(self, audio_bytes: bytes) -> None:
        """Push an audio chunk to the streaming recognizer."""
        self._requests_queue.put(audio_bytes)

    def close(self) -> None:
        """Cleanly terminate the stream and join the reader thread."""
        self._stop_event.set()
        self._requests_queue.put(None)  # sentinel to end generator
        if self._response_thread is not None:
            self._response_thread.join(timeout=2.0)
            self._response_thread = None
