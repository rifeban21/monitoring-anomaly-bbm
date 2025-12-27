from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    unit: str


class ProductCreate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True
