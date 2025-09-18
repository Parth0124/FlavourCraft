import pytest
from httpx import AsyncClient

from main import app

class TestUsers:
    """User management test suite"""
    
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
    
    @pytest.mark.asyncio
    async def test_get_user_profile(self, async_client: AsyncClient, auth_headers):
        """Test getting user profile"""
        response = await async_client.get(
            "/users/profile",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "username" in data
        assert "email" in data
        assert data["email"] == "test@test.com"
    
    @pytest.mark.asyncio
    async def test_update_user_profile(self, async_client: AsyncClient, auth_headers):
        """Test updating user profile"""
        update_data = {
            "username": "updated_testuser",
            "preferences": {
                "dietary_restrictions": ["vegetarian"],
                "cuisine_preferences": ["italian", "indian"],
                "cooking_skill": "intermediate"
            }
        }
        
        response = await async_client.put(
            "/users/profile",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "updated_testuser"
        assert "preferences" in data
    
    @pytest.mark.asyncio
    async def test_get_user_history(self, async_client: AsyncClient, auth_headers):
        """Test getting user cooking history"""
        response = await async_client.get(
            "/users/history",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "recipes" in data
        assert "total_count" in data
        assert "page" in data
        assert "per_page" in data
    
    @pytest.mark.asyncio
    async def test_get_favorite_recipes(self, async_client: AsyncClient, auth_headers):
        """Test getting user's favorite recipes"""
        response = await async_client.get(
            "/users/favorites",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.asyncio
    async def test_delete_user_account(self, async_client: AsyncClient, auth_headers):
        """Test account deletion"""
        response = await async_client.delete(
            "/users/account",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        assert "deleted successfully" in response.json()["message"]
    
    @pytest.mark.asyncio
    async def test_profile_access_without_auth(self, async_client: AsyncClient):
        """Test accessing profile without authentication"""
        response = await async_client.get("/users/profile")
        
        assert response.status_code == 401