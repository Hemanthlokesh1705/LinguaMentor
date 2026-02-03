from app.core.database import conversations
from app.utils.jwt_utils import verify_token
from bson import ObjectId
def get_active_chat(token:str):
    payload=verify_token(token)
    user_id=payload["user_id"]
    return conversations.find_one({
        "user_id":ObjectId(user_id),
        "active":True
    })