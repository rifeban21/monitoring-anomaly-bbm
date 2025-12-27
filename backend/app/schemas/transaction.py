from pydantic import BaseModel, Field
from datetime import date

class TransactionCreate(BaseModel):
    date: date
    location_id: int = Field(gt=0)
    product_id: int = Field(gt=0)
    volume: float = Field(gt=0)
    note: str | None = None


class TransactionOut(BaseModel):
    id: int
    date: date
    location_id: int
    product_id: int
    volume: float
    note: str | None

    class Config:
        from_attributes = True

class TransactionOutPublic(BaseModel):
    id: int
    date: date
    location_id: int
    product_id: int
    location_name: str
    product_name: str
    volume: float
    note: str | None

    class Config:
        from_attributes = True
