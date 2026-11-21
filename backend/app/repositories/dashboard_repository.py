from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case, and_

from app.models.task import Task


async def get_dashboard_stats(db: AsyncSession):

    query = select(
        func.count(Task.id).label("total_tasks"),
        func.sum(case((Task.status == "Pending", 1), else_=0)).label("pending_tasks"),
        func.sum(case((Task.status == "In Progress", 1), else_=0)).label(
            "in_progress_tasks"
        ),
        func.sum(case((Task.status == "In Review", 1), else_=0)).label(
            "in_review_tasks"
        ),
        func.sum(case((Task.status == "Completed", 1), else_=0)).label(
            "completed_tasks"
        ),
        func.sum(
            case(
                (
                    and_(
                        Task.due_date < func.current_date(), Task.status != "Completed"
                    ),
                    1,
                ),
                else_=0,
            )
        ).label("overdue_tasks"),
    )

    result = await db.execute(query)

    return result.one()
