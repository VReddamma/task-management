import logging
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repository import (
    get_all_users as repository_get_all_users,
    get_user_by_id as repository_get_user_by_id,
)

logger = logging.getLogger(__name__)


async def get_all_users_service(db: AsyncSession):
    logger.info("Fetching all users")
    return await repository_get_all_users(db)


async def get_user_by_id_service(db: AsyncSession, user_id: str):
    logger.info("Fetching user: %s", user_id)
    return await repository_get_user_by_id(db, user_id)
