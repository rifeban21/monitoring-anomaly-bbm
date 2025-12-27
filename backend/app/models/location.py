from sqlalchemy import Column, Integer, String
from app.core.database import Base
from app.models.base import TimestampMixin

class Location(Base, TimestampMixin):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    region = Column(String(100), nullable=False)
