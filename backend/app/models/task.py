import uuid

from datetime import date, datetime

from sqlalchemy import (
    String,
    Text,
    Date,
    DateTime,
    ForeignKey,
    CheckConstraint,
    Index,
    func,
    Integer,
)

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Task(Base):

    __tablename__ = "tasks"

    __table_args__ = (
        CheckConstraint(
            "status IN ('Pending', 'In Progress', 'In Review', 'Completed')",
            name="chk_task_status",
        ),
        CheckConstraint(
            "priority IN ('Low', 'Medium', 'High')", name="chk_task_priority"
        ),
        Index("idx_task_status", "status"),
        Index("idx_task_priority", "priority"),
        Index("idx_task_due_date", "due_date"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # newly added - for alembic
    estimated_hours: Mapped[int | None] = mapped_column(Integer, nullable=True)

    status: Mapped[str] = mapped_column(
        String(20), default="Pending", nullable=False, index=True
    )

    priority: Mapped[str] = mapped_column(
        String(20), default="Medium", nullable=False, index=True
    )

    due_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)

    assignee_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    created_by: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    assignee: Mapped["User"] = relationship(
        back_populates="assigned_tasks", foreign_keys=[assignee_id]
    )

    creator: Mapped["User"] = relationship(
        back_populates="created_tasks", foreign_keys=[created_by]
    )
