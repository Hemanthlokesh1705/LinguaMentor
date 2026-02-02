from app.core.database import conversations
from bson import ObjectId
from app.utils.jwt_utils import verify_token
from app.core.config import MAX_MESSAGES
def make_conversation_active(token: str, conversation_id: str):
    try:
        payload = verify_token(token)
        user_object_id = ObjectId(payload["user_id"])
        convo_object_id = ObjectId(conversation_id)
        conversation = conversations.find_one({
            "_id": convo_object_id,
            "user_id": user_object_id
        })
        if not conversation:
            raise ValueError("Conversation not found")
        if conversation["message_count"] >= MAX_MESSAGES:
            raise ValueError("Conversation is full. Start a new chat.")
        conversations.update_many(
            {"user_id": user_object_id, "active": True},
            {"$set": {"active": False}}
        )
        conversations.update_one(
            {"_id": convo_object_id},
            {"$set": {"active": True}}
        )

        return True

    except Exception as e:
        raise RuntimeError(f"Failed to activate conversation: {e}")
