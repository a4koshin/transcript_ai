import re


def format_transcript(text: str, sentences_per_paragraph: int = 3):
    text = re.sub(r"\s+", " ", text).strip()

    sentences = re.split(r"(?<=[.!?])\s+", text)

    paragraphs = []

    for i in range(0, len(sentences), sentences_per_paragraph):
        chunk = sentences[i:i + sentences_per_paragraph]

        paragraph = " ".join(chunk).strip()

        if paragraph:
            paragraphs.append(paragraph)

    return "\n\n".join(paragraphs)