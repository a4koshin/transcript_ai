import whisper
import uuid
import shutil
import os

from functools import lru_cache
from app.core.config import UPLOAD_DIR, TRANSCRIPT_DIR, MODEL_NAME
from app.services.text_normalizer_service import normalize_somali_latin


@lru_cache
def get_model():
    return whisper.load_model(MODEL_NAME)


async def transcribe_audio_service(file):
    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    model = get_model()

    result = model.transcribe(
        file_path,
        language="so",
        task="transcribe",
        fp16=False,
        temperature=0,
        condition_on_previous_text=False,
        initial_prompt="Ku qor Af-Soomaali farta Latin-ka oo keliya. Tusaale: salaam, caafimaad, dadka, warbixin."
    )

    raw_text = result["text"]
    transcript_text = normalize_somali_latin(raw_text)

    transcript_path = f"{TRANSCRIPT_DIR}/{file_id}.txt"

    with open(transcript_path, "w", encoding="utf-8") as transcript_file:
        transcript_file.write(transcript_text)

    os.remove(file_path)

    return transcript_text