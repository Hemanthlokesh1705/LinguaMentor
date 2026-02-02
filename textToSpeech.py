import asyncio
import edge_tts
import os
from app.core.config import MODEL_VOICE
TEXT = "Hello Hemanth. LinguaMentor is ready to help you improve your English speaking skills."
VOICE =  MODEL_VOICE
OUTPUT_FILE = "output.mp3"

async def main():
    communicate = edge_tts.Communicate(TEXT, VOICE)
    await communicate.save(OUTPUT_FILE)

    print("Playing voice...")
    os.system(f"mpg123 {OUTPUT_FILE}")

asyncio.run(main())
