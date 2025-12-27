from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from fastapi import HTTPException, status

from app.models.transaction import Transaction
from app.models.location import Location
from app.models.product import Product


async def create_transaction(
    db: AsyncSession,
    data
) -> Transaction:
    trx = Transaction(**data.dict())
    db.add(trx)
    await db.commit()
    await db.refresh(trx)
    return trx


async def get_transactions(
    db: AsyncSession,
    location_id: int | None = None,
    product_id: int | None = None
):
    stmt = (
        select(
            Transaction.id,
            Transaction.date,
            Transaction.location_id,
            Transaction.product_id,
            Location.name.label("location_name"),
            Product.name.label("product_name"),
            Transaction.volume,
            Transaction.note,
        )
        .join(Location, Location.id == Transaction.location_id)
        .join(Product, Product.id == Transaction.product_id)
        .order_by(desc(Transaction.date))
    )

    if location_id:
        stmt = stmt.where(Transaction.location_id == location_id)

    if product_id:
        stmt = stmt.where(Transaction.product_id == product_id)

    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "id": r.id,
            "date": r.date,
            "location_id": r.location_id,
            "product_id": r.product_id,
            "location_name": r.location_name,
            "product_name": r.product_name,
            "volume": r.volume,
            "note": r.note,
        }
        for r in rows
    ]

async def get_transaction_by_id(
    db: AsyncSession,
    trx_id: int
):
    result = await db.execute(
        select(Transaction).where(Transaction.id == trx_id)
    )
    return result.scalar_one_or_none()

async def delete_transaction(db: AsyncSession, transaction_id: int) -> None:
    result = await db.execute(
        select(Transaction).where(Transaction.id == transaction_id)
    )
    trx = result.scalar_one_or_none()

    if not trx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

    await db.delete(trx)
    await db.commit()
