import ollama
from datetime import date
from app.core.config import LLAMA_MODEL, TEMPERATURE, NUM_CTX, MAX_HISTORY_LENGTH
from pymongo import MongoClient


class LinguaMentor:
    def __init__(self, model_name: str = LLAMA_MODEL):
        self.model_name = model_name
        self.history = []
        self.client = None
        self.db = None
        self.collection = None

        self.system_prompt = """
        You are a friendly English speaking coach named LinguaMentor developed by Hemanth.
        Your responsibilities:
        - Help students improve English speaking
        - Prepare them for job interviews
        - Create learning roadmaps
        - Give tips and daily assignments
        - Provide instant grammar feedback
        - Keep learners motivated
        - Speak in a polite and encouraging tone
        """

        self.initialize_model()

    def initialize_model(self):

        try:
            self.client = MongoClient("mongodb://127.0.0.1:27017/")
            self.client.admin.command("ping")

            self.db = self.client["LinguaMentor"]
            self.collection = self.db["users"]

            self.history = [
                {"role": "system", "content": self.system_prompt},
                {
                    "role": "assistant",
                    "content": f"Hi! Happy {date.today().strftime('%A')}. How can I help you improve your English today?"
                }
            ]

            print("LinguaMentor initialized successfully.")

        except Exception as e:
            raise RuntimeError("Initialization failed") from e

    def get_response(self, user_input: str):

        if not user_input:
            return "Please say something so I can help you."

        self.history.append({"role": "user", "content": user_input})

        response = ollama.chat(
            model=self.model_name,
            options={
                "temperature": TEMPERATURE,
                "num_ctx": NUM_CTX
            },
            messages=self.history
        )

        assistant_reply = response["message"]["content"]

        self.history.append({"role": "assistant", "content": assistant_reply})

        if len(self.history) > MAX_HISTORY_LENGTH:
            self.history = [self.history[0]] + self.history[-(MAX_HISTORY_LENGTH-1):]

        return assistant_reply


if __name__ == "__main__":

    coach = LinguaMentor()

    print("LinguaMentor:", coach.history[1]["content"])

    while True:

        user_input = input("You: ")

        if user_input.strip().lower() == "exit":

            chat_doc = {
                "date": str(date.today()),
                "conversation": coach.history
            }

            coach.collection.insert_one(chat_doc)

            print("LinguaMentor: Goodbye! Keep practicing English 🚀")
            break

        reply = coach.get_response(user_input)
        print("LinguaMentor:", reply)
