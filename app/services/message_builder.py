from app.services.context_builder import get_chat_context
from app.models.llamma_core import LinguaMentor
from app.core.database import messages
from bson import ObjectId
from datetime import datetime, timezone
def chat_builder(conversation_id: str, user_input: str):
    convo_id = ObjectId(conversation_id)
    total_messages = messages.count_documents({
        "conversation_id": convo_id,
        "role": {"$ne": "system"}   
    })

    if total_messages >= 50:
        return "Your message limit has been exceeded. Please open a new chat."

    context = get_chat_context(conversation_id)
    context.append({
        "role": "user",
        "content": user_input
    })
    now = datetime.now(timezone.utc)
    messages.insert_one({
        "conversation_id": convo_id,
        "role": "user",
        "content": user_input,
        "timestamp": now
    })
    model = LinguaMentor()
    response = model.generate_reply(context)
    messages.insert_one({
        "conversation_id": convo_id,
        "role": "assistant",
        "content": response,
        "timestamp": now
    })

    return response
