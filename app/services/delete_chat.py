from app.core.database import conversations, messages
from bson import ObjectId
def delete_conversation( conversation_id: str,user_id:str) -> bool:
    try:
        convo_object_id = ObjectId(conversation_id)
        user_object_id = ObjectId(user_id)
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
