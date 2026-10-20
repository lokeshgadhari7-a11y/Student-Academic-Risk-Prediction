import React from 'react';
import { collegeDatasetInfo } from '../../data/datasets';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  FileSpreadsheet,
  Lightbulb,
  Info,
  Database,
  Activity,
  Bot,
  MessageSquare,
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  isBackendOnline: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, isBackendOnline }) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-blue-700 to-slate-900 text-white p-6 shadow-md">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-indigo-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Third-Year AI & Data Science Mini-Project</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
            Engineering Student Performance & At-Risk Prediction System
          </h1>
          <p className="text-indigo-100/90 text-xs md:text-sm max-w-2xl leading-relaxed">
            Machine learning platform designed specifically for engineering colleges to predict semester SGPA/CGPA on the standard <strong>1.0 – 10.0 scale</strong>, evaluate academic risk, and provide early intervention support before semester examinations.
          </p>

          <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center gap-3 text-xs text-indigo-200">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Backend Status: {isBackendOnline ? 'FastAPI Connected' : 'Embedded Python/TS Engine'}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-300" />
              <span>Dataset: {collegeDatasetInfo.name} ({collegeDatasetInfo.rows} instances, 33 features)</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Featured AI Academic Advisor Card */}
      <div
        onClick={() => onNavigate('advisor')}
        className="cursor-pointer bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 rounded-2xl border border-indigo-700/80 shadow-md hover:shadow-lg transition-all group relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 group-hover:scale-105 transition-transform">
              <Bot className="w-7 h-7 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  AI Academic Advisor Chatbot
                </h3>
                <span className="bg-amber-400 text-gray-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  NEW
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
                Interact with our dedicated chatbot to receive customized academic suggestions, personalized weekly revision timetables, and backlog clearance strategies grounded in your entered metrics.
              </p>
            </div>
          </div>

          <div className="self-end sm:self-auto shrink-0 flex items-center gap-2 bg-white text-indigo-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs group-hover:bg-indigo-50 transition-colors">
            <span>Launch Advisor Chat</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* College Engineering Highlights Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Engineering Academic Performance & Risk Evaluation
              </h2>
              <p className="text-xs text-indigo-700 font-medium">
                Standard 10-Point CGPA Scale • Lab Attendance • Backlogs • Internal Assessments
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
            10.0 CGPA Mapped System
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          The system evaluates engineering students on the standard <strong>1.0 to 10.0 university CGPA scale</strong>. Utilizing multi-class and regularized regression pipelines (Random Forest, SVM, Logistic Regression, Ridge), it forecasts continuous projected semester SGPA and categorizes students into academic standing bands:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Distinction Tier</span>
            <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">8.0 – 10.0</div>
            <span className="text-[10px] text-gray-500">Grade BA / AA</span>
          </div>

          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-blue-800 uppercase block">First Class</span>
            <div className="text-base font-bold text-blue-950 font-mono mt-0.5">6.5 – 7.9</div>
            <span className="text-[10px] text-gray-500">Grade BB / CB</span>
          </div>

          <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Second Class</span>
            <div className="text-base font-bold text-amber-950 font-mono mt-0.5">5.0 – 6.4</div>
            <span className="text-[10px] text-gray-500">Grade CC</span>
          </div>

          <div className="p-2.5 bg-red-50/70 border border-red-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-red-800 uppercase block">Academic Risk</span>
            <div className="text-base font-bold text-red-950 font-mono mt-0.5">&lt; 5.0 CGPA</div>
            <span className="text-[10px] text-red-600 font-semibold">Needs Mentoring</span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
          Application Modules
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ModuleButton
            title="Dashboard"
            description="KPIs & 10-Point CGPA Distribution"
            icon={<BarChart3 className="w-5 h-5 text-indigo-600" />}
            onClick={() => onNavigate('dashboard')}
          />
          <ModuleButton
            title="Predict At-Risk"
            description="Dynamic 1-10 CGPA & Backlogs Inference"
            icon={<BrainCircuit className="w-5 h-5 text-amber-600" />}
            onClick={() => onNavigate('predict')}
            highlight
          />
          <ModuleButton
            title="AI Academic Advisor"
            description="Interactive Chatbot with Personal Advice"
            icon={<Bot className="w-5 h-5 text-indigo-600" />}
            onClick={() => onNavigate('advisor')}
            highlight
          />
          <ModuleButton
            title="Model Evaluation"
            description="RF, SVM, PCA/LDA & Residual Analysis"
            icon={<Activity className="w-5 h-5 text-purple-600" />}
            onClick={() => onNavigate('evaluation')}
          />
          <ModuleButton
            title="Feature Engineering"
            description="PCA, LDA, Noise Audit & Evaluation Metrics"
            icon={<FileSpreadsheet className="w-5 h-5 text-blue-600" />}
            onClick={() => onNavigate('dataset')}
            highlight
          />
          <ModuleButton
            title="Key Insights"
            description="MDI Feature Ranking & Causation Principles"
            icon={<Lightbulb className="w-5 h-5 text-orange-600" />}
            onClick={() => onNavigate('insights')}
          />
          <ModuleButton
            title="About Project"
            description="Objectives, Architecture & Lab Syllabus"
            icon={<Info className="w-5 h-5 text-teal-600" />}
            onClick={() => onNavigate('about')}
          />
        </div>
      </div>
    </div>
  );
};

interface ModuleButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
}

const ModuleButton: React.FC<ModuleButtonProps> = ({ title, description, icon, onClick, highlight }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between group hover:shadow-md ${
        highlight
          ? 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-400'
          : 'bg-white border-gray-200 hover:border-indigo-400'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
          {icon}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{description}</p>
      </div>
    </button>
  );
};
