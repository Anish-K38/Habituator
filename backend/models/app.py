from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(String(255))
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TimeLog(Base):
    __tablename__ = "timelogs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hours = Column(Float, nullable=False)
    activity = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, index=True)
    currency = Column(String(10), default="₹")
    daily_budget = Column(Float, default=1000.0)
    daily_hours = Column(Float, default=6.0)
    money_weight = Column(Integer, default=50)

class UserStats(Base):
    __tablename__ = "user_stats"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, index=True)
    streak_count = Column(Integer, default=0)
    streak_last_date = Column(Date, nullable=True)
    
    # Achievements booleans
    first_expense = Column(Boolean, default=False)
    budget_saver = Column(Boolean, default=False)
    timemaster = Column(Boolean, default=False)
    streak_week = Column(Boolean, default=False)
    efficient = Column(Boolean, default=False)
    goal_setter = Column(Boolean, default=False)

class TaskReminder(Base):
    __tablename__ = "task_reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    time = Column(String(10), nullable=False) # e.g. "14:30"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
