import subprocess
import os


def split_audio_into_chunks(input_path: str, output_dir: str, file_id: str, chunk_seconds: int = 30):
    os.makedirs(output_dir, exist_ok=True)

    output_pattern = f"{output_dir}/{file_id}_chunk_%03d.wav"

    command = [
        "ffmpeg",
        "-i", input_path,
        "-f", "segment",
        "-segment_time", str(chunk_seconds),
        "-c", "copy",
        "-y",
        output_pattern
    ]

    subprocess.run(command, check=True)

    chunks = sorted([
        f"{output_dir}/{file}"
        for file in os.listdir(output_dir)
        if file.startswith(f"{file_id}_chunk_") and file.endswith(".wav")
    ])

    return chunks