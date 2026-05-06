import uuid
import shutil
import os
import torch
import librosa

from functools import lru_cache
from transformers import Wav2Vec2ForCTC, AutoProcessor
from app.core.config import UPLOAD_DIR, TRANSCRIPT_DIR, MODEL_NAME, TARGET_LANGUAGE
from app.services.audio_preprocessing_service import preprocess_audio


@lru_cache
def get_mms_model():
    processor = AutoProcessor.from_pretrained(MODEL_NAME)
    model = Wav2Vec2ForCTC.from_pretrained(MODEL_NAME)

    processor.tokenizer.set_target_lang(TARGET_LANGUAGE)
    model.load_adapter(TARGET_LANGUAGE)

    return processor, model


async def transcribe_audio_service(file):
    file_id = str(uuid.uuid4())

    raw_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"
    clean_path = f"{UPLOAD_DIR}/{file_id}_clean.wav"

    with open(raw_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    preprocess_audio(raw_path, clean_path)

    processor, model = get_mms_model()

    audio, sample_rate = librosa.load(clean_path, sr=16000)

    inputs = processor(audio, sampling_rate=16000, return_tensors="pt")

    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_ids = torch.argmax(logits, dim=-1)
    transcript_text = processor.batch_decode(predicted_ids)[0]

    transcript_path = f"{TRANSCRIPT_DIR}/{file_id}.txt"

    with open(transcript_path, "w", encoding="utf-8") as transcript_file:
        transcript_file.write(transcript_text)

    os.remove(raw_path)
    os.remove(clean_path)

    return transcript_text