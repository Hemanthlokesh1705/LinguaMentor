from app.core.database import conversations, messages
from bson import ObjectId
from app.services.chat_creation import verify_token
def delete_conversation(token: str, conversation_id: str) -> bool:
    try:
        payload=verify_token(token)
        convo_object_id = ObjectId(conversation_id)
        user_object_id = ObjectId(payload["user_id"])
        result = conversations.delete_one({
            "_id": convo_object_id,
            "user_id": user_object_id
        })
        if result.deleted_count == 0:
            raise ValueError("Conversation not found or access denied")

        messages.delete_many({
            "conversation_id": convo_object_id
        })
        return True
    except Exception as e:
        raise RuntimeError(f"Failed to delete conversation: {e}")
