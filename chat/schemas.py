from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserMini(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    avatar: str | None


class MessageCreate(BaseModel):
    receiver_id: int
    text: str = ""


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender: UserMini
    receiver: UserMini
    text: str
    is_read: bool
    created_at: datetime


class MarkReadRequest(BaseModel):
    sender_id: int