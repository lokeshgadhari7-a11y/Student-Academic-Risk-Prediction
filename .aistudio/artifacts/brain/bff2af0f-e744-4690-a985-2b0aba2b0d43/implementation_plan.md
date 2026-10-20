# Engineering College Student Performance & At-Risk Prediction System with Academic Advisor AI

A specialized machine learning platform and Material 3 Flutter application tailored exclusively for Engineering College students, featuring a 10-point CGPA scale, algorithmic at-risk prediction, comprehensive project dossier, and an interactive Academic Advisor Chatbot for personalized academic improvement.

## User Review & Critical Decisions

> [!IMPORTANT]
> The application is being restructured based on direct user requirements:
> 1. **Exclusive Engineering College Focus**: School student mode has been completely removed. All dataset explorers, predictive models, KPI analytics, and preprocessing pipelines now operate purely on the UCI Higher Education & Engineering College student dataset.
> 2. **Continuous 1.0–10.0 CGPA Scale**: CGPA inputs, distributions, and regression predictions now use the standard 10-point engineering scale. Transparent ratio mapping converts between continuous 1.0–10.0 values and original dataset categories.
> 3. **Streamlined About Screen**: The Viva Voce Q&A tab is removed. The About section now cleanly hosts the engineering problem statement, algorithm pipeline, lab practicals mapping, and project limitations.
> 4. **Dedicated Academic Advisor Chatbot**: A full interactive chat interface provides personalized study plans and interventions based on the student's entered metrics and dataset feature importances.

- **Confirmed Decision 1**: Exclusively Engineering College Student Mode (School Student removed).
- **Confirmed Decision 2**: Standard 10-point CGPA scale ($1.0 - 10.0$) with ratio mapping and $6.0 / 10.0$ passing threshold.
- **Confirmed Decision 3**: Viva Voce removed; About dossier retained.
- **Confirmed Decision 4**: Dedicated Academic Advisor Chatbot integrated into primary navigation and prediction results.

---

## 1. Overview & Core Concept

- **What It Does**: The platform trains and runs genuine scikit-learn models (Multiple Linear Regression, Ridge, Lasso, Polynomial Regression, Logistic Regression, Support Vector Machines, Random Forest, and PCA dimensionality reduction) to evaluate engineering students' academic trajectory. It predicts final graduation grade/CGPA on a $1.0\text{--}10.0$ scale, flags at-risk students ($\text{CGPA} < 6.0$), and provides an interactive AI Academic Advisor Chatbot that generates personalized, data-backed interventions.
- **Target Audience / Persona**: Engineering college students, faculty mentors, academic counselors, and ML laboratory examiners.
- **Key Value**: Replaces black-box predictions with interpretable machine learning, aligns with third-year engineering AI & Data Science coursework, and delivers actionable guidance through an AI tutor.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Welcome & Navigation**: The landing screen directly introduces the Engineering College Student Performance System with key KPIs (145 records, 33 engineering & behavioral attributes, 8 trained models). Users can navigate directly to Prediction, Dashboard, Evaluation, Dataset Explorer, Academic Advisor, or Project About.
2. **Predictive Assessment (10-Point Scale)**:
   - Students enter their academic metrics using intuitive sliders and selects: Cumulative CGPA ($1.0\text{--}10.0$), Last Semester CGPA ($1.0\text{--}10.0$), Weekly Study Hours, Lecture Attendance, Midterm Exam Scores, Project/Lab Engagement, and Seminar Attendance.
   - Users select their desired algorithm (Random Forest, SVM, Ridge Regression, etc.).
   - The system displays the predicted CGPA on the 10-point scale, categorical grade (A/B/C/D/Fail), risk status (`Not At-Risk` / `At-Risk`), and a breakdown of feature contributions.
   - A single-click CTA ("Consult Academic Advisor") sends these exact student inputs directly to the Chatbot.
3. **Academic Advisor Chatbot**:
   - Accessible via the top navigation bar and floating action button.
   - Pre-loads current student metrics if available, highlighting key strengths (e.g., high project participation) and risk factors (e.g., study hours $< 5\text{h/week}$, low attendance).
   - Features quick-action prompts: *"How can I raise my CGPA from 6.8 to 8.5?"*, *"What are my top risk factors?"*, *"Generate a 4-week exam prep schedule"*, *"How to balance lab projects and theory exams?"*.
   - Generates structured, actionable recommendations grounded in the dataset's feature importance weights.
4. **Model Evaluation & Lab Alignment**:
   - Side-by-side performance metrics across all models (Accuracy, Precision, Recall, F1-Score, Confusion Matrix, ROC-AUC, Mean Absolute Error, $R^2$ Score).
   - Interactive PCA 2D/3D component visualization showing student clustering.
5. **Project About Dossier**:
   - Rigorous academic documentation: Problem statement, system architecture, data pipeline, syllabus mapping for Machine Learning Laboratory, and ethical considerations.

