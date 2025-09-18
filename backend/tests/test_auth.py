import pytest
import asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient

from main import app
from services.storage_service import get_database
from models.user import UserCreate

class TestAuth:
    """Authentication test suite"""
    
    @pytest.fixture
    async def async_client(self):
        async with AsyncClient(app=app, base_url="http://test") as client:
            yield client
    
    @pytest.fixture
    async def test_db(self):
        db = await get_database()
        # Clean up test data before each test
        await db.users.delete_many({"email": {"$regex": "test.*@test.com"}})
        yield db
        # Clean up after each test
        await db.users.delete_many({"email": {"$regex": "test.*@test.com"}})
    
    @pytest.mark.asyncio
    async def test_user_registration_success(self, async_client: AsyncClient):
        """Test successful user registration"""
        user_data = {
            "username": "testuser",
            "email": "test@test.com",
            "password": "testpassword123"
        }
        
        response = await async_client.post("/auth/register", json=user_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["message"] == "User registered successfully"
    
    @pytest.mark.asyncio
    async def test_user_registration_duplicate_email(self, async_client: AsyncClient):
        """Test registration with duplicate email"""
        user_data = {
            "username": "testuser",
            "email": "test@test.com",
            "password": "testpassword123"
        }
        
        # First registration
        await async_client.post("/auth/register", json=user_data)
        
        # Second registration with same email
        user_data["username"] = "testuser2"
        response = await async_client.post("/auth/register", json=user_data)
        
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    
    @pytest.mark.asyncio
    async def test_user_login_success(self, async_client: AsyncClient):
        """Test successful user login"""
        # Register user first
        user_data = {
            "username": "testuser",
            "email": "test@test.com",
            "password": "testpassword123"
        }
        await async_client.post("/auth/register", json=user_data)
        
        # Login
        login_data = {
            "email": "test@test.com",
            "password": "testpassword123"
        }
        
        response = await async_client.post("/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
    
    @pytest.mark.asyncio
    async def test_user_login_invalid_credentials(self, async_client: AsyncClient):
        """Test login with invalid credentials"""
        login_data = {
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        }
        
        response = await async_client.post("/auth/login", json=login_data)
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    
    @pytest.mark.asyncio
    async def test_token_refresh(self, async_client: AsyncClient):
        """Test JWT token refresh"""
        # Register and login to get token
        user_data = {
            "username": "testuser",
            "email": "test@test.com",
            "password": "testpassword123"
        }
        await async_client.post("/auth/register", json=user_data)
        
        login_response = await async_client.post("/auth/login", json={
            "email": "test@test.com",
            "password": "testpassword123"
        })
        
        token = login_response.json()["access_token"]
        
        # Refresh token
        response = await async_client.post(
            "/auth/refresh",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        assert "access_token" in response.json()