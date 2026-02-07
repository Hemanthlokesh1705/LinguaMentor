from fastapi import APIRouter,HTTPException, Depends
from pydantic import BaseModel,EmailStr
from app.dependencies.auth_dependency import get_current_user
from app.services.auth_signup import Signup
from app.services.auth_signin import SignIn
from app.services.change_pass_otp import reset_password_request_otp
from app.services.reset_password import reset_password_verify_otp
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
class ForgetPassword(BaseModel):
    email:EmailStr
class SetNewPassword(BaseModel):
    email:EmailStr
    otp:str
    newpassword:str
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
@router.post("/forget-password")
def forget_password_request(data:ForgetPassword):
    try:
        reset_password_request_otp(data.email)
        return {"message":"Password Change OTP sent succesfully"}
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))  
@router.post("/change-password")
def set_new_password(data:SetNewPassword):
    try:
        reset_password_verify_otp(data.email,data.otp,data.newpassword)
        return {"message":"password reset is succesfull!"}
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))  
    
@router.get("/me")
def get_current_user_profile(user_id: str = Depends(get_current_user)):
    from app.core.database import users
    from bson import ObjectId
    
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "username": user.get("username", "Learner"),
        "email": user.get("email"),
        "plan": user.get("plan", "Free Plan")
    }
