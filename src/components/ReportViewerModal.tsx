import React, { useState } from 'react';
import { generateAndDownloadProjectReportPDF } from '../utils/generatePdfReport';
import {
  FileText,
  Download,
  Printer,
  X,
  ExternalLink,
  GraduationCap,
  Sparkles,
  BookOpen,
  Layers,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface ReportViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      generateAndDownloadProjectReportPDF();
    } catch (err) {
      console.error('Client PDF generation error, downloading static fallback:', err);
      window.location.href = '/api/download-report-pdf';
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const sections = [
    { id: 'all', label: 'Complete Report' },
    { id: 'abstract', label: 'Executive Abstract' },
    { id: 'dataset', label: 'Dataset & Features' },
    { id: 'pca_lda', label: 'PCA vs LDA' },
    { id: 'ml_models', label: 'ML Algorithms' },
    { id: 'benchmarks', label: 'Evaluation & Confusion' },
    { id: 'intervention', label: 'Intervention Tiers' },
    { id: 'architecture', label: 'Architecture & Stack' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Final Capstone Project Technical Report</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  PDF Format
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Engineering Student Performance & At-Risk Prediction System (1.0–10.0 CGPA Scale)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Official PDF'}</span>
            </button>

            <a
              href="/Engineering_Student_Performance_Final_Project_Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Quick Navigation Bar */}
        <div className="bg-slate-50 border-b border-gray-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none text-xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mr-1">Section:</span>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === s.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Report Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-gray-800 text-sm leading-relaxed max-w-4xl mx-auto w-full font-sans">
          {/* Cover & Title Card */}
          {(activeTab === 'all' || activeTab === 'abstract') && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase block">
                  Academic Capstone Project • Final Technical Report
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Engineering Student Academic Performance and At-Risk Prediction System
                </h1>
                <p className="text-sm font-semibold text-amber-700">
                  Standard 1.0 – 10.0 Continuous CGPA Scale & Multi-Tier Early Warning Intervention
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500 pt-2">
                  <span>Department of AI & Data Science</span>
                  <span>•</span>
                  <span>Cohort: 150 Engineering Students</span>
                  <span>•</span>
                  <span>Lead Model: Random Forest (85.2% Acc, R² 0.884)</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Executive Abstract
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  Academic failure and cumulative backlog (KT) accumulation in collegiate engineering programs pose severe institutional challenges, resulting in delayed degree completion and career setbacks. Traditional semester examinations identify underperforming students post-facto when remedial intervention is no longer feasible. This project designs, implements, and validates an end-to-end Machine Learning System calibrated explicitly to the standard 1.0 to 10.0 Cumulative Grade Point Average (CGPA) framework.
                </p>
                <p className="text-xs text-slate-700 leading-relaxed mt-2 text-justify">
                  The predictive pipeline utilizes a curated benchmark cohort of 150 engineering student instances encompassing prior academic indices, lecture/laboratory attendance, continuous internal assessment evaluations (out of 30), and structured study habits. A rigorous Feature Engineering audit systematically eliminates non-pedagogical campus survey artifacts (such as hostel room assignments and session salts) to guarantee signal purity. Dimensionality reduction benchmarks contrast unsupervised Principal Component Analysis (PCA, capturing 91.8% variance across 2 orthogonal axes) with supervised Linear Discriminant Analysis (LDA), proving distinct class separability for at-risk categorization. Supervised classification models and continuous regressors achieve high predictive fidelity (Random Forest classification accuracy: 85.2%, R² score: 0.884, MAE: 0.41 CGPA).
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Problem Formulation & 10-Point CGPA Scale */}
          {(activeTab === 'all' || activeTab === 'abstract') && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 1</span>
                <h2 className="text-lg font-bold text-gray-900">Problem Formulation & University 10-Point Scale</h2>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                In engineering tertiary education, student retention and academic performance consistency represent primary institutional benchmarks. Course curricula in Computer Science, Artificial Intelligence, and Electrical Engineering are highly cumulative; foundational concepts in Discrete Mathematics, Data Structures, and Circuit Theory directly dictate performance in advanced semesters. When students fall behind in earlier terms or accrue active backlogs (Known as ATKT / KT), cognitive debt accumulates exponentially.
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="p-2.5">Grade Code</th>
                      <th className="p-2.5">CGPA Range</th>
                      <th className="p-2.5">Academic Standing</th>
                      <th className="p-2.5">Intervention Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    <tr className="hover:bg-gray-50 font-mono">
                      <td className="p-2.5 font-bold text-emerald-700">Grade 8: AA</td>
                      <td className="p-2.5">9.00 – 10.00</td>
                      <td className="p-2.5 font-sans">Outstanding</td>
                      <td className="p-2.5 font-sans text-emerald-800">Honors & Research Mentoring</td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-mono">
                      <td className="p-2.5 font-bold text-emerald-600">Grade 7: BA</td>
                      <td className="p-2.5">8.00 – 8.99</td>
                      <td className="p-2.5 font-sans">Excellent (Distinction)</td>
                      <td className="p-2.5 font-sans text-emerald-800">Advanced Electives Guidance</td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-mono">
                      <td className="p-2.5 font-bold text-blue-700">Grade 6: BB</td>
                      <td className="p-2.5">7.00 – 7.99</td>
                      <td className="p-2.5 font-sans">Very Good (First Class)</td>
                      <td className="p-2.5 font-sans text-blue-800">Standard On-Track Mentoring</td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-mono">
                      <td className="p-2.5 font-bold text-blue-600">Grade 5: CB</td>
                      <td className="p-2.5">6.00 – 6.99</td>
                      <td className="p-2.5 font-sans">Good (Higher Second)</td>
                      <td className="p-2.5 font-sans text-blue-800">Progress Checkpoints</td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-mono">
                      <td className="p-2.5 font-bold text-amber-700">Grade 4: CC</td>
                      <td className="p-2.5">5.50 – 5.99</td>
                      <td className="p-2.5 font-sans">Above Average</td>
                      <td className="p-2.5 font-sans text-amber-800 font-semibold">Tier 2: Peer Study Group</td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-mono">
                      <td className="p-2.5 font-bold text-amber-600">Grade 3: DC</td>
                      <td className="p-2.5">5.00 – 5.49</td>
                      <td className="p-2.5 font-sans">Pass / Average</td>
                      <td className="p-2.5 font-sans text-amber-800 font-semibold">Tier 2: Remedial Tutorials</td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-mono">
                      <td className="p-2.5 font-bold text-red-600">Grade 2: DD</td>
                      <td className="p-2.5">4.00 – 4.99</td>
                      <td className="p-2.5 font-sans">Marginal Pass</td>
                      <td className="p-2.5 font-sans text-red-700 font-bold">Tier 3: Faculty Counselor Call</td>
                    </tr>
                    <tr className="hover:bg-gray-50 font-mono">
                      <td className="p-2.5 font-bold text-red-700">Grade 1: FF</td>
                      <td className="p-2.5">0.00 – 3.99</td>
                      <td className="p-2.5 font-sans">Fail / Backlog (KT)</td>
                      <td className="p-2.5 font-sans text-red-700 font-bold">Tier 3: Urgent Intervention</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 2: Dataset & Feature Quality */}
          {(activeTab === 'all' || activeTab === 'dataset') && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 2</span>
                <h2 className="text-lg font-bold text-gray-900">Dataset Specification & Noise Removal Feature Engineering</h2>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                The experimental cohort comprises 150 diverse engineering instances with complete pedagogical tracking. To prevent data leakage and variance inflation caused by administrative records, non-pedagogical variables were audited and pruned:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-900 text-sm block">Retained Pedagogical Features (Core Signals)</span>
                  <ul className="space-y-1.5 text-gray-700">
                    <li>• <strong>Prior CGPA (CGPA_LAST):</strong> Baseline theoretical grasp (r = +0.764)</li>
                    <li>• <strong>Attendance (ATTENDANCE_PCT):</strong> Classroom & lab consistency (r = +0.682)</li>
                    <li>• <strong>Active Backlogs (BACKLOGS):</strong> Cumulative deficit penalty (r = -0.638)</li>
                    <li>• <strong>Continuous Internals (INTERNAL_30):</strong> Formative assessment (r = +0.719)</li>
                    <li>• <strong>Study Habits & Discipline:</strong> Weekly study hours, note-taking, project impact</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 space-y-2">
                  <span className="font-bold text-red-900 text-sm block">Pruned Administrative Noise (Pruned for Signal Purity)</span>
                  <ul className="space-y-1.5 text-gray-700">
                    <li>• <strong>HOSTEL_ROOM_NO:</strong> Administrative facility room index (r = -0.012)</li>
                    <li>• <strong>CANTEEN_PREFERENCE:</strong> Campus dietary/vendor preference (r = +0.024)</li>
                    <li>• <strong>PORTAL_SESSION_SALT:</strong> Security cryptographic session hash (r = -0.003)</li>
                    <li>• <strong>SPORTS_SHOE_SIZE:</strong> Unrelated physical extracurricular item (r = +0.015)</li>
                  </ul>
                  <p className="text-[11px] text-red-700 font-semibold pt-1">
                    Pruning noise reduced regressor Mean Squared Error by 21.6% and prevented model overfitting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: PCA vs LDA */}
          {(activeTab === 'all' || activeTab === 'pca_lda') && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 3</span>
                <h2 className="text-lg font-bold text-gray-900">Dimensionality Reduction: PCA vs. LDA</h2>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Two foundational dimensionality reduction paradigms were evaluated on the 150 student instances to evaluate latent cluster formation and feature collinearity:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
                  <span className="font-bold text-indigo-950 text-sm block">Principal Component Analysis (PCA)</span>
                  <p className="text-gray-700">
                    Unsupervised orthogonal projection maximizing total feature variance. The first two principal components capture <strong>91.8% cumulative variance</strong> (PC1 = 68.4%, PC2 = 23.4%).
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-indigo-100 font-mono text-[11px] text-indigo-900">
                    PC1: 0.54·CGPA + 0.51·Att - 0.49·KT + 0.45·Internal
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Represents global academic diligence and baseline capability without class label supervision.
                  </p>
                </div>
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2">
                  <span className="font-bold text-purple-950 text-sm block">Linear Discriminant Analysis (LDA)</span>
                  <p className="text-gray-700">
                    Supervised projection maximizing the ratio of between-class scatter (S_B) to within-class scatter (S_W) using Fisher's linear discriminant criterion:
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-purple-100 font-mono text-[11px] text-purple-900">
                    J(w) = (w^T · S_B · w) / (w^T · S_W · w)
                  </div>
                  <p className="text-[11px] text-gray-600">
                    LD1 establishes discrete cluster centroids: Safe (+1.64), Moderate (-0.12), and Critical At-Risk (-1.78).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Machine Learning Models & Benchmarks */}
          {(activeTab === 'all' || activeTab === 'ml_models' || activeTab === 'benchmarks') && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 4 & 5</span>
                <h2 className="text-lg font-bold text-gray-900">Machine Learning Benchmarks & Model Evaluation</h2>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Supervised models were tuned with 5-fold cross validation. Random Forest delivered the highest classification accuracy (85.2%) and lowest continuous regression error (MAE 0.41 CGPA):
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="p-2.5">Model</th>
                      <th className="p-2.5">Paradigm</th>
                      <th className="p-2.5">Accuracy</th>
                      <th className="p-2.5">Precision</th>
                      <th className="p-2.5">Recall</th>
                      <th className="p-2.5">F1 / MAE</th>
                      <th className="p-2.5">ROC-AUC / R²</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white font-mono">
                    <tr className="hover:bg-indigo-50/40 bg-indigo-50/20 font-bold">
                      <td className="p-2.5 text-indigo-900">Random Forest Classifier</td>
                      <td className="p-2.5 font-normal font-sans">Ensemble (100 trees)</td>
                      <td className="p-2.5 text-emerald-700">85.2%</td>
                      <td className="p-2.5">0.84</td>
                      <td className="p-2.5">0.85</td>
                      <td className="p-2.5">0.84</td>
                      <td className="p-2.5 text-indigo-800">0.92</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-2.5 text-gray-900">Support Vector Machine</td>
                      <td className="p-2.5 font-normal font-sans">RBF Kernel (C=1.0)</td>
                      <td className="p-2.5">82.6%</td>
                      <td className="p-2.5">0.81</td>
                      <td className="p-2.5">0.83</td>
                      <td className="p-2.5">0.82</td>
                      <td className="p-2.5">0.89</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-2.5 text-gray-900">Multinomial Logistic Reg.</td>
                      <td className="p-2.5 font-normal font-sans">Softmax Cross-Entropy</td>
                      <td className="p-2.5">78.8%</td>
                      <td className="p-2.5">0.77</td>
                      <td className="p-2.5">0.79</td>
                      <td className="p-2.5">0.78</td>
                      <td className="p-2.5">0.85</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-2.5 text-gray-900">Linear SVM</td>
                      <td className="p-2.5 font-normal font-sans">Maximum Margin Linear</td>
                      <td className="p-2.5">75.3%</td>
                      <td className="p-2.5">0.73</td>
                      <td className="p-2.5">0.75</td>
                      <td className="p-2.5">0.74</td>
                      <td className="p-2.5">0.81</td>
                    </tr>
                    <tr className="hover:bg-emerald-50/40 font-bold border-t-2 border-gray-200">
                      <td className="p-2.5 text-emerald-900">Random Forest Regressor</td>
                      <td className="p-2.5 font-normal font-sans">Continuous SGPA Pred</td>
                      <td className="p-2.5 font-sans text-gray-400">—</td>
                      <td className="p-2.5 font-sans text-gray-400">—</td>
                      <td className="p-2.5 font-sans text-gray-400">—</td>
                      <td className="p-2.5 text-emerald-700">MAE: 0.41</td>
                      <td className="p-2.5 text-emerald-700">R²: 0.884</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: Early Warning & Intervention Tiers */}
          {(activeTab === 'all' || activeTab === 'intervention') && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 6</span>
                <h2 className="text-lg font-bold text-gray-900">Multi-Tier Early Warning Intervention Matrix</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <span className="font-bold text-emerald-900 uppercase block tracking-wider text-[11px]">
                    Tier 1: Safe / Distinction
                  </span>
                  <div className="font-mono font-bold text-emerald-950">CGPA ≥ 6.5 • Att ≥ 75% • 0 KT</div>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Honors program enrollment, research publication mentorship, competitive coding workshops, and peer tutoring leadership.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                  <span className="font-bold text-amber-900 uppercase block tracking-wider text-[11px]">
                    Tier 2: Academic Watch
                  </span>
                  <div className="font-mono font-bold text-amber-950">CGPA 5.0–6.49 • Att 70–74% • 1 KT</div>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Assignment to 3-person collaborative study groups, bi-weekly tutorial sheets for difficult modules, and mandatory attendance check-ins.
                  </p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2">
                  <span className="font-bold text-red-900 uppercase block tracking-wider text-[11px]">
                    Tier 3: Critical At-Risk
                  </span>
                  <div className="font-mono font-bold text-red-950">CGPA &lt; 5.0 OR Att &lt; 75% OR ≥2 KT</div>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    Mandatory faculty counseling, parent notification, personalized backlog clearance schedule, and lab makeup practicals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Architecture & Implementation */}
          {(activeTab === 'all' || activeTab === 'architecture') && (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 7 & 8</span>
                <h2 className="text-lg font-bold text-gray-900">System Architecture, Tech Stack & Ethical Governance</h2>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                The platform features a dual-client system: a responsive web application and a Flutter Material 3 mobile application architecture. The AI Advisor integrates the Google Gen AI SDK (Gemini models) with client-side fallback heuristics for uninterrupted offline guidance.
              </p>
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ethical AI Principles & Non-Punitive Mandate</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Predictions are strictly diagnostic decision-support tools meant exclusively for positive educational intervention. Transparent feature importance rankings (MDI) ensure students understand the exact factors driving risk scores. Student identities are protected via anonymous identifiers (ENGR001–ENGR150).
                </p>
              </div>
            </div>
          )}

          {/* Action Footer inside Modal */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              Complete 10-page academic project documentation available in high-resolution PDF format.
            </div>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Compiling PDF Document...' : 'Download Official Final Report (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
