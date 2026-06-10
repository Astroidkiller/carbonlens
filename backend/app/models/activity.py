import uuid
from sqlalchemy import Column, String, DateTime, Float, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    activity_date = Column(DateTime(timezone=True), nullable=False)
    
    # Categories: transport, electricity, food, shopping, waste
    category = Column(String, nullable=False, index=True)
    activity_type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    carbon_emission = Column(Float, nullable=False)
    calculation_explanation = Column(String, nullable=True)

    user = relationship("User", backref="activities")
