import motor.motor_asyncio
from typing import Optional
from pymongo import IndexModel, TEXT

from config import settings
from utils.logger import setup_logger

logger = setup_logger(__name__)

# Global database connection
_database: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None

async def get_database() -> motor.motor_asyncio.AsyncIOMotorDatabase:
    """Get database connection"""
    global _database
    
    if _database is None:
        try:
            client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
            _database = client.get_default_database()
            
            # Test connection
            await client.admin.command('ismaster')
            logger.info("Database connection established")
            
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    return _database

async def create_indexes(db: motor.motor_asyncio.AsyncIOMotorDatabase):
    """Create database indexes for optimal performance"""
    try:
        # Users collection indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.users.create_index("created_at")
        
        # Static recipes collection indexes
        await db.static_recipes.create_index([("title", TEXT), ("instructions", TEXT)])
        await db.static_recipes.create_index("tags")
        await db.static_recipes.create_index("ingredients")
        await db.static_recipes.create_index("difficulty")
        await db.static_recipes.create_index([("prep_time", 1), ("cook_time", 1)])
        
        # Generated recipes collection indexes
        await db.generated_recipes.create_index([("user_id", 1), ("timestamp", -1)])
        await db.generated_recipes.create_index([("user_id", 1), ("is_favorite", 1)])
        await db.generated_recipes.create_index("timestamp")
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Index creation failed: {e}")
        raise

async def aggregate_user_data(user_id: str, db: motor.motor_asyncio.AsyncIOMotorDatabase) -> dict:
    """Aggregate user statistics"""
    try:
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": None,
                "total_recipes": {"$sum": 1},
                "favorite_count": {"$sum": {"$cond": ["$is_favorite", 1, 0]}},
                "avg_confidence": {"$avg": "$confidence_score"}
            }}
        ]
        
        result = await db.generated_recipes.aggregate(pipeline).to_list(1)
        
        if result:
            return result[0]
        else:
            return {
                "total_recipes": 0,
                "favorite_count": 0,
                "avg_confidence": 0.0
            }
    
    except Exception as e:
        logger.error(f"User data aggregation failed: {e}")
        return {"total_recipes": 0, "favorite_count": 0, "avg_confidence": 0.0}

async def backup_user_recipes(user_id: str, db: motor.motor_asyncio.AsyncIOMotorDatabase) -> list:
    """Export user recipe data"""
    try:
        cursor = db.generated_recipes.find({"user_id": user_id})
        recipes = await cursor.to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for recipe in recipes:
            recipe["_id"] = str(recipe["_id"])
            recipe["user_id"] = str(recipe["user_id"])
        
        return recipes
    
    except Exception as e:
        logger.error(f"Recipe backup failed: {e}")
        return []