import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.user import UserCreate, UserDocument
from utils.hashing import hash_password, verify_password
from config import settings
from utils.logger import setup_logger

logger = setup_logger(__name__)

def create_access_token(data: Dict[str, Any]) -> str:
    """Create JWT access token"""
    try:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )
        
        return encoded_jwt
    except Exception as e:
        logger.error(f"Token creation failed: {e}")
        raise

def verify_token(token: str) -> Dict[str, Any]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Token expired")
        raise jwt.PyJWTError("Token expired")
    except jwt.JWTError as e:
        logger.warning(f"Token verification failed: {e}")
        raise

async def register_user(user_data: UserCreate, db: AsyncIOMotorDatabase) -> str:
    """Register a new user"""
    try:
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user document
        user_doc = UserDocument(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password,
            created_at=datetime.utcnow()
        )
        
        # Insert into database
        result = await db.users.insert_one(user_doc.dict(by_alias=True, exclude={"id"}))
        
        logger.info(f"User registered successfully: {user_data.email}")
        return str(result.inserted_id)
    
    except Exception as e:
        logger.error(f"User registration failed: {e}")
        raise

async def authenticate_user(email: str, password: str, db: AsyncIOMotorDatabase) -> Optional[Dict[str, Any]]:
    """Authenticate user with email and password"""
    try:
        # Find user by email
        user = await db.users.find_one({"email": email})
        
        if not user:
            logger.warning(f"Authentication failed: user not found - {email}")
            return None
        
        # Verify password
        if not verify_password(password, user["password_hash"]):
            logger.warning(f"Authentication failed: invalid password - {email}")
            return None
        
        logger.info(f"User authenticated successfully: {email}")
        return user
    
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        return None

async def update_user_data(user_id: str, update_data: Dict[str, Any], db: AsyncIOMotorDatabase) -> bool:
    """Update user data"""
    try:
        result = await db.users.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0
    
    except Exception as e:
        logger.error(f"User update failed: {e}")
        return False
