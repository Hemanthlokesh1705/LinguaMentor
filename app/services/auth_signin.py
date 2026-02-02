from app.utils.security import Security
from app.core.database import users,email_verifications
from datetime import datetime,timezone
from app.utils.jwt_utils import create_token
security=Security()
class SignIn:
    def __init__(self,email:str, password:str):
        self.email=email
        self.password=password
        self.signin()
    def signin(self):
        user = users.find_one({"email": self.email})

        if not user:
            raise ValueError("Invalid credentials")

        if not user.get("email_verified"):
            raise ValueError("Email not verified")

        if not security.verify_password(self.password, user["password_hash"]):
            raise ValueError("Invalid credentials")

        users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.now(timezone.utc)}}
        )
        token=create_token(str(user["_id"]))
        return token

if __name__=="__main__":
    sign=SignIn("hemanthlokesh58@gmail.com","abc@123")
    print(sign.signin())
  