from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.database import engine, Base
from users.router import router as users_router
from users import models as users_models
from menu.router import router as menu_router
from menu import models as menu_models
from posts.router import router as posts_router
from posts import models as posts_models
from bookings.router import router as bookings_router
from bookings import models as bookings_models
from chat.router import router as chat_router
from chat import models as chat_models
from notifications.router import router as notifications_router
from notifications import models as notifications_models
from ai.router import router as ai_router
from asosiy.router import router as asosiy_router
from route.router import router as route_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="Tourly API", lifespan=lifespan)

app.include_router(users_router)
app.include_router(menu_router)
app.include_router(posts_router)
app.include_router(bookings_router)
app.include_router(chat_router)
app.include_router(notifications_router)
app.include_router(ai_router)
app.include_router(asosiy_router)
app.include_router(route_router)


@app.get("/")
def home():
    return {"message": "Salom, jiyan!"}