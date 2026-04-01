from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Using SQLite for local development so no installation is required
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:2210@localhost:5432/habittracker")

# check_same_thread=False is needed only for SQLite
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
