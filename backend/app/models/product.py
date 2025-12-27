from sqlalchemy import Column, Integer, String
from app.core.database import Base
from app.models.base import TimestampMixin

class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    unit = Column(String(20), nullable=False)