### Visual Identity & Theme
- **Aesthetic Direction**: Material 3 Engineering Dashboard — clean, scholarly, utilitarian, and accessible.
- **Color Palette (60-30-10 Rule)**:
  - *Canvas (60%)*: Crisp off-white (`#f8fafc`) / slate canvas.
  - *Surfaces & Cards (30%)*: Pure white (`#ffffff`) with hairline borders (`#e2e8f0`) and subtle elevation shadows.
  - *Semantic Accents (10%)*: Deep Academic Indigo (`#4338ca`) for primary branding, Emerald (`#059669`) for positive/safe performance, and Amber/Coral (`#dc2626`) for at-risk alerts.
- **Typography**: Clean modern display type (`Plus Jakarta Sans`) paired with tabular figures (`tabular-nums`) for all GPA and statistical metric displays.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Pure Engineering College Scope
- **Approach**: Eliminate School Student mode entirely to focus 100% on Engineering College workflows.
- **Why**: College students have distinct variables (scholarships, laboratory projects, semester GPA, seminar attendance, internship preparation) that differ fundamentally from secondary school Portuguese/Math records.
- **Result**: Cleaner UI, zero confusion between secondary vs higher education, and tighter syllabus alignment.

### Decision 2: 1.0–10.0 CGPA Scale Ratio Mapping
- **Approach**: Expose continuous $1.0\text{--}10.0$ inputs (step 0.1) in the UI while mathematically transforming values to/from the UCI 5-band ordinal scale:
  - Band 1: $\text{CGPA} < 5.0$ (Critical Risk)
  - Band 2: $5.0 \le \text{CGPA} < 6.5$ (Moderate Risk / Minimum Pass)
  - Band 3: $6.5 \le \text{CGPA} < 7.5$ (Average / Second Class)
  - Band 4: $7.5 \le \text{CGPA} < 9.0$ (Very Good / First Class)
  - Band 5: $\text{CGPA} \ge 9.0$ (Distinction / Outstanding)
- **Why**: Matches genuine university grading systems while maintaining mathematical fidelity with the underlying UCI dataset.

### Decision 3: Hybrid Chatbot Engine (Gemini + Data-Driven Heuristics)
- **Approach**: Full-stack proxy endpoint (`/api/advisor/chat`) utilizing `@google/genai` with `gemini-3.8-flash`, backed by an instant local heuristic rule engine when offline or when API keys are not supplied.
- **Why**: Zero runtime crashes, immediate responsiveness, and expert academic advice grounded in actual feature importances.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Flutter Material 3 Web Interface                     │
│  ┌──────────────┬──────────────┬──────────────┬─────────────────────┐  │
│  │  Dashboard   │  Prediction  │  Evaluation  │  Academic Advisor   │  │
│  │  Overview    │  (1-10 CGPA) │  & PCA/LDA   │  Chatbot (Gemini)   │  │
│  └──────┬───────┴──────┬───────┴──────┬───────┴──────────┬──────────┘  │
└─────────┼──────────────┼──────────────┼──────────────────┼─────────────┘
          │              │              │                  │
          ▼              ▼              ▼                  ▼
┌───────────────────┬───────────────────────────────┬────────────────────┐
│ College Dataset   │ Deterministic ML Engine       │ Server Proxy       │
│ - 145 records     │ - Random Forest Classifier    │ /api/advisor/chat  │
│ - 33 attributes   │ - SVM (Linear & RBF)          │ (Gemini 3.8 Flash  │
│ - 10-point scale  │ - Ridge / Lasso / Poly Regr.  │  + Heuristic Fall- │
│ - UCI Higher Ed.  │ - PCA Component Projection    │  back)             │
└───────────────────┴───────────────────────────────┴────────────────────┘
```

### Component & State Mapping
- `src/types/index.ts`: Updated to remove school types, refine `CollegeStudentProfile`, add `ChatMessage` and `AdvisorRecommendation`.
- `src/data/datasets.ts`: Retains solely `collegeDatasetInfo`, `collegeSchemaFields`, and `collegeFeatureImportances`.
- `src/ml/mlEngine.ts`: Refactored to operate on 10-point CGPA scales, calculate risk thresholds ($\text{CGPA} < 6.0$), and provide regression and classification metrics for college students.
- `src/components/screens/PredictionScreen.tsx`: Modernized form with 10-point CGPA sliders, real-time risk indicators, and direct "Send to Advisor" handover.
- `src/components/screens/AdvisorChatbotScreen.tsx`: New dedicated chat screen with prompt suggestions, student context cards, and tailored recommendations.
- `src/components/screens/AboutScreen.tsx`: Clean project dossier without the viva tab.
- `server.ts`: Express backend serving the app and proxying `/api/advisor/chat` using `@google/genai`.
