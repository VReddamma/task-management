from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate
from app.repositories.task_repository import (
    get_user_by_id,
    create_task,
    get_all_tasks as repository_get_all_tasks,
    get_task_by_id as repository_get_task_by_id,
    update_task as repository_update_task,
    delete_task as repository_delete_task,
    update_task_status as repository_update_task_status,
)

# logging
import logging

logger = logging.getLogger(__name__)


async def create_task_service(db: AsyncSession, task_data: TaskCreate):
    logger.info("Creating a new task")
    # 1. Get assigned user through repository
    assignee = await get_user_by_id(db, str(task_data.assignee_id))

    # 2. Apply business rule
    if assignee is None:
        return None

    # 3. Create task object
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        estimated_hours=task_data.estimated_hours,
        due_date=task_data.due_date,
        assignee_id=str(assignee.id),
        created_by=str(assignee.id),
    )

    # 4. Save through repository
    return await create_task(db, new_task)


async def get_all_tasks_service(
    db: AsyncSession,
    search: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10,
):
    tasks, total = await repository_get_all_tasks(
        db=db,
        search=search,
        status=status,
        priority=priority,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )

    total_pages = (total + limit - 1) // limit

    return {
        "items": tasks,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


async def get_task_by_id_service(db: AsyncSession, task_id: str):
    return await repository_get_task_by_id(db=db, task_id=task_id)


async def update_task_service(db: AsyncSession, task_id: str, update_data: dict):
    logger.info("Updating task: %s", task_id)
    # 1. Find existing task
    task = await repository_get_task_by_id(db=db, task_id=task_id)

    if task is None:
        return None

    # 2. Validate assignee if changed
    if "assignee_id" in update_data:
        assignee_id = update_data["assignee_id"]

        if assignee_id is None:
            return None

        assignee = await get_user_by_id(db, str(assignee_id))

        if assignee is None:
            return None

        update_data["assignee_id"] = str(assignee.id)

    # 3. Update through repository
    return await repository_update_task(db, task, update_data)


async def delete_task_service(db: AsyncSession, task_id: str):
    logger.info("Deleting task: %s", task_id)
    task = await repository_get_task_by_id(db=db, task_id=task_id)

    if task is None:
        return False

    await repository_delete_task(db, task)

    return True


async def update_task_status_service(db: AsyncSession, task_id: str, new_status: str):
    task = await repository_get_task_by_id(db=db, task_id=task_id)

    if task is None:
        return None

    return await repository_update_task_status(db, task, new_status)
