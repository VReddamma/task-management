from app.schemas.task import TaskCreate, TaskUpdate

task = TaskCreate(
    title="Design dashboard",
    priority="High",
    due_date="2026-11-15",
    assignee_id="cee83727-d816-11f1-a371-00fffa50f973",
)

print("CREATE:", task.model_dump())

update = TaskUpdate(status="In Progress")

print("UPDATE:", update.model_dump(exclude_unset=True))
