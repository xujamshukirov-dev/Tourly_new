from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from users.models import User
from bookings import crud, schemas

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("/")
async def list_my_bookings(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = await crud.get_user_bookings(db, current_user.id, limit, offset)
    return [schemas.BookingRead.model_validate(b) for b in bookings]


@router.post("/")
async def create_booking(
    data: schemas.BookingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = await crud.create_booking(db, current_user.id, data.model_dump())

    # Agar gid uchun bron bo'lsa — xabar va bildirishnoma yuboriladi
    # (chat va notifications app'lari FastAPI'ga o'tkazilgach to'liq ishlaydi)
    if data.service_type == "guide":
        try:
            from menu.models import GuideVerification
            from sqlalchemy import select as _select

            guide_stmt = _select(GuideVerification).where(GuideVerification.id == data.service_id)
            guide = (await db.execute(guide_stmt)).scalar_one_or_none()

            if guide:
                try:
                    from chat.models import Message
                    db.add(Message(
                        sender_id=current_user.id,
                        receiver_id=guide.user_id,
                        text=f"{current_user.first_name} sizni bron qildi!",
                    ))
                except ImportError:
                    pass

                try:
                    from notifications.models import Notification
                    db.add(Notification(
                        user_id=guide.user_id,
                        notif_type="booking",
                        text=f"{current_user.first_name} sizni bron qildi!",
                    ))
                except ImportError:
                    pass

                await db.commit()
        except Exception:
            pass

    return schemas.BookingRead.model_validate(booking)


@router.get("/{booking_id}")
async def get_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = await crud.get_booking_by_id(db, booking_id, current_user.id)
    if not booking:
        raise HTTPException(status_code=404, detail="Bron topilmadi")
    return schemas.BookingRead.model_validate(booking)


@router.delete("/{booking_id}")
async def cancel_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = await crud.get_booking_by_id(db, booking_id, current_user.id)
    if not booking:
        raise HTTPException(status_code=404, detail="Bron topilmadi")
    updated = await crud.cancel_booking(db, booking)
    return {"message": "Bron bekor qilindi!", "booking": schemas.BookingRead.model_validate(updated)}