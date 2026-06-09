from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "eco.warrior@example.com",
                "password": "strongpassword123",
                "full_name": "Eco Warrior"
            }
        }
    )

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str | None = None
    current_carbon_score: float = 0.0

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "eco.warrior@example.com",
                "full_name": "Eco Warrior",
                "current_carbon_score": 145.5
            }
        }
    )

class Token(BaseModel):
    access_token: str
    token_type: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }
    )

class TokenPayload(BaseModel):
    sub: str | None = None
