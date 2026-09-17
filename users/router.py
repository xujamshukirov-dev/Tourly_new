from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from users import crud, schemas
from core.security import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    decode_token,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=schemas.TokenResponse)
async def register(data: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    existing_email = await crud.get_user_by_email(db, data.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Bu email allaqachon ro'yxatdan o'tgan")

    existing_username = await crud.get_user_by_username(db, data.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="Bu username band")

    user = await crud.create_user(db, data.username, data.email, data.password)
    return schemas.TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/login", response_model=schemas.TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Swagger 'Authorize' shu yerga so'rov yuboradi.
    username katagiga EMAIL yoziladi."""
    user = await crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email yoki parol noto'g'ri")

    return schemas.TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/login-json", response_model=schemas.TokenResponse)
async def login_json(data: schemas.LoginRequest, db: AsyncSession = Depends(get_db)):
    """Frontend uchun — JSON bilan login."""
    user = await crud.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email yoki parol noto'g'ri")

    return schemas.TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/refresh", response_model=schemas.TokenResponse)
async def refresh_token(data: schemas.RefreshRequest):
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Noto'g'ri token turi")

    user_id = int(payload.get("sub"))
    return schemas.TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )


@router.get("/me", response_model=schemas.UserRead)
async def read_me(current_user=Depends(get_current_user)):
    return current_user


@router.post("/{user_id}/follow")
async def follow_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.UserRead = Depends(get_current_user),
):
    followed = await crud.toggle_follow(db, current_user.id, user_id)
    return {"following": followed}


@router.get("/{user_id}", response_model=schemas.UserPublicProfile)
async def read_user_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.UserRead | None = Depends(get_current_user),
):
    row = await crud.get_user_profile(db, user_id, current_user.id if current_user else None)
    if not row:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")

    user, followers_count, following_count, is_following = row
    return schemas.UserPublicProfile(
        **schemas.UserRead.model_validate(user).model_dump(),
        followers_count=followers_count,
        following_count=following_count,
        is_following=is_following,
    )