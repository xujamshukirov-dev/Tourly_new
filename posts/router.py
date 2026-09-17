from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_user
from users.models import User
from posts import crud, schemas

router = APIRouter(prefix="/posts", tags=["posts"])


def _build_post_read(row) -> schemas.PostRead:
    post, likes_count, comments_count, is_liked, is_saved, user = row
    return schemas.PostRead(
        id=post.id,
        user=schemas.UserMini.model_validate(user),
        media=post.media,
        media_type=post.media_type,
        caption=post.caption,
        location_name=post.location_name,
        latitude=post.latitude,
        longitude=post.longitude,
        created_at=post.created_at,
        likes_count=likes_count,
        comments_count=comments_count,
        is_liked=bool(is_liked),
        is_saved=bool(is_saved),
    )


@router.get("/feed")
async def feed(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    rows = await crud.get_feed(db, current_user.id if current_user else None, limit, offset)
    return [_build_post_read(r) for r in rows]


@router.post("/")
async def create_post(
    data: schemas.PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = await crud.create_post(db, current_user.id, data.model_dump())
    row = await crud.get_post_by_id(db, post.id, current_user.id)
    return _build_post_read(row)


@router.get("/{post_id}")
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    row = await crud.get_post_by_id(db, post_id, current_user.id if current_user else None)
    if not row:
        raise HTTPException(status_code=404, detail="Post topilmadi")
    return _build_post_read(row)


@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = await crud.get_post_by_id(db, post_id, current_user.id)
    if not row:
        raise HTTPException(status_code=404, detail="Post topilmadi")
    post = row[0]
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")
    await crud.delete_post(db, post)
    return {"message": "O'chirildi!"}


@router.get("/user/{user_id}")
async def user_posts(
    user_id: int,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    rows = await crud.get_user_posts(db, user_id, current_user.id if current_user else None, limit, offset)
    return [_build_post_read(r) for r in rows]


# ---------- Like ----------
@router.post("/{post_id}/like")
async def like_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    active = await crud.toggle_like(db, current_user.id, post_id)
    return schemas.ToggleResponse(active=active)


# ---------- Save ----------
@router.post("/{post_id}/save")
async def save_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    active = await crud.toggle_save(db, current_user.id, post_id)
    return schemas.ToggleResponse(active=active)


# ---------- Comment ----------
@router.post("/{post_id}/comments")
async def add_comment(
    post_id: int,
    data: schemas.CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = await crud.create_comment(db, current_user.id, post_id, data.comment)
    return schemas.CommentRead(
        id=comment.id,
        user=schemas.UserMini.model_validate(current_user),
        post_id=comment.post_id,
        comment=comment.comment,
        created_at=comment.created_at,
    )


@router.get("/{post_id}/comments")
async def list_comments(
    post_id: int,
    limit: int = 30,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    rows = await crud.get_comments(db, post_id, limit, offset)
    return [
        schemas.CommentRead(
            id=c.id,
            user=schemas.UserMini.model_validate(u),
            post_id=c.post_id,
            comment=c.comment,
            created_at=c.created_at,
        )
        for c, u in rows
    ]


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from sqlalchemy import select
    from posts.models import Comment as CommentModel

    stmt = select(CommentModel).where(CommentModel.id == comment_id)
    comment = (await db.execute(stmt)).scalar_one_or_none()
    if not comment:
        raise HTTPException(status_code=404, detail="Komment topilmadi")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Ruxsat yo'q")

    await crud.delete_comment(db, comment)
    return {"message": "O'chirildi!"}