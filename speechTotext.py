import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
from faster_whisper import WhisperModel

SAMPLE_RATE = 16000
DURATION = 20 

print("Loading Whisper model...")
model = WhisperModel("base", device="cpu", compute_type="int8")
print("Model loaded successfully.")

print("Speak now...")

audio = sd.rec(
    int(DURATION * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype=np.float32,
     device=10 
)

sd.wait()

print("Recording finished.")

file_name = "input.wav"
write(file_name, SAMPLE_RATE, audio)

print("Transcribing...")

segments, info = model.transcribe(
    file_name,
    language="en",
    beam_size=5,
    vad_filter=True
)

full_text = ""

for segment in segments:
    full_text += segment.text

print("\nRecognized Text:")
print(full_text)

