from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.schemas.location import (
    LocationCreate,
    LocationOut
)
from app.crud.location import (
    get_all_locations,
    get_location_by_id,
    create_location,
    update_location,
    delete_location
)

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/", response_model=list[LocationOut])
async def list_locations(
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user)
):
    return await get_all_locations(db, search)


@router.post("/", response_model=LocationOut)
async def add_location(
    data: LocationCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    return await create_location(db, data)


@router.put("/{location_id}", response_model=LocationOut)
async def edit_location(
    location_id: int,
    data: LocationCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    location = await get_location_by_id(db, location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    return await update_location(db, location, data)


@router.delete("/{location_id}")
async def remove_location(
    location_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    location = await get_location_by_id(db, location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    await delete_location(db, location)
    return {"message": "Location deleted"}
