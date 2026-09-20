import os
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Request
from sqlalchemy import select as _select
from core.database import get_db
from users.models import User
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests



SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-gmda0p+ifg@-otc$&9977(n6e@fu^31&^-1$^302%w(ld-s4ob")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 365
REFRESH_TOKEN_EXPIRE_DAYS = 3650

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {"sub": str(user_id), "exp": expire, "type": "access"}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": str(user_id), "exp": expire, "type": "refresh"}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token yaroqsiz yoki muddati o'tgan",
        )


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Noto'g'ri token turi")

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token yaroqsiz")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="Foydalanuvchi topilmadi")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Akkaunt faol emas")

    return user

async def get_current_user_optional(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User | None:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = decode_token(token)
    except HTTPException:
        return None
    if payload.get("type") != "access":
        return None
    user_id = payload.get("sub")
    result = await db.execute(_select(User).where(User.id == int(user_id)))
    return result.scalar_one_or_none()



GOOGLE_CLIENT_ID = "270246511610-eip51h62s69a0c5ghin641kjp7h1k3ci.apps.googleusercontent.com"


def verify_google_token(token: str) -> dict:
    """
    Google ID tokenini HAQIQATAN Google serverida tekshiradi.
    Token soxta yoki muddati o'tgan bo'lsa, xato tashlaydi (aylanib o'tib bo'lmaydi).
    Muvaffaqiyatli bo'lsa, foydalanuvchi ma'lumotini (email, ism) qaytaradi.
    """
    try:
        idinfo = google_id_token.verify_oauth2_token(
            token, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise ValueError("Google token noto'g'ri yoki muddati o'tgan")

    if not idinfo.get("email"):
        raise ValueError("Google akkauntda email topilmadi")

    if not idinfo.get("email_verified", False):
        raise ValueError("Google email tasdiqlanmagan")

    return {
        "email": idinfo["email"],
        "first_name": idinfo.get("given_name", ""),
        "last_name": idinfo.get("family_name", ""),
    }