from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import String, Integer, Date, DateTime, Numeric, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        Index("ix_booking_user", "user_id"),
        Index("ix_booking_service", "service_type", "service_id"),  # "shu xizmat band qilinganmi" tez tekshirish
        Index("ix_booking_status", "status"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    service_type: Mapped[str] = mapped_column(String(50))   # guide | taxi | house | hotel | restaurant
    service_id: Mapped[int] = mapped_column(Integer)

    check_in: Mapped[date] = mapped_column(Date)
    check_out: Mapped[date | None] = mapped_column(Date, nullable=True)

    total: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    status: Mapped[str] = mapped_column(String(50), default="pending")     # pending | confirmed | cancelled
    payment: Mapped[str] = mapped_column(String(20))                       # payme | click | cash

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())