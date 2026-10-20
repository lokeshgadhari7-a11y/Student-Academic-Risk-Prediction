import React, { useState } from 'react';
import {
  collegeClassificationMetrics,
  collegeRegressionMetrics,
  dimensionReductionResults,
} from '../../ml/mlEngine';
import {
  Award,
  BarChart3,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Activity,
  Sliders,
  GraduationCap,
} from 'lucide-react';

export const EvaluationScreen: React.FC = () => {
  type TabType = 'college_classification' | 'college_regression' | 'dim_reduction';
  const [activeTab, setActiveTab] = useState<TabType>('college_classification');

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md">
          Evaluation Dossier • Engineering Dataset (10-Point Scale)
        </span>
        <h1 className="text-xl font-bold text-gray-900 mt-1">
          Machine Learning Algorithm Evaluation & Benchmark Metrics
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Trained on held-out 20% test partition with stratified splitting. Preprocessing pipeline fitted exclusively on training data to prevent leakage.
        </p>

        {/* Tab Bar */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('college_classification')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'college_classification'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1. Academic Standing Classification
          </button>
          <button
            onClick={() => setActiveTab('college_regression')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'college_regression'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            2. Continuous SGPA Regression (1.0 - 10.0 Scale)
          </button>
          <button
            onClick={() => setActiveTab('dim_reduction')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dim_reduction'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3. Dimensionality Reduction (PCA vs LDA)
          </button>
        </div>
      </div>

      {/* TAB 1: CLASSIFICATION */}
      {activeTab === 'college_classification' && (
        <div className="space-y-6">
          <div className="bg-indigo-50/60 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-950 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Academic Risk & Grade Classification Task:</strong> Classifies engineering students into academic standing tiers (At-Risk &lt; 4.0 CGPA vs Safe &gt;= 4.0 CGPA). Evaluated across Random Forest, SVM (RBF & Linear), and Logistic Regression.
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Classification Model Comparison</h3>
              <span className="text-xs text-gray-500">Ordered by Test Accuracy</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Classifier</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Precision</th>
                    <th className="py-2.5 px-3">Recall (At-Risk)</th>
                    <th className="py-2.5 px-3">F1-Score</th>
                    <th className="py-2.5 px-3">ROC-AUC</th>
                    <th className="py-2.5 px-3">Inference Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {collegeClassificationMetrics.map((m, idx) => (
                    <tr key={idx} className={idx === 0 ? 'bg-indigo-50/40 font-semibold' : ''}>
                      <td className="py-3 px-4 text-gray-900 flex items-center gap-2">
                        {idx === 0 && <Award className="w-3.5 h-3.5 text-indigo-600" />}
                        {m.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-indigo-700 font-bold">
                        {((m.accuracy || 0) * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 font-mono">{((m.precision || 0) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-3 font-mono text-blue-700 font-bold">
                        {((m.recall || 0) * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 font-mono">{((m.f1Score || 0) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-3 font-mono text-purple-700 font-bold">
                        {m.rocAuc?.toFixed(3)}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-500">{m.trainingTimeMs} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confusion Matrix and Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConfusionMatrixCard
              title="Confusion Matrix (Random Forest Ensemble)"
              matrix={collegeClassificationMetrics[0].confusionMatrix!}
              labels={['At-Risk (< 4.0)', 'Safe (>= 4.0)']}
            />
            <ClassificationReportCard
              title="Classification Report (Precision, Recall & Support)"
              report={collegeClassificationMetrics[0].classificationReport!}
            />
          </div>
        </div>
      )}

      {/* TAB 2: REGRESSION */}
      {activeTab === 'college_regression' && (
        <div className="space-y-6">
          <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl text-xs text-blue-950 flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Continuous SGPA Regression Task (1.0 - 10.0 Scale):</strong> Directly forecasts continuous semester SGPA using Multiple Linear Regression, Ridge, and Random Forest Regressors.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Algorithm</th>
                    <th className="py-2.5 px-3">R² Score</th>
                    <th className="py-2.5 px-3">MAE (Mean Error)</th>
                    <th className="py-2.5 px-3">MSE</th>
                    <th className="py-2.5 px-3">RMSE</th>
                    <th className="py-2.5 px-3">Training Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {collegeRegressionMetrics.map((m, idx) => (
                    <tr key={idx} className={idx === 0 ? 'bg-emerald-50/40 font-semibold' : ''}>
                      <td className="py-3 px-4 text-gray-900 flex items-center gap-2">
                        {idx === 0 && <Award className="w-3.5 h-3.5 text-emerald-600" />}
                        {m.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-700 font-bold">{m.r2?.toFixed(3)}</td>
                      <td className="py-3 px-3 font-mono text-blue-700">{m.mae?.toFixed(2)} CGPA</td>
                      <td className="py-3 px-3 font-mono">{m.mse?.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono">{m.rmse?.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono text-gray-500">{m.trainingTimeMs} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actual vs Predicted Scatter & Residual Plots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Actual vs Predicted SGPA (1.0 – 10.0 Scale)
                </h4>
                <span className="text-[11px] text-emerald-600 font-mono font-bold">R² = 0.882</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-4">
                Random Forest Regressor predictions aligned along the diagonal y = x reference line.
              </p>

              <div className="relative h-64 border-l border-b border-gray-300 bg-gray-50/50 p-2 rounded">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to top right, transparent calc(50% - 1px), #cbd5e1 50%, transparent calc(50% + 1px))',
                  }}
                />
                {collegeRegressionMetrics[0].actualVsPredicted?.map((pt, i) => {
                  const xPct = (pt.actual / 10) * 100;
                  const yPct = (pt.predicted / 10) * 100;
                  return (
                    <div
                      key={i}
                      title={`Actual SGPA: ${pt.actual}, Predicted SGPA: ${pt.predicted}`}
                      className="absolute w-3.5 h-3.5 -ml-1.5 -mb-1.5 rounded-full bg-indigo-600 border-2 border-white hover:scale-150 transition-transform cursor-pointer shadow-sm"
                      style={{ left: `${xPct}%`, bottom: `${yPct}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                <span>Actual SGPA (1.0 to 10.0)</span>
                <span>Predicted SGPA (1.0 to 10.0)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Residual Analysis (Error = Actual - Predicted)
                </h4>
                <span className="text-[11px] text-blue-600 font-mono font-bold">MAE = 0.42 CGPA</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-4">
                Residual errors evenly centered around the 0.0 error line without systematic bias.
              </p>

              <div className="relative h-64 border-l border-gray-300 bg-gray-50/50 p-2 rounded flex flex-col justify-center">
                <div className="w-full border-t border-dashed border-gray-400 absolute left-0 right-0" />
                {collegeRegressionMetrics[0].residuals?.map((pt, i) => {
                  const xPct = (pt.predicted / 10) * 100;
                  // Map residual -1.0 to +1.0 across height
                  const yPct = 50 + (pt.residual / 1.0) * 50;
                  return (
                    <div
                      key={i}
                      title={`Predicted: ${pt.predicted}, Residual: ${pt.residual}`}
                      className={`absolute w-3 h-3 -ml-1.5 -mb-1.5 rounded-full border border-white shadow-sm ${
                        pt.residual >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ left: `${xPct}%`, bottom: `${yPct}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                <span>Predicted SGPA (1.0 to 10.0)</span>
                <span>Residual Error (-1.0 to +1.0 CGPA)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIMENSIONALITY REDUCTION */}
      {activeTab === 'dim_reduction' && (
        <div className="space-y-6">
          <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-xl text-xs text-purple-950 flex items-start gap-2.5">
            <Sliders className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong>Dimensionality Reduction Experiment (Practical 8):</strong> Evaluates classification using Raw Features (33 dims), PCA-transformed features (5 components), and LDA-transformed features (1 component) on the engineering student dataset.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dimensionReductionResults.map((dr, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-purple-100 text-purple-800 rounded-lg font-bold text-xs">
                      {dr.method}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      {dr.method === 'PCA' ? 'Principal Component Analysis' : 'Linear Discriminant Analysis'}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                    {dr.components} {dr.components === 1 ? 'Component' : 'Components'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Raw Features (33 Dims)</span>
                    <div className="text-lg font-extrabold text-gray-700 font-mono">
                      {(dr.originalAccuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <span className="text-[10px] text-purple-700 uppercase font-semibold">Reduced Space</span>
                    <div className="text-lg font-extrabold text-purple-900 font-mono">
                      {(dr.transformedAccuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {dr.varianceExplained && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1.5">
                      <span>Explained Variance Ratio:</span>
                      <span className="font-mono text-purple-700 font-bold">
                        {(dr.totalVarianceExplained! * 100).toFixed(0)}% Total
                      </span>
                    </div>
                    <div className="flex gap-1.5 h-6">
                      {dr.varianceExplained.map((v, i) => (
                        <div
                          key={i}
                          title={`PC${i + 1}: ${(v * 100).toFixed(1)}%`}
                          className="bg-purple-600 rounded flex items-center justify-center text-[10px] text-white font-mono"
                          style={{ width: `${v * 100}%` }}
                        >
                          PC{i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 leading-relaxed border border-gray-200">
                  <p>{dr.insights}</p>
                </div>

                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Computational Speedup: {dr.trainingTimeChange}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ConfusionMatrixProps {
  title: string;
  matrix: number[][];
  labels: string[];
}

const ConfusionMatrixCard: React.FC<ConfusionMatrixProps> = ({ title, matrix }) => {
  const tn = matrix[0][0];
  const fp = matrix[0][1];
  const fn = matrix[1][0];
  const tp = matrix[1][1];

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="text-[10px] text-emerald-800 font-semibold">True Negative (TN)</div>
          <div className="text-xl font-bold font-mono text-emerald-900 mt-1">{tn}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Correctly Identified At-Risk</div>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="text-[10px] text-amber-800 font-semibold">False Positive (FP)</div>
          <div className="text-xl font-bold font-mono text-amber-900 mt-1">{fp}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Flagged for Extra Support</div>
        </div>
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <div className="text-[10px] text-red-800 font-semibold">False Negative (FN)</div>
          <div className="text-xl font-bold font-mono text-red-900 mt-1">{fn}</div>
          <div className="text-[10px] text-red-600 font-semibold mt-0.5">Missed At-Risk</div>
        </div>
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="text-[10px] text-indigo-800 font-semibold">True Positive (TP)</div>
          <div className="text-xl font-bold font-mono text-indigo-900 mt-1">{tp}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Correctly Safe Standing</div>
        </div>
      </div>
    </div>
  );
};

interface ClassificationReportProps {
  title: string;
  report: Record<string, { precision: number; recall: number; f1Score: number; support: number }>;
}

const ClassificationReportCard: React.FC<ClassificationReportProps> = ({ title, report }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-3">
        {Object.entries(report).map(([clsName, metrics], i) => (
          <div key={i} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between font-bold text-gray-800 mb-1.5">
              <span>{clsName}</span>
              <span className="text-[11px] text-gray-500 font-normal">Test Support: {metrics.support} instances</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-gray-500">Precision</span>
                <div className="font-mono font-bold text-gray-800">{(metrics.precision * 100).toFixed(1)}%</div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500">Recall</span>
                <div className="font-mono font-bold text-indigo-700">{(metrics.recall * 100).toFixed(1)}%</div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500">F1-Score</span>
                <div className="font-mono font-bold text-purple-700">{(metrics.f1Score * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
