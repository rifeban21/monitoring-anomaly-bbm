from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.location import Location


async def get_all_locations(
    db: AsyncSession,
    search: str | None = None
):
    stmt = select(Location)
    if search:
        stmt = stmt.where(Location.name.ilike(f"%{search}%"))

    result = await db.execute(stmt)
    return result.scalars().all()


async def get_location_by_id(
    db: AsyncSession,
    location_id: int
):
    result = await db.execute(
        select(Location).where(Location.id == location_id)
    )
    return result.scalar_one_or_none()


async def create_location(
    db: AsyncSession,
    data
):
    location = Location(**data.dict())
    db.add(location)
    await db.commit()
    await db.refresh(location)
    return location


async def update_location(
    db: AsyncSession,
    location: Location,
    data
):
    for field, value in data.dict().items():
        setattr(location, field, value)

    await db.commit()
    await db.refresh(location)
    return location


async def delete_location(
    db: AsyncSession,
    location: Location
):
    await db.delete(location)
    await db.commit()
