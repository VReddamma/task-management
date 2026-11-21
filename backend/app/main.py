from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

# DB
from app.db.database import get_db

# Routers
from app.routers import tasks
from app.routers import users
from app.routers import dashboard

# Exceptions and Exception Handlers
from app.core.exceptions import AppException
from app.core.exception_handlers import (
    app_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler,
)

# Exception Handling
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# CORS - Middleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TaskFlow API", description="Task Management System API", version="1.0.0"
)
# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REgistering handlers
app.add_exception_handler(AppException, app_exception_handler)

app.add_exception_handler(StarletteHTTPException, http_exception_handler)

app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.add_exception_handler(Exception, general_exception_handler)

# Register all routers
app.include_router(tasks.router)
app.include_router(users.router)
app.include_router(dashboard.router)


@app.get("/")
async def root():
    return {"message": "Welcome to TaskFlow API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/db-check")
async def database_check(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("Select 1"))
    value = result.scalar_one()
    return {"database": "Connected", "data": value}


app.add_exception_handler(AppException, app_exception_handler)

app.add_exception_handler(StarletteHTTPException, http_exception_handler)

app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.add_exception_handler(Exception, general_exception_handler)
