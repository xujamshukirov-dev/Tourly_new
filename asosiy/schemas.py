from pydantic import BaseModel
from posts.schemas import PostRead
from menu.schemas import GuidePublicRead, TaxiPublicRead, HomeRentPublicRead, RestoranPublicRead, HotelPublicRead


class HomeResponse(BaseModel):
    tourism_posts: list[PostRead]
    guides: list[GuidePublicRead]
    taxis: list[TaxiPublicRead]
    homes: list[HomeRentPublicRead]
    restorans: list[RestoranPublicRead]
    hotels: list[HotelPublicRead]
    latest_posts: list[PostRead]


class SearchResponse(BaseModel):
    posts: list[PostRead]
    guides: list[GuidePublicRead]
    hotels: list[HotelPublicRead]
    restorans: list[RestoranPublicRead]