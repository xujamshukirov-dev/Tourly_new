from sqlalchemy import select, func, exists, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from posts.models import Post, Like, Comment, Save
from users.models import User


def _post_query(current_user_id: int | None = None):
    likes_count_sq = select(func.count(Like.id)).where(Like.post_id == Post.id).scalar_subquery()
    comments_count_sq = select(func.count(Comment.id)).where(Comment.post_id == Post.id).scalar_subquery()

    if current_user_id:
        is_liked_sq = select(exists().where(and_(Like.post_id == Post.id, Like.user_id == current_user_id))).scalar_subquery()
        is_saved_sq = select(exists().where(and_(Save.post_id == Post.id, Save.user_id == current_user_id))).scalar_subquery()
    else:
        is_liked_sq = func.false()
        is_saved_sq = func.false()

    return select(
        Post,
        likes_count_sq.label("likes_count"),
        comments_count_sq.label("comments_count"),
        is_liked_sq.label("is_liked"),
        is_saved_sq.label("is_saved"),
    )

async def get_feed(db: AsyncSession, current_user_id: int | None, limit: int = 20, offset: int = 0):
    """Umumiy feed — eng yangi postlar birinchi"""
    stmt = (
        _post_query(current_user_id)
        .join(User, User.id == Post.user_id)
        .add_columns(User)
        .order_by(desc(Post.created_at))
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.all()


async def get_post_by_id(db: AsyncSession, post_id: int, current_user_id: int | None):
    stmt = (
        _post_query(current_user_id)
        .join(User, User.id == Post.user_id)
        .add_columns(User)
        .where(Post.id == post_id)
    )
    result = await db.execute(stmt)
    return result.first()


async def get_user_posts(db: AsyncSession, user_id: int, current_user_id: int | None, limit: int = 20, offset: int = 0):
    """Profil sahifasi — bitta userning postlari"""
    stmt = (
        _post_query(current_user_id)
        .join(User, User.id == Post.user_id)
        .add_columns(User)
        .where(Post.user_id == user_id)
        .order_by(desc(Post.created_at))
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.all()


async def create_post(db: AsyncSession, user_id: int, data: dict) -> Post:
    post = Post(user_id=user_id, **data)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


async def delete_post(db: AsyncSession, post: Post):
    await db.delete(post)
    await db.commit()


# ---------- Like ----------
async def toggle_like(db: AsyncSession, user_id: int, post_id: int) -> bool:
    stmt = select(Like).where(Like.user_id == user_id, Like.post_id == post_id)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        await db.delete(existing)
        await db.commit()
        return False
    db.add(Like(user_id=user_id, post_id=post_id))
    await db.commit()
    return True


# ---------- Save ----------
async def toggle_save(db: AsyncSession, user_id: int, post_id: int) -> bool:
    stmt = select(Save).where(Save.user_id == user_id, Save.post_id == post_id)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        await db.delete(existing)
        await db.commit()
        return False
    db.add(Save(user_id=user_id, post_id=post_id))
    await db.commit()
    return True


# ---------- Comment ----------
async def create_comment(db: AsyncSession, user_id: int, post_id: int, text: str) -> Comment:
    comment = Comment(user_id=user_id, post_id=post_id, comment=text)
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment


async def get_comments(db: AsyncSession, post_id: int, limit: int = 30, offset: int = 0):
    stmt = (
        select(Comment, User)
        .join(User, User.id == Comment.user_id)
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at)
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.all()


async def delete_comment(db: AsyncSession, comment: Comment):
    await db.delete(comment)
    await db.commit()

async def search_posts(db: AsyncSession, query: str, current_user_id: int | None, limit: int = 20):
    stmt = (
        _post_query(current_user_id)
        .join(User, User.id == Post.user_id)
        .add_columns(User)
        .where(Post.caption.icontains(query))
        .order_by(desc(Post.created_at))
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.all()