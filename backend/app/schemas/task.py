from datetime import date
from uuid import UUID
from typing import Optional, Literal

from pydantic import BaseModel, Field, ConfigDict


class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: Optional[str] = None

    status: Literal["Pending", "In Progress", "In Review", "Completed"] = "Pending"

    priority: Literal["Low", "Medium", "High"] = "Medium"

    estimated_hours: Optional[int] = Field(default=None, ge=1)

    due_date: date
    assignee_id: UUID


class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    status: str
    priority: str
    estimated_hours: Optional[int]
    due_date: date
    assignee_id: UUID

    model_config = ConfigDict(from_attributes=True)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3, max_length=200)

    description: Optional[str] = None

    status: Optional[Literal["Pending", "In Progress", "In Review", "Completed"]] = None

    priority: Optional[Literal["Low", "Medium", "High"]] = None

    estimated_hours: Optional[int] = Field(default=None, ge=1)

    due_date: Optional[date] = None
    assignee_id: Optional[UUID] = None


# For filter,search,pagination,sorting
class TaskListResponse(BaseModel):
    items: list[TaskResponse]
    total: int
    page: int
    limit: int
    total_pages: int
