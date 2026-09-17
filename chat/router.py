from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from users.models import User
from chat import crud, schemas

router = APIRouter(prefix="/messages", tags=["chat"])


@router.get("/")
async def list_messages(
    user: int | None = None,   # ?user=<id> — ma'lum bir suhbat, aks holda barchasi
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if user:
        messages = await crud.get_conversation(db, current_user.id, user)
    else:
        messages = await crud.get_all_messages(db, current_user.id, limit, offset)

    return [schemas.MessageRead.model_validate(m) for m in messages]


@router.post("/")
async def send_message(
    data: schemas.MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = await crud.create_message(db, current_user.id, data.receiver_id, data.text)
    return schemas.MessageRead.model_validate(msg)


@router.get("/{message_id}")
async def get_message(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = await crud.get_message_by_id(db, message_id, current_user.id)
    if not msg:
        raise HTTPException(status_code=404, detail="Xabar topilmadi")
    return schemas.MessageRead.model_validate(msg)


@router.delete("/{message_id}")
async def delete_message(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = await crud.get_message_by_id(db, message_id, current_user.id)
    if not msg:
        raise HTTPException(status_code=404, detail="Xabar topilmadi")
    await crud.delete_message(db, msg)
    return {"message": "O'chirildi"}


@router.post("/mark-read")
async def mark_read(
    data: schemas.MarkReadRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await crud.mark_as_read(db, current_user.id, data.sender_id)
    return {"message": "O'qilgan deb belgilandi"}