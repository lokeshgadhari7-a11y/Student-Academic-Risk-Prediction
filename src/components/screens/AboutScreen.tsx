import React from 'react';
import { labPracticalsMapping } from '../../data/datasets';
import {
  BookOpen,
  GraduationCap,
  Code2,
  Award,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  BarChart2,
  SlidersHorizontal,
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
          Academic Project Dossier • Third-Year AI & Data Science
        </span>
        <h1 className="text-xl font-bold text-gray-900 mt-1">
          About: Engineering Student Performance & At-Risk Prediction System
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Comprehensive project report documentation, system architecture, methodology, and Machine Learning Laboratory syllabus mapping.
        </p>
      </div>

      {/* Problem Statement and Core Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-sm">Problem Statement</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            In technical universities, academic performance evaluations occur retroactively at the conclusion of semesters, when students have already failed or accumulated active backlogs (KT). This project develops an early-warning, proactive machine learning system specifically for engineering students to forecast semester performance on the standard <strong>1.0 to 10.0 CGPA scale</strong> and identify at-risk students who need remedial tutoring and mentorship before university final examinations.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-sm">Core Objectives</h3>
          </div>
          <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
            <li>Standardize engineering academic metrics onto the university 1.0 – 10.0 CGPA scale.</li>
            <li>Train and evaluate 4 classifiers (Random Forest, SVM RBF, SVM Linear, Logistic Regression).</li>
            <li>Implement continuous SGPA regression pipelines (Random Forest Regressor, Ridge, Linear Regression).</li>
            <li>Perform dimensionality reduction experiments using PCA (5 components) vs LDA (1 component).</li>
            <li>Provide a responsive Material 3 Flutter user interface backed by a Python FastAPI REST engine.</li>
          </ul>
        </div>
      </div>

      {/* End-to-End System Architecture */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-gray-900 text-sm">End-to-End System Architecture</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
            <div className="font-bold text-indigo-700 flex items-center gap-1.5">
              <span>1. Flutter UI (M3)</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Material 3 interface with dynamic input forms, fl_chart analytics, CSV file upload, and real-time prediction cards.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
            <div className="font-bold text-emerald-700 flex items-center gap-1.5">
              <span>2. FastAPI REST API</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Asynchronous endpoints for health, dashboard summaries, prediction inference, and multipart CSV validation.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
            <div className="font-bold text-purple-700 flex items-center gap-1.5">
              <span>3. ML Pipelines</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Scikit-Learn ColumnTransformers, StandardScaler, PCA, LDA, and serialized Joblib model artifacts.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
            <div className="font-bold text-amber-700 flex items-center gap-1.5">
              <span>4. Data & Ethics</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              10-point CGPA ratio conversion, stratified 80/20 train-test splitting, zero data leakage, and supportive guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-sm">Technology Stack & Specifications</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="font-bold text-indigo-700 block">Frontend</span>
            <span className="text-gray-700 font-medium">Flutter & Dart (M3)</span>
            <p className="text-[10px] text-gray-500 mt-0.5">fl_chart, Dio, file_picker, Provider</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="font-bold text-emerald-700 block">ML Backend</span>
            <span className="text-gray-700 font-medium">Python 3 & FastAPI</span>
            <p className="text-[10px] text-gray-500 mt-0.5">Uvicorn, Pydantic, Pandas, NumPy</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="font-bold text-purple-700 block">Machine Learning</span>
            <span className="text-gray-700 font-medium">Scikit-Learn & Joblib</span>
            <p className="text-[10px] text-gray-500 mt-0.5">Pipelines, PCA, LDA, RF, SVM</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="font-bold text-amber-700 block">Dataset</span>
            <span className="text-gray-700 font-medium">UCI Engineering Dataset</span>
            <p className="text-[10px] text-gray-500 mt-0.5">150 instances, 10-point scale mapping</p>
          </div>
        </div>
      </div>

      {/* Machine Learning Methodology & Integrity */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-sm">ML Methodology & Prevention of Data Leakage</h3>
        </div>
        <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
          <p>
            1. <strong>Strict Train/Test Isolation:</strong> Data was partitioned into 80% training and 20% held-out test sets using stratified sampling to preserve target class proportions. Preprocessing transformers (StandardScaler, OneHotEncoder) were fitted strictly on the training partition; test data was never used to compute means, variances, or category encodings.
          </p>
          <p>
            2. <strong>10-Point CGPA Scaling:</strong> To reflect university grading systems, ordinal 1-5 bands from the UCI dataset were mapped into continuous 1.0 - 10.0 CGPA values using ratio conversion (CGPA = band * 2.0), preserving relative academic ordering and enabling decimal precision.
          </p>
          <p>
            3. <strong>Target Independence:</strong> In both classification (predicting Grade Band $0-7$) and regression (predicting continuous semester SGPA), the target variable was strictly excluded from the feature matrix to eliminate target leakage.
          </p>
        </div>
      </div>

      {/* Lab Practicals Mapping Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-sm">
              Machine Learning Laboratory Syllabus Mapping
            </h3>
          </div>
          <span className="text-xs text-gray-500">Practicals 1 through 9</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-3">Lab #</th>
                <th className="py-2.5 px-3">Practical Topic</th>
                <th className="py-2.5 px-4">Implementation in This Project</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {labPracticalsMapping.map((lp, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-bold text-indigo-700 whitespace-nowrap">
                    {lp.labNo}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-gray-900">
                    {lp.title}
                    <div className="text-[10px] text-gray-500 font-normal mt-0.5">
                      {lp.curriculumTopic}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-gray-700">{lp.projectImplementation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Scope, Ethical Guidelines & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Ethical AI Principles</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Predictions generated by this application are decision-support estimates to guide faculty advisors and academic counseling. Model outputs must be utilized exclusively for positive educational interventions—such as scheduling doubt sessions, peer-study circles, and laboratory assistance—never for punitive disciplinary actions or grade penalties.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <BarChart2 className="w-4 h-4 text-amber-600" />
            <span>Project Scope & Limitations</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            The system operates on historical dataset statistics and cannot capture unmeasured personal circumstances, acute illnesses, or mid-semester personal breakthroughs. Continuous model re-calibration with each graduating batch ensures long-term algorithmic fairness and prevents distribution drift over changing curriculum structures.
          </p>
        </div>
      </div>
    </div>
  );
};
