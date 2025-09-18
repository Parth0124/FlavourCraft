import re
from typing import List
from fastapi import UploadFile

from config import settings

def validate_email(email: str) -> bool:
    """Validate email format"""
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(email_pattern, email))

def validate_username(username: str) -> bool:
    """Validate username format"""
    # Username must be 3-50 characters, alphanumeric and underscores only
    username_pattern = r'^[a-zA-Z0-9_]{3,50}$'
    return bool(re.match(username_pattern, username))

def validate_image_file(file: UploadFile) -> bool:
    """Validate uploaded image file"""
    try:
        # Check file extension
        if not file.filename:
            return False
        
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension not in settings.ALLOWED_EXTENSIONS:
            return False
        
        # Check file size
        # UploadFile does not have .size attribute; need to read file to get size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)     # Reset pointer
        if file_size > settings.MAX_UPLOAD_SIZE:
            return False
        
        # Check content type
        allowed_content_types = [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/webp'
        ]
        
        if file.content_type not in allowed_content_types:
            return False
        
        return True
    
    except Exception:
        return False

def check_file_safety(file_path: str) -> bool:
    """Basic file safety check"""
    try:
        # Check if file exists and is readable
        with open(file_path, 'rb') as f:
            # Read first few bytes to verify it's an image
            header = f.read(8)
            
            # Check for common image file signatures
            image_signatures = [
                b'\xff\xd8\xff',  # JPEG
                b'\x89PNG\r\n',   # PNG
                b'RIFF'           # WEBP (starts with RIFF)
            ]
            
            return any(header.startswith(sig) for sig in image_signatures)
    
    except Exception:
        return False

def validate_ingredients(ingredients: List[str]) -> List[str]:
    """Validate and clean ingredient list"""
    valid_ingredients = []
    
    for ingredient in ingredients:
        # Clean ingredient name
        cleaned = ingredient.strip().lower()
        
        # Basic validation
        if (len(cleaned) >= 2 and 
            len(cleaned) <= 50 and
            cleaned.replace(' ', '').replace('-', '').isalpha()):
            valid_ingredients.append(cleaned)
    
    return valid_ingredients

def validate_recipe_format(recipe: dict) -> bool:
    """Validate recipe data format"""
    required_fields = ['title', 'steps', 'estimated_time', 'difficulty']
    
    try:
        # Check required fields
        for field in required_fields:
            if field not in recipe:
                return False
        
        # Validate field types
        if not isinstance(recipe['title'], str) or len(recipe['title']) < 3:
            return False
        
        if not isinstance(recipe['steps'], list) or len(recipe['steps']) < 1:
            return False
        
        if not isinstance(recipe['estimated_time'], int) or recipe['estimated_time'] <= 0:
            return False
        
        if recipe['difficulty'] not in ['easy', 'medium', 'hard']:
            return False
        
        return True
    
    except Exception:
        return False
