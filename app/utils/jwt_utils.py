import jwt
from jwt import ExpiredSignatureError,InvalidTokenError
from app.core.config import TOKEN_EXPIRATION_MINUTES,JWT_ALGORITHM
from dotenv import load_dotenv
from datetime import datetime,timedelta,timezone
import os
load_dotenv()
def create_token(user_id:str):
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY missing")
    now=datetime.now(timezone.utc)
    payload={
        "user_id": user_id,
        "iat": now,
        "exp":now + timedelta(minutes=TOKEN_EXPIRATION_MINUTES)
    }
    token=jwt.encode(
        payload,
        secret,
        algorithm=JWT_ALGORITHM
    )
    return token
def verify_token(token:str):
    try:
        payload=jwt.decode(
            token,
            os.getenv("JWT_SECRET_KEY"),
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except ExpiredSignatureError:
        raise ValueError("Token Expired")
    except InvalidTokenError:
        raise ValueError("Invaild token")
