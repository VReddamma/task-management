from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.config import settings

# 1. Create database engine
engine = create_async_engine(settings.DATABASE_URL, echo=True)

# 2. Create session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


# 3. Database Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
