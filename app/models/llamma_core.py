import ollama
from app.core.config import LLAMA_MODEL, TEMPERATURE, NUM_CTX, MAX_HISTORY_LENGTH
from app.models.system_prompt_template import SYSTEM_PROMPT_TEMPLATE
class LinguaMentor:
    def __init__(self):
        self.model_name = LLAMA_MODEL
    def generate_reply(self, conversation_history: list, user_input: str):
        if not user_input:
            return "Please say something so I can help you."
        if not conversation_history:
            conversation_history.append({
                "role": "system",
                "content": SYSTEM_PROMPT_TEMPLATE
            })
        conversation_history.append({
            "role": "user",
            "content": user_input
        })
        response = ollama.chat(
            model=self.model_name,
            options={
                "temperature": TEMPERATURE,
                "num_ctx": NUM_CTX
            },
            messages=conversation_history
        )
        assistant_reply = response["message"]["content"]

        conversation_history.append({
            "role": "assistant",
            "content": assistant_reply
        })
        return assistant_reply
