import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from controllers.auth_controller import router as auth_router
from controllers.user_controller import router as user_router
from controllers.league_controller import router as league_router
from controllers.team_controller import router as team_router
from controllers.homepage import router as homepage_router
from controllers.vip_controller import router as vip_router
from controllers import request_controller as request_router
from controllers.statistic_controller import router as statistics_router

# Load .env only locally (optional)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Stripe
import stripe
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

app = FastAPI()

# ----------------------------
# CORS (IMPORTANT for cookies)
# ----------------------------
# Put your frontend origins here.
# You can set FRONTEND_URL on Render like:
# FRONTEND_URL=https://nextleague-1.onrender.com
#
# Or multiple:
# FRONTEND_URL=https://nextleague-1.onrender.com,http://localhost:3000

default_origins = [
    "http://localhost:3000",
    "https://nextleague-1.onrender.com",
]

extra_origins = [o.strip().rstrip("/") for o in env_origins.split(",") if o.strip()]



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nextleague-1.onrender.com",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Static files
# ----------------------------
profile_pics_dir = os.path.join("users", "profile_pictures")
team_images_dir = os.path.join("images", "team")

os.makedirs(profile_pics_dir, exist_ok=True)
os.makedirs(team_images_dir, exist_ok=True)

app.mount("/users/profile_pictures", StaticFiles(directory=profile_pics_dir), name="profile_pictures")
app.mount("/images/team", StaticFiles(directory=team_images_dir), name="team_images")

# ----------------------------
# Routers
# ----------------------------
app.include_router(auth_router)
app.include_router(league_router)
app.include_router(team_router)
app.include_router(homepage_router)
app.include_router(user_router)
app.include_router(vip_router)
app.include_router(request_router.router)
app.include_router(statistics_router)