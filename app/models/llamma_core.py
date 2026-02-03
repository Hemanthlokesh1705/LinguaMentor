import ollama
from app.core.config import LLAMA_MODEL, TEMPERATURE, NUM_CTX
class LinguaMentor:
    def __init__(self):
        self.model_name = LLAMA_MODEL
    def generate_reply(self, conversation_history: list):
        response = ollama.chat(
            model=self.model_name,
            options={
                "temperature": TEMPERATURE,
                "num_ctx": NUM_CTX
            },
            messages=conversation_history
        )
        return response["message"]["content"]
