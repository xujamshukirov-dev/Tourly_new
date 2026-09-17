from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from bookings.models import Booking


async def create_booking(db: AsyncSession, user_id: int, data: dict) -> Booking:
    booking = Booking(user_id=user_id, status="pending", **data)
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking


async def get_user_bookings(db: AsyncSession, user_id: int, limit: int = 20, offset: int = 0):
    stmt = (
        select(Booking)
        .where(Booking.user_id == user_id)
        .order_by(Booking.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_booking_by_id(db: AsyncSession, booking_id: int, user_id: int):
    stmt = select(Booking).where(Booking.id == booking_id, Booking.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def cancel_booking(db: AsyncSession, booking: Booking) -> Booking:
    booking.status = "cancelled"
    await db.commit()
    await db.refresh(booking)
    return booking