from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...models.user import User
from ...schemas.user import UserCreate, UserOut, Token
from ...core.security import verify_password, get_password_hash, create_access_token
from ...core.config import settings
from ..deps import get_current_user

router = APIRouter()

import traceback
import logging

logger = logging.getLogger(__name__)
@router.post(
    "/register", 
    response_model=UserOut,
    summary="Register a new user",
    description="Creates a new user account with an email and password. Also initializes their Carbon Score to zero."
)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"--- BACKEND REGISTER ATTEMPT ---")
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        logger.warning(f"Register failed: Email already registered ({user_in.email})")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    hashed = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed,
        full_name=user_in.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"Register success: User ID {user.id}")
    return user

@router.post(
    "/login", 
    response_model=Token,
    summary="Login via OAuth2",
    description="Authenticates a user and returns a JWT Bearer token for accessing protected routes."
)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info(f"--- BACKEND LOGIN ATTEMPT --- Username requested: {form_data.username}")
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        logger.warning(f"Login failed: User not found ({form_data.username})")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Login failed: Invalid password for user ({form_data.username})")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        user.id, expires_delta=access_token_expires
    )
    logger.info(f"Login success: Token generated for {user.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get(
    "/me", 
    response_model=UserOut,
    summary="Get current user profile",
    description="Returns the profile information of the currently authenticated user based on their JWT token."
)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
