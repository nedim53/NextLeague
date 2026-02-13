import stripe
from sqlmodel import Session
from fastapi import HTTPException, Request
from auth.jwt_utils import decode_access_token
from repositories.vip_repository import update_user_type


def handle_confirm_purchase(request: Request, session: Session, session_id: str):
    try:
        # Dohvatanje checkout sesije s ekspandiranim line_items
        checkout_session = stripe.checkout.Session.retrieve(
            session_id,
            expand=["line_items.data.price"]
        )

        token = request.cookies.get("access_token")
        payload = decode_access_token(token)
        user_id_str = payload.get("id")
        user_id = int(user_id_str)

        line_items = checkout_session.get("line_items", {}).get("data", [])

        if not line_items:
            raise HTTPException(status_code=400, detail="No line items found in the Stripe session.")

        price_id = line_items[0]["price"]["id"]

        # Razlikujemo pakete po price_id
        if price_id == "price_1RPq6YQbnCtu5rm4fQEj3Unx":  
            user_type = 2
        elif price_id == "price_1RPqGOQbnCtu5rm4KrVrLTjM":  
            user_type = 3
        else:
            user_type = 1 

        update_user_type(session, user_id, user_type)

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
