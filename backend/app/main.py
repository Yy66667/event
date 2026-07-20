from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import ai, leads, public, vendors
from app.core.config import settings
from app.core.database import close_database_connection
from app.seed import seed_database

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(_: FastAPI):
    await seed_database()
    yield
    await close_database_connection()


def create_app() -> FastAPI:
    app = FastAPI(title="SAMBARAM Events API", version="1.0.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(public.router)
    app.include_router(ai.router)
    app.include_router(leads.router)
    app.include_router(vendors.router)
    return app


app = create_app()
