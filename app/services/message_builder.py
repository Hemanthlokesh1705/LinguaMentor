from app.services.context_builder import get_chat_context
from app.models.llamma_core import LinguaMentor
from app.core.database import messages,conversations
from bson import ObjectId
from datetime import datetime, timezone
from app.utils.title_generator import generate_chat_title
from app.core.config import MAX_HISTORY_LENGTH
import re
def chat_builder(conversation_id: str, user_input: str):
    convo_id = ObjectId(conversation_id)
    total_messages = messages.count_documents({
        "conversation_id": convo_id,
        "role": {"$ne": "system"}   
    })
    chat = conversations.find_one({"_id": convo_id})
    if chat["message_count"] >= MAX_HISTORY_LENGTH:
        conversations.update_one({"_id": convo_id},{
            "$set":{"active":False}
        })
        return "Your message limit has been exceeded. Please open a new chat."
    context = get_chat_context(conversation_id)
    context.append({
        "role": "user",
        "content": user_input
    })
    conversations.update_one({"_id":convo_id},{
        "$inc":{"message_count":1}
    })
    messages.insert_one({
        "conversation_id": convo_id,
        "role": "user",
        "content": user_input,
        "timestamp": datetime.now(timezone.utc)
    })
    if chat["message_count"] == 0:
        text=generate_chat_title(user_input)
        conversations.update_one({"_id": convo_id},{
            "$set":{"title":text}
        })
    model = LinguaMentor()
    response = model.generate_reply(context)
    response=re.sub(r'\n+','\n',response)
    messages.insert_one({
        "conversation_id": convo_id,
        "role": "assistant",
        "content": response,
        "timestamp": datetime.now(timezone.utc)
    })
    return response

