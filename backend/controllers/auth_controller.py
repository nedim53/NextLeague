from fastapi import APIRouter, Response, HTTPException, Request, Depends
from typing import Annotated, List
from sqlmodel import Session

from models.user_model import User
from database.database import engine
from schemas.auth_schema import LoginRequest, RegisterRequest
from services import user_service, auth_service
from auth.jwt_utils import decode_access_token

# -----------------------------------
# Session dependency
# -----------------------------------
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter()


# -----------------------------------
# LOGIN
# -----------------------------------
@router.post("/login")
def login_user(data: LoginRequest, response: Response, session: Session = Depends(get_session)):
    try:
        result = auth_service.login_user(data, session)
        token = result.get("access_token")
        if not token:
            raise HTTPException(status_code=400, detail="Token not generated")

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
        )
        return {"message": "Login successful"}
    except HTTPException:
        raise
    except Exception as e:
        # ovo će ti pokazati pravi uzrok umjesto "Internal Server Error"
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------
# REGISTER
# -----------------------------------
@router.post("/register")
def register_user(
    data: RegisterRequest,
    session: Session = Depends(get_session)
):
    return auth_service.register_user(data, session)


# -----------------------------------
# GET ALL USERS
# -----------------------------------
@router.get("/getUsers", response_model=List[User])
def get_users(session: Session = Depends(get_session)):
    return user_service.get_users(session)


# -----------------------------------
# GET CURRENT USER FROM COOKIE
# -----------------------------------
@router.get("/user-data")
def get_user_data(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Missing or invalid cookie")

    try:
        payload = decode_access_token(token)
        return {"user_data": payload}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# -----------------------------------
# LOGOUT
# -----------------------------------
@router.post("/logout")
def logout(response: Response):
    """
    Delete cookie correctly (must match SameSite + Secure settings).
    """
    response.delete_cookie(
        key="access_token",
        path="/",
        secure=True,
        samesite="none"
    )
    return {"message": "Logged out"}