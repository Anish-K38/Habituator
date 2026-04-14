from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, data
import models.app # Ensure SQLAlchemy registers the new tables
import os

# Create all database tables
# In production, use Alembic for migrations instead
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HabitTracker API",
    description="Backend for the HabitTracker Application",
    version="1.0.0"
)

# Allow CORS for front-end
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    frontend_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(data.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the HabitTracker API 🚀"}
