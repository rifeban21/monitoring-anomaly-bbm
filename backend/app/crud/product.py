from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.product import Product


async def get_all_products(
    db: AsyncSession,
    search: str | None = None
):
    stmt = select(Product)
    if search:
        stmt = stmt.where(Product.name.ilike(f"%{search}%"))

    result = await db.execute(stmt)
    return result.scalars().all()


async def get_product_by_id(
    db: AsyncSession,
    product_id: int
):
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    return result.scalar_one_or_none()


async def create_product(
    db: AsyncSession,
    data
):
    product = Product(**data.dict())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def update_product(
    db: AsyncSession,
    product: Product,
    data
):
    for field, value in data.dict().items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)
    return product


async def delete_product(
    db: AsyncSession,
    product: Product
):
    await db.delete(product)
    await db.commit()
