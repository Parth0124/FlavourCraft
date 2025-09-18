import pytest
import tempfile
import os
from httpx import AsyncClient
from PIL import Image
import io

from main import app

class TestUpload:
    """Image upload test suite"""
    
    @pytest.fixture
    async def async_client(self):
        async with AsyncClient(app=app, base_url="http://test") as client:
            yield client
    
    @pytest.fixture
    async def auth_headers(self, async_client):
        """Get authentication headers for testing"""
        user_data = {
            "username": "testuser",
            "email": "test@test.com",
            "password": "testpassword123"
        }
        
        response = await async_client.post("/auth/register", json=user_data)
        token = response.json()["access_token"]
        
        return {"Authorization": f"Bearer {token}"}
    
    def create_test_image(self, format="JPEG") -> bytes:
        """Create a test image in memory"""
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format=format)
        img_bytes.seek(0)
        return img_bytes.read()
    
    @pytest.mark.asyncio
    async def test_image_upload_success(self, async_client: AsyncClient, auth_headers):
        """Test successful image upload"""
        image_data = self.create_test_image()
        
        files = {"files": ("test.jpg", image_data, "image/jpeg")}
        
        response = await async_client.post(
            "/upload/",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "upload_id" in data
        assert "ingredients" in data
        assert isinstance(data["ingredients"], list)
    
    @pytest.mark.asyncio
    async def test_image_upload_no_auth(self, async_client: AsyncClient):
        """Test image upload without authentication"""
        image_data = self.create_test_image()
        
        files = {"files": ("test.jpg", image_data, "image/jpeg")}
        
        response = await async_client.post("/upload/", files=files)
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_image_upload_invalid_format(self, async_client: AsyncClient, auth_headers):
        """Test upload with invalid file format"""
        # Create a text file instead of image
        text_data = b"This is not an image"
        
        files = {"files": ("test.txt", text_data, "text/plain")}
        
        response = await async_client.post(
            "/upload/",
            files=files,
            headers=auth_headers
        )
        
        assert response.status_code == 400
    
    @pytest.mark.asyncio
    async def test_upload_status_check(self, async_client: AsyncClient, auth_headers):
        """Test upload status checking"""
        upload_id = "test-upload-id"
        
        response = await async_client.get(
            f"/upload/status/{upload_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["upload_id"] == upload_id
    
    @pytest.mark.asyncio
    async def test_upload_cleanup(self, async_client: AsyncClient, auth_headers):
        """Test upload cleanup"""
        upload_id = "test-upload-id"
        
        response = await async_client.delete(
            f"/upload/{upload_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert "cleaned up" in response.json()["message"]
