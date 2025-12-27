from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.schemas.user import UserCreate, UserOut
from app.crud.user import create_user, get_all_users

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[UserOut])
async def list_users(
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    return await get_all_users(db)

@router.post("/", response_model=UserOut)
async def create_new_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    return await create_user(
        db,
        username=data.username,
        password=data.password,
        role=data.role
    )
