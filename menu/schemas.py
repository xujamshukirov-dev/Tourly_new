from datetime import datetime
from pydantic import BaseModel, ConfigDict
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

# ---------- Yaratish uchun (POST) ----------
class VerificationBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str = ""
    passport_series: str = ""
    passport_image: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    viloyat: str
    tuman: str

class GuideCreate(VerificationBase):
    language: str
    bio: str = ""
    image: str | None = None


class TaxiCreate(VerificationBase):
    car_model: str
    car_number: str
    bio: str = ""
    image: str | None = None


class HomeRentCreate(VerificationBase):
    address: str
    room_count: int
    bio: str = ""
    image: str | None = None


class RestoranCreate(VerificationBase):
    address: str
    cuisine: str
    bio: str = ""
    image: str | None = None


class HotelCreate(VerificationBase):
    address: str
    room_count: int
    star_count: int = 1
    bio: str = ""
    image: str | None = None


# ---------- To'liq ko'rish (faqat egasi/admin uchun — pasport bilan) ----------
class VerificationRead(VerificationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    status: str
    created_at: datetime


class GuideRead(VerificationRead):
    language: str
    bio: str
    image: str | None


class TaxiRead(VerificationRead):
    car_model: str
    car_number: str
    bio: str
    image: str | None


class HomeRentRead(VerificationRead):
    address: str
    room_count: int
    bio: str
    image: str | None


class RestoranRead(VerificationRead):
    address: str
    cuisine: str
    bio: str
    image: str | None


class HotelRead(VerificationRead):
    address: str
    room_count: int
    star_count: int
    bio: str
    image: str | None


# ---------- Ommaviy ko'rish (GET — pasport ma'lumotisiz) ----------
class VerificationPublicRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    phone: str
    status: str
    latitude: float | None
    longitude: float | None
    viloyat: str
    tuman: str

class GuidePublicRead(VerificationPublicRead):
    language: str
    bio: str
    image: str | None


class TaxiPublicRead(VerificationPublicRead):
    car_model: str
    car_number: str
    bio: str
    image: str | None


class HomeRentPublicRead(VerificationPublicRead):
    address: str
    room_count: int
    bio: str
    image: str | None


class RestoranPublicRead(VerificationPublicRead):
    address: str
    cuisine: str
    bio: str
    image: str | None


class HotelPublicRead(VerificationPublicRead):
    address: str
    room_count: int
    star_count: int
    bio: str
    image: str | None



class PoyezdReysOut(BaseModel):
    id: int
    train_number: str
    origin_station: str
    destination_station: str
    departure_time: datetime
    arrival_time: datetime
    wagon_class: str
    price: Decimal
    available_seats: int

    class Config:
        from_attributes = True


class PoyezdBiletCreate(BaseModel):
    reys_id: int
    passenger_name: str
    passenger_passport: str


class PoyezdBiletOut(BaseModel):
    id: int
    reys: PoyezdReysOut
    passenger_name: str
    total_price: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AviaReysOut(BaseModel):
    id: int
    flight_number: str
    airline: str
    origin_airport: str
    destination_airport: str
    departure_time: datetime
    arrival_time: datetime
    seat_class: str
    price: Decimal
    available_seats: int
    baggage_allowance_kg: int | None = None

    class Config:
        from_attributes = True


class AviaBiletCreate(BaseModel):
    reys_id: int
    passenger_name: str
    passenger_passport: str


class AviaBiletOut(BaseModel):
    id: int
    reys: AviaReysOut
    passenger_name: str
    total_price: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AvtobusReysOut(BaseModel):
    id: int
    bus_number: str
    company_name: str
    origin_station: str
    destination_station: str
    departure_time: datetime
    arrival_time: datetime
    bus_type: str
    price: Decimal
    available_seats: int

    class Config:
        from_attributes = True


class AvtobusBiletCreate(BaseModel):
    reys_id: int
    passenger_name: str
    passenger_passport: str


class AvtobusBiletOut(BaseModel):
    id: int
    reys: AvtobusReysOut
    passenger_name: str
    total_price: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== TUR (TOUR) ====================

# ---------- TourRasm (galereya) ----------
class TourRasmRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    image: str


# ---------- Kompaniya: yaratish (POST) ----------
class TourKompaniyaCreate(BaseModel):
    first_name: str                 # mas'ul shaxs ismi
    last_name: str                  # mas'ul shaxs familiyasi
    email: str
    phone: str = ""
    company_name: str
    license_number: str             # majburiy
    address: str
    logo: str | None = None
    license_image: str | None = None


# ---------- Kompaniya: to'liq ko'rish (egasi/admin — litsenziya bilan) ----------
class TourKompaniyaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    company_name: str
    license_number: str
    address: str
    logo: str | None
    license_image: str | None
    status: str
    created_at: datetime


# ---------- Kompaniya: ommaviy ko'rish (GET — litsenziya rasmisiz) ----------
class TourKompaniyaPublicRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    company_name: str
    phone: str
    address: str
    logo: str | None
    status: str


# ---------- Tur: yaratish (POST) ----------
class TourCreate(BaseModel):
    title: str
    description: str = ""
    route: str
    price: Decimal
    duration_days: int
    available_seats: int
    images: list[str] = []          # galereya URL/yo'llari ro'yxati


# ---------- Tur: ommaviy ko'rish (GET) ----------
class TourRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    kompaniya_id: int
    title: str
    description: str
    route: str
    price: Decimal
    duration_days: int
    available_seats: int
    is_active: bool
    created_at: datetime
    rasmlar: list[TourRasmRead] = []