"""
Student Performance and At-Risk Prediction System
FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Student Performance and At-Risk Prediction API",
    description="REST API for predicting student outcomes, evaluating ML models, and dataset exploration across School and Engineering College modes.",
    version="1.0.0",
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "http://10.0.2.2:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Student Performance ML API", "version": "1.0.0"}

@app.get("/datasets")
def get_datasets():
    return {
        "school": {
            "name": "UCI Student Performance (Mathematics)",
            "rows": 395,
            "columns": 33,
            "target": "G3 (Final Grade, 0-20)",
            "status": "Ready",
        },
        "college": {
            "name": "UCI Higher Education Performance Evaluation",
            "rows": 145,
            "columns": 33,
            "target": "GRADE (0: Fail to 7: AA)",
            "status": "Ready",
        }
    }
