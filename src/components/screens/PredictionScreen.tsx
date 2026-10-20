import React, { useState } from 'react';
import { PredictionResult } from '../../types';
import { collegeSchemaFields } from '../../data/datasets';
import { predictStudentOutcome } from '../../ml/mlEngine';
import {
  BrainCircuit,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

interface PredictionScreenProps {
  initialData?: Record<string, any>;
  onUpdateData?: (data: Record<string, any>) => void;
  onNavigateToAdvisor?: () => void;
}

export const PredictionScreen: React.FC<PredictionScreenProps> = ({
  initialData,
  onUpdateData,
  onNavigateToAdvisor,
}) => {
  const fields = collegeSchemaFields;

  // Selected ML Model
  const [selectedModel, setSelectedModel] = useState<string>('Random Forest Classifier & Regressor');

  // Form state initialized with standard default engineering student values
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      return initialData;
    }
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.name] = f.defaultValue;
    });
    return initial;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Generate initial prediction
  const [prediction, setPrediction] = useState<PredictionResult | null>(() => {
    return predictStudentOutcome({
      model: 'Random Forest Classifier & Regressor',
      data: initialData || fields.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue }), {}),
    });
  });

  const handleInputChange = (name: string, value: any) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onUpdateData?.(updated);
    setValidationError(null);
  };

  const handleReset = () => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.name] = f.defaultValue;
    });
    setFormData(initial);
    setValidationError(null);
    setPrediction(null);
  };

  const handlePredict = () => {
    // Validate CGPA strictly on 1.0 - 10.0 scale
    const cgpa = Number(formData.CGPA_LAST);
    if (isNaN(cgpa) || cgpa < 1.0 || cgpa > 10.0) {
      setValidationError('Prior CGPA must be between 1.0 and 10.0 (e.g., 7.5 or 8.2).');
      return;
    }

    const attendance = Number(formData.ATTENDANCE_PERCENT);
    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      setValidationError('Attendance must be between 0% and 100%.');
      return;
    }

    const backlogs = Number(formData.BACKLOGS_COUNT);
    if (isNaN(backlogs) || backlogs < 0 || backlogs > 10) {
      setValidationError('Active backlogs count must be a non-negative integer.');
      return;
    }

    setIsLoading(true);
    setValidationError(null);

    setTimeout(() => {
      try {
        const result = predictStudentOutcome({
          model: selectedModel,
          data: formData,
        });
        setPrediction(result);
      } catch (err) {
        setValidationError('Prediction error. Please verify input fields.');
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Engineering Prediction Module • 1.0 - 10.0 CGPA Scale
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-1">
              Engineering Semester Performance & At-Risk Inference
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter academic metrics to forecast projected SGPA on the 10-point scale and identify students requiring mentorship.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Form
          </button>
        </div>

        {/* Model Selector Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Trained Pipeline:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Random Forest Classifier & Regressor">
                Random Forest Ensemble (Accuracy: 84.5% • R²: 0.882)
              </option>
              <option value="Support Vector Machine (RBF Kernel)">
                Support Vector Machine - RBF Kernel (Accuracy: 81.2%)
              </option>
              <option value="Ridge Regression Pipeline">
                Ridge Regularized Regressor (R²: 0.854 • MAE: 0.48)
              </option>
              <option value="Logistic Regression (L2)">
                Logistic Regression Classifier (Accuracy: 78.4%)
              </option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-gray-600 font-medium">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Scale: 1.0 to 10.0 CGPA</span>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Grid: Left Column Form, Right Column Prediction Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              Student Academic Parameters
            </h2>
            <span className="text-[11px] text-gray-500">Continuous 1.0 - 10.0 Scale</span>
          </div>

          {/* Prominent Prior Semester CGPA Input Card */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-700" />
                Prior Semester Cumulative GPA (CGPA)
              </label>
              <span className="text-xs font-black font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-300">
                {Number(formData.CGPA_LAST).toFixed(1)} / 10.0
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.1"
                value={formData.CGPA_LAST}
                onChange={(e) => handleInputChange('CGPA_LAST', Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <input
                type="number"
                min="1.0"
                max="10.0"
                step="0.1"
                value={formData.CGPA_LAST}
                onChange={(e) => handleInputChange('CGPA_LAST', Number(e.target.value))}
                className="w-20 bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-center text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-between text-[10px] text-indigo-800 font-medium">
              <span>1.0 (Fail)</span>
              <span>4.0 (Pass threshold)</span>
              <span>6.5 (First Class)</span>
              <span>8.0+ (Distinction)</span>
              <span>10.0 (Max)</span>
            </div>
          </div>

          {/* Remaining Engineering Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields
              .filter((f) => f.name !== 'CGPA_LAST')
              .map((field) => (
                <div key={field.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700">
                      {field.label}
                    </label>
                    {field.min !== undefined && field.max !== undefined && (
                      <span className="text-[10px] text-gray-400">
                        [{field.min} - {field.max}]
                      </span>
                    )}
                  </div>

                  {field.options ? (
                    <select
                      value={formData[field.name]}
                      onChange={(e) => {
                        const val =
                          field.type === 'numeric' || field.type === 'ordinal'
                            ? Number(e.target.value)
                            : e.target.value;
                        handleInputChange(field.name, val);
                      }}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {field.options.map((opt) => (
                        <option key={String(opt.value)} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                      value={formData[field.name]}
                      onChange={(e) => handleInputChange(field.name, Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}

                  <p className="text-[10px] text-gray-500 line-clamp-1">{field.description}</p>
                </div>
              ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
            <button
              onClick={handlePredict}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Inferring Academic Standing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Execute ML Inference</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prediction Output Card Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {prediction && (
            <div
              className={`p-5 rounded-2xl border-2 transition-all ${
                prediction.atRisk
                  ? 'bg-amber-50/70 border-amber-300 shadow-md ring-2 ring-amber-500/10'
                  : 'bg-emerald-50/70 border-emerald-300 shadow-md ring-2 ring-emerald-500/10'
              }`}
            >
              {/* Header Status */}
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      prediction.atRisk
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {prediction.atRisk ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    {prediction.atRisk ? 'ACADEMIC RISK FLAGGED' : 'SATISFACTORY STANDING'}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-2">
                    {prediction.predictedClass}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Confidence</span>
                  <div className="text-sm font-extrabold font-mono text-gray-800">
                    {(prediction.confidenceScore * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* 10-Point SGPA Display Card */}
              {prediction.predictedScore !== undefined && (
                <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Projected Semester SGPA
                    </span>
                    <div className="text-2xl font-black text-gray-900 font-mono">
                      {prediction.predictedScore.toFixed(1)} / 10.0
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500">Grading Tier</span>
                    <div className="text-xs font-semibold text-indigo-700">
                      {prediction.predictedScore >= 8.0
                        ? 'Distinction Tier'
                        : prediction.predictedScore >= 6.5
                        ? 'First Class'
                        : prediction.predictedScore >= 5.0
                        ? 'Second Class'
                        : 'Sub-Pass / At-Risk'}
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Impact Contributions */}
              <div className="mt-4">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-2">
                  Top Influencing Factors (Attribution on 10-Point Scale)
                </span>
                <div className="space-y-1.5">
                  {prediction.featureContributions.map((fc, i) => (
                    <div
                      key={i}
                      className="p-2 bg-white/80 rounded-lg border border-gray-200/80 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        {fc.direction === 'positive' ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                        )}
                        <span className="font-medium text-gray-800">{fc.feature}</span>
                      </div>
                      <span
                        className={`font-mono font-bold text-xs ${
                          fc.direction === 'positive' ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {fc.impact > 0 ? `+${fc.impact}` : fc.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations for Engineering Students */}
              <div className="mt-4">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-2">
                  Academic Support & Mentorship Recommendations
                </span>
                <ul className="space-y-1.5">
                  {prediction.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-700 flex items-start gap-1.5 bg-white/70 p-2 rounded-lg border border-gray-200/60"
                    >
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consult AI Advisor Action Button */}
              {onNavigateToAdvisor && (
                <div className="mt-4 pt-3 border-t border-gray-200/80">
                  <button
                    onClick={onNavigateToAdvisor}
                    className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-colors"
                  >
                    <span>💬 Chat with AI Advisor About These Suggestions</span>
                  </button>
                </div>
              )}

              {/* Ethical Disclaimer */}
              <div className="mt-4 pt-3 border-t border-gray-200/80 flex items-start gap-2 text-[10px] text-gray-500">
                <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-600 mt-0.5" />
                <span>
                  <strong>Ethical AI Notice:</strong> Predictions are statistical estimates for academic counseling and mentoring, not guarantees. Must not be used for disciplinary decisions.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
