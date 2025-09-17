from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from contextlib import asynccontextmanager

from routes import auth, upload, recipes, users
from config import settings
from utils.logger import setup_logger
from services.storage_service import get_database, create_indexes

# Setup logging
logger = setup_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting AI Recipe Generator Backend...")
    
    # Initialize database and create indexes
    try:
        db = await get_database()
        await create_indexes(db)
        logger.info("Database connection established and indexes created")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Recipe Generator Backend...")

# Create FastAPI application
app = FastAPI(
    title="AI Recipe Generator API",
    description="Backend API for intelligent recipe generation through image analysis",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(upload.router, prefix="/upload", tags=["Image Upload"])
app.include_router(recipes.router, prefix="/recipes", tags=["Recipes"])
app.include_router(users.router, prefix="/users", tags=["Users"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "AI Recipe Generator API is running"}

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=4000,
        reload=settings.ENVIRONMENT == "development"
    )