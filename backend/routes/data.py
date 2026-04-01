from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas import app as app_schemas
from controllers import data as data_controller
from utils.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/data", tags=["Application Data"])

@router.get("/all", response_model=app_schemas.AppDataOut)
def get_all_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch ALL user data (Expenses, Logs, Settings, Stats) at once for fast dashboard hydration"""
    expenses = data_controller.get_expenses_by_user(db, current_user.id)
    timelogs = data_controller.get_timelogs_by_user(db, current_user.id)
    reminders = data_controller.get_reminders_by_user(db, current_user.id)
    settings = data_controller.get_settings(db, current_user.id)
    stats = data_controller.get_stats(db, current_user.id)
    
    return {
        "expenses": expenses,
        "timeLogs": timelogs,
        "reminders": reminders,
        "settings": settings,
        "stats": stats
    }

@router.post("/expenses", response_model=app_schemas.ExpenseOut)
def add_expense(expense: app_schemas.ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return data_controller.create_expense(db, expense, current_user.id)

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deleted = data_controller.delete_expense(db, expense_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Success"}

@router.post("/timelogs", response_model=app_schemas.TimeLogOut)
def add_timelog(log: app_schemas.TimeLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return data_controller.create_timelog(db, log, current_user.id)

@router.delete("/timelogs/{log_id}")
def delete_timelog(log_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deleted = data_controller.delete_timelog(db, log_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Timelog not found")
    return {"message": "Success"}

@router.put("/settings", response_model=app_schemas.UserSettingsOut)
def update_settings(settings: app_schemas.UserSettingsUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return data_controller.upsert_settings(db, settings, current_user.id)

@router.put("/stats", response_model=app_schemas.UserStatsOut)
def update_stats(stats: app_schemas.UserStatsUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return data_controller.upsert_stats(db, stats, current_user.id)

@router.post("/reminders", response_model=app_schemas.TaskReminderOut)
def add_reminder(reminder: app_schemas.TaskReminderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return data_controller.create_reminder(db, reminder, current_user.id)

@router.delete("/reminders/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deleted = data_controller.delete_reminder(db, reminder_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return {"message": "Success"}
