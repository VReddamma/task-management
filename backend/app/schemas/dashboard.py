from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    in_review_tasks: int
    completed_tasks: int
    overdue_tasks: int
