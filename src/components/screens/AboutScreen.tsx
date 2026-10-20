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
  FileText,
  Download,
  Server,
  Globe,
  ExternalLink,
  Terminal,
} from 'lucide-react';
import { generateAndDownloadProjectReportPDF } from '../../utils/generatePdfReport';

interface AboutScreenProps {
  onOpenReport?: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onOpenReport }) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
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

        <button
          onClick={() => generateAndDownloadProjectReportPDF()}
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Official Project Report PDF Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-500/30 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">
                Official Capstone Final Project Report (10-Page PDF)
              </h3>
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Formal Academic Dossier
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Complete publication-grade documentation containing abstract, 10-point CGPA formulations, 150 student instances, PCA vs LDA variance mathematical proofs, Random Forest and SVM benchmarks, confusion matrices, and ethical guidelines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              Read in Viewer
            </button>
          )}
          <button
            onClick={() => generateAndDownloadProjectReportPDF()}
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
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

      {/* Cloud Hosting & Deployment Guide */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Cloud Hosting & Live Deployment Specifications
              </h3>
              <p className="text-[11px] text-slate-400">
                Pre-configured for zero-setup deployment on Google Cloud Run, Render, Railway, and Docker
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Currently Live on Cloud Run</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <Globe className="w-4 h-4" />
              <span>Public Live Share URL</span>
            </div>
            <p className="text-[11px] text-slate-300 break-all font-mono select-all bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              https://ais-pre-2kxyjcxspnagsbbq7yvbij-354422128157.asia-northeast1.run.app
            </p>
            <p className="text-[10px] text-slate-400">
              Live link to share with college professors, viva evaluators, and project guides immediately.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
              <Terminal className="w-4 h-4" />
              <span>1-Click Render.com / Railway</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              Build: npm run build<br />
              Start: npm start
            </p>
            <p className="text-[10px] text-slate-400">
              Includes pre-configured <code className="text-indigo-300">render.yaml</code> and <code className="text-indigo-300">Procfile</code> for free cloud hosting.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Layers className="w-4 h-4" />
              <span>Docker Production Image</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
              docker build -t app .<br />
              docker run -p 3000:3000 app
            </p>
            <p className="text-[10px] text-slate-400">
              Multi-stage alpine Dockerfile ready for AWS EC2, DigitalOcean, or private college servers.
            </p>
          </div>
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
