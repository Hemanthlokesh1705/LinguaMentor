from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
client=None
db=None
users=None
email_verifications=None
conversations=None
messages=None
def connect_db():
    try:
        global client,db,users,email_verifications,conversations,messages
        client=MongoClient(
            "mongodb://127.0.0.1:27017/",
            serverSelectionTimeoutMS=3000
            )
        client.admin.command("ping")
        db=client["LinguaMentor"]
        users=db["users"]
        conversations=db["conversation"]
        messages=db["messages"]
        email_verifications = db["email_verifications"]
        users.create_index("email",unique=True)
        users.create_index("username",unique=True)
        email_verifications.create_index("email",unique=True)
        print("Database connection is succesfull")
    except ServerSelectionTimeoutError:
        raise RuntimeError("Failed to connect server..")
connect_db()