from app.core.database import conversations
from app.utils.jwt_utils import verify_token
from datetime import datetime,timezone
from bson import ObjectId
def create_newchat(token:str,title:str):
    try:
        payload=verify_token(token)
        user_object_id = ObjectId(payload["user_id"])
        conversations.update_many(
                {"user_id": user_object_id, "active": True},
                {"$set": {"active": False}}
            )
        chat={
            "user_id":user_object_id,
            "active":True,
            "message_count":0,
            "title":title,
            "created_at":datetime.now(timezone.utc),
            "updated_at":datetime.now(timezone.utc)
        }
        result=conversations.insert_one(chat)
        return  str(result.inserted_id)
    except Exception as e:
        raise RuntimeError("Error in creating converstion database")

