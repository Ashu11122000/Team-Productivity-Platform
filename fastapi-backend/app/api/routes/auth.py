from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import (UserCreate, UserLogin, UserResponse)
from app.services.user_service import (create_user, get_user_by_email) 
from app.core.security import (verify_password, create_access_token)
from app.api.deps import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="""
    Created a new user account.
    
    Roles supported:
    - MEMBER (default)
    - ADMIN (future support)
    
    Authentication is managed by FastAPI and shared with NestJS
    through a common JWT strategy.
    """,
    
)
def register( user: UserCreate, db: Session = Depends(get_db)):
    existing_user=get_user_by_email(db, user.email)
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="User already exists!"
        )
        
    new_user = create_user(
        db=db,
        email=user.email,
        password=user.password
    )
    
    return {
        "success": True,
        "message": "User Registered Successfully",
        "data": {
            "user_id": new_user.id,
            "email": new_user.email,
            "role": new_user.role
        },
    }
    
@router.post(
    "/login",
    summary="Login User",
    description="""
    Authenticates a user and returns a JWT token.
        
    The same JWT is used by:
    - FastAPI
    - NestJS
        
    This enables Single Sign-On (SSO)-style authentication
    across both backend services.
    """
)
def login( user: UserLogin, db:Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )
    
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(
        {
            "sub": str(db.user.id),
            "email": db_user.email,
            "role": db_user.role
        }
    )
    
    return {
        "success": True,
        "message": "Login Successful", 
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "email": db_user.email,
                "role": db_user.role,
            },
        },
    }
    
@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user",
    description="""
    Returns currently authenticated user information.
    
    Used by:
    - Next.js frontend
    - Role-based UI rendering
    - Profile pages
    - Permission checks
    """,
)
def get_me(current_user = Depends(get_current_user)):
    return current_user