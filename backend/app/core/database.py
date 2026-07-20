from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings


mongo_client = AsyncIOMotorClient(settings.mongo_url)
db = mongo_client[settings.db_name]


async def close_database_connection() -> None:
    mongo_client.close()
