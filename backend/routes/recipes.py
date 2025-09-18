from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from models.static_recipe import StaticRecipe, RecipeSearchParams, RecipeFilter
from models.generated_recipe import (
    GeneratedRecipeRequest, GeneratedRecipeResponse, 
    RecipeHistoryResponse, GeneratedRecipeDocument
)
from models.user import UserDocument
from services.recipe_service import (
    search_static_recipes, generate_ai_recipe, get_user_recipe_history
)
from dependencies import get_current_user, get_optional_user, get_db

router = APIRouter()

# Static Recipe Routes
@router.get("/static", response_model=List[StaticRecipe])
async def get_static_recipes(
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0),
    tags: Optional[str] = Query(default=None),
    difficulty: Optional[str] = Query(default=None),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Browse static recipes"""
    try:
        filter_dict = {}
        
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            filter_dict["tags"] = {"$in": tag_list}
        
        if difficulty:
            filter_dict["difficulty"] = difficulty
        
        cursor = db.static_recipes.find(filter_dict).skip(skip).limit(limit)
        recipes = await cursor.to_list(length=limit)
        
        return [StaticRecipe(**recipe) for recipe in recipes]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch recipes"
        )

@router.get("/static/search")
async def search_recipes(
    query: Optional[str] = Query(default=None),
    tags: Optional[str] = Query(default=None),
    ingredients: Optional[str] = Query(default=None),
    difficulty: Optional[str] = Query(default=None),
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Search static recipes with filters"""
    try:
        search_params = RecipeSearchParams(
            query=query,
            filters=RecipeFilter(
                tags=tags.split(',') if tags else None,
                ingredients=ingredients.split(',') if ingredients else None,
                difficulty=difficulty
            ),
            limit=limit,
            skip=skip
        )
        
        recipes = await search_static_recipes(search_params, db)
        return recipes
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Search failed"
        )

@router.get("/static/{recipe_id}")
async def get_static_recipe(
    recipe_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get specific static recipe"""
    try:
        if not ObjectId.is_valid(recipe_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid recipe ID"
            )
        
        recipe = await db.static_recipes.find_one({"_id": ObjectId(recipe_id)})
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        return StaticRecipe(**recipe)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch recipe"
        )

# AI-Generated Recipe Routes
@router.post("/generate", response_model=GeneratedRecipeResponse)
async def generate_recipe(
    request: GeneratedRecipeRequest,
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Generate AI recipe from ingredients"""
    try:
        # Generate recipe using AI service
        generated_recipe = await generate_ai_recipe(request, current_user.preferences)
        
        # Create recipe document
        recipe_doc = GeneratedRecipeDocument(
            user_id=current_user.id,
            ingredients=request.ingredients,
            generated_recipe=generated_recipe,
            confidence_score=0.85  # Mock confidence score
        )
        
        # Save to database
        result = await db.generated_recipes.insert_one(recipe_doc.dict(by_alias=True))
        recipe_doc.id = result.inserted_id
        
        return GeneratedRecipeResponse(**recipe_doc.dict(by_alias=True))
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Recipe generation failed"
        )

@router.get("/history", response_model=RecipeHistoryResponse)
async def get_recipe_history(
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0),
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's recipe generation history"""
    try:
        history = await get_user_recipe_history(current_user.id, limit, skip, db)
        return history
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch recipe history"
        )

@router.get("/generated/{recipe_id}", response_model=GeneratedRecipeResponse)
async def get_generated_recipe(
    recipe_id: str,
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get specific generated recipe"""
    try:
        if not ObjectId.is_valid(recipe_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid recipe ID"
            )
        
        recipe = await db.generated_recipes.find_one({
            "_id": ObjectId(recipe_id),
            "user_id": current_user.id
        })
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        return GeneratedRecipeResponse(**recipe)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch recipe"
        )

@router.put("/generated/{recipe_id}/favorite")
async def toggle_favorite(
    recipe_id: str,
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Toggle favorite status of generated recipe"""
    try:
        if not ObjectId.is_valid(recipe_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid recipe ID"
            )
        
        recipe = await db.generated_recipes.find_one({
            "_id": ObjectId(recipe_id),
            "user_id": current_user.id
        })
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        new_favorite_status = not recipe.get("is_favorite", False)
        
        await db.generated_recipes.update_one(
            {"_id": ObjectId(recipe_id)},
            {"$set": {"is_favorite": new_favorite_status}}
        )
        
        return {
            "message": f"Recipe {'added to' if new_favorite_status else 'removed from'} favorites",
            "is_favorite": new_favorite_status
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update favorite status"
        )