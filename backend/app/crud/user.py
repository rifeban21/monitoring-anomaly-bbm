from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.services.auth.password import hash_password, verify_password, pwd_context


async def authenticate_user(
    db: AsyncSession,
    username: str,
    password: str
):
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user

async def create_user(
    db: AsyncSession,
    username: str,
    password: str,
    role: str
):
    hashed_password = pwd_context.hash(password)

    user = User(
        username=username,
        password_hash=hashed_password,
        role=role
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def get_all_users(db: AsyncSession):
    result = await db.execute(
        select(User).order_by(User.id.desc())
    )
    return result.scalars().all()

async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(
        select(User).where(User.username == username)
    )
    return result.scalar_one_or_none()


async def get_user_by_refresh_token(db: AsyncSession, refresh_token: str):
    result = await db.execute(
        select(User).where(User.refresh_token == refresh_token)
    )
    return result.scalar_one_or_none()


async def update_refresh_token(
    db: AsyncSession,
    user: User,
    refresh_token: str
):
    user.refresh_token = refresh_token
    await db.commit()
    
