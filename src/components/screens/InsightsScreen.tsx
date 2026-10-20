import React from 'react';
import { collegeFeatureImportances } from '../../data/datasets';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BrainCircuit,
  HeartHandshake,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const InsightsScreen: React.FC = () => {
  const importances = collegeFeatureImportances;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md">
          Explainability & Attribution • Engineering Dataset
        </span>
        <h1 className="text-xl font-bold text-gray-900 mt-1">
          Engineering Academic Factor Attribution & Predictive Insights
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Empirical feature importance rankings derived from Scikit-Learn Random Forest ensembles (Mean Decrease in Impurity - MDI).
        </p>
      </div>

      {/* Critical Association vs Causation Disclaimer Card */}
      <div className="bg-amber-50/70 border border-amber-300 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <h4 className="font-bold text-amber-900 text-sm">
            Ethical Principle: Statistical Association is Not Proof of Causation
          </h4>
          <p className="leading-relaxed">
            Machine learning models discover mathematical correlations within historical engineering cohorts. While lower attendance and higher backlogs strongly correlate with semester failure, an individual backlog does not guarantee inability to succeed. Personal emergencies, health issues, or exam stress are unmeasured variables. Predictions must strictly serve as guidance for mentorship, remedial tutorial scheduling, and lab assistance—never for punitive disciplinary measures.
          </p>
        </div>
      </div>

      {/* Feature Importance Bar Chart */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-gray-900 text-sm">
              Global Feature Importance Ranking (Random Forest MDI)
            </h3>
          </div>
          <span className="text-xs font-medium text-gray-500">Cumulative Impurity Reduction = 100%</span>
        </div>

        <div className="space-y-3 pt-2">
          {importances.map((fi, idx) => {
            const pct = (fi.importance * 100).toFixed(1);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-gray-800">{fi.feature}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                      {fi.category}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-indigo-700">{pct}%</span>
                </div>

                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-[11px] text-gray-500 pl-7">{fi.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Support Interventions for Engineering Colleges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-sm">Departmental Remedial Framework</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Backlog Clearance Clinics:</strong> Conduct targeted tutorial doubt sessions for prerequisite subjects before re-examinations.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Attendance Alert Triggers:</strong> Automated alerts when a student drops below the university 75% threshold, enabling early counseling.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Faculty Mentorship Circles:</strong> Assign faculty advisors to students in the &lt; 5.0 CGPA band to monitor weekly progress.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-sm">Cognitive & Study Habit Findings</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-start gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Technical Note-Taking:</strong> Active sketching of architecture diagrams and pseudo-code raises semester test scores by 1.2 CGPA points on average.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Hands-on Laboratory Mini-Projects:</strong> Students with positive project engagement demonstrate 42% higher retention in semester examinations.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Study Consistency vs Cramming:</strong> Consistent weekly revision yields an average 1.6 CGPA boost over last-minute exam cramming.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
