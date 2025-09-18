from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

from models.user import UserDocument, UserUpdate, UserResponse, UserPreferences
from models.generated_recipe import GeneratedRecipeResponse
from dependencies import get_current_user, get_db

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: UserDocument = Depends(get_current_user)
):
    """Get current user profile"""
    try:
        return UserResponse(**current_user.dict(by_alias=True))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch profile"
        )

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update user profile"""
    try:
        update_data = {}
        
        if user_update.username:
            # Check if username is already taken
            existing_user = await db.users.find_one({
                "username": user_update.username,
                "_id": {"$ne": current_user.id}
            })
            
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
            
            update_data["username"] = user_update.username
        
        if user_update.preferences:
            update_data["preferences"] = user_update.preferences.dict()
        
        if update_data:
            await db.users.update_one(
                {"_id": current_user.id},
                {"$set": update_data}
            )
        
        # Fetch updated user
        updated_user = await db.users.find_one({"_id": current_user.id})
        return UserResponse(**updated_user)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile update failed"
        )

@router.get("/history")
async def get_user_history(
    limit: int = Query(default=50, le=200),
    skip: int = Query(default=0, ge=0),
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get complete user cooking history"""
    try:
        cursor = db.generated_recipes.find(
            {"user_id": current_user.id}
        ).sort("timestamp", -1).skip(skip).limit(limit)
        
        recipes = await cursor.to_list(length=limit)
        
        # Get total count
        total_count = await db.generated_recipes.count_documents(
            {"user_id": current_user.id}
        )
        
        recipe_responses = [GeneratedRecipeResponse(**recipe) for recipe in recipes]
        
        return {
            "recipes": recipe_responses,
            "total_count": total_count,
            "page": skip // limit + 1,
            "per_page": limit
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch history"
        )

@router.get("/favorites", response_model=List[GeneratedRecipeResponse])
async def get_favorite_recipes(
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's favorite recipes"""
    try:
        cursor = db.generated_recipes.find({
            "user_id": current_user.id,
            "is_favorite": True
        }).sort("timestamp", -1)
        
        recipes = await cursor.to_list(length=None)
        return [GeneratedRecipeResponse(**recipe) for recipe in recipes]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch favorites"
        )

@router.delete("/account")
async def delete_user_account(
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete user account and all associated data"""
    try:
        # Delete user's generated recipes
        await db.generated_recipes.delete_many({"user_id": current_user.id})
        
        # Delete user account
        await db.users.delete_one({"_id": current_user.id})
        
        return {"message": "Account deleted successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Account deletion failed"
        )