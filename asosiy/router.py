from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user_optional
from users.models import User

from posts import crud as posts_crud
from posts.router import _build_post_read

from menu.models import (
    GuideVerification, TaxiVerification, HomeRentVerification,
    RestoranVerification, HotelVerification,
)
from menu import schemas as menu_schemas

from asosiy import schemas

router = APIRouter(prefix="/asosiy", tags=["asosiy"])


async def _get_approved(db: AsyncSession, model, limit: int = 10):
    stmt = select(model).where(model.status == "approved").limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/home", response_model=schemas.HomeResponse)
async def home(
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    uid = current_user.id if current_user else None

    tourism_rows = await posts_crud.get_feed(db, uid, limit=10, offset=0)
    latest_rows = await posts_crud.get_feed(db, uid, limit=20, offset=0)

    guides = await _get_approved(db, GuideVerification)
    taxis = await _get_approved(db, TaxiVerification)
    homes = await _get_approved(db, HomeRentVerification)
    restorans = await _get_approved(db, RestoranVerification)
    hotels = await _get_approved(db, HotelVerification)

    return schemas.HomeResponse(
        tourism_posts=[_build_post_read(r) for r in tourism_rows],
        guides=[menu_schemas.GuidePublicRead.model_validate(g) for g in guides],
        taxis=[menu_schemas.TaxiPublicRead.model_validate(t) for t in taxis],
        homes=[menu_schemas.HomeRentPublicRead.model_validate(h) for h in homes],
        restorans=[menu_schemas.RestoranPublicRead.model_validate(r) for r in restorans],
        hotels=[menu_schemas.HotelPublicRead.model_validate(h) for h in hotels],
        latest_posts=[_build_post_read(r) for r in latest_rows],
    )


@router.get("/search", response_model=schemas.SearchResponse)
async def search(
    q: str = "",
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    if not q:
        raise HTTPException(status_code=400, detail="Qidiruv so'zini kiriting!")

    uid = current_user.id if current_user else None

    # Postlarni qidirish (caption bo'yicha)
    post_rows = await posts_crud.search_posts(db, q, uid)

    # Guide, hotel, restoran qidirish
    guide_stmt = select(GuideVerification).where(
        GuideVerification.status == "approved",
        GuideVerification.first_name.icontains(q),
    )
    hotel_stmt = select(HotelVerification).where(
        HotelVerification.status == "approved",
        HotelVerification.address.icontains(q),
    )
    restoran_stmt = select(RestoranVerification).where(
        RestoranVerification.status == "approved",
        RestoranVerification.address.icontains(q),
    )

    guides = (await db.execute(guide_stmt)).scalars().all()
    hotels = (await db.execute(hotel_stmt)).scalars().all()
    restorans = (await db.execute(restoran_stmt)).scalars().all()

    return schemas.SearchResponse(
        posts=[_build_post_read(r) for r in post_rows],
        guides=[menu_schemas.GuidePublicRead.model_validate(g) for g in guides],
        hotels=[menu_schemas.HotelPublicRead.model_validate(h) for h in hotels],
        restorans=[menu_schemas.RestoranPublicRead.model_validate(r) for r in restorans],
    )