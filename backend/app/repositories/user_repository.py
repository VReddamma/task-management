from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_all_users(db: AsyncSession):
    query = select(User).where(User.is_active.is_(True)).order_by(User.name.asc())

    result = await db.execute(query)

    return result.scalars().all()


async def get_user_by_id(db: AsyncSession, user_id: str):
    result = await db.execute(select(User).where(User.id == user_id))

    return result.scalar_one_or_none()
