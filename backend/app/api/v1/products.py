from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.product import (
    ProductCreate,
    ProductOut
)
from app.crud.product import (
    get_all_products,
    get_product_by_id,
    create_product,
    update_product,
    delete_product
)
from app.core.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=list[ProductOut])
async def list_products(
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user)
):
    return await get_all_products(db, search)


@router.post("/", response_model=ProductOut)
async def add_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    return await create_product(db, data)


@router.put("/{product_id}", response_model=ProductOut)
async def edit_product(
    product_id: int,
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    product = await get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return await update_product(db, product, data)


@router.delete("/{product_id}")
async def remove_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin)
):
    product = await get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await delete_product(db, product)
    return {"message": "Product deleted"}
