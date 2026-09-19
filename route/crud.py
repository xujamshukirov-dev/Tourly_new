import httpx
import math

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


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Ikki koordinata orasidagi masofa (km)."""
    R = 6371
    la1, lo1 = math.radians(lat1), math.radians(lng1)
    la2, lo2 = math.radians(lat2), math.radians(lng2)
    dlat, dlng = la2 - la1, lo2 - lo1
    h = math.sin(dlat / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin(dlng / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


def _build_bbox(coords: list[dict], padding: float = 0.05) -> tuple[float, float, float, float]:
    """Marshrut atrofidagi qidiruv maydonini (bounding box) hisoblash."""
    lats = [c["lat"] for c in coords]
    lngs = [c["lng"] for c in coords]
    return (
        min(lats) - padding,
        min(lngs) - padding,
        max(lats) + padding,
        max(lngs) + padding,
    )


def _sample_route_points(coords: list[dict], interval_km: float = 10) -> list[dict]:
    """Marshrut bo'ylab har `interval_km` kilometrda bitta nuqta tanlaydi."""
    if len(coords) <= 2:
        return coords

    selected = [coords[0]]
    accumulated = 0.0

    for i in range(1, len(coords)):
        accumulated += _haversine_km(
            coords[i - 1]["lat"], coords[i - 1]["lng"],
            coords[i]["lat"], coords[i]["lng"],
        )
        if accumulated >= interval_km:
            selected.append(coords[i])
            accumulated = 0.0

    if selected[-1] != coords[-1]:
        selected.append(coords[-1])

    return selected

async def get_pois_along_route(coords: list[dict], poi_type: str) -> list[dict]:
    """
    Uzun yo'lni ~50 km'lik segmentlarga bo'lib, har biriga alohida
    (kichik) bbox bilan Overpass so'rovi yuboradi — Overpass juda katta
    bbox'ni (masalan butun mamlakat) 406 bilan rad etadi, shuning uchun
    bo'lib-bo'lib so'raymiz. Keyin har 10 km segmentdan eng yaqin 1 tasini olamiz.
    """
    if poi_type == "fuel":
        tag_query = 'node["amenity"="fuel"]'
    else:  # food
        tag_query = 'node["amenity"~"restaurant|cafe|fast_food"]'

    # Yo'lni ~50 km'lik bo'laklarga bo'lamiz, har biriga alohida so'rov
    chunk_points = _sample_route_points(coords, interval_km=50)
    all_elements = []
    seen_element_ids = set()

    async with httpx.AsyncClient(timeout=30.0) as client:
        for i in range(len(chunk_points) - 1):
            chunk_coords = [chunk_points[i], chunk_points[i + 1]]
            south, west, north, east = _build_bbox(chunk_coords, padding=0.1)

            query = f"""
            [out:json][timeout:25];
            {tag_query}({south},{west},{north},{east});
            out body;
            """

            try:
                response = await client.post(
                    OVERPASS_URL,
                    data={"data": query},
                    headers={
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "TourlyApp/1.0",
                    },
                )
            except httpx.HTTPError:
                continue

            if response.status_code != 200:
                continue

            for el in response.json().get("elements", []):
                if el["id"] in seen_element_ids:
                    continue
                seen_element_ids.add(el["id"])
                all_elements.append(el)

    if not all_elements:
        return []

    # ---- Har 10 km segmentdan eng yaqin 1 tasini tanlaymiz ----
    sample_points = _sample_route_points(coords, interval_km=10)

    results = []
    seen_ids = set()

    for point in sample_points:
        closest = None
        closest_dist = None

        for el in all_elements:
            if "lat" not in el or "lon" not in el:
                continue
            if el["id"] in seen_ids:
                continue

            dist = _haversine_km(point["lat"], point["lng"], el["lat"], el["lon"])
            if dist > 8:
                continue

            if closest is None or dist < closest_dist:
                closest = el
                closest_dist = dist

        if closest is not None:
            seen_ids.add(closest["id"])
            tags = closest.get("tags", {})
            results.append({
                "name": tags.get("name", "Nomsiz"),
                "type": poi_type,
                "lat": closest["lat"],
                "lng": closest["lon"],
            })

    return results


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
                response = await client.post(
                    OVERPASS_URL,
                    data={"data": query},
                    headers={
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "TourlyApp/1.0",
                    },
                )
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