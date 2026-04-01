from sqlalchemy.orm import Session
from models import app as app_models
from schemas import app as app_schemas

# ----- Expenses -----
def create_expense(db: Session, expense: app_schemas.ExpenseCreate, user_id: int):
    db_expense = app_models.Expense(**expense.model_dump(), user_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def delete_expense(db: Session, expense_id: int, user_id: int):
    db_expense = db.query(app_models.Expense).filter(app_models.Expense.id == expense_id, app_models.Expense.user_id == user_id).first()
    if db_expense:
        db.delete(db_expense)
        db.commit()
    return db_expense

def get_expenses_by_user(db: Session, user_id: int):
    # Retrieve chronologically backwards
    return db.query(app_models.Expense).filter(app_models.Expense.user_id == user_id).order_by(app_models.Expense.id.desc()).all()

# ----- TimeLogs -----
def create_timelog(db: Session, log: app_schemas.TimeLogCreate, user_id: int):
    db_log = app_models.TimeLog(**log.model_dump(), user_id=user_id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def delete_timelog(db: Session, log_id: int, user_id: int):
    db_log = db.query(app_models.TimeLog).filter(app_models.TimeLog.id == log_id, app_models.TimeLog.user_id == user_id).first()
    if db_log:
        db.delete(db_log)
        db.commit()
    return db_log

def get_timelogs_by_user(db: Session, user_id: int):
    return db.query(app_models.TimeLog).filter(app_models.TimeLog.user_id == user_id).order_by(app_models.TimeLog.id.desc()).all()

# ----- Settings -----
def upsert_settings(db: Session, settings: app_schemas.UserSettingsUpdate, user_id: int):
    db_settings = db.query(app_models.UserSettings).filter(app_models.UserSettings.user_id == user_id).first()
    if db_settings:
        for key, value in settings.model_dump().items():
            setattr(db_settings, key, value)
    else:
        db_settings = app_models.UserSettings(**settings.model_dump(), user_id=user_id)
        db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings

def get_settings(db: Session, user_id: int):
    return db.query(app_models.UserSettings).filter(app_models.UserSettings.user_id == user_id).first()

# ----- Stats -----
def upsert_stats(db: Session, stats: app_schemas.UserStatsUpdate, user_id: int):
    db_stats = db.query(app_models.UserStats).filter(app_models.UserStats.user_id == user_id).first()
    if db_stats:
        for key, value in stats.model_dump().items():
            setattr(db_stats, key, value)
    else:
        db_stats = app_models.UserStats(**stats.model_dump(), user_id=user_id)
        db.add(db_stats)
    db.commit()
    db.refresh(db_stats)
    return db_stats

def get_stats(db: Session, user_id: int):
    return db.query(app_models.UserStats).filter(app_models.UserStats.user_id == user_id).first()

# ----- Reminders -----
def create_reminder(db: Session, reminder: app_schemas.TaskReminderCreate, user_id: int):
    db_rem = app_models.TaskReminder(**reminder.model_dump(), user_id=user_id)
    db.add(db_rem)
    db.commit()
    db.refresh(db_rem)
    return db_rem

def delete_reminder(db: Session, reminder_id: int, user_id: int):
    db_rem = db.query(app_models.TaskReminder).filter(app_models.TaskReminder.id == reminder_id, app_models.TaskReminder.user_id == user_id).first()
    if db_rem:
        db.delete(db_rem)
        db.commit()
    return db_rem

def get_reminders_by_user(db: Session, user_id: int):
    return db.query(app_models.TaskReminder).filter(app_models.TaskReminder.user_id == user_id).order_by(app_models.TaskReminder.time.asc()).all()
