import aiohttp
import asyncio
import base64
from typing import List, Dict, Any
from PIL import Image
import io

from config import settings
from utils.logger import setup_logger

logger = setup_logger(__name__)

async def detect_local_ingredients(image_path: str) -> List[Dict[str, Any]]:
    """Detect ingredients using local ML models"""
    try:
        # Mock implementation - replace with actual HuggingFace model
        # This would use transformers library to load and run local models
        
        # For now, return mock data
        mock_ingredients = [
            {"name": "tomato", "confidence": 0.92, "source": "local_ml"},
            {"name": "onion", "confidence": 0.87, "source": "local_ml"},
            {"name": "garlic", "confidence": 0.75, "source": "local_ml"},
        ]
        
        # Simulate processing time
        await asyncio.sleep(0.1)
        
        logger.info(f"Local ML detected {len(mock_ingredients)} ingredients from {image_path}")
        return mock_ingredients
    
    except Exception as e:
        logger.error(f"Local ML detection failed: {e}")
        return []

async def detect_openai_ingredients(image_path: str) -> List[Dict[str, Any]]:
    """Detect ingredients using OpenAI Vision API"""
    try:
        import openai
        
        # Load and encode image
        with open(image_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        response = await client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Identify all food ingredients visible in this image. Return only a comma-separated list of ingredient names, no descriptions or additional text."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_data}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        # Parse response
        ingredients_text = response.choices[0].message.content.strip()
        ingredient_names = [name.strip().lower() for name in ingredients_text.split(',')]
        
        # Convert to structured format
        ingredients = [
            {"name": name, "confidence": 0.85, "source": "openai_vision"}
            for name in ingredient_names if name
        ]
        
        logger.info(f"OpenAI Vision detected {len(ingredients)} ingredients from {image_path}")
        return ingredients
    
    except Exception as e:
        logger.error(f"OpenAI Vision detection failed: {e}")
        return []

def merge_detection_results(local_results: List[Dict], openai_results: List[Dict]) -> List[Dict]:
    """Merge and score results from different detection methods"""
    try:
        ingredient_scores = {}
        
        # Process local ML results
        for ingredient in local_results:
            name = ingredient["name"].lower()
            ingredient_scores[name] = {
                "name": name,
                "confidence": ingredient["confidence"] * 0.6,  # Weight local ML at 60%
                "sources": ["local_ml"]
            }
        
        # Process OpenAI results
        for ingredient in openai_results:
            name = ingredient["name"].lower()
            if name in ingredient_scores:
                # Boost confidence for agreement between sources
                ingredient_scores[name]["confidence"] = min(
                    (ingredient_scores[name]["confidence"] + ingredient["confidence"] * 0.4) * 1.2,
                    1.0
                )
                ingredient_scores[name]["sources"].append("openai_vision")
            else:
                ingredient_scores[name] = {
                    "name": name,
                    "confidence": ingredient["confidence"] * 0.4,  # Weight OpenAI at 40% when alone
                    "sources": ["openai_vision"]
                }
        
        # Convert back to list and sort by confidence
        merged_results = [
            {
                "name": data["name"],
                "confidence": data["confidence"],
                "sources": data["sources"]
            }
            for data in ingredient_scores.values()
            if data["confidence"] > 0.3  # Filter low confidence results
        ]
        
        merged_results.sort(key=lambda x: x["confidence"], reverse=True)
        
        logger.info(f"Merged results: {len(merged_results)} ingredients after filtering")
        return merged_results
    
    except Exception as e:
        logger.error(f"Result merging failed: {e}")
        return []

async def validate_ingredients(ingredients: List[str]) -> List[str]:
    """Validate and clean ingredient list"""
    try:
        # Common ingredient validation
        valid_ingredients = []
        
        for ingredient in ingredients:
            # Clean and normalize
            cleaned = ingredient.strip().lower()
            
            # Filter out non-food items (basic list)
            non_food_items = ['plate', 'bowl', 'table', 'hand', 'person', 'kitchen', 'utensil']
            
            if cleaned and len(cleaned) > 2 and cleaned not in non_food_items:
                valid_ingredients.append(cleaned)
        
        return valid_ingredients
    
    except Exception as e:
        logger.error(f"Ingredient validation failed: {e}")
        return ingredients