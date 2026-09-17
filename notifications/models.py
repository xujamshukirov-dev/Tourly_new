from datetime import datetime
from sqlalchemy import String, Text, Boolean, ForeignKey, DateTime, Index, func
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = (
        # foydalanuvchining o'qilmagan bildirishnomalarini tez topish uchun
        Index("ix_notification_user_read", "user_id", "is_read"),
        Index("ix_notification_created", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    notif_type: Mapped[str] = mapped_column(String(20))   # like | comment | follow | booking | message
    text: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())