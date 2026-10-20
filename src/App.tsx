/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { PredictionScreen } from './components/screens/PredictionScreen';
import { ChatbotScreen } from './components/screens/ChatbotScreen';
import { EvaluationScreen } from './components/screens/EvaluationScreen';
import { DatasetExplorerScreen } from './components/screens/DatasetExplorerScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { AboutScreen } from './components/screens/AboutScreen';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { ReportViewerModal } from './components/ReportViewerModal';
import { generateAndDownloadProjectReportPDF } from './utils/generatePdfReport';

import {
  Home,
  BarChart3,
  BrainCircuit,
  Bot,
  Activity,
  FileSpreadsheet,
  Lightbulb,
  Info,
  Smartphone,
  Monitor,
  FileCode,
  FileText,
  GraduationCap,
  Sparkles,
  Wifi,
  Download,
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);

  // Synchronized student profile state passed between Predict and AI Chatbot
  const [studentProfileData, setStudentProfileData] = useState<Record<string, any>>({
    CGPA_LAST: 7.5,
    ATTENDANCE_PERCENT: 85,
    BACKLOGS_COUNT: 0,
    INTERNAL_MARKS: 24,
    WEEKLY_STUDY_HOURS: 3,
    PREP_MIDTERM: 2,
    TAKING_NOTES: 3,
    PROJECT_IMPACT: 1,
    ADDITIONAL_WORK: 'no',
    SCHOLARSHIP: 2,
  });

  // Bottom Navigation tabs in Flutter M3 style
  const navTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'predict', label: 'Predict (1-10)', icon: BrainCircuit, badge: 'ML' },
    { id: 'advisor', label: 'AI Advisor', icon: Bot, badge: 'AI' },
    { id: 'evaluation', label: 'Evaluation', icon: Activity },
    { id: 'dataset', label: 'Feature Engineering', icon: FileSpreadsheet, badge: 'PCA/LDA' },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Workspace Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 shrink-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Project Title and 10-Point Scale badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">
                  Engineering Student Performance & At-Risk Predictor
                </span>
                <span className="text-[10px] font-mono bg-indigo-900 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-700 font-bold hidden sm:inline">
                  1.0 – 10.0 CGPA Scale
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Department of AI & Data Science • Third-Year Engineering Mini-Project
              </p>
            </div>
          </div>

          {/* Controls: View Mode & Code Explorer */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Direct AI Advisor Shortcut Button */}
            <button
              onClick={() => setCurrentScreen('advisor')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentScreen === 'advisor'
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-slate-700'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>AI Advisor Chat</span>
            </button>

            {/* View Mode (Mobile vs Responsive) */}
            <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setIsMobileFrame(false)}
                title="Full Responsive Tablet/Desktop View"
                className={`p-1.5 rounded-lg transition-colors ${
                  !isMobileFrame ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMobileFrame(true)}
                title="Pixel 7 Mobile Flutter Frame"
                className={`p-1.5 rounded-lg transition-colors ${
                  isMobileFrame ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Project Report PDF Button */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-xl font-bold shadow-sm transition-all"
              title="View and download comprehensive final project technical report (PDF)"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>Project Report (PDF)</span>
            </button>

            {/* View Codebase & ZIP Download Button */}
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-3.5 py-1.5 rounded-xl font-bold shadow-sm transition-all"
            >
              <FileCode className="w-4 h-4" />
              <span>Project Code & ZIP</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        <div
          className={`w-full transition-all duration-300 flex flex-col ${
            isMobileFrame
              ? 'max-w-[420px] my-auto bg-white rounded-[38px] shadow-2xl border-[10px] border-slate-900 overflow-hidden min-h-[760px] h-[86vh]'
              : 'max-w-6xl bg-white sm:rounded-2xl shadow-sm border border-gray-200'
          }`}
        >
          {/* Mobile Frame Top Notch & Status Bar */}
          {isMobileFrame && (
            <div className="bg-slate-900 text-white px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-mono select-none">
              <span>9:41</span>
              <div className="w-16 h-3 bg-black rounded-full" />
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Flutter App Bar */}
          {currentScreen !== 'splash' && (
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-2">
                {currentScreen !== 'home' && (
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    ←
                  </button>
                )}
                <div>
                  <h2 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    {currentScreen === 'advisor'
                      ? 'AI Academic Mentor'
                      : 'Engineering College Track'}
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                      1.0 – 10.0 CGPA Scale
                    </span>
                  </h2>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>FastAPI + Gemini Active</span>
              </div>
            </div>
          )}

          {/* Screen Content Scrollable Body */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {currentScreen === 'splash' && (
              <SplashScreen
                onComplete={() => setCurrentScreen('home')}
                apiStatus="online"
              />
            )}

            {currentScreen === 'home' && (
              <HomeScreen
                onNavigate={(screen) => setCurrentScreen(screen)}
                isBackendOnline={isBackendOnline}
                onOpenReport={() => setIsReportModalOpen(true)}
              />
            )}

            {currentScreen === 'dashboard' && (
              <DashboardScreen
                onNavigate={(screen) => setCurrentScreen(screen)}
              />
            )}

            {currentScreen === 'predict' && (
              <PredictionScreen
                initialData={studentProfileData}
                onUpdateData={(data) => setStudentProfileData(data)}
                onNavigateToAdvisor={() => setCurrentScreen('advisor')}
              />
            )}

            {currentScreen === 'advisor' && (
              <ChatbotScreen
                studentData={studentProfileData}
                onNavigateToPredict={() => setCurrentScreen('predict')}
              />
            )}

            {currentScreen === 'evaluation' && <EvaluationScreen />}

            {currentScreen === 'dataset' && <DatasetExplorerScreen />}

            {currentScreen === 'insights' && <InsightsScreen />}

            {currentScreen === 'about' && (
              <AboutScreen onOpenReport={() => setIsReportModalOpen(true)} />
            )}
          </div>

          {/* Material 3 Bottom Navigation Bar */}
          {currentScreen !== 'splash' && (
            <nav className="bg-white border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shrink-0 z-20">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentScreen === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentScreen(tab.id)}
                    className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                      isActive ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-full transition-all ${
                        isActive ? 'bg-indigo-100 text-indigo-700' : ''
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
                    {tab.badge && (
                      <span className="absolute -top-1 right-1 bg-amber-500 text-white text-[9px] font-extrabold px-1 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Mobile Home Indicator */}
          {isMobileFrame && (
            <div className="bg-white py-1.5 flex justify-center">
              <div className="w-32 h-1 bg-gray-300 rounded-full" />
            </div>
          )}
        </div>
      </main>

      {/* Codebase & Deliverables Explorer Modal */}
      <CodeExplorerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Official Project Report Modal */}
      <ReportViewerModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
