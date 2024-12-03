import json
import sys
import whisper
import os
from datetime import datetime

MODEL_NAME = "medium"

def adjust_ranges(target_data):
    """
    Procesa los rangos en orden ascendente por tiempo.
    Respeta los rangos con tiempo menor y recorta los segundos solapados en los rangos posteriores.
    """
    sorted_ranges = sorted(target_data, key=lambda x: x["time"])
    adjusted_ranges = []

    for current in sorted_ranges:
        start = current["time"] - 3
        end = current["time"]
        level = current["level"]

        if not adjusted_ranges or adjusted_ranges[-1]["end"] <= start:
            adjusted_ranges.append({"start": start, "end": end, "level": level})
        else:
            last_range = adjusted_ranges[-1]
            # Validación de last_range y valores
            if not isinstance(last_range, dict) or "end" not in last_range:
                raise ValueError(f"last_range inválido: {last_range}")
            if not isinstance(end, (int, float)) or not isinstance(level, int):
                raise ValueError(f"Valores inválidos - end: {end}, level: {level}")

            # Ajuste del rango en caso de solapamiento
            if last_range["end"] < end:
                adjusted_ranges.append({"start": last_range["end"], "end": end, "level": level})

    return adjusted_ranges

def save_transcription(text):
    output_dir = "Transcripciones"
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(output_dir, f"transcripcion_{timestamp}.txt")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(text)
    return output_file

def transcribe_audio_with_multiple_keywords(audio_file, target_data):
    model = whisper.load_model(MODEL_NAME)
    result = model.transcribe(audio_file, word_timestamps=True)
    adjusted_ranges = adjust_ranges(target_data)
    segments = result.get("segments", [])
    highlighted_text = ""
    temp_block = ""
    current_level = None

    for segment in segments:
        for word_info in segment.get("words", []):
            word_start = word_info.get("start", 0)
            word_text = word_info.get("word", "")

            applicable_ranges = [r for r in adjusted_ranges if r["start"] <= word_start < r["end"]]
            if applicable_ranges:
                current_range = applicable_ranges[0]
                level = current_range["level"]
                if current_level != level and temp_block:
                    asterisks = '*' * current_level
                    highlighted_text += f"{asterisks}{temp_block.strip()}{asterisks} "
                    temp_block = ""
                current_level = level
                temp_block += f"{word_text} "
            else:
                if temp_block:
                    asterisks = '*' * current_level
                    highlighted_text += f"{asterisks}{temp_block.strip()}{asterisks} "
                    temp_block = ""
                highlighted_text += f"{word_text} "

    if temp_block:
        asterisks = '*' * current_level
        highlighted_text += f"{asterisks}{temp_block.strip()}{asterisks} "

    return highlighted_text

def main():
    if not sys.stdin.isatty():  # Si recibe datos desde stdin
        input_data = json.loads(sys.stdin.read())
        audio_path = input_data["audio_path"]
        target_data = input_data["target_data"]
        transcription = transcribe_audio_with_multiple_keywords(audio_path, target_data)
        output_file = save_transcription(transcription)
        print(json.dumps({"transcription": transcription, "file": output_file}))
    else:  # Si se ejecuta directamente
        audio_path = "/Users/davidcalvomunoz/Desktop/GuerraMundialLargo.m4a"
        target_data = [
            {"time": 5, "level": 2},
            {"time": 7, "level": 2},
            {"time": 12, "level": 2},
        ]
        transcription = transcribe_audio_with_multiple_keywords(audio_path, target_data)
        save_transcription(transcription)

if __name__ == "__main__":
    main()