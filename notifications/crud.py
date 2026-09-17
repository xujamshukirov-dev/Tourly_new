from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from notifications.models import Notification


async def get_user_notifications(db: AsyncSession, user_id: int, limit: int = 30, offset: int = 0):
    stmt = (
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_notification(db: AsyncSession, notification_id: int, user_id: int):
    stmt = select(Notification).where(Notification.id == notification_id, Notification.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def mark_as_read(db: AsyncSession, notif: Notification) -> Notification:
    notif.is_read = True
    await db.commit()
    await db.refresh(notif)
    return notif


async def delete_notification(db: AsyncSession, notif: Notification):
    await db.delete(notif)
    await db.commit()