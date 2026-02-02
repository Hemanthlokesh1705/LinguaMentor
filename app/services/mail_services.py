import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
load_dotenv()


def send_otp_email(email: str, otp: str):

    subject = "LinguaMentor OTP Verification"
    body = f"""
Hello 👋

Your OTP for LinguaMentor signup is:

👉 {otp}

This OTP is valid for 5 minutes.

If you did not request this, please ignore this email.

Regards,
LinguaMentor Team
"""

    msg = MIMEMultipart()
    msg["From"] =os.getenv("EMAIL_ADDRESS") 
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(os.getenv("EMAIL_HOST"),os.getenv("EMAIL_PORT"))
        server.starttls()

        server.login(os.getenv("EMAIL_ADDRESS") , os.getenv("EMAIL_PASSWORD"))

        server.send_message(msg)

        server.quit()

        print("OTP email sent successfully")

    except Exception as e:
        print("Email sending failed:", e)
        raise RuntimeError("Failed to send OTP email")
