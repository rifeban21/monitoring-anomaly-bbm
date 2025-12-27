from sqlalchemy import Column, Integer, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class BaselineState(Base):
    __tablename__ = "baseline_states"

    id = Column(Integer, primary_key=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    median = Column(Float)
    mad = Column(Float)
    ewma = Column(Float)

    updated_at = Column(DateTime(timezone=True), server_default=func.now())

