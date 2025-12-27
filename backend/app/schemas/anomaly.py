from pydantic import BaseModel
from datetime import date
from typing import List, Optional


class AnomalyOut(BaseModel):
    transaction_id: int
    date: date

    location_name: str
    product_name: str
    volume: float
    baseline: Optional[float] = None

    risk_score: int
    status: str
    reasons: List[str]

class AnomalyCreate(BaseModel):
    date: date
    location_id: int
    product_id: int
    volume: float
    note: Optional[str] = None

