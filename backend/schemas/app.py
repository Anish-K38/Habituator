from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

# Expense Schemas
class ExpenseBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: date

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseOut(ExpenseBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# TimeLog Schemas
class TimeLogBase(BaseModel):
    hours: float
    activity: str
    date: date

class TimeLogCreate(TimeLogBase):
    pass

class TimeLogOut(TimeLogBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# User Settings Schemas
class UserSettingsBase(BaseModel):
    currency: str
    daily_budget: float
    daily_hours: float
    money_weight: int

class UserSettingsUpdate(UserSettingsBase):
    pass

class UserSettingsOut(UserSettingsBase):
    class Config:
        from_attributes = True

# User Stats & Achievements Schemas
class UserStatsBase(BaseModel):
    streak_count: int
    streak_last_date: Optional[date] = None
    first_expense: bool
    budget_saver: bool
    timemaster: bool
    streak_week: bool
    efficient: bool
    goal_setter: bool

class UserStatsUpdate(UserStatsBase):
    pass

class UserStatsOut(UserStatsBase):
    class Config:
        from_attributes = True

# Task Reminder Schemas
class TaskReminderBase(BaseModel):
    title: str
    time: str

class TaskReminderCreate(TaskReminderBase):
    pass

class TaskReminderOut(TaskReminderBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Mega Payload for Frontend hydration
class AppDataOut(BaseModel):
    expenses: List[ExpenseOut]
    timeLogs: List[TimeLogOut]
    reminders: List[TaskReminderOut] = []
    settings: Optional[UserSettingsOut]
    stats: Optional[UserStatsOut]
