from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Float
from app.core.database import Base
from app.models.base import TimestampMixin

class AnomalyResult(Base, TimestampMixin):
    __tablename__ = "anomaly_results"

    id = Column(Integer, primary_key=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=False)


    baseline = Column(Float, nullable=True)
    risk_score = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False)
    reasons = Column(JSON, nullable=False)

