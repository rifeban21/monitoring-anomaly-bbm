import asyncio
from app.core.database import AsyncSessionLocal
from app.crud.user import create_user

async def main():
    async with AsyncSessionLocal() as db:
        await create_user(
            db,
            username="admin",
            password="admin123",
            role="admin"
        )

asyncio.run(main())
