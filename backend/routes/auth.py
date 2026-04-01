from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import UserCreate, UserLogin, UserOut, Token
from controllers import auth as auth_controller
from utils.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user in the system"""
    return auth_controller.create_user(db=db, user=user)

@router.post("/login", response_model=Token)
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Authenticate user and return JWT"""
    db_user = auth_controller.authenticate_user(db, user)
    
    access_token = create_access_token(subject=db_user.email)
    
    # Optional: Set HTTP-Only Cookie for web clients
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=60*60*24*7, # 7 days
        samesite="lax",
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

@router.post("/logout")
def logout(response: Response):
    """Logout by clearing the HTTP-Only cookie"""
    response.delete_cookie("access_token")
    return {"message": "Successfully logged out"}
