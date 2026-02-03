from datetime import datetime, timedelta,timezone
from app.core.database import email_verifications, users
from app.utils.security import Security
from app.services.mail_services import send_otp_email

security = Security()


class Signup:

    def __init__(self, email: str, username: str, password: str):

        self.email = email
        self.username = username
        self.password = password

        self.password_hash = None
        self.otp = None

    def signup_request_otp(self):

        if users.find_one({"email": self.email}):
            raise ValueError("Email already registered")

        if users.find_one({"username": self.username}):
            raise ValueError("Username already taken")

        self.otp = security.generate_otp()

        email_verifications.delete_many({"email": self.email})

        email_verifications.insert_one({
            "email": self.email,
            "username": self.username,
            "password_hash": security.hash_password(self.password),
            "otp_hash": security.hash_otp(self.otp),
            "expires_at": datetime.now(timezone.utc) + timedelta(minutes=5),
            "verified": False,
            "attempts": 0,
            "created_at": datetime.now(timezone.utc)
        })

        send_otp_email(self.email, self.otp)

        print("OTP sent successfully")

    def signup_verify_otp(self, user_otp: str):

        record = email_verifications.find_one({
            "email": self.email,
            "verified": False
        })

        if not record:
            raise ValueError("OTP not found")

        expires_at = record["expires_at"]

        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > expires_at:
            raise ValueError("OTP expired")


        if record["attempts"] >= 5:
            raise ValueError("Too many attempts")

        if not security.verify_otp(user_otp, record["otp_hash"]):

            email_verifications.update_one(
                {"_id": record["_id"]},
                {"$inc": {"attempts": 1}}
            )

            raise ValueError("Invalid OTP")

        # Create user
        users.insert_one({
            "email": record["email"],
            "username": record["username"],
            "password_hash": record["password_hash"],
            "email_verified": True,
            "created_at": datetime.now(timezone.utc),
            "last_login": None
        })

        # Remove OTP record
        email_verifications.delete_one({"_id": record["_id"]})

        print("Signup successful")


if __name__ == "__main__":

    signup = Signup(
        "1dt23ca014@dsatm.edu.in",
        "Karki",
        "abc@123"
    )

    signup.signup_request_otp()

    entered_otp = input("Enter OTP: ")

    signup.signup_verify_otp(entered_otp)
