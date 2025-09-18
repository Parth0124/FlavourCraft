from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class GeneratedRecipeRequest(BaseModel):
    ingredients: List[str] = Field(..., min_items=1)
    dietary_preferences: Optional[List[str]] = []
    cuisine_type: Optional[str] = None
    difficulty_preference: Optional[str] = None

class GeneratedRecipe(BaseModel):
    title: str
    steps: List[str]
    estimated_time: int  # in minutes
    difficulty: str
    tips: Optional[str] = None
    servings: int = 4

class GeneratedRecipeDocument(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    ingredients: List[str]
    generated_recipe: GeneratedRecipe
    source: str = "openai_gpt4"
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)
    is_favorite: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class GeneratedRecipeResponse(BaseModel):
    id: str = Field(alias="_id")
    ingredients: List[str]
    generated_recipe: GeneratedRecipe
    source: str
    confidence_score: float
    is_favorite: bool
    timestamp: datetime

    class Config:
        populate_by_name = True

class RecipeHistoryResponse(BaseModel):
    recipes: List[GeneratedRecipeResponse]
    total_count: int
    page: int
    per_page: int