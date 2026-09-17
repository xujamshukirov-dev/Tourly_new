from fastapi import APIRouter, Depends, HTTPException
from core.security import get_current_user
from users.models import User
from route import crud, schemas

router = APIRouter(prefix="/route", tags=["route"])


@router.post("/plan", response_model=schemas.RouteResponse)
async def plan_route(
    data: schemas.RouteRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        route_data = await crud.get_route(data.start_lat, data.start_lng, data.end_lat, data.end_lng)
    except ConnectionError:
        raise HTTPException(status_code=502, detail="Xarita xizmati javob bermadi")
    except ValueError:
        raise HTTPException(status_code=404, detail="Marshrut topilmadi")

    fuel_stops = await crud.get_pois_along_route(route_data["geometry"], "fuel")
    food_stops = await crud.get_pois_along_route(route_data["geometry"], "food")

    return schemas.RouteResponse(
        distance_km=route_data["distance_km"],
        duration_min=route_data["duration_min"],
        geometry=route_data["geometry"],
        fuel_stops=[schemas.POI(**p) for p in fuel_stops],
        food_stops=[schemas.POI(**p) for p in food_stops],
    )


@router.get("/nearby")
async def nearby(
    lat: float,
    lng: float,
    types: str,               # vergul bilan: "salon,parkovka,bilyard"
    radius: int = 2000,       # metr, default 2km
    current_user: User = Depends(get_current_user),
):
    type_list = [t.strip() for t in types.split(",") if t.strip()]
    if not type_list:
        raise HTTPException(status_code=400, detail="Kamida bitta kategoriya tanlang")

    try:
        places = await crud.get_nearby_pois(lat, lng, radius, type_list)
    except Exception:
        raise HTTPException(status_code=503, detail="Xarita xizmati vaqtincha ishlamayapti")

    return {"count": len(places), "places": places}

@router.get("/geocode")
async def geocode(
    q: str,
    current_user: User = Depends(get_current_user),
):
    """Manzil nomini koordinataga aylantiradi (masalan: 'Registon, Samarqand')"""
    result = await crud.geocode_address(q)
    if not result:
        raise HTTPException(status_code=404, detail="Manzil topilmadi")
    return result