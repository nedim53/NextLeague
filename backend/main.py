import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.user_controller import router as user_router
from controllers.league_controller import router as league_router
from controllers.team_controller import router as team_router
from controllers.auth_controller import router as auth_router
from controllers.homepage import router as homepage_router
from controllers import request_controller as request_router
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi import APIRouter
from fastapi import Request
from controllers.vip_controller import router as vip_router
from fastapi.staticfiles import StaticFiles
from controllers.statistic_controller import router as statistics_router

# Load .env file only for local development (optional)
# In production, Render will provide environment variables directly
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not installed, rely on environment variables

# Initialize Stripe API key at startup
import stripe
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

# Get frontend URL from environment, default to localhost for dev
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# Render frontend URL (deployed Next.js app)
RENDER_FRONTEND_URL = "https://nextleague-1.onrender.com"

app = FastAPI() 

# Configure CORS
# Allow env-based frontend URL, Render URL and localhost for local dev
allowed_origins = set()
allowed_origins.add(FRONTEND_URL.rstrip("/"))
allowed_origins.add("http://localhost:3000")
allowed_origins.add(RENDER_FRONTEND_URL.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve profile pictures statically
app.mount("/users/profile_pictures", StaticFiles(directory="users/profile_pictures"), name="profile_pictures")
app.mount("/images/team", StaticFiles(directory="images/team"), name="team_images")

# Include routers

  
 
app.include_router(auth_router)
app.include_router(league_router)  
app.include_router(team_router)  
app.include_router(homepage_router)
app.include_router(user_router)
app.include_router(vip_router)   
app.include_router(request_router.router)
app.include_router(statistics_router)