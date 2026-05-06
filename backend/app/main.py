from fastapi import FastAPI
from app.middlewares.cors_middleware import setup_cors
from app.routers import transcription_routes

app = FastAPI(
    title="Trascritta AI API",
    version="1.0.0"
)

setup_cors(app)

app.include_router(transcription_routes.router)


@app.get("/")
def home():
    return {
        "success": True,
        "message": "Trascritta AI backend is running"
    }