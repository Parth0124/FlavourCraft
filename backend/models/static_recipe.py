from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class NutritionInfo(BaseModel):
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class StaticRecipe(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    ingredients: List[str]
    instructions: str
    tags: List[str]
    difficulty: str = Field(..., regex="^(easy|medium|hard)$")
    prep_time: int = Field(..., gt=0)  # in minutes
    cook_time: int = Field(..., gt=0)  # in minutes
    servings: int = Field(default=4, gt=0)
    nutrition: Optional[NutritionInfo] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class StaticRecipeCreate(BaseModel):
    title: str
    ingredients: List[str]
    instructions: str
    tags: List[str]
    difficulty: str
    prep_time: int
    cook_time: int
    servings: int = 4
    nutrition: Optional[NutritionInfo] = None

class RecipeFilter(BaseModel):
    tags: Optional[List[str]] = None
    ingredients: Optional[List[str]] = None
    difficulty: Optional[str] = None
    max_prep_time: Optional[int] = None
    max_cook_time: Optional[int] = None

class RecipeSearchParams(BaseModel):
    query: Optional[str] = None
    filters: Optional[RecipeFilter] = None
    limit: int = Field(default=20, le=100)
    skip: int = Field(default=0, ge=0)
