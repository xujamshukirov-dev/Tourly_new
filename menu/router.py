from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from users.models import User
from menu import crud, schemas
from core.hududlar import tekshir
from menu.models import (
    GuideVerification, TaxiVerification, HomeRentVerification,
    RestoranVerification, HotelVerification,
)

router = APIRouter(prefix="/menu", tags=["menu"])

# category_nomi: (Model, CreateSchema, FullReadSchema, PublicReadSchema)
MODEL_MAP = {
    "guide": (GuideVerification, schemas.GuideCreate, schemas.GuideRead, schemas.GuidePublicRead),
    "taxi": (TaxiVerification, schemas.TaxiCreate, schemas.TaxiRead, schemas.TaxiPublicRead),
    "home-rent": (HomeRentVerification, schemas.HomeRentCreate, schemas.HomeRentRead, schemas.HomeRentPublicRead),
    "restoran": (RestoranVerification, schemas.RestoranCreate, schemas.RestoranRead, schemas.RestoranPublicRead),
    "hotel": (HotelVerification, schemas.HotelCreate, schemas.HotelRead, schemas.HotelPublicRead),
}


def get_model_or_404(category: str):
    if category not in MODEL_MAP:
        raise HTTPException(status_code=404, detail="Noto'g'ri kategoriya")
    return MODEL_MAP[category]


# ---- LIST (ochiq — faqat approved, pasportsiz) ----
@router.get("/{category}")
async def list_verifications(
    category: str,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    model, _, _, public_schema = get_model_or_404(category)
    items = await crud.list_approved(db, model, limit, offset)
    return [public_schema.model_validate(i) for i in items]


# ---- CREATE (login talab qilinadi) ----
@router.post("/{category}")
async def create_verification(
    category: str,
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    model, create_schema, read_schema, _ = get_model_or_404(category)
    validated = create_schema(**data)

    from core.hududlar import tekshir

    if not tekshir(validated.viloyat, validated.tuman):
        raise HTTPException(status_code=400, detail="Viloyat yoki tuman noto'g'ri")

    existing = await crud.get_verification_by_user(db, model, current_user.id)
    if existing:
        raise HTTPException(status_code=400, detail="Siz allaqachon ariza topshirgansiz!")

    obj = await crud.create_verification(db, model, current_user.id, validated.model_dump())
    return read_schema.model_validate(obj)


# ---- DETAIL (ochiq — pasportsiz) ----
@router.get("/{category}/{verification_id}")
async def get_verification(
    category: str,
    verification_id: int,
    db: AsyncSession = Depends(get_db),
):
    model, _, _, public_schema = get_model_or_404(category)
    obj = await crud.get_by_id(db, model, verification_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Topilmadi")
    return public_schema.model_validate(obj)


# ---- UPDATE (faqat egasi yoki admin) ----
@router.put("/{category}/{verification_id}")
async def update_verification(
    category: str,
    verification_id: int,
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    model, _, read_schema, _ = get_model_or_404(category)
    obj = await crud.get_by_id(db, model, verification_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Topilmadi")

    if obj.user_id != current_user.id and not current_user.is_staff:
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")

    updated = await crud.update_partial(db, obj, data)
    return read_schema.model_validate(updated)


# ---- DELETE (faqat egasi yoki admin) ----
@router.delete("/{category}/{verification_id}")
async def delete_verification(
    category: str,
    verification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    model, _, _, _ = get_model_or_404(category)
    obj = await crud.get_by_id(db, model, verification_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Topilmadi")

    if obj.user_id != current_user.id and not current_user.is_staff:
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")

    await crud.delete_verification(db, obj)
    return {"message": "O'chirildi!"}

# ==================== TUR (TOUR) ====================
from menu.models import TourKompaniya, Tour

tour_router = APIRouter(prefix="/tour", tags=["tour"])


# ---- KOMPANIYA: ro'yxatdan o'tish (login talab) ----
@tour_router.post("/kompaniya")
async def register_kompaniya(
    data: schemas.TourKompaniyaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = await crud.get_verification_by_user(db, TourKompaniya, current_user.id)
    if existing:
        raise HTTPException(status_code=400, detail="Siz allaqachon ariza topshirgansiz!")

    obj = await crud.create_verification(db, TourKompaniya, current_user.id, data.model_dump())
    return schemas.TourKompaniyaRead.model_validate(obj)


# ---- KOMPANIYA: mening kompaniyam (egasi ko'radi) ----
@tour_router.get("/kompaniya/me")
async def my_kompaniya(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    obj = await crud.get_verification_by_user(db, TourKompaniya, current_user.id)
    if not obj:
        raise HTTPException(status_code=404, detail="Kompaniya topilmadi")
    return schemas.TourKompaniyaRead.model_validate(obj)


# ---- KOMPANIYA: ommaviy ro'yxat (faqat approved) ----
@tour_router.get("/kompaniya")
async def list_kompaniya(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    items = await crud.list_approved(db, TourKompaniya, limit, offset)
    return [schemas.TourKompaniyaPublicRead.model_validate(i) for i in items]


# ---- TUR: joylash (faqat tasdiqlangan kompaniya) ----
@tour_router.post("/")
async def create_tour(
    data: schemas.TourCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    kompaniya = await crud.get_verification_by_user(db, TourKompaniya, current_user.id)
    if not kompaniya:
        raise HTTPException(status_code=403, detail="Avval kompaniya sifatida ro'yxatdan o'ting")
    if kompaniya.status != "approved":
        raise HTTPException(status_code=403, detail="Kompaniyangiz hali tasdiqlanmagan")

    obj = await crud.create_tour(db, kompaniya.id, data.model_dump())
    full = await crud.get_tour_by_id(db, obj.id)
    return schemas.TourRead.model_validate(full)


# ---- TUR: ommaviy ro'yxat ----
@tour_router.get("/")
async def list_tours(
    kompaniya_id: int | None = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    items = await crud.list_tours(db, kompaniya_id, limit, offset)
    return [schemas.TourRead.model_validate(i) for i in items]


# ---- TUR: bitta tur (detal) ----
@tour_router.get("/{tour_id}")
async def get_tour(
    tour_id: int,
    db: AsyncSession = Depends(get_db),
):
    obj = await crud.get_tour_by_id(db, tour_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Tur topilmadi")
    return schemas.TourRead.model_validate(obj)


# umumiy routerga ulash
router.include_router(tour_router)