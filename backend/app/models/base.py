from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class TimestampMixin:
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
