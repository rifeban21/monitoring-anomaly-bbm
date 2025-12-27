from pydantic import BaseModel

class LocationBase(BaseModel):
    name: str
    type: str
    region: str


class LocationCreate(LocationBase):
    pass


class LocationOut(LocationBase):
    id: int

    class Config:
        from_attributes = True
