from fastapi import APIRouter,HTTPException
from pydantic import BaseModel,EmailStr
from app.services.auth_signup import Signup
from app.services.auth_signin import SignIn
router=APIRouter(prefix="/auth",tags=["Authentication"])
class SignUpRequest(BaseModel):
    email:EmailStr
    username:str
    password:str
class VerifyOtpRequst(BaseModel):
    email:EmailStr
    otp:str
class SignInRequest(BaseModel):
    email:EmailStr
    password:str
@router.post("/signup")
def signup_user(data:SignUpRequest):
    try:
        signup=Signup(
            email=data.email,
            username=data.username,
            password=data.password
        )
        signup.signup_request_otp()
        return {"message":"OTP sent successfully!"}
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))
@router.post("/verify-otp")
def verify_user_otp(data:VerifyOtpRequst):
    try:
        signup=Signup(
            email=data.email,
            username="",
            password=""
        )
        signup.signup_verify_otp(data.otp)
        return {"message":"SignUp Successfull"}
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))
@router.post("/login")
def signin_user(data:SignInRequest):
    try:
        login=SignIn(
            email=data.email,
            password=data.password
        )
        token=login.signin()
        return {"token":token,"token_type":"bearer"}
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))   