import subprocess


def preprocess_audio(input_path: str, output_path: str):
    command = [
        "ffmpeg",
        "-i", input_path,
        "-ac", "1",
        "-ar", "16000",
        "-af", "loudnorm",
        "-y",
        output_path
    ]

    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)