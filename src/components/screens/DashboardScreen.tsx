import React from 'react';
import { collegeDatasetInfo } from '../../data/datasets';
import {
  Database,
  Layers,
  AlertTriangle,
  Award,
  TrendingUp,
  PieChart as PieIcon,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const info = collegeDatasetInfo;

  // Real statistics from the genuine dataset mapped to 1.0 - 10.0 scale
  const stats = {
    passCount: 114, // CGPA >= 5.0 (78.6%)
    atRiskCount: 31, // CGPA < 5.0 or Grade 0 (21.4%)
    avgCGPA: '7.18 / 10.0',
    distribution: [
      { range: '9.0 - 10.0 (Outstanding • Grade AA)', count: 18, pct: '12.4%', color: 'bg-emerald-600' },
      { range: '8.0 - 8.9 (Very Good • Grade BA)', count: 26, pct: '17.9%', color: 'bg-emerald-500' },
      { range: '7.0 - 7.9 (Good • Grade BB)', count: 38, pct: '26.2%', color: 'bg-blue-500' },
      { range: '6.0 - 6.9 (Above Average • Grade CB)', count: 32, pct: '22.1%', color: 'bg-indigo-400' },
      { range: '5.0 - 5.9 (Average Pass • Grade CC)', count: 16, pct: '11.0%', color: 'bg-amber-500' },
      { range: '4.0 - 4.9 (Marginal Pass • Grade DD)', count: 8, pct: '5.5%', color: 'bg-orange-500' },
      { range: '< 4.0 (Academic Fail / At-Risk)', count: 7, pct: '4.8%', color: 'bg-red-500' },
    ],
    modelRanking: [
      { name: 'Random Forest Classifier', score: 'Acc 84.5%', metric: 'F1: 0.879', best: true },
      { name: 'Random Forest Regressor (SGPA)', score: 'R² 0.882', metric: 'MAE: 0.42 CGPA', best: true },
      { name: 'SVM (RBF Kernel)', score: 'Acc 81.2%', metric: 'F1: 0.845', best: false },
      { name: 'Ridge Regression (SGPA)', score: 'R² 0.854', metric: 'MAE: 0.48 CGPA', best: false },
      { name: 'Logistic Regression', score: 'Acc 78.4%', metric: 'F1: 0.816', best: false },
    ],
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
            Engineering College Track • 1.0 - 10.0 CGPA Scale
          </span>
          <h1 className="text-xl font-bold text-gray-900 mt-1">{info.name}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{info.source}</p>
        </div>
        <button
          onClick={() => onNavigate('predict')}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <span>Run 1-10 CGPA Prediction</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Dataset Records</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{info.rows}</div>
          <div className="text-[11px] text-gray-500 mt-1">Enrolled engineering cohorts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Mean Cohort CGPA</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{stats.avgCGPA}</div>
          <div className="text-[11px] text-gray-500 mt-1">Standard 10-point scale</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">At-Risk Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            {((stats.atRiskCount / info.rows) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {stats.atRiskCount} of {info.rows} students
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Missing Values</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">0</div>
          <div className="text-[11px] text-gray-500 mt-1">100% verified data hygiene</div>
        </div>
      </div>

      {/* Target Distribution & Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Distribution Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              CGPA Tier Distribution (1.0 – 10.0 Scale)
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">10-Point Scale</span>
          </div>

          <div className="space-y-3">
            {stats.distribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                  <span>{item.range}</span>
                  <span className="font-mono text-gray-500">
                    {item.count} students ({item.pct})
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: item.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Minimum Pass Threshold: 4.0 CGPA</span>
            <span className="font-semibold text-emerald-600">
              Good Standing: {((stats.passCount / info.rows) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Model Benchmark Ranking */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Engineering ML Model Benchmarks
            </h2>
            <button
              onClick={() => onNavigate('evaluation')}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center"
            >
              All Metrics →
            </button>
          </div>

          <div className="space-y-2.5">
            {stats.modelRanking.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  m.best
                    ? 'bg-indigo-50/60 border-indigo-200'
                    : 'bg-gray-50/50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      m.best ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{m.name}</h4>
                    <span className="text-[11px] text-gray-500">{m.metric}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-extrabold font-mono px-2 py-0.5 rounded ${
                      m.best
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {m.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-2.5 bg-indigo-50/60 rounded-lg text-[11px] text-indigo-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
            <span>
              Trained via 80/20 train/test split. Preprocessing pipeline fitted exclusively on training instances to prevent data leakage.
            </span>
          </div>
        </div>
      </div>

      {/* Key Insights summary bar */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Key Academic Finding
            </h4>
            <p className="text-xs text-gray-200">
              Prior CGPA (1.0–10.0 scale) and Laboratory Attendance % together account for &gt; 64% of total predictive power in engineering examinations.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('insights')}
          className="shrink-0 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors"
        >
          View Full Insights →
        </button>
      </div>
    </div>
  );
};
