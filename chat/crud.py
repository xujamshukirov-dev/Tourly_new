from sqlalchemy import select, or_, and_, update
from sqlalchemy.ext.asyncio import AsyncSession
from chat.models import Message


async def create_message(db: AsyncSession, sender_id: int, receiver_id: int, text: str) -> Message:
    msg = Message(sender_id=sender_id, receiver_id=receiver_id, text=text)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg


async def get_conversation(db: AsyncSession, user_id: int, other_id: int):
    """Ikki foydalanuvchi orasidagi to'liq suhbat, vaqt bo'yicha (eskisi birinchi)"""
    stmt = (
        select(Message)
        .where(
            or_(
                and_(Message.sender_id == user_id, Message.receiver_id == other_id),
                and_(Message.sender_id == other_id, Message.receiver_id == user_id),
            )
        )
        .order_by(Message.created_at)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_all_messages(db: AsyncSession, user_id: int, limit: int = 50, offset: int = 0):
    """Barcha xabarlar (suhbatdoshlar ro'yxati uchun) — eng yangisi birinchi"""
    stmt = (
        select(Message)
        .where(or_(Message.sender_id == user_id, Message.receiver_id == user_id))
        .order_by(Message.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_message_by_id(db: AsyncSession, message_id: int, sender_id: int):
    stmt = select(Message).where(Message.id == message_id, Message.sender_id == sender_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def delete_message(db: AsyncSession, message: Message):
    await db.delete(message)
    await db.commit()


async def mark_as_read(db: AsyncSession, receiver_id: int, sender_id: int):
    stmt = (
        update(Message)
        .where(Message.sender_id == sender_id, Message.receiver_id == receiver_id, Message.is_read == False)
        .values(is_read=True)
    )
    await db.execute(stmt)
    await db.commit()