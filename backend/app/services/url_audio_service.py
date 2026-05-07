import subprocess
import os


def download_audio_from_url(url: str, output_path_without_ext: str) -> str:
    output_template = f"{output_path_without_ext}.%(ext)s"

    command = [
        "yt-dlp",
        "-x",
        "--audio-format", "wav",
        "--audio-quality", "0",
        "-o", output_template,
        url
    ]

    subprocess.run(command, check=True)

    final_path = f"{output_path_without_ext}.wav"

    if not os.path.exists(final_path):
        raise FileNotFoundError("Audio file was not created")

    return final_path