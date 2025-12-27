from sqlalchemy import Column, Integer, Date, Numeric, ForeignKey, Text
from app.core.database import Base
from app.models.base import TimestampMixin

class Transaction(Base, TimestampMixin):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    volume = Column(Numeric(12, 2), nullable=False)
    note = Column(Text)
