# Student Performance and At-Risk Prediction System

A complete Machine Learning application and Flutter frontend for predicting academic performance, identifying at-risk students, comparing ML algorithms, and rendering performance analytics.

Developed for **Third-Year Engineering in Artificial Intelligence & Data Science** (Machine Learning Laboratory Mini-Project).

---

## 1. System Architecture

```
Flutter Mobile / Web Frontend (Material 3)
         │
         │ REST API (JSON / Multipart CSV Upload)
         ▼
FastAPI Python Backend (uvicorn :8000)
         │
         ▼
Scikit-Learn Preprocessing Pipelines (ColumnTransformer, StandardScaler, OneHotEncoder)
         │
         ▼
ML Algorithms (Linear/Polynomial/Ridge/Lasso/RF Regression, Logistic/SVM/RF Classification)
         │
         ▼
Model Evaluation & Explainability (Metrics, Confusion Matrix, ROC-AUC, PCA/LDA, Feature Importance)
         │
         ▼
JSON Response to Flutter Widgets (fl_chart, KPI cards, Prediction Badges)
```

---

## 2. Dual Academic Tracks

| Track | Dataset Source | Size | Target Variable | Algorithms Evaluated |
|---|---|---|---|---|
| **1. School Student Mode** | Official UCI Student Performance (Math) | 395 rows, 33 columns | `G3` Final Grade (0–20 scale) & At-Risk (`G3 < 10`) | Linear, Ridge, Lasso, Polynomial (Deg 2/3), Random Forest Regressor & Classifiers |
| **2. Engineering College Mode** | Official UCI Higher Education Evaluation | 145 rows, 33 columns | `GRADE` (0: Fail/At-Risk to 7: AA) | Logistic Regression, Linear SVM, RBF SVM, Random Forest Classifier |

---

## 3. Installation and Execution

### Backend (Python FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows PowerShell:**
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - **Windows Command Prompt:**
     ```cmd
     python -m venv .venv
     .venv\Scripts\activate.bat
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   Interactive OpenAPI documentation will be accessible at: `http://localhost:8000/docs`

5. Run automated test suite:
   ```bash
   pytest tests/test_ml.py
   ```

---

### Frontend (Flutter M3)

1. Navigate to the Flutter directory:
   ```bash
   cd flutter_app
   ```

2. Fetch dependencies:
   ```bash
   flutter pub get
   ```

3. Analyze and test:
   ```bash
   flutter analyze
   flutter test
   ```

4. Run on your target platform:
   - **Chrome / Web Browser:**
     ```bash
     flutter run -d chrome
     ```
   - **Android Emulator (backend at http://10.0.2.2:8000):**
     ```bash
     flutter run -d emulator-5554
     ```
   - **Physical Device (replace with your LAN IP):**
     ```bash
     flutter run -d <device-id>
     ```

5. Build Android Release:
   ```bash
   flutter build apk --release
   flutter build appbundle
   ```

---

## 4. Machine Learning Laboratory Syllabus Mapping

- **Practical 1 & 2:** Data Preprocessing, Missing Value Handling, 10-Point CGPA Scaling, StandardScaler (`backend/app/ml/preprocessing.py`)
- **Practical 3:** Continuous SGPA Regression (1.0 – 10.0 scale) using Multiple Linear Regression & Polynomials (`backend/app/ml/training.py`)
- **Practical 4:** Regularization Techniques (Ridge & Lasso) balancing prior CGPA, attendance %, and internals
- **Practical 5:** Logistic Regression & Sigmoid Decision Boundaries for Binary Academic Risk (At-Risk vs Safe)
- **Practical 6:** Support Vector Machines (Linear vs Non-linear RBF Kernels)
- **Practical 7:** Ensemble Learning & Random Forest with Mean Decrease in Impurity (MDI) feature attribution
- **Practical 8:** Dimensionality Reduction: Unsupervised PCA (5 components, 92% variance) vs Supervised LDA (1 component)
- **Practical 9:** Evaluation Metrics: Confusion Matrix heatmaps, Precision, Recall, F1-Score, ROC-AUC, MAE, RMSE, R²

---

## 5. Ethical AI and Disclaimer

Machine learning models produce statistical associations based on historical sample distributions. Predictions are intended strictly as decision-support indicators for educators and mentors to provide timely academic tutoring. They must never be used for punitive academic actions.
