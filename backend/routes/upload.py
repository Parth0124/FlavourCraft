import os
import uuid
import aiofiles
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.user import UserDocument
from services.ingredient_service import detect_local_ingredients, detect_openai_ingredients, merge_detection_results
from dependencies import get_current_user, get_db
from utils.validators import validate_image_file
from config import settings

router = APIRouter()

# Create uploads directory if it doesn't exist
os.makedirs("uploads/temp", exist_ok=True)

@router.post("/")
async def upload_images(
    files: List[UploadFile] = File(...),
    current_user: UserDocument = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload images and detect ingredients"""
    try:
        if len(files) > 5:  # Limit to 5 images
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum 5 images allowed"
            )
        
        upload_id = str(uuid.uuid4())
        saved_files = []
        
        # Validate and save files
        for file in files:
            if not validate_image_file(file):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid file: {file.filename}"
                )
            
            # Generate unique filename
            file_extension = file.filename.split('.')[-1].lower()
            unique_filename = f"{upload_id}_{uuid.uuid4()}.{file_extension}"
            file_path = f"uploads/temp/{unique_filename}"
            
            # Save file
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            saved_files.append(file_path)
        
        # Process images for ingredient detection
        all_ingredients = []
        
        for file_path in saved_files:
            try:
                # Local ML detection
                local_ingredients = await detect_local_ingredients(file_path)
                
                # OpenAI Vision detection
                openai_ingredients = await detect_openai_ingredients(file_path)
                
                # Merge results
                merged_ingredients = merge_detection_results(local_ingredients, openai_ingredients)
                all_ingredients.extend(merged_ingredients)
                
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                continue
        
        # Remove duplicates and sort by confidence
        unique_ingredients = {}
        for ingredient in all_ingredients:
            name = ingredient['name'].lower()
            if name not in unique_ingredients or ingredient['confidence'] > unique_ingredients[name]['confidence']:
                unique_ingredients[name] = ingredient
        
        final_ingredients = sorted(
            unique_ingredients.values(),
            key=lambda x: x['confidence'],
            reverse=True
        )
        
        # Clean up temporary files
        for file_path in saved_files:
            try:
                os.remove(file_path)
            except:
                pass
        
        return {
            "upload_id": upload_id,
            "ingredients": final_ingredients[:20],  # Return top 20 ingredients
            "message": "Images processed successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image processing failed"
        )

@router.get("/status/{upload_id}")
async def get_upload_status(
    upload_id: str,
    current_user: UserDocument = Depends(get_current_user)
):
    """Check processing status (placeholder for async processing)"""
    # This would be used if we implement background task processing
    return {
        "upload_id": upload_id,
        "status": "completed",
        "message": "Processing completed"
    }

@router.delete("/{upload_id}")
async def cleanup_upload(
    upload_id: str,
    current_user: UserDocument = Depends(get_current_user)
):
    """Clean up upload files"""
    try:
        # Clean up any remaining temporary files with this upload_id
        import glob
        temp_files = glob.glob(f"uploads/temp/{upload_id}_*")
        
        for file_path in temp_files:
            try:
                os.remove(file_path)
            except:
                pass
        
        return {"message": "Upload cleaned up successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cleanup failed"
        )
