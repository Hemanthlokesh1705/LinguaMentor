from app.core.database import conversations, messages
from app.utils.jwt_utils import verify_token
from datetime import datetime, timezone, date
from bson import ObjectId
from app.models.system_prompt_template import SYSTEM_PROMPT_TEMPLATE
def create_newchat(token: str, title: str = "New Chat"):
    try:
        payload = verify_token(token)
        user_id = payload["user_id"]
        user_object_id = ObjectId(user_id)
        conversations.update_many(
            {"user_id": user_object_id, "active": True},
            {"$set": {"active": False}}
        )
        now = datetime.now(timezone.utc)
        chat = {
            "user_id": user_object_id,
            "active": True,
            "message_count": 0,
            "title": title,
            "created_at": now,
            "updated_at": now
        }
        result = conversations.insert_one(chat)
        conversation_id = result.inserted_id
        messages.insert_one({
            "conversation_id": conversation_id,
            "role": "system",
            "content": SYSTEM_PROMPT_TEMPLATE,
            "timestamp": now
        })
        return str(conversation_id)

    except Exception as e:
        raise RuntimeError(f"Error creating conversation: {e}")
