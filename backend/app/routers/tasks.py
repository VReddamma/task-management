from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from typing import Literal
from fastapi import Query
from app.schemas.task import TaskListResponse

from app.db.database import get_db
from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskUpdate,
    TaskListResponse,
)

# Services
from app.services.task_service import (
    create_task_service,
    get_all_tasks_service,
    get_task_by_id_service,
    update_task_service,
    delete_task_service,
)

# Handling exceptions
from app.core.exceptions import ResourceNotFoundException

from uuid import UUID

router = APIRouter(prefix="/api/v1/tasks", tags=["Tasks"])


# POST - Create task
# Replace service with post router - Create task
@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    new_task = await create_task_service(db=db, task_data=task_data)

    if new_task is None:
        raise HTTPException(status_code=404, detail="Assigned user not found")

    return new_task


# Get all - without pagination, sorting, search, filter
# @router.get("", response_model=list[TaskResponse])
# async def get_all_tasks(db: AsyncSession = Depends(get_db)):
#     # 1. Prepare SELECT query
#     query = select(Task)

#     # 2. Execute query
#     result = await db.execute(query)

#     # 3. Extract all Task objects
#     tasks = result.scalars().all()

#     # 4. Return tasks
#     return tasks

# GET - Get all with Pagination, Filter, Sorting, Search


@router.get("", response_model=TaskListResponse)
async def get_all_tasks(
    search: str | None = Query(default=None, min_length=1, max_length=100),
    status: Literal["Pending", "In Progress", "In Review", "Completed"] | None = None,
    priority: Literal["Low", "Medium", "High"] | None = None,
    sort_by: Literal[
        "created_at", "due_date", "title", "priority", "status"
    ] = "created_at",
    sort_order: Literal["asc", "desc"] = "desc",
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await get_all_tasks_service(
        db=db,
        search=search,
        status=status,
        priority=priority,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )


# GET Task By ID API
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task_by_id(task_id: UUID, db: AsyncSession = Depends(get_db)):
    task = await get_task_by_id_service(db=db, task_id=str(task_id))

    if task is None:
        # raise HTTPException(status_code=404, detail="Task not found")
        raise ResourceNotFoundException("Task not found")

    return task


# PUT - Update task
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID, task_data: TaskUpdate, db: AsyncSession = Depends(get_db)
):
    update_data = task_data.model_dump(exclude_unset=True)

    task = await update_task_service(
        db=db, task_id=str(task_id), update_data=update_data
    )

    if task is None:
        raise HTTPException(status_code=404, detail="Task or assigned user not found")

    return task


# DELETE - Delete task
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: UUID, db: AsyncSession = Depends(get_db)):
    deleted = await delete_task_service(db=db, task_id=str(task_id))

    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")

    return None
