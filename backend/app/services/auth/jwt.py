from datetime import datetime, timedelta, UTC
from jose import jwt, JWTError
from app.core.config import settings

ALGORITHM = settings.jwt_algorithm


def create_access_token(subject: str, expires_minutes: int = 30):
    expire = datetime.now(UTC) + timedelta(minutes=expires_minutes)
    payload = {
        "sub": subject,
        "exp": expire,
        "type": "access"
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=ALGORITHM)


def create_refresh_token(subject: str, expires_days: int = 7):
    expire = datetime.now(UTC) + timedelta(days=expires_days)
    payload = {
        "sub": subject,
        "exp": expire,
        "type": "refresh"
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[ALGORITHM]
        )
    except JWTError:
        return None
