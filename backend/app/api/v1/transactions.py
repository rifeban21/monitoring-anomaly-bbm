from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.core.database import get_db
from app.core.dependencies import (
    require_operator,
    get_current_user
)
from app.schemas.transaction import (
    TransactionCreate,
    TransactionOut,
    TransactionOutPublic
)
from app.crud.transaction import (
    create_transaction,
    get_transactions,
    delete_transaction
)

from app.services.anomaly_detector import run_anomaly_detection


router = APIRouter(prefix="/transactions", tags=["Transactions"])


# Buat transaksi (Operator)
@router.post("/", response_model=TransactionOut)
async def add_transaction(
    data: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_operator)
):
    trx = await create_transaction(db, data)

    await run_anomaly_detection(db, trx)
    return trx

# List transaksi
@router.get("/", response_model=list[TransactionOutPublic])
async def list_transactions(
    location_id: int | None = Query(None),
    product_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
):
    return await get_transactions(
        db,
        location_id=location_id,
        product_id=product_id
    )

@router.delete("/{transaction_id}")
async def delete_transaction_api(
    transaction_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_operator)
):
    await delete_transaction(db, transaction_id)
    return {"message": "deleted"}
