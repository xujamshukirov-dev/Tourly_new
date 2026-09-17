from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    username: str
    email: EmailStr
    bio: str = ""
    avatar: str | None = None


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_verified: bool
    profile_completed: bool
    date_joined: datetime


class UserPublicProfile(BaseModel):
    """Boshqa foydalanuvchilar ko'radigan profil — followers_count bilan"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    avatar: str | None
    bio: str
    is_verified: bool
    followers_count: int
    following_count: int
    is_following: bool = False  # so'rov yuborgan user follow qilganmi

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str