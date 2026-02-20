from sqlmodel import Session
from schemas.auth_schema import LoginRequest, RegisterRequest
from repositories import auth_repository
from fastapi import HTTPException, Response
from hashlib import sha256
from models.user_model import User
from datetime import date
from auth.jwt_utils import create_access_token

def login_user(data, session):
    user = auth_repository.get_user_by_email(session, data.email)

    if not user or user.password != sha256(data.password.encode()).hexdigest():
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email
    }

    token = create_access_token(token_data)

    return {"access_token": token}

def register_user(data: RegisterRequest, session: Session):
    existing_user = auth_repository.get_user_by_email(session, data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = sha256(data.password.encode()).hexdigest()

    new_user = User(
        name=data.name,
        surname=data.surname,
        birth_date=data.birth_date,
        email=data.email,
        password=hashed_password,
        phone_number=data.phone_number
    )

    auth_repository.create_user(session, new_user)

    return {"message": "User registered successfully"}

