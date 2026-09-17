from sqlalchemy import select, func, exists, and_
from sqlalchemy.ext.asyncio import AsyncSession
from users.models import User, Follow


async def get_user_profile(db: AsyncSession, user_id: int, current_user_id: int | None = None):
    """
    Bitta SQL so'rov bilan: user ma'lumoti + followers soni + following soni +
    joriy foydalanuvchi uni follow qilganmi — hammasi birga.
    N+1 muammosining oldini oladi.
    """
    followers_count_sq = (
        select(func.count(Follow.id))
        .where(Follow.following_id == User.id)
        .scalar_subquery()
    )
    following_count_sq = (
        select(func.count(Follow.id))
        .where(Follow.follower_id == User.id)
        .scalar_subquery()
    )

    is_following_sq = None
    if current_user_id:
        is_following_sq = (
            select(exists().where(
                and_(
                    Follow.follower_id == current_user_id,
                    Follow.following_id == User.id,
                )
            ))
            .scalar_subquery()
        )

    stmt = select(
        User,
        followers_count_sq.label("followers_count"),
        following_count_sq.label("following_count"),
        (is_following_sq.label("is_following") if is_following_sq is not None else func.false().label("is_following")),
    ).where(User.id == user_id)

    result = await db.execute(stmt)
    row = result.first()
    return row


async def get_followers(db: AsyncSession, user_id: int, limit: int = 20, offset: int = 0):
    """Pagination bilan — hech qachon LIMIT'siz katta ro'yxat qaytarmaymiz"""
    stmt = (
        select(User)
        .join(Follow, Follow.follower_id == User.id)
        .where(Follow.following_id == user_id)
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def toggle_follow(db: AsyncSession, follower_id: int, following_id: int) -> bool:
    """True = follow qilindi, False = unfollow qilindi"""
    if follower_id == following_id:
        raise ValueError("Foydalanuvchi o'zini follow qila olmaydi")

    stmt = select(Follow).where(
        Follow.follower_id == follower_id,
        Follow.following_id == following_id,
    )
    existing = (await db.execute(stmt)).scalar_one_or_none()

    if existing:
        await db.delete(existing)
        await db.commit()
        return False
    else:
        new_follow = Follow(follower_id=follower_id, following_id=following_id)
        db.add(new_follow)
        await db.commit()
        return True

from core.security import hash_password, verify_password


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_username(db: AsyncSession, username: str) -> User | None:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, username: str, email: str, password: str) -> User:
    new_user = User(
        username=username,
        email=email,
        hashed_password=hash_password(password),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    user = await get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user