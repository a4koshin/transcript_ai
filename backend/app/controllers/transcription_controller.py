from fastapi import UploadFile, File
from app.services.transcription_service import transcribe_audio_service


async def transcribe_controller(file: UploadFile = File(...)):
    text = await transcribe_audio_service(file)

    return {
        "success": True,
        "message": "Transcription completed successfully",
        "text": text
    }