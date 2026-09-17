from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


async def create_verification(db: AsyncSession, model, user_id: int, data: dict):
    obj = model(user_id=user_id, **data)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


async def get_verification_by_user(db: AsyncSession, model, user_id: int):
    stmt = select(model).where(model.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, model, verification_id: int):
    stmt = select(model).where(model.id == verification_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def list_approved(db: AsyncSession, model, limit: int = 20, offset: int = 0):
    """Faqat status='approved' bo'lganlar — ochiq ro'yxat uchun, pagination bilan"""
    stmt = (
        select(model)
        .where(model.status == "approved")
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def update_partial(db: AsyncSession, obj, data: dict):
    for key, value in data.items():
        if value is not None:
            setattr(obj, key, value)
    await db.commit()
    await db.refresh(obj)
    return obj


async def delete_verification(db: AsyncSession, obj):
    await db.delete(obj)
    await db.commit()

# ==================== TUR (TOUR) ====================
from .models import Tour, TourRasm, TourKompaniya


async def create_tour(db: AsyncSession, kompaniya_id: int, data: dict):
    """Tur yaratadi + galereya rasmlarini (images ro'yxati) qo'shadi."""
    images = data.pop("images", [])

    tour = Tour(kompaniya_id=kompaniya_id, **data)
    db.add(tour)
    await db.flush()          # tour.id ni olish uchun (commit'dan oldin)

    for url in images:
        db.add(TourRasm(tour_id=tour.id, image=url))

    await db.commit()
    await db.refresh(tour)
    return tour


async def get_tour_by_id(db: AsyncSession, tour_id: int):
    """Bitta turni rasmlari bilan qaytaradi."""
    stmt = (
        select(Tour)
        .where(Tour.id == tour_id)
        .options(selectinload(Tour.rasmlar))
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def list_tours(db: AsyncSession, kompaniya_id: int | None = None,
                     limit: int = 20, offset: int = 0):
    """Turlar ro'yxati (rasmlari bilan). kompaniya_id berilsa — faqat o'shaniki."""
    stmt = select(Tour).where(Tour.is_active == True).options(selectinload(Tour.rasmlar))
    if kompaniya_id is not None:
        stmt = stmt.where(Tour.kompaniya_id == kompaniya_id)
    stmt = stmt.limit(limit).offset(offset)
    result = await db.execute(stmt)
    return result.scalars().all()