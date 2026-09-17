from datetime import datetime
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, declared_attr
from core.database import Base
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime, Float, func
import enum
from datetime import datetime, date
from decimal import Decimal

from sqlalchemy import String, Text, Numeric, DateTime, Date, Integer, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base  # TAXMIN — haqiqiy import yo'lini tasdiqlang


class VerificationMixin:
    """Django'dagi BaseVerification(abstract=True)ning o'rnini bosadi"""

    id: Mapped[int] = mapped_column(primary_key=True)

    @declared_attr
    def user_id(cls) -> Mapped[int]:
        return mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)

    first_name: Mapped[str] = mapped_column(String(60))
    last_name: Mapped[str] = mapped_column(String(60))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(30), default="")
    passport_series: Mapped[str] = mapped_column(String(50), default="")
    passport_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class GuideVerification(VerificationMixin, Base):
    __tablename__ = "guide_verifications"

    language: Mapped[str] = mapped_column(String(60))
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str] = mapped_column(Text, default="")
    viloyat: Mapped[str] = mapped_column(String(50), index=True)
    tuman: Mapped[str] = mapped_column(String(50), index=True)

class TaxiVerification(VerificationMixin, Base):
    __tablename__ = "taxi_verifications"

    car_model: Mapped[str] = mapped_column(String(100))
    car_number: Mapped[str] = mapped_column(String(20))
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str] = mapped_column(Text, default="")
    viloyat: Mapped[str] = mapped_column(String(50), index=True)
    tuman: Mapped[str] = mapped_column(String(50), index=True)

class HomeRentVerification(VerificationMixin, Base):
    __tablename__ = "home_rent_verifications"

    address: Mapped[str] = mapped_column(String(200))
    room_count: Mapped[int] = mapped_column(Integer)
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str] = mapped_column(Text, default="")
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    viloyat: Mapped[str] = mapped_column(String(50), index=True)
    tuman: Mapped[str] = mapped_column(String(50), index=True)


class RestoranVerification(VerificationMixin, Base):
    __tablename__ = "restoran_verifications"

    address: Mapped[str] = mapped_column(String(200))
    cuisine: Mapped[str] = mapped_column(String(100))
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str] = mapped_column(Text, default="")
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    viloyat: Mapped[str] = mapped_column(String(50), index=True)
    tuman: Mapped[str] = mapped_column(String(50), index=True)

class HotelVerification(VerificationMixin, Base):
    __tablename__ = "hotel_verifications"

    address: Mapped[str] = mapped_column(String(200))
    room_count: Mapped[int] = mapped_column(Integer)
    star_count: Mapped[int] = mapped_column(Integer, default=1)
    image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str] = mapped_column(Text, default="")
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    viloyat: Mapped[str] = mapped_column(String(50), index=True)
    tuman: Mapped[str] = mapped_column(String(50), index=True)

class BiletStatus(str, enum.Enum):
    PENDING = "pending"          # yaratildi, to'lov kutilmoqda
    PAID = "paid"                # to'lov o'tdi
    CONFIRMED = "confirmed"      # bilet tasdiqlandi (provayder tomonidan yoki avtomatik)
    CANCELLED = "cancelled"


class PoyezdReys(Base):
    __tablename__ = "poyezd_reys"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    train_number: Mapped[str] = mapped_column(String(20))
    train_name: Mapped[str | None] = mapped_column(String(100), default=None)

    origin_station: Mapped[str] = mapped_column(String(255))
    destination_station: Mapped[str] = mapped_column(String(255))

    departure_time: Mapped[datetime] = mapped_column(DateTime)
    arrival_time: Mapped[datetime] = mapped_column(DateTime)

    wagon_class: Mapped[str] = mapped_column(String(50))
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(10), default="UZS")

    total_seats: Mapped[int] = mapped_column(Integer)
    available_seats: Mapped[int] = mapped_column(Integer)

    is_active: Mapped[bool] = mapped_column(default=True)

    biletlar: Mapped[list["PoyezdBilet"]] = relationship(back_populates="reys")


class PoyezdBilet(Base):
    __tablename__ = "poyezd_bilet"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))  # TAXMIN — users jadval nomini tasdiqlang
    reys_id: Mapped[int] = mapped_column(ForeignKey("poyezd_reys.id"))

    passenger_name: Mapped[str] = mapped_column(String(255))
    passenger_passport: Mapped[str] = mapped_column(String(50))
    wagon_number: Mapped[str | None] = mapped_column(String(10), default=None)
    seat_number: Mapped[str | None] = mapped_column(String(10), default=None)

    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    status: Mapped[BiletStatus] = mapped_column(SAEnum(BiletStatus), default=BiletStatus.PENDING)

    payment_id: Mapped[str | None] = mapped_column(String(100), default=None)  # to'lov tizimidan qaytgan tranzaksiya ID
    pdf_generated: Mapped[bool] = mapped_column(default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    reys: Mapped["PoyezdReys"] = relationship(back_populates="biletlar")

class AviaReys(Base):
    __tablename__ = "avia_reys"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    flight_number: Mapped[str] = mapped_column(String(20))       # "HY123"
    airline: Mapped[str] = mapped_column(String(100))             # "Uzbekistan Airways"

    origin_airport: Mapped[str] = mapped_column(String(255))      # "Toshkent (TAS)"
    destination_airport: Mapped[str] = mapped_column(String(255)) # "Samarqand (SKD)"

    departure_time: Mapped[datetime] = mapped_column(DateTime)
    arrival_time: Mapped[datetime] = mapped_column(DateTime)

    seat_class: Mapped[str] = mapped_column(String(50))           # "Economy", "Business"
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(10), default="UZS")

    total_seats: Mapped[int] = mapped_column(Integer)
    available_seats: Mapped[int] = mapped_column(Integer)

    baggage_allowance_kg: Mapped[int | None] = mapped_column(Integer, default=None)

    is_active: Mapped[bool] = mapped_column(default=True)

    biletlar: Mapped[list["AviaBilet"]] = relationship(back_populates="reys")


