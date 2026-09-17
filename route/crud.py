import httpx

OSRM_URL = "http://router.project-osrm.org/route/v1/driving"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

async def get_route(start_lat: float, start_lng: float, end_lat: float, end_lng: float) -> dict:
    """OSRM orqali marshrut olish"""
    url = f"{OSRM_URL}/{start_lng},{start_lat};{end_lng},{end_lat}"
    params = {"overview": "full", "geometries": "geojson"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise ConnectionError("OSRM xizmati javob bermadi")

    data = response.json()
    if data.get("code") != "Ok" or not data.get("routes"):
        raise ValueError("Marshrut topilmadi")

    route = data["routes"][0]
    coords = route["geometry"]["coordinates"]  # [[lng, lat], ...]

    return {
        "distance_km": round(route["distance"] / 1000, 2),
        "duration_min": round(route["duration"] / 60, 1),
        "geometry": [{"lat": c[1], "lng": c[0]} for c in coords],
    }


def _build_bbox(coords: list[dict], padding: float = 0.02) -> tuple[float, float, float, float]:
    """Marshrut atrofidagi qidiruv maydonini (bounding box) hisoblash"""
    lats = [c["lat"] for c in coords]
    lngs = [c["lng"] for c in coords]
    return (
        min(lats) - padding,
        min(lngs) - padding,
        max(lats) + padding,
        max(lngs) + padding,
    )


def _sample_route_points(coords: list[dict], interval_km: float = 10) -> list[dict]:
    """
    Marshrut bo'ylab har `interval_km` kilometrda bitta nuqta tanlaydi.
    Yo'l qancha uzun bo'lishidan qat'i nazar, qamrov "teshiksiz" bo'ladi.
    """
    if len(coords) <= 2:
        return coords

    import math

    def haversine_km(a: dict, b: dict) -> float:
        R = 6371
        lat1, lng1 = math.radians(a["lat"]), math.radians(a["lng"])
        lat2, lng2 = math.radians(b["lat"]), math.radians(b["lng"])
        dlat, dlng = lat2 - lat1, lng2 - lng1
        h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
        return 2 * R * math.asin(math.sqrt(h))

    selected = [coords[0]]
    accumulated = 0.0

    for i in range(1, len(coords)):
        accumulated += haversine_km(coords[i - 1], coords[i])
        if accumulated >= interval_km:
            selected.append(coords[i])
            accumulated = 0.0

    if selected[-1] != coords[-1]:
        selected.append(coords[-1])

    return selected


async def get_pois_along_route(coords: list[dict], poi_type: str, radius: int = 6000) -> list[dict]:
    """
    Butun marshrut bo'ylab (har 10 km'da bir nuqta, radius 6 km) yoqilg'i
    yoki oshxonalarni topadi — uzoq yo'lda ham "teshik" qolmasligi uchun.
    """
    if poi_type == "fuel":
        tag = 'node["amenity"="fuel"]'
    else:  # food
        tag = 'node["amenity"~"restaurant|cafe|fast_food"]'

    sample_points = _sample_route_points(coords, interval_km=10)

    # Overpass'ga bitta katta so'rov o'rniga guruhlab yuboramiz (uzoq yo'lda
    # nuqta soni ko'p bo'lsa, bitta so'rov juda og'ir bo'lib qolmasin)
    all_results = {}
    batch_size = 25

    async with httpx.AsyncClient(timeout=30.0) as client:
        for i in range(0, len(sample_points), batch_size):
            batch = sample_points[i:i + batch_size]
            blocks = "".join(
                f'{tag}(around:{radius},{p["lat"]},{p["lng"]});'
                for p in batch
            )
            query = f"[out:json][timeout:25];({blocks});out body;"

            try:
                response = await client.post(OVERPASS_URL, data={"data": query})
            except httpx.HTTPError:
                continue

            if response.status_code != 200:
                continue

            for el in response.json().get("elements", []):
                if el["id"] in all_results:
                    continue
                tags = el.get("tags", {})
                all_results[el["id"]] = {
                    "name": tags.get("name", "Nomsiz"),
                    "type": poi_type,
                    "lat": el["lat"],
                    "lng": el["lon"],
                }

    return list(all_results.values())


# ==================== YAQIN-ATROFDA (nuqta atrofida qidirish) ====================

NEARBY_TAGS = {
    "salon":      ['node["shop"="beauty"]', 'node["shop"="hairdresser"]'],
    "massaj":     ['node["shop"="massage"]', 'node["leisure"="spa"]'],
    "parkovka":   ['node["amenity"="parking"]'],
    "bilyard":    ['node["leisure"="adult_gaming_centre"]', 'node["sport"="billiards"]'],
    "sport_zali": ['node["leisure"="fitness_centre"]', 'node["leisure"="sports_centre"]'],
    "oyingoh":    ['node["leisure"="playground"]'],
}


async def get_nearby_pois(lat: float, lng: float, radius: int, types: list[str]) -> list[dict]:
    """
    Overpass orqali foydalanuvchi atrofidagi (radius metr ichida) joylarni topadi.
    Har kategoriya alohida so'raladi — shunda 'type' aniq bo'ladi va
    bitta kategoriya xato bersa, boshqalari ishlayveradi.
    types: ["salon", "parkovka", ...] — NEARBY_TAGS kalitlari.
    """
    results = []
    async with httpx.AsyncClient(timeout=30.0) as client:
        for t in types:
            tags = NEARBY_TAGS.get(t)
            if not tags:
                continue

            body = "".join(f'{tag}(around:{radius},{lat},{lng});' for tag in tags)
            query = f"[out:json][timeout:25];({body});out body;"

            try:
                response = await client.post(OVERPASS_URL, data={"data": query})
            except httpx.HTTPError:
                continue

            if response.status_code != 200:
                continue

            for el in response.json().get("elements", []):
                if "lat" not in el or "lon" not in el:
                    continue
                el_tags = el.get("tags", {})
                results.append({
                    "name": el_tags.get("name", "Nomsiz"),
                    "type": t,               # qaysi kategoriya — aniq
                    "lat": el["lat"],
                    "lng": el["lon"],
                })

    return results

# ==================== GEOCODING (manzil -> koordinata) ====================

async def geocode_address(query: str) -> dict | None:
    """
    Nominatim orqali manzil nomini koordinataga aylantiradi.
    Masalan: "Registon, Samarqand" -> {"lat": 39.65, "lng": 66.97, "display_name": "..."}
    Topilmasa None qaytaradi.
    """
    params = {
        "q": query,
        "format": "json",
        "limit": 1,
        "countrycodes": "uz",       # faqat O'zbekiston ichida qidiradi
        "accept-language": "uz",
    }
    headers = {
        "User-Agent": "TourlyApp/1.0"   # Nominatim buni talab qiladi, bo'sh qoldirsa rad etadi
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(NOMINATIM_URL, params=params, headers=headers)

    if response.status_code != 200:
        return None

    results = response.json()
    if not results:
        return None

    first = results[0]
    return {
        "lat": float(first["lat"]),
        "lng": float(first["lon"]),
        "display_name": first.get("display_name", query),
    }