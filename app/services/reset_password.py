from app.core.database import email_verifications,users
from datetime import datetime,timezone
from app.utils.security import Security
security=Security()
def reset_password_verify_otp(email, otp, new_password):
    record = email_verifications.find_one({
        "email": email,
        "verified": False,
        "purpose": "reset"
    })
    if not record:
        raise ValueError("OTP not found")

    if datetime.now(timezone.utc) > record["expires_at"]:
        raise ValueError("OTP expired")

    if record["attempts"] >= 5:
        raise ValueError("Too many attempts")

    if not security.verify_otp(otp, record["otp_hash"]):
        email_verifications.update_one(
            {"_id": record["_id"]},
            {"$inc": {"attempts": 1}}
        )
        raise ValueError("Invalid OTP")

    users.update_one(
        {"email": email},
        {"$set": {"password_hash": security.hash_password(new_password)}}
    )

    email_verifications.delete_one({"_id": record["_id"]})

    print("Password reset successful")
