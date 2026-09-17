from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserMini(BaseModel):
    """Post ichida ko'rsatiladigan qisqa user ma'lumoti"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    avatar: str | None


# ---------- Post ----------
class PostCreate(BaseModel):
    media: str
    media_type: str
    caption: str = ""
    location_name: str = ""
    latitude: float | None = None
    longitude: float | None = None


class PostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user: UserMini
    media: str
    media_type: str
    caption: str
    location_name: str
    latitude: float | None
    longitude: float | None
    created_at: datetime

    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False
    is_saved: bool = False


# ---------- Comment ----------
class CommentCreate(BaseModel):
    post_id: int
    comment: str = ""


class CommentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user: UserMini
    post_id: int
    comment: str
    created_at: datetime


# ---------- Like / Save (toggle javobi) ----------
class ToggleResponse(BaseModel):
    active: bool  # True = like/save qilindi, False = olib tashlandi