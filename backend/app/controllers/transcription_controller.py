from fastapi import UploadFile, File
from pydantic import BaseModel

from app.services.transcription_service import (
    transcribe_audio_service,
    transcribe_url_service
)


class UrlTranscriptionRequest(BaseModel):
    url: str


async def transcribe_controller(file: UploadFile = File(...)):
    text = await transcribe_audio_service(file)

    return {
        "success": True,
        "message": "File transcription completed successfully",
        "text": text
    }


async def transcribe_url_controller(body: UrlTranscriptionRequest):
    text = await transcribe_url_service(body.url)

    return {
        "success": True,
        "message": "URL transcription completed successfully",
        "text": text
    }