from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, field_validator

SERVICE_TYPES = {"guide", "taxi", "house", "hotel", "restaurant"}
STATUS_CHOICES = {"pending", "confirmed", "cancelled"}
PAYMENT_CHOICES = {"payme", "click", "cash"}


class BookingCreate(BaseModel):
    service_type: str
    service_id: int
    check_in: date
    check_out: date | None = None
    total: Decimal
    payment: str

    @field_validator("service_type")
    @classmethod
    def validate_service_type(cls, v):
        if v not in SERVICE_TYPES:
            raise ValueError(f"service_type quyidagilardan biri bo'lishi kerak: {SERVICE_TYPES}")
        return v

    @field_validator("payment")
    @classmethod
    def validate_payment(cls, v):
        if v not in PAYMENT_CHOICES:
            raise ValueError(f"payment quyidagilardan biri bo'lishi kerak: {PAYMENT_CHOICES}")
        return v


class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    service_type: str
    service_id: int
    check_in: date
    check_out: date | None
    total: Decimal
    status: str
    payment: str
    created_at: datetime