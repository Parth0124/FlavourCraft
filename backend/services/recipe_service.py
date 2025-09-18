import openai
import json
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.static_recipe import RecipeSearchParams, StaticRecipe
from models.generated_recipe import GeneratedRecipeRequest, GeneratedRecipe, RecipeHistoryResponse, GeneratedRecipeResponse
from config import settings
from utils.logger import setup_logger

logger = setup_logger(__name__)

async def generate_ai_recipe(
    request: GeneratedRecipeRequest, 
    user_preferences: Optional[Dict] = None
) -> GeneratedRecipe:
    """Generate recipe using OpenAI"""
    try:
        client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Build prompt based on ingredients and preferences
        ingredients_text = ", ".join(request.ingredients)
        dietary_text = ", ".join(request.dietary_preferences) if request.dietary_preferences else "none"
        
        prompt = f"""Create a detailed recipe using these ingredients: {ingredients_text}

Dietary preferences: {dietary_text}
Cuisine preference: {request.cuisine_type or 'any'}
Difficulty preference: {request.difficulty_preference or 'any'}

Please provide a JSON response with the following structure:
{{
    "title": "Recipe name",
    "steps": ["Step 1 instruction", "Step 2 instruction", ...],
    "estimated_time": 30,
    "difficulty": "easy/medium/hard",
    "tips": "Cooking tips or variations",
    "servings": 4
}}

Make sure the recipe is practical, uses common cooking techniques, and the steps are clear and detailed."""
        
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert chef and recipe creator. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        # Parse the JSON response
        recipe_text = response.choices[0].message.content.strip()
        
        # Clean up the response if it has markdown formatting
        if recipe_text.startswith('```json'):
            recipe_text = recipe_text[7:-3]
        elif recipe_text.startswith('```'):
            recipe_text = recipe_text[3:-3]
        
        recipe_data = json.loads(recipe_text)
        
        # Create GeneratedRecipe object
        generated_recipe = GeneratedRecipe(**recipe_data)
        
        logger.info(f"Generated recipe: {generated_recipe.title}")
        return generated_recipe
    
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse OpenAI response: {e}")
        return await fallback_rule_based_recipe(request)
    except Exception as e:
        logger.error(f"Recipe generation failed: {e}")
        return await fallback_rule_based_recipe(request)

async def fallback_rule_based_recipe(request: GeneratedRecipeRequest) -> GeneratedRecipe:
    """Fallback rule-based recipe generation"""
    try:
        ingredients = request.ingredients
        
        # Simple rule-based recipe generation
        if any(grain in ingredients for grain in ['rice', 'pasta', 'noodles']):
            recipe_type = "grain_based"
        elif any(protein in ingredients for protein in ['chicken', 'beef', 'fish', 'paneer', 'tofu']):
            recipe_type = "protein_based"
        else:
            recipe_type = "vegetable_stir_fry"
        
        recipes = {
            "grain_based": GeneratedRecipe(
                title=f"{ingredients[0].title()} Bowl",
                steps=[
                    f"Prepare all ingredients: {', '.join(ingredients)}",
                    "Heat oil in a large pan or wok",
                    "Add aromatics (onion, garlic, ginger) if available",
                    f"Add main ingredients and cook until tender",
                    "Season with salt, pepper, and available spices",
                    "Serve hot and enjoy!"
                ],
                estimated_time=25,
                difficulty="easy",
                tips="Feel free to adjust seasoning to taste",
                servings=4
            ),
            "protein_based": GeneratedRecipe(
                title=f"Simple {ingredients[0].title()} Dish",
                steps=[
                    f"Clean and prepare {ingredients[0]}",
                    "Heat oil in a pan",
                    "Cook protein until golden brown",
                    "Add vegetables and seasonings",
                    "Cook until everything is well combined",
                    "Serve with rice or bread"
                ],
                estimated_time=30,
                difficulty="medium",
                tips="Don't overcook the protein",
                servings=4
            ),
            "vegetable_stir_fry": GeneratedRecipe(
                title="Mixed Vegetable Stir Fry",
                steps=[
                    "Wash and chop all vegetables",
                    "Heat oil in a wok or large pan",
                    "Add harder vegetables first",
                    "Stir fry on high heat",
                    "Add softer vegetables",
                    "Season and serve hot"
                ],
                estimated_time=15,
                difficulty="easy",
                tips="Keep vegetables crispy for better texture",
                servings=4
            )
        }
        
        return recipes.get(recipe_type, recipes["vegetable_stir_fry"])
    
    except Exception as e:
        logger.error(f"Fallback recipe generation failed: {e}")
        # Return absolute fallback
        return GeneratedRecipe(
            title="Simple Ingredient Mix",
            steps=[
                "Combine all available ingredients",
                "Cook with basic seasonings",
                "Adjust taste as needed"
            ],
            estimated_time=20,
            difficulty="easy",
            tips="This is a basic combination of your ingredients",
            servings=4
        )

async def search_static_recipes(
    search_params: RecipeSearchParams,
    db: AsyncIOMotorDatabase
) -> List[StaticRecipe]:
    """Search static recipes with advanced filtering"""
    try:
        query = {}
        
        # Text search
        if search_params.query:
            query["$text"] = {"$search": search_params.query}
        
        # Apply filters
        if search_params.filters:
            filters = search_params.filters
            
            if filters.tags:
                query["tags"] = {"$in": filters.tags}
            
            if filters.ingredients:
                query["ingredients"] = {"$in": filters.ingredients}
            
            if filters.difficulty:
                query["difficulty"] = filters.difficulty
            
            if filters.max_prep_time:
                query["prep_time"] = {"$lte": filters.max_prep_time}
            
            if filters.max_cook_time:
                query["cook_time"] = {"$lte": filters.max_cook_time}
        
        cursor = db.static_recipes.find(query).skip(search_params.skip).limit(search_params.limit)
        recipes = await cursor.to_list(length=search_params.limit)
        
        return [StaticRecipe(**recipe) for recipe in recipes]
    
    except Exception as e:
        logger.error(f"Recipe search failed: {e}")
        return []

async def get_user_recipe_history(
    user_id: str,
    limit: int,
    skip: int,
    db: AsyncIOMotorDatabase
) -> RecipeHistoryResponse:
    """Get user's recipe generation history"""
    try:
        cursor = db.generated_recipes.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).skip(skip).limit(limit)
        
        recipes = await cursor.to_list(length=limit)
        
        # Get total count
        total_count = await db.generated_recipes.count_documents({"user_id": user_id})
        
        recipe_responses = [GeneratedRecipeResponse(**recipe) for recipe in recipes]
        
        return RecipeHistoryResponse(
            recipes=recipe_responses,
            total_count=total_count,
            page=skip // limit + 1,
            per_page=limit
        )
    
    except Exception as e:
        logger.error(f"Failed to fetch recipe history: {e}")
        return RecipeHistoryResponse(recipes=[], total_count=0, page=1, per_page=limit)
