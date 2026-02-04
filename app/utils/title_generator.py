def generate_chat_title(text: str, max_words: int = 5) -> str:
    words = text.strip().split()
    title = " ".join(words[:max_words])
    return title.title()