class AviaBilet(Base):
    __tablename__ = "avia_bilet"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    reys_id: Mapped[int] = mapped_column(ForeignKey("avia_reys.id"))

    passenger_name: Mapped[str] = mapped_column(String(255))
    passenger_passport: Mapped[str] = mapped_column(String(50))
    seat_number: Mapped[str | None] = mapped_column(String(10), default=None)

    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    status: Mapped[BiletStatus] = mapped_column(SAEnum(BiletStatus), default=BiletStatus.PENDING)

    payment_id: Mapped[str | None] = mapped_column(String(100), default=None)
    pdf_generated: Mapped[bool] = mapped_column(default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    reys: Mapped["AviaReys"] = relationship(back_populates="biletlar")


class AvtobusReys(Base):
    __tablename__ = "avtobus_reys"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    bus_number: Mapped[str] = mapped_column(String(20))
    company_name: Mapped[str] = mapped_column(String(100))         # "Express Line"

    origin_station: Mapped[str] = mapped_column(String(255))
    destination_station: Mapped[str] = mapped_column(String(255))

    departure_time: Mapped[datetime] = mapped_column(DateTime)
    arrival_time: Mapped[datetime] = mapped_column(DateTime)

    bus_type: Mapped[str] = mapped_column(String(50))              # "VIP", "Standart"
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(10), default="UZS")

    total_seats: Mapped[int] = mapped_column(Integer)
    available_seats: Mapped[int] = mapped_column(Integer)

    is_active: Mapped[bool] = mapped_column(default=True)

    biletlar: Mapped[list["AvtobusBilet"]] = relationship(back_populates="reys")


class AvtobusBilet(Base):
    __tablename__ = "avtobus_bilet"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    reys_id: Mapped[int] = mapped_column(ForeignKey("avtobus_reys.id"))

    passenger_name: Mapped[str] = mapped_column(String(255))
    passenger_passport: Mapped[str] = mapped_column(String(50))
    seat_number: Mapped[str | None] = mapped_column(String(10), default=None)

    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    status: Mapped[BiletStatus] = mapped_column(SAEnum(BiletStatus), default=BiletStatus.PENDING)

    payment_id: Mapped[str | None] = mapped_column(String(100), default=None)
    pdf_generated: Mapped[bool] = mapped_column(default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    reys: Mapped["AvtobusReys"] = relationship(back_populates="biletlar")

# ==================== TUR (TOUR) ====================

class TourKompaniya(VerificationMixin, Base):
    """Tur kompaniyasi ro'yxatdan o'tishi (verification).
    first_name / last_name = mas'ul shaxs ismi-familiyasi (mixin'dan)."""
    __tablename__ = "tour_kompaniya"

    company_name: Mapped[str] = mapped_column(String(200))
    license_number: Mapped[str] = mapped_column(String(100))   # majburiy — turoperator litsenziyasi
    address: Mapped[str] = mapped_column(String(200))
    logo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    license_image: Mapped[str | None] = mapped_column(String(500), nullable=True)

    tourlar: Mapped[list["Tour"]] = relationship(back_populates="kompaniya")


class Tour(Base):
    """Kompaniya joylaydigan tur (katalog)."""
    __tablename__ = "tour"

    id: Mapped[int] = mapped_column(primary_key=True)
    kompaniya_id: Mapped[int] = mapped_column(
        ForeignKey("tour_kompaniya.id", ondelete="CASCADE"), index=True
    )

    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")
    route: Mapped[str] = mapped_column(String(255))            # yo'nalish: "Samarqand → Buxoro"
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))     # 1 kishi uchun
    duration_days: Mapped[int] = mapped_column(Integer)
    available_seats: Mapped[int] = mapped_column(Integer)

    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    kompaniya: Mapped["TourKompaniya"] = relationship(back_populates="tourlar")
    rasmlar: Mapped[list["TourRasm"]] = relationship(
        back_populates="tour", cascade="all, delete-orphan"
    )


class TourRasm(Base):
    """Bitta tur uchun galereya rasmlari (bir nechta)."""
    __tablename__ = "tour_rasm"

    id: Mapped[int] = mapped_column(primary_key=True)
    tour_id: Mapped[int] = mapped_column(
        ForeignKey("tour.id", ondelete="CASCADE"), index=True
    )
    image: Mapped[str] = mapped_column(String(500))

    tour: Mapped["Tour"] = relationship(back_populates="rasmlar")