from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from users.models import User
from notifications import crud, schemas

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/")
async def list_notifications(
    limit: int = 30,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifs = await crud.get_user_notifications(db, current_user.id, limit, offset)
    return [schemas.NotificationRead.model_validate(n) for n in notifs]


@router.put("/{notification_id}/read")
async def mark_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = await crud.get_notification(db, notification_id, current_user.id)
    if not notif:
        raise HTTPException(status_code=404, detail="Bildirishnoma topilmadi")
    updated = await crud.mark_as_read(db, notif)
    return {"message": "o'qildi", "notification": schemas.NotificationRead.model_validate(updated)}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notif = await crud.get_notification(db, notification_id, current_user.id)
    if not notif:
        raise HTTPException(status_code=404, detail="Bildirishnoma topilmadi")
    await crud.delete_notification(db, notif)
    return {"message": "O'chirildi"}