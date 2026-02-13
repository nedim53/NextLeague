import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database.database import get_session
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.homepage import UserResponse
from schemas.homepage import UserCounts
from pydantic import BaseModel
from services import homepage as user_service
from services import homepage as homepage_service
from database.database import get_session 
from models.league_model import League
from jose import JWTError, jwt
from models.user_model import User
from schemas.homepage import LeagueRead
from schemas.homepage import TeamRead
from repositories.homepage import get_leagues_by_user
from auth.jwt_utils import decode_access_token
from services.homepage import fetch_user_leagues
from services.homepage import fetch_user_teams
from schemas.vip_schema import ConfirmPurchaseSchema
from services.vip_service import handle_confirm_purchase
import stripe

router = APIRouter()

# Get frontend URL from environment, default to localhost for dev
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

@router.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()

    checkout_session = stripe.checkout.Session.create(
        success_url=f"{FRONTEND_URL}/vip/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{FRONTEND_URL}/homepage",
        payment_method_types=["card"],
        mode="subscription",
        line_items=[{
            "price": data["priceId"], 
            "quantity": 1
        }]
    )

    return {"sessionId": checkout_session["id"]}

class SessionVerifyRequest(BaseModel):
    sessionId: str

@router.post("/verify-session")
async def verify_session(data: SessionVerifyRequest):
    try:
        session = stripe.checkout.Session.retrieve(data.sessionId)

        if session.payment_status == "paid":
            return {"valid": True}
        else:
            return {"valid": False}

    except stripe.error.InvalidRequestError:
        raise HTTPException(status_code=400, detail="Nevažeći session ID")


@router.post("/confirm-purchase")
def confirm_purchase( request: Request,
    data: ConfirmPurchaseSchema,
    session: Session = Depends(get_session)):
    
    handle_confirm_purchase(request,session, data.sessionId)
    return {"message": "User type updated successfully"}
