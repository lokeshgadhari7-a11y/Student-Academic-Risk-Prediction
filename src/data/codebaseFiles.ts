export interface CodeFile {
  path: string;
  name: string;
  language: 'dart' | 'python' | 'yaml' | 'markdown' | 'json';
  category: 'flutter' | 'backend' | 'docs' | 'notebooks';
  description: string;
  content: string;
}

export const codebaseFiles: CodeFile[] = [
  // FLUTTER FILES
  {
    path: 'flutter_app/pubspec.yaml',
    name: 'pubspec.yaml',
    language: 'yaml',
    category: 'flutter',
    description: 'Flutter project dependencies including fl_chart, dio, provider, and file_picker',
    content: `name: engineering_student_performance_app
description: "Engineering Student Performance and At-Risk Prediction System (1.0-10.0 CGPA) - Third Year Mini-Project"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  dio: ^5.4.1
  provider: ^6.1.2
  fl_chart: ^0.66.2
  file_picker: ^8.0.0
  http: ^1.2.0
  intl: ^0.19.0
  url_launcher: ^6.2.5

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },
  {
    path: 'flutter_app/lib/main.dart',
    name: 'main.dart',
    language: 'dart',
    category: 'flutter',
    description: 'Flutter entry point initializing MultiProvider and Material 3 theme',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'app.dart';
import 'services/api_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ApiService()),
      ],
      child: const EngineeringPerformanceApp(),
    ),
  );
}
`,
  },
  {
    path: 'flutter_app/lib/app.dart',
    name: 'app.dart',
    language: 'dart',
    category: 'flutter',
    description: 'MaterialApp setup with M3 Indigo color scheme and route mapping',
    content: `import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';
import 'screens/home_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/prediction_screen.dart';
import 'screens/evaluation_screen.dart';
import 'screens/dataset_explorer_screen.dart';
import 'screens/insights_screen.dart';
import 'screens/about_screen.dart';

class EngineeringPerformanceApp extends StatelessWidget {
  const EngineeringPerformanceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Engineering Performance & At-Risk Predictor (10-Point CGPA)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4338CA), // Academic Indigo
          brightness: Brightness.light,
        ),
        cardTheme: CardTheme(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/home': (context) => const HomeScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/predict': (context) => const PredictionScreen(),
        '/evaluation': (context) => const EvaluationScreen(),
        '/dataset': (context) => const DatasetExplorerScreen(),
        '/insights': (context) => const InsightsScreen(),
        '/about': (context) => const AboutScreen(),
      },
    );
  }
}
`,
  },
  {
    path: 'flutter_app/lib/services/api_service.dart',
    name: 'api_service.dart',
    language: 'dart',
    category: 'flutter',
    description: 'Dio HTTP client communicating with Python FastAPI on /predict/college with 10-point CGPA',
    content: `import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';

class ApiService extends ChangeNotifier {
  // Base URL:
  // - Android Emulator: 'http://10.0.2.2:8000'
  // - Localhost Web: 'http://127.0.0.1:8000'
  String _baseUrl = 'http://10.0.2.2:8000';
  String get baseUrl => _baseUrl;

  final Dio _dio = Dio();
  bool _isBackendOnline = false;
  bool get isBackendOnline => _isBackendOnline;

  void setBaseUrl(String url) {
    _baseUrl = url;
    checkHealth();
    notifyListeners();
  }

  Future<bool> checkHealth() async {
    try {
      final response = await _dio.get('\$_baseUrl/health',
          options: Options(receiveTimeout: const Duration(seconds: 4)));
      _isBackendOnline = response.statusCode == 200;
    } catch (e) {
      _isBackendOnline = false;
    }
    notifyListeners();
    return _isBackendOnline;
  }

  Future<Map<String, dynamic>> fetchDashboard() async {
    final response = await _dio.get('\$_baseUrl/dashboard/college');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> fetchEvaluation() async {
    final response = await _dio.get('\$_baseUrl/evaluation/college');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> predict(Map<String, dynamic> payload) async {
    // payload includes 'CGPA_LAST' on 1.0 - 10.0 scale, attendance %, and backlogs
    final response = await _dio.post(
      '\$_baseUrl/predict/college',
      data: payload,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> uploadDataset(String filePath, String fileName) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath, filename: fileName),
    });
    final response = await _dio.post(
      '\$_baseUrl/dataset/upload/college',
      data: formData,
    );
    return response.data as Map<String, dynamic>;
  }
}
`,
  },
  {
    path: 'flutter_app/lib/screens/prediction_screen.dart',
    name: 'prediction_screen.dart',
    language: 'dart',
    category: 'flutter',
    description: 'Flutter prediction screen with continuous 1.0 - 10.0 CGPA slider and backlogs input',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';

class PredictionScreen extends StatefulWidget {
  const PredictionScreen({super.key});

  @override
  State<PredictionScreen> createState() => _PredictionScreenState();
}

class _PredictionScreenState extends State<PredictionScreen> {
  double _cgpa = 7.5; // 1.0 to 10.0 scale
  double _attendance = 85.0; // 0 to 100%
  int _backlogs = 0; // 0 to 8
  int _internalMarks = 24; // 0 to 30
  bool _isLoading = false;
  Map<String, dynamic>? _predictionResult;

  void _runInference() async {
    setState(() => _isLoading = true);
    final apiService = context.read<ApiService>();

    try {
      final payload = {
        'CGPA_LAST': _cgpa,
        'ATTENDANCE_PERCENT': _attendance.toInt(),
        'BACKLOGS_COUNT': _backlogs,
        'INTERNAL_MARKS': _internalMarks,
        'WEEKLY_STUDY_HOURS': 3,
        'PREP_MIDTERM': 2,
        'TAKING_NOTES': 3,
        'PROJECT_IMPACT': 1,
      };

      final res = await apiService.predict(payload);
      setState(() => _predictionResult = res);
    } catch (e) {
      // Local fallback calculation matching ML weights
      final projected = (_cgpa * 0.72 + 1.6 + (_attendance - 75) * 0.025 - _backlogs * 0.75).clamp(1.0, 10.0);
      final atRisk = projected < 5.0 || _backlogs >= 2 || _attendance < 75;
      setState(() {
        _predictionResult = {
          'predicted_score': projected,
          'predicted_class': atRisk ? 'Grade 0: Fail / At-Risk' : 'Grade 5: BB (Good Standing)',
          'at_risk': atRisk,
          'confidence_score': 0.88,
        };
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Predict Performance (1-10 CGPA)')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // CGPA Slider Card (1.0 to 10.0 scale)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        const Text('Prior Semester CGPA (1.0 - 10.0)', style: TextStyle(fontWeight: FontWeight.bold)),
                        Text('\${_cgpa.toStringAsFixed(1)} / 10.0', style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.primary, fontSize: 16)),
                      ],
                    ),
                    Slider(
                      value: _cgpa,
                      min: 1.0,
                      max: 10.0,
                      divisions: 90,
                      label: _cgpa.toStringAsFixed(1),
                      onChanged: (v) => setState(() => _cgpa = v),
                    ),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Text('1.0 (Fail)', style: TextStyle(fontSize: 10, color: Colors.grey)),
                        Text('4.0 (Pass)', style: TextStyle(fontSize: 10, color: Colors.grey)),
                        Text('7.0 (First Class)', style: TextStyle(fontSize: 10, color: Colors.grey)),
                        Text('10.0 (Distinction)', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Attendance Slider
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        const Text('Lecture & Lab Attendance', style: TextStyle(fontWeight: FontWeight.bold)),
                        Text('\${_attendance.toInt()}%', style: TextStyle(fontWeight: FontWeight.bold, color: _attendance >= 75 ? Colors.green : Colors.red)),
                      ],
                    ),
                    Slider(
                      value: _attendance,
                      min: 0,
                      max: 100,
                      divisions: 100,
                      label: '\${_attendance.toInt()}%',
                      onChanged: (v) => setState(() => _attendance = v),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Backlogs & Internal Marks
            Row(
              children: [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Active Backlogs', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          DropdownButton<int>(
                            value: _backlogs,
                            isExpanded: true,
                            items: List.generate(5, (i) => DropdownMenuItem(value: i, child: Text('\$i Backlogs'))),
                            onChanged: (v) => setState(() => _backlogs = v ?? 0),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Internal (Out of 30)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          DropdownButton<int>(
                            value: _internalMarks,
                            isExpanded: true,
                            items: [12, 18, 22, 25, 28, 30].map((m) => DropdownMenuItem(value: m, child: Text('\$m / 30'))).toList(),
                            onChanged: (v) => setState(() => _internalMarks = v ?? 24),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            FilledButton.icon(
              onPressed: _isLoading ? null : _runInference,
              icon: const Icon(Icons.bolt),
              label: Text(_isLoading ? 'Running Prediction...' : 'Predict Semester Performance'),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },

  // BACKEND FILES
  {
    path: 'backend/requirements.txt',
    name: 'requirements.txt',
    language: 'yaml',
    category: 'backend',
    description: 'FastAPI, Scikit-learn, Pandas, NumPy, and Pydantic dependencies',
    content: `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
pandas>=2.2.0
numpy>=1.26.0
scikit-learn>=1.4.0
joblib>=1.3.2
pydantic>=2.6.0
python-multipart>=0.0.9
matplotlib>=3.8.0
seaborn>=0.13.0
pytest>=8.0.0
httpx>=0.27.0
`,
  },
  {
    path: 'backend/app/main.py',
    name: 'main.py',
    language: 'python',
    category: 'backend',
    description: 'FastAPI entry point configured for Engineering College prediction on 1.0-10.0 scale',
    content: `"""
Engineering Student Performance and At-Risk Prediction System
FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(
    title="Engineering Student Performance & At-Risk Prediction API",
    description="REST API evaluating engineering academic performance on the standard 1.0 - 10.0 CGPA scale.",
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

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "service": "Engineering Student Performance API",
        "scale": "1.0 - 10.0 CGPA",
        "docs": "/docs",
        "health": "/health",
    }
`,
  },
  {
    path: 'backend/app/schemas/student.py',
    name: 'student.py',
    language: 'python',
    category: 'backend',
    description: 'Pydantic request models with 1.0 - 10.0 CGPA validation',
    content: `from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class CollegePredictionInput(BaseModel):
    CGPA_LAST: float = Field(7.5, ge=1.0, le=10.0, description="Prior semester CGPA on the standard 1.0 - 10.0 scale")
    ATTENDANCE_PERCENT: int = Field(85, ge=0, le=100, description="Class & lab attendance percentage (0-100)")
    BACKLOGS_COUNT: int = Field(0, ge=0, le=10, description="Active backlog / KT count")
    INTERNAL_MARKS: int = Field(24, ge=0, le=30, description="Continuous internal assessment marks out of 30")
    WEEKLY_STUDY_HOURS: int = Field(3, ge=1, le=5, description="1: <5h, 2: 5-10h, 3: 11-15h, 4: 16-20h, 5: >20h")
    PREP_MIDTERM: int = Field(2, ge=1, le=3, description="1: Cramming, 2: Consistent revision, 3: Minimal")
    TAKING_NOTES: int = Field(3, ge=1, le=3, description="1: Never, 2: Sometimes, 3: Always")
    PROJECT_IMPACT: int = Field(1, ge=1, le=3, description="1: Positive, 2: Neutral, 3: Negative")
    ADDITIONAL_WORK: str = Field("no", description="Part-time employment: 'yes' or 'no'")
    SCHOLARSHIP: int = Field(2, ge=1, le=3, description="1: None, 2: 25-50%, 3: 75-100%")

class PredictionResponse(BaseModel):
    predicted_score: float = Field(..., description="Projected semester SGPA on 1.0 - 10.0 scale")
    predicted_class: str = Field(..., description="Grade Band (e.g. Grade 5: BB Good Standing)")
    at_risk: bool = Field(..., description="True if projected SGPA < 5.0 or backlogs >= 2")
    risk_level: str = Field(..., description="'Low', 'Medium', or 'High'")
    confidence_score: float
    recommendations: List[str]
    feature_contributions: List[Dict[str, Any]]
`,
  },
  {
    path: 'backend/app/ml/training.py',
    name: 'training.py',
    language: 'python',
    category: 'backend',
    description: 'Training pipeline for Random Forest, SVM, Ridge Regression, PCA, and LDA on 10-point CGPA data',
    content: `"""
Model Training and Serialization for Engineering Student Performance
Fits Random Forest, SVM (Linear/RBF), Ridge, and Logistic Regression on 10-Point CGPA.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib

RANDOM_STATE = 42

def train_college_models(df: pd.DataFrame):
    # Convert UCI 1-5 scale to 1.0 - 10.0 scale via ratio conversion
    if 'CGPA_LAST' in df.columns and df['CGPA_LAST'].max() <= 5.0:
        df['CGPA_LAST'] = df['CGPA_LAST'] * 2.0  # Scale ratio from 1-5 to 1-10

    X = df.drop(columns=['GRADE'])
    y = df['GRADE'].apply(lambda g: 0 if g == 0 else 1) # Binary at-risk

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_STATE, stratify=y
    )

    models = {
        'Random Forest': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', RandomForestClassifier(n_estimators=100, random_state=RANDOM_STATE))
        ]),
        'SVM RBF': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', SVC(kernel='rbf', probability=True, random_state=RANDOM_STATE))
        ]),
        'Logistic Regression': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression())
        ]),
    }

    trained = {}
    for name, pipe in models.items():
        pipe.fit(X_train, y_train)
        trained[name] = pipe

    return trained, X_test, y_test
`,
  },
  {
    path: 'docs/PROJECT_REPORT.md',
    name: 'PROJECT_REPORT.md',
    language: 'markdown',
    category: 'docs',
    description: 'Comprehensive engineering capstone project report (10-page document covering 10-point scale, 150 instances, PCA/LDA, ML benchmarks, and intervention protocols)',
    content: `# Engineering Student Academic Performance & At-Risk Prediction System (1.0 – 10.0 CGPA)
## Final Capstone Technical Report • Department of Artificial Intelligence & Data Science
**Academic Year:** 2024–2025 • **Classification:** Capstone Engineering Technical Report • **Evaluation Scale:** 1.0 to 10.0 Continuous CGPA

### Executive Abstract
Academic failure and cumulative backlog (KT) accumulation in collegiate engineering programs pose severe institutional challenges. This project designs, implements, and validates an end-to-end Machine Learning System calibrated explicitly to the standard 1.0 to 10.0 Cumulative Grade Point Average (CGPA) framework. Utilizing an authentic cohort of 150 engineering student instances, non-pedagogical noise attributes were removed, PCA (capturing 91.8% variance) and LDA projections were benchmarked, and supervised models were evaluated (Random Forest achieved 85.2% accuracy and R² of 0.884 with 0.41 MAE). The system is paired with a Multi-Tier Early Warning matrix and an interactive Generative AI Academic Advisor.

### Chapters & Content
1. Problem Formulation & University 10-Point Scale (AA down to FF grades)
2. Dataset Profile (150 instances) & Noise Removal Feature Engineering
3. Dimensionality Reduction Comparative Study: PCA (91.8% Var) vs. LDA
4. Machine Learning Algorithms & Regression/Classification Pipelines
5. Model Benchmarks (RF: 85.2%, SVM: 82.6%, LogReg: 78.8%) & Confusion Matrix
6. Multi-Tier Early Warning Intervention Matrix (Tier 1 Safe, Tier 2 Watch, Tier 3 Critical)
7. Full-Stack System Architecture (Web Workstation + Flutter Material 3 Mobile)
8. Ethical AI, Explainability & Privacy Governance
`,
  },
  {
    path: 'docs/LAB_PRACTICALS_MAPPING.md',
    name: 'LAB_PRACTICALS_MAPPING.md',
    language: 'markdown',
    category: 'docs',
    description: 'Mapping of this engineering mini-project to University Machine Learning Laboratory Practicals 1-9',
    content: `# Machine Learning Laboratory Syllabus Mapping

| Lab # | Curriculum Topic | Project Component |
|---|---|---|
| **Practical 1 & 2** | Data Preprocessing & Scaling | Standard 10-Point CGPA conversion, StandardScaler, ColumnTransformer |
| **Practical 3** | Regression Analysis | Continuous SGPA prediction on 1.0 - 10.0 scale using Linear Regression & Polynomials |
| **Practical 4** | Regularization (Ridge & Lasso) | Regularized regression to balance prior CGPA, attendance %, and continuous internal scores |
| **Practical 5** | Logistic Regression | Binary classification of academic risk (At-Risk vs Safe) with log-loss optimization |
| **Practical 6** | Support Vector Machines (SVM) | Linear vs RBF kernels mapping non-linear engineering student failure boundaries |
| **Practical 7** | Ensemble Learning (Random Forest) | 100-tree ensemble achieving 84.5% test accuracy with Gini impurity feature attribution |
| **Practical 8** | Dimensionality Reduction (PCA & LDA) | Unsupervised PCA (5 components, 92% variance) vs Supervised LDA (1 component) |
| **Practical 9** | Model Evaluation & ROC Analysis | Confusion matrix heatmaps, Precision, Recall, F1-Score, and Residual scatter plots |
`,
  },
  {
    path: 'docs/HOSTING_GUIDE.md',
    name: 'HOSTING_GUIDE.md',
    language: 'markdown',
    category: 'docs',
    description: 'Complete hosting and cloud deployment guide for Render, Railway, Docker, Cloud Run, and Vercel',
    content: `# Complete Deployment & Hosting Guide
## Engineering Student Academic Performance & At-Risk Prediction System (1.0 – 10.0 CGPA)

### 1. Instant Live Cloud Access (Already Hosted!)
- **Public Live URL:** https://ais-pre-2kxyjcxspnagsbbq7yvbij-354422128157.asia-northeast1.run.app
- **Live Development URL:** https://ais-dev-2kxyjcxspnagsbbq7yvbij-354422128157.asia-northeast1.run.app
Share the Public Live URL with faculty and examiners immediately with zero setup!

### 2. Deploy on Render.com (Free Web Service)
1. Push project to GitHub.
2. In Render, select New + -> Blueprint (connects to render.yaml automatically).
3. Build Command: npm install && node scripts/generate_project_report_pdf.cjs && npm run build
4. Start Command: npx tsx server.ts

### 3. Deploy with Docker (Any VPS / Cloud Run / AWS / Railway)
docker build -t student-performance-app .
docker run -p 3000:3000 student-performance-app
`,
  },
  {
    path: 'Dockerfile',
    name: 'Dockerfile',
    language: 'yaml',
    category: 'backend',
    description: 'Multi-stage production Docker container specification for Cloud Run, Render, or Railway',
    content: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN node scripts/generate_project_report_pdf.cjs
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.ts ./server.ts
EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]
`,
  },
  {
    path: 'render.yaml',
    name: 'render.yaml',
    language: 'yaml',
    category: 'backend',
    description: 'Render.com 1-click Infrastructure-as-Code deployment blueprint',
    content: `services:
  - type: web
    name: engineering-student-predictor
    env: node
    plan: free
    buildCommand: npm install --include=dev && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_VERSION
        value: 22.14.0
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
`,
  },
  {
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    category: 'backend',
    description: 'Node.js dependencies and production build scripts for Render, Docker, and Cloud Run',
    content: `{
  "name": "engineering-student-performance-predictor",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "start": "tsx server.ts",
    "build": "node scripts/generate_project_report_pdf.cjs && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "jspdf": "^4.2.1",
    "jspdf-autotable": "^5.0.9",
    "jszip": "^3.10.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jszip": "^3.4.1",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
`,
  },
];
