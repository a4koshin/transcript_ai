from fastapi import APIRouter

from app.controllers.transcription_controller import (
    transcribe_controller,
    transcribe_url_controller
)

router = APIRouter(
    prefix="/api/transcriptions",
    tags=["Transcriptions"]
)

router.post("/transcribe")(transcribe_controller)

router.post("/transcribe-url")(transcribe_url_controller)