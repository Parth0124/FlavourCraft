import pytest
from httpx import AsyncClient

from main import app

class TestRecipes:
    """Recipe management test suite"""
    
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
    async def test_get_static_recipes(self, async_client: AsyncClient):
        """Test getting static recipes"""
        response = await async_client.get("/recipes/static")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.asyncio
    async def test_search_static_recipes(self, async_client: AsyncClient):
        """Test static recipe search"""
        response = await async_client.get(
            "/recipes/static/search?query=pasta&difficulty=easy"
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    @pytest.mark.asyncio
    async def test_generate_ai_recipe(self, async_client: AsyncClient, auth_headers):
        """Test AI recipe generation"""
        recipe_request = {
            "ingredients": ["tomato", "onion", "garlic"],
            "dietary_preferences": ["vegetarian"],
            "cuisine_type": "italian"
        }
        
        response = await async_client.post(
            "/recipes/generate",
            json=recipe_request,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "generated_recipe" in data
        assert "title" in data["generated_recipe"]
        assert "steps" in data["generated_recipe"]
    
    @pytest.mark.asyncio
    async def test_get_recipe_history(self, async_client: AsyncClient, auth_headers):
        """Test getting user recipe history"""
        response = await async_client.get(
            "/recipes/history",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "recipes" in data
        assert "total_count" in data
        assert isinstance(data["recipes"], list)
    
    @pytest.mark.asyncio
    async def test_toggle_favorite_recipe(self, async_client: AsyncClient, auth_headers):
        """Test toggling recipe favorite status"""
        # First generate a recipe
        recipe_request = {
            "ingredients": ["tomato", "onion"],
            "dietary_preferences": []
        }
        
        create_response = await async_client.post(
            "/recipes/generate",
            json=recipe_request,
            headers=auth_headers
        )
        
        recipe_id = create_response.json()["id"]
        
        # Toggle favorite
        response = await async_client.put(
            f"/recipes/generated/{recipe_id}/favorite",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "is_favorite" in data
