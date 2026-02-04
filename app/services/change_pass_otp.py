from app.core.database import users,email_verifications
from app.utils.security import Security
from datetime import timedelta,datetime
from app.services.mail_services import send_otp_email
security=Security()
def reset_password_request_otp(email):
    user = users.find_one({"email": email})

    if not user:
        return "If email exists, OTP sent"

    otp = security.generate_otp()

    email_verifications.delete_many({"email": email})

    email_verifications.insert_one({
        "email": email,
        "otp_hash": security.hash_otp(otp),
        "expires_at": datetime.utcnow() + timedelta(minutes=5),
        "verified": False,
        "attempts": 0,
        "purpose": "reset",
        "created_at": datetime.utcnow()
    })

    send_otp_email(email, otp)

    return "If email exists, OTP sent"

reset_password_request_otp("hemanthlokesh58@gmail.com")