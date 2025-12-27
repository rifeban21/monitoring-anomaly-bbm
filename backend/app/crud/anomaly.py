from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.models.anomaly import AnomalyResult
from app.models.transaction import Transaction
from app.models.location import Location
from app.models.product import Product


async def get_anomaly_results(
    db: AsyncSession,
    status: str | None = None,
    location_id: int | None = None,
    product_id: int | None = None,
    min_risk: int = 0
):
    stmt = (
        select(
            AnomalyResult.transaction_id,
            Transaction.date,
            Location.name.label("location_name"),
            Product.name.label("product_name"),
            Transaction.volume,
            AnomalyResult.baseline,
            AnomalyResult.risk_score,
            AnomalyResult.status,
            AnomalyResult.reasons,
        )
        .join(Transaction, Transaction.id == AnomalyResult.transaction_id)
        .join(Location, Location.id == Transaction.location_id)
        .join(Product, Product.id == Transaction.product_id)
        .order_by(desc(AnomalyResult.risk_score))
    )

    if status:
        stmt = stmt.where(AnomalyResult.status == status)

    if location_id:
        stmt = stmt.where(Transaction.location_id == location_id)

    if product_id:
        stmt = stmt.where(Transaction.product_id == product_id)

    if min_risk > 0:
        stmt = stmt.where(AnomalyResult.risk_score >= min_risk)

    result = await db.execute(stmt)

    # mapping Row → dict
    rows = result.all()

    items = [
        {
            "transaction_id": r.transaction_id,
            "date": r.date,
            "location_name": r.location_name,
            "product_name": r.product_name,
            "volume": r.volume,
            "baseline": r.baseline,
            "risk_score": r.risk_score,
            "status": r.status,
            "reasons": r.reasons,
        }
        for r in rows
    ]

    return items


async def get_anomaly_by_transaction_id(db: AsyncSession, trx_id: int):
    stmt = (
        select(
            AnomalyResult.transaction_id,
            Transaction.date,
            Location.name.label("location_name"),
            Product.name.label("product_name"),
            Transaction.volume,
            AnomalyResult.baseline,
            AnomalyResult.risk_score,
            AnomalyResult.status,
            AnomalyResult.reasons,
        )
        .join(Transaction, Transaction.id == AnomalyResult.transaction_id)
        .join(Location, Location.id == Transaction.location_id)
        .join(Product, Product.id == Transaction.product_id)
        .where(AnomalyResult.transaction_id == trx_id)
    )

    result = await db.execute(stmt)
    r = result.first()
    if not r:
        return None
    return {
        "transaction_id": r.transaction_id,
        "date": r.date,
        "location_name": r.location_name,
        "product_name": r.product_name,
        "volume": r.volume,
        "baseline": r.baseline,
        "risk_score": r.risk_score,
        "status": r.status,
        "reasons": r.reasons,
    }

