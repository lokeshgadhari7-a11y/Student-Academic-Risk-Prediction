from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class SchoolPredictionInput(BaseModel):
    studytime: int = Field(2, ge=1, le=4, description="Weekly study time: 1 (<2h), 2 (2-5h), 3 (5-10h), 4 (>10h)")
    failures: int = Field(0, ge=0, le=4, description="Number of past class failures")
    absences: int = Field(4, ge=0, le=93, description="Number of school absences (0 to 93)")
    G1: Optional[int] = Field(10, ge=0, le=20, description="Period 1 Grade (0-20)")
    G2: Optional[int] = Field(10, ge=0, le=20, description="Period 2 Grade (0-20)")
    higher: str = Field("yes", description="Wants to take higher education: 'yes' or 'no'")
    schoolsup: str = Field("no", description="Extra educational support: 'yes' or 'no'")
    famsup: str = Field("yes", description="Family educational support: 'yes' or 'no'")
    Medu: int = Field(3, ge=0, le=4, description="Mother education level (0 to 4)")
    Fedu: int = Field(3, ge=0, le=4, description="Father education level (0 to 4)")
    internet: str = Field("yes", description="Internet access at home: 'yes' or 'no'")
    goout: int = Field(3, ge=1, le=5, description="Going out with friends (1 to 5)")
    health: int = Field(4, ge=1, le=5, description="Current health status (1 to 5)")
    include_period_grades: bool = Field(True, description="Toggle whether to include G1/G2 in regression")

class CollegePredictionInput(BaseModel):
    CGPA_LAST: int = Field(3, ge=1, le=5, description="Prior semester CGPA: 1 (<2.0) to 5 (>3.49)")
    ATTENDANCE_CLASSES: int = Field(1, ge=1, le=3, description="1: Always, 2: Sometimes, 3: Never")
    WEEKLY_STUDY_HOURS: int = Field(2, ge=1, le=5, description="1: None, 2: <5h, 3: 6-10h, 4: 11-20h, 5: >20h")
    PREP_MIDTERM_1: int = Field(2, ge=1, le=3, description="1: Closest to exam, 2: Regularly, 3: Never")
    TAKING_NOTES: int = Field(2, ge=1, le=3, description="1: Never, 2: Sometimes, 3: Always")
    LISTEN_CLASS: int = Field(2, ge=1, le=3, description="1: Never, 2: Sometimes, 3: Always")
    DISCUSSION_INTEREST: int = Field(2, ge=1, le=3, description="1: Never, 2: Sometimes, 3: Always")
    SCHOLARSHIP: int = Field(3, ge=1, le=5, description="1: None to 5: 100%")
    ADDITIONAL_WORK: int = Field(2, ge=1, le=2, description="1: Yes, 2: No")
    PROJECT_IMPACT: int = Field(1, ge=1, le=3, description="1: Positive, 2: Negative, 3: Neutral")
