"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import API_PREFIX, APP_TITLE, APP_VERSION
from app.api.routes_health import router as health_router
from app.api.routes_attacks import router as attacks_router
from app.api.routes_lab import router as lab_router

app = FastAPI(title=APP_TITLE, version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=API_PREFIX)
app.include_router(attacks_router, prefix=API_PREFIX)
app.include_router(lab_router, prefix=API_PREFIX)
