from app.core.database import users
from app.utils.jwt_utils import verify_token
from bson import ObjectId
def get_user_name(token:str):
    payload=verify_token(token)
    result=users.find_one({"_id":ObjectId(payload["user_id"])})
    user_name=result["username"]
    return user_name
print(get_user_name("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjk3ZjkwZGUxMjZlNjVjODAzZGYyYzZjIiwiaWF0IjoxNzcwMTAxODI1LCJleHAiOjE3NzAxMDU0MjV9.KUA4wHb_kXo1FQa2zwP3bZInEgeEuW5iWcSXgARs7z4"))
