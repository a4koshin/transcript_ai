import uuid
import shutil
import os
import torch
import librosa

from functools import lru_cache
from transformers import Wav2Vec2ForCTC, AutoProcessor
from app.services.text_formatter_service import format_transcript

from app.core.config import (
    UPLOAD_DIR,
    TRANSCRIPT_DIR,
    CHUNK_DIR,
    MODEL_NAME,
    TARGET_LANGUAGE
)



from app.services.audio_preprocessing_service import preprocess_audio
from app.services.audio_chunking_service import split_audio_into_chunks
from app.services.url_audio_service import download_audio_from_url


@lru_cache
def get_mms_model():
    processor = AutoProcessor.from_pretrained(MODEL_NAME)
    model = Wav2Vec2ForCTC.from_pretrained(MODEL_NAME)

    processor.tokenizer.set_target_lang(TARGET_LANGUAGE)
    model.load_adapter(TARGET_LANGUAGE)

    return processor, model


def transcribe_single_chunk(chunk_path: str) -> str:
    processor, model = get_mms_model()

    audio, _ = librosa.load(chunk_path, sr=16000)

    inputs = processor(audio, sampling_rate=16000, return_tensors="pt")

    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_ids = torch.argmax(logits, dim=-1)

    text = processor.batch_decode(predicted_ids)[0]

    return text.strip()


def transcribe_clean_audio(clean_path: str, file_id: str) -> str:
    chunk_output_dir = f"{CHUNK_DIR}/{file_id}"

    chunks = split_audio_into_chunks(
        input_path=clean_path,
        output_dir=chunk_output_dir,
        file_id=file_id,
        chunk_seconds=30
    )

    transcript_parts = []

    for index, chunk_path in enumerate(chunks, start=1):
        print(f"Transcribing chunk {index}/{len(chunks)}")

        chunk_text = transcribe_single_chunk(chunk_path)

        if chunk_text:
            transcript_parts.append(chunk_text)


    raw_text = " ".join(transcript_parts)

    transcript_text = format_transcript(raw_text)

    transcript_path = f"{TRANSCRIPT_DIR}/{file_id}.txt"

    with open(transcript_path, "w", encoding="utf-8") as transcript_file:
        transcript_file.write(transcript_text)

    for chunk_path in chunks:
        os.remove(chunk_path)

    if os.path.exists(chunk_output_dir):
        os.rmdir(chunk_output_dir)

    return transcript_text


async def transcribe_audio_service(file):
    file_id = str(uuid.uuid4())

    raw_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"
    clean_path = f"{UPLOAD_DIR}/{file_id}_clean.wav"

    with open(raw_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    preprocess_audio(raw_path, clean_path)

    transcript_text = transcribe_clean_audio(clean_path, file_id)

    os.remove(raw_path)
    os.remove(clean_path)

    return transcript_text


async def transcribe_url_service(url: str):
    file_id = str(uuid.uuid4())

    downloaded_path_without_ext = f"{UPLOAD_DIR}/{file_id}_downloaded"
    downloaded_audio_path = download_audio_from_url(url, downloaded_path_without_ext)

    clean_path = f"{UPLOAD_DIR}/{file_id}_clean.wav"

    preprocess_audio(downloaded_audio_path, clean_path)

    transcript_text = transcribe_clean_audio(clean_path, file_id)

    os.remove(downloaded_audio_path)
    os.remove(clean_path)

    return transcript_text