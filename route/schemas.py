from pydantic import BaseModel


class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float


class RoutePoint(BaseModel):
    lat: float
    lng: float


class POI(BaseModel):
    """Yo'l bo'yidagi joy — yoqilg'i shaxobcha yoki oshxona"""
    name: str
    type: str
    lat: float
    lng: float


class RouteResponse(BaseModel):
    distance_km: float
    duration_min: float
    geometry: list[RoutePoint]
    fuel_stops: list[POI]
    food_stops: list[POI]