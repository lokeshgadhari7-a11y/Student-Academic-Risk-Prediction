# Engineering Student Performance & At-Risk Prediction System (1.0 - 10.0 CGPA)
## Academic Mini-Project Report • Third-Year AI & Data Science

### 1. Abstract & Problem Statement
Early detection of academic failure is critical in engineering colleges to enable timely remedial tutoring before final semester examinations. This project implements a machine learning system on the standard 1.0 - 10.0 CGPA scale to predict academic performance and classify students at risk of failure or backlog accumulation.

### 2. Dataset & Features
- **Source:** UCI Machine Learning Repository (Higher Education Evaluation Dataset)
- **Scale:** 1.0 to 10.0 continuous CGPA scale
- **Key Features:** Prior Semester CGPA, Class & Lab Attendance (%), Active Backlog Count, Continuous Internal Marks (out of 30), Weekly Study Hours, Midterm Exam Prep Strategy, Lecture Note-Taking, and Project Impact.

### 3. Machine Learning Algorithms
- **Classification:** Random Forest Classifier (84.5% Accuracy), Support Vector Machine with RBF Kernel (81.2%), Logistic Regression (78.4%), Linear SVM (75.0%).
- **Regression:** Random Forest Regressor (R² = 0.882, MAE = 0.42 CGPA), Ridge Regression (R² = 0.854), Multiple Linear Regression (OLS).
- **Dimensionality Reduction:** Unsupervised PCA (5 components capturing 92% variance) vs Supervised LDA (1 component).

### 4. Ethical AI Guidelines
Predictions are statistical decision-support tools meant exclusively for positive educational intervention (remedial tutorials, mentoring) and must never be used punitively.
