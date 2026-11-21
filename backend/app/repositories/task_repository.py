from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.models.user import User


async def get_user_by_id(db: AsyncSession, user_id: str):
    result = await db.execute(select(User).where(User.id == user_id))

    return result.scalar_one_or_none()


async def create_task(db: AsyncSession, task: Task):
    db.add(task)

    await db.commit()

    await db.refresh(task)

    return task


async def get_all_tasks(
    db: AsyncSession,
    search: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10,
):
    # 1. Build filters
    filters = []

    if search:
        search_term = f"%{search}%"

        filters.append(
            or_(Task.title.ilike(search_term), Task.description.ilike(search_term))
        )

    if status:
        filters.append(Task.status == status)

    if priority:
        filters.append(Task.priority == priority)

    # 2. Count matching tasks
    count_query = select(func.count()).select_from(Task).where(*filters)

    count_result = await db.execute(count_query)
    total = count_result.scalar_one()

    # 3. Get tasks
    query = select(Task).where(*filters)

    # 4. Sort
    sort_column = getattr(Task, sort_by)

    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    # 5. Pagination
    offset = (page - 1) * limit

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    tasks = result.scalars().all()

    return tasks, total


async def get_task_by_id(db: AsyncSession, task_id: str):
    result = await db.execute(select(Task).where(Task.id == task_id))

    return result.scalar_one_or_none()


async def update_task(db: AsyncSession, task: Task, update_data: dict):
    for key, value in update_data.items():
        setattr(task, key, value)

    await db.commit()
    await db.refresh(task)

    return task


async def delete_task(db: AsyncSession, task: Task):
    await db.delete(task)
    await db.commit()


async def update_task_status(db: AsyncSession, task: Task, new_status: str):
    task.status = new_status

    await db.commit()
    await db.refresh(task)

    return task
