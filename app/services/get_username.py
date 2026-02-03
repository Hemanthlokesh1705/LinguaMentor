from app.core.database import users
from app.utils.jwt_utils import verify_token
from bson import ObjectId
def get_user_name(token:str):
    payload=verify_token(token)
    result=users.find_one({"_id":ObjectId(payload["user_id"])})
    user_name=result["username"]
    return user_name

