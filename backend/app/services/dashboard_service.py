from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.dashboard_repository import get_dashboard_stats

# logging
import logging

logger = logging.getLogger(__name__)


async def get_dashboard_stats_service(db: AsyncSession):
    stats = await get_dashboard_stats(db)

    return {
        "total_tasks": stats.total_tasks or 0,
        "pending_tasks": stats.pending_tasks or 0,
        "in_progress_tasks": stats.in_progress_tasks or 0,
        "in_review_tasks": stats.in_review_tasks or 0,
        "completed_tasks": stats.completed_tasks or 0,
        "overdue_tasks": stats.overdue_tasks or 0,
    }
