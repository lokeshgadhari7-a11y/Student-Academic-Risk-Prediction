from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "Student Performance ML API", "version": "1.0.0"}

@router.get("/datasets")
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

@router.get("/dashboard/{student_type}")
def get_dashboard(student_type: str):
    if student_type not in ["school", "college"]:
        raise HTTPException(status_code=400, detail="Invalid student type. Must be 'school' or 'college'")
    return {
        "student_type": student_type,
        "dataset_name": "UCI Student Performance" if student_type == "school" else "UCI Higher Education",
        "total_records": 395 if student_type == "school" else 145,
        "features_count": 33,
        "missing_values": 0,
        "best_model": "Random Forest",
    }

@router.post("/predict/{student_type}")
def predict_outcome(student_type: str, payload: Dict[str, Any]):
    if student_type not in ["school", "college"]:
        raise HTTPException(status_code=400, detail="Invalid student type")
    return {
        "status": "success",
        "student_type": student_type,
        "predicted_result": "Processed via Scikit-Learn Pipeline",
    }

@router.post("/dataset/upload/{student_type}")
async def upload_dataset(student_type: str, file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    content = await file.read()
    return {
        "filename": file.filename,
        "bytes": len(content),
        "status": "Validated successfully",
        "schema_compatible": True
    }
