from app.core.database import messages
from bson import ObjectId
from app.core.config import WINDOW_LIMIT
from app.models.system_prompt_template import SYSTEM_PROMPT_TEMPLATE
def get_chat_context(conversation_id: str):
    convo_object_id = ObjectId(conversation_id)
    cursor = messages.find(
        {"conversation_id": convo_object_id}
    ).sort("timestamp", -1).limit(WINDOW_LIMIT)
    docs = list(cursor)
    docs.reverse()
    context = []
    system_present = False
    for msg in docs:
        if msg["role"] == "system":
            system_present = True
        context.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    if not system_present:
        context.insert(0, {
            "role": "system",
            "content": SYSTEM_PROMPT_TEMPLATE
        })
    return context
