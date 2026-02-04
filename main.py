from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.chat import router as chat_router
app=FastAPI(
    title="LinguaMentor",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_headers=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_origins=["*"]
)
@app.get("/")
def health_check():
    return {"status":"Linguamentor is running...."}
app.include_router(auth_router)
app.include_router(chat_router)
