from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from bson.errors import InvalidId
from app.services.chat_creation import create_newchat
from app.dependencies.auth_dependency import get_current_user
from app.services.message_builder import chat_builder
from app.core.database import conversations, messages
from app.services.delete_chat import delete_conversation
router = APIRouter(prefix="/chat", tags=["Chats"])
class ChatRequest(BaseModel):
    message: str
def validate_object_id(id: str):
    try:
        return ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid conversation ID")
@router.post("/new")
def create_new_chat(user_id: str = Depends(get_current_user)):
    conversation_id = create_newchat(user_id)
    return {
        "conversation_id": conversation_id,
        "message": "New chat created successfully"
    }
@router.post("/{conversation_id}/send")
def send_message(
        conversation_id: str,
        data: ChatRequest,
        user_id: str = Depends(get_current_user)
):
    convo_id = validate_object_id(conversation_id)
    conv = conversations.find_one({
        "_id": convo_id,
        "user_id": ObjectId(user_id)
    })
    if not conv:
        raise HTTPException(status_code=403, detail="Unauthorized chat access")
    reply = chat_builder(
        conversation_id=conversation_id,
        user_input=data.message
    )
    return {
        "conversation_id": conversation_id,
        "reply": reply
    }
@router.get("/list")
def list_all_conversations(user_id: str = Depends(get_current_user)):
    chats = conversations.find(
        {"user_id": ObjectId(user_id)}
    ).sort("updated_at", -1)
    result = [{
        "conversation_id": str(chat["_id"]),
        "title": chat.get("title"),
        "updated_at": chat.get("updated_at")
    } for chat in chats]
    return result
@router.get("/{conversation_id}")
def load_chat(conversation_id: str, user_id: str = Depends(get_current_user)):
    convo_id = validate_object_id(conversation_id)
    conv = conversations.find_one({
        "_id": convo_id,
        "user_id": ObjectId(user_id)
    })
    if not conv:
        print(f"DEBUG: 403 Error - Chat not found for user. ConvoID: {conversation_id}, UserID: {user_id}")
        raise HTTPException(status_code=403, detail="Unauthorized chat")
    cursor = messages.find(
        {
            "conversation_id": convo_id,
            "role": {"$ne": "system"}
        }
    ).sort("timestamp", 1)
    chat_messages = [{
        "role": msg["role"],
        "content": msg["content"],
        "time": msg["timestamp"]
    } for msg in cursor]
    return {
        "conversation_id": conversation_id,
        "title": conv["title"],
        "messages": chat_messages
    }
@router.delete("/{conversation_id}")
def delete_user_chat(conversation_id: str, user_id: str = Depends(get_current_user)):
    convo_id = validate_object_id(conversation_id)
    conv = conversations.find_one({
        "_id": convo_id,
        "user_id": ObjectId(user_id)
    })
    if not conv:
        raise HTTPException(status_code=403, detail="Unauthorized chat access")
    delete_conversation(conversation_id, user_id)
    return {"message": "Conversation deleted successfully"}
