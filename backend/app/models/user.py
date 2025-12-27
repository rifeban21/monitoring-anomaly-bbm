from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base
from app.models.base import TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(70), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String(20), nullable=False)
    is_active = Column(Boolean, default=True)

    refresh_token = Column(String, nullable=True)
