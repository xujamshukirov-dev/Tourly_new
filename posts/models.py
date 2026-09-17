from datetime import datetime
from sqlalchemy import String, Text, Float, ForeignKey, DateTime, UniqueConstraint, Index, func
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class Post(Base):
    __tablename__ = "posts"
    __table_args__ = (
        Index("ix_post_user_created", "user_id", "created_at"),   # profil sahifasi uchun
        Index("ix_post_created_at", "created_at"),                 # feed uchun (eng yangi postlar)
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    media: Mapped[str] = mapped_column(String(500))
    media_type: Mapped[str] = mapped_column(String(10))
    caption: Mapped[str] = mapped_column(Text, default="")
    location_name: Mapped[str] = mapped_column(String(100), default="")
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_like_user_post"),
        Index("ix_like_post", "post_id"),   # "shu postni nechta kishi like qilgan" tez hisoblash uchun
        Index("ix_like_user", "user_id"),   # "men like qilgan postlar" tez topish uchun
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Comment(Base):
    __tablename__ = "comments"
    __table_args__ = (
        Index("ix_comment_post_created", "post_id", "created_at"),  # posts ostidagi kommentlar tartibi bilan
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))
    comment: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Save(Base):
    __tablename__ = "saves"
    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_save_user_post"),
        Index("ix_save_user", "user_id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())