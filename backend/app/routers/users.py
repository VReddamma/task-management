from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.schemas.user import UserResponse
from app.services.user_service import get_all_users_service, get_user_by_id_service

router = APIRouter(prefix="/api/v1/users", tags=["Users"])


@router.get("", response_model=list[UserResponse])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    return await get_all_users_service(db)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: UUID, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_id_service(db, str(user_id))

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user
