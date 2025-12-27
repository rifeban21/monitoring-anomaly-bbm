from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.schemas.anomaly import AnomalyOut, AnomalyCreate
from app.crud.anomaly import get_anomaly_results, get_anomaly_by_transaction_id
from app.crud.transaction import create_transaction
from app.schemas.transaction import TransactionCreate
from app.services.anomaly_detector import run_anomaly_detection

router = APIRouter(prefix="/anomalies", tags=["Monitoring Anomaly"])

@router.get("/", response_model=list[AnomalyOut])
async def list_anomalies(
    status: str | None = Query(
        None, description="NORMAL | WASPADA | ANOMALI"
    ),
    location_id: int | None = Query(None),
    product_id: int | None = Query(None),
    min_risk: int = Query(0),

    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user)
):
    return await get_anomaly_results(
        db=db,
        status=status,
        location_id=location_id,
        product_id=product_id,
        min_risk=min_risk
    )

@router.post("/", response_model=AnomalyOut)
async def create_anomaly_via_admin(
    data: AnomalyCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    trx_data = TransactionCreate(
        date=data.date,
        location_id=data.location_id,
        product_id=data.product_id,
        volume=data.volume,
        note=data.note,
    )

    trx = await create_transaction(db, trx_data)

    await run_anomaly_detection(db, trx)

    anom = await get_anomaly_by_transaction_id(db, trx.id)
    if not anom:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="No anomaly detected for submitted data")

    return anom
