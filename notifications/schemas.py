from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NotificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    notif_type: str
    text: str
    is_read: bool
    created_at: datetime