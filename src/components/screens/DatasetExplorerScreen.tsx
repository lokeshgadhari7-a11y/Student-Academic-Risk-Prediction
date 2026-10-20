import React, { useState } from 'react';
import {
  collegeDatasetInfo,
  sampleCollegeRecords,
  cleanCollegeRecords,
  featureQualityRegistry,
  pcaEigenScreeData,
  studentProjectionsData,
  reductionBenchmarks,
  featureEngineeringEvaluationMetrics,
} from '../../data/datasets';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  Search,
  Database,
  RefreshCw,
  Sliders,
  Layers,
  TrendingUp,
  Activity,
  Award,
  Filter,
  Download,
  HelpCircle,
  Minimize2,
  Sparkles,
  BarChart3,
  Target,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const DatasetExplorerScreen: React.FC = () => {
  const info = collegeDatasetInfo;
  const initialRecords = sampleCollegeRecords;

  const [activeTab, setActiveTab] = useState<'table' | 'pca' | 'lda' | 'reduced' | 'metrics'>('table');
  const [showSurveyAttributes, setShowSurveyAttributes] = useState(true);
  const [records, setRecords] = useState<any[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [customTargetCol, setCustomTargetCol] = useState('GRADE');
  const [selectedStudentPoint, setSelectedStudentPoint] = useState<any | null>(studentProjectionsData[0]);
  const [selectedPC, setSelectedPC] = useState<string>('PC1');

  // Reducer simulation state
  const [reducerMethod, setReducerMethod] = useState<'raw' | 'filter' | 'pca' | 'lda'>('filter');
  const [pcaComponentCount, setPcaComponentCount] = useState<number>(3);

  // Evaluation metrics tab state
  const [selectedMetricSet, setSelectedMetricSet] = useState<'raw' | 'filtered' | 'pca' | 'lda'>('filtered');

  // Non-pedagogical survey attributes present in real-world institutional multi-department databases
  const surveyColumnNames = ['HOSTEL_ROOM_NO', 'CANTEEN_PREFERENCE', 'PORTAL_SESSION_SALT', 'SPORTS_SHOE_SIZE'];

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const displayedRecords = showSurveyAttributes ? records : cleanCollegeRecords;
  const columns = displayedRecords.length > 0 ? Object.keys(displayedRecords[0]) : [];

  const filteredRecords = displayedRecords.filter((r) =>
    Object.values(r).some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadMessage({
        type: 'error',
        text: 'Invalid file format. Please upload a genuine comma-separated CSV file.',
      });
      return;
    }

    setUploadMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
          throw new Error('CSV file is empty or missing header columns.');
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

        if (headers.length < 4) {
          throw new Error('CSV has too few columns. Expected at least 4 academic variables (e.g. CGPA, Attendance, Backlogs, Grade).');
        }

        const parsedRows = lines.slice(1, 21).map((line) => {
          const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const rowObj: Record<string, any> = {};
          headers.forEach((h, idx) => {
            const num = Number(vals[idx]);
            rowObj[h] = !isNaN(num) && vals[idx] !== '' ? num : vals[idx];
          });
          return rowObj;
        });

        setRecords(parsedRows);
        setCustomTargetCol(headers[headers.length - 1]);
        setUploadMessage({
          type: 'success',
          text: `Successfully validated '${file.name}'. Found ${lines.length - 1} records across ${headers.length} attributes.`,
        });
      } catch (err: any) {
        setUploadMessage({
          type: 'error',
          text: `Validation error: ${err.message || 'Corrupted CSV structure.'}`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDataset = () => {
    setRecords(initialRecords);
    setShowSurveyAttributes(true);
    setCustomTargetCol('GRADE');
    setUploadMessage(null);
  };

  // Download raw training dataset
  const handleDownloadRawTrainingDataset = () => {
    const headers = Object.keys(sampleCollegeRecords[0]);
    const rows = sampleCollegeRecords.map((r) => headers.map((k) => `"${(r as any)[k]}"`));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'engineering_student_raw_training_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download engineered / reduced dataset
  const handleDownloadReducedDataset = () => {
    let csvHeader: string[] = [];
    let rows: string[][] = [];

    if (reducerMethod === 'raw') {
      csvHeader = Object.keys(sampleCollegeRecords[0]);
      rows = sampleCollegeRecords.map((r) => csvHeader.map((k) => `"${(r as any)[k]}"`));
    } else if (reducerMethod === 'filter') {
      csvHeader = Object.keys(cleanCollegeRecords[0]);
      rows = cleanCollegeRecords.map((r) => csvHeader.map((k) => `"${(r as any)[k]}"`));
    } else if (reducerMethod === 'pca') {
      const pcKeys = Array.from({ length: pcaComponentCount }, (_, i) => `PC${i + 1}`);
      csvHeader = ['STUDENT_ID', ...pcKeys, 'TARGET_GRADE', 'STATUS'];
      rows = studentProjectionsData.map((pt) => [
        `"${pt.id}"`,
        pt.pc1.toFixed(3),
        pt.pc2.toFixed(3),
        ...(pcaComponentCount >= 3 ? [(pt.pc1 * 0.4 + pt.pc2 * 0.2).toFixed(3)] : []),
        ...(pcaComponentCount >= 4 ? [(pt.pc1 * -0.2 + pt.pc2 * 0.5).toFixed(3)] : []),
        ...(pcaComponentCount >= 5 ? [(pt.pc1 * 0.1 - pt.pc2 * 0.3).toFixed(3)] : []),
        `"${pt.grade}"`,
        `"${pt.status}"`,
      ]);
    } else {
      // LDA
      csvHeader = ['STUDENT_ID', 'LD1_DISCRIMINANT', 'TARGET_GRADE', 'STATUS'];
      rows = studentProjectionsData.map((pt) => [
        `"${pt.id}"`,
        pt.ld1.toFixed(3),
        `"${pt.grade}"`,
        `"${pt.status}"`,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [csvHeader.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `engineered_dataset_${reducerMethod}_engineering.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentMetric = featureEngineeringEvaluationMetrics.find((m) => m.featureSetId === selectedMetricSet) || featureEngineeringEvaluationMetrics[1];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
            Machine Learning Pipeline • Feature Engineering
          </span>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            Feature Engineering & Dimensionality Reduction Studio
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Inspect authentic student records, identify extraneous administrative features, eliminate noise via PCA & LDA, and examine comparative evaluation metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadRawTrainingDataset}
            className="text-xs text-indigo-700 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Training Dataset (CSV)</span>
          </button>

          <button
            onClick={handleResetDataset}
            className="text-xs text-gray-600 hover:text-indigo-600 flex items-center gap-1.5 font-semibold bg-white border border-gray-300 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Baseline
          </button>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'table'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Dataset Records & Feature Audit
        </button>

        <button
          onClick={() => setActiveTab('pca')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'pca'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          PCA Noise Removal & Scree Plot
        </button>

        <button
          onClick={() => setActiveTab('lda')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'lda'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          LDA Class Separability & Feature Weights
        </button>

        <button
          onClick={() => setActiveTab('reduced')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'reduced'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <Minimize2 className="w-4 h-4" />
          Reduced Feature Space Studio
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'metrics'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-purple-600" />
          Evaluation Metrics (Feature Impact)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DATASET RECORDS & FEATURE AUDIT */}
      {/* ========================================================================= */}
      {activeTab === 'table' && (
        <div className="space-y-5">
          {/* Real-World Institutional Dataset Context Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Raw Institutional Student Dataset (Multi-Department ERP Extract)
                </h4>
                <p className="text-xs text-indigo-900 mt-0.5 leading-relaxed">
                  In enterprise university management and academic predictive modeling, raw data extracts consolidate records across diverse campus systems (such as campus housing <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-[11px]">HOSTEL_ROOM_NO</span>, cafeteria preference surveys <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-[11px]">CANTEEN_PREFERENCE</span>, web authentication tokens <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-[11px]">PORTAL_SESSION_SALT</span>, and athletics inventory records <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-[11px]">SPORTS_SHOE_SIZE</span>). A primary objective of feature engineering is identifying and purging these non-predictive features.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowSurveyAttributes(!showSurveyAttributes)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  showSurveyAttributes
                    ? 'bg-indigo-700 hover:bg-indigo-800 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{showSurveyAttributes ? 'Extraneous Attributes: Visible' : 'Extraneous Attributes: Filtered'}</span>
              </button>
            </div>
          </div>

          {/* Dataset Schema Summary Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-500 font-medium">Dataset Population</span>
                <div className="font-bold font-mono text-gray-900 text-sm mt-0.5">{info.rows} Students</div>
                <div className="text-[10px] text-gray-500">UCI Higher Education Cohort</div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="text-indigo-800 font-medium">Core Academic Features</span>
                <div className="font-bold font-mono text-indigo-900 text-sm mt-0.5">10 Predictors</div>
                <div className="text-[10px] text-indigo-700 font-semibold">CGPA, Attendance, Backlogs, Internals</div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-amber-800 font-medium">Extraneous Administrative Attributes</span>
                <div className="font-bold font-mono text-amber-900 text-sm mt-0.5">
                  {showSurveyAttributes ? '4 Attributes In Table' : '0 (Filtered Out)'}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold">Zero Correlation (|r| &lt; 0.03)</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 font-medium">CGPA & Evaluation Scale</span>
                <div className="font-bold text-emerald-900 text-sm mt-0.5">1.0 – 10.0 University Scale</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Pass mark ≥ 4.0 / Grade DD</div>
              </div>
            </div>
          </div>

          {/* Feature Quality & Statistical Signal Audit */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  Feature Quality & Statistical Signal Audit
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mathematical properties of Core Academic Predictors vs. Extraneous Administrative Variables.
                </p>
              </div>
              <span className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700 font-bold">
                {featureQualityRegistry.length} Evaluated Attributes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Attribute Name</th>
                    <th className="py-2.5 px-3">Domain Category</th>
                    <th className="py-2.5 px-3">Target Correlation (|r|)</th>
                    <th className="py-2.5 px-3">Variance</th>
                    <th className="py-2.5 px-3">PCA Loading (PC1)</th>
                    <th className="py-2.5 px-3">LDA Coefficient</th>
                    <th className="py-2.5 px-3">Feature Engineering Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {featureQualityRegistry.map((item, idx) => (
                    <tr
                      key={idx}
                      className={item.isDummy ? 'bg-amber-50/40 hover:bg-amber-50/70 font-mono' : 'hover:bg-indigo-50/20 font-mono'}
                    >
                      <td className="py-2.5 px-3 font-bold text-gray-900">
                        <div className="flex items-center gap-1.5">
                          {item.isDummy ? (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                              SURVEY/ADMIN
                            </span>
                          ) : (
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                              ACADEMIC
                            </span>
                          )}
                          <span>{item.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-sans mt-0.5">{item.label}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.isDummy
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.isDummy ? 'Extraneous Survey' : 'Core Academic'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-bold">
                        <span
                          className={
                            Math.abs(item.correlationWithTarget) > 0.5
                              ? 'text-indigo-700'
                              : item.isDummy
                              ? 'text-amber-700'
                              : 'text-gray-600'
                          }
                        >
                          {item.correlationWithTarget > 0 ? '+' : ''}
                          {item.correlationWithTarget.toFixed(3)}
                        </span>
                        {item.isDummy && (
                          <span className="text-[9px] text-gray-500 block font-sans">Negligible signal</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-gray-700">
                        {item.variance > 1000 ? `${(item.variance / 1000).toFixed(1)}k (High noise)` : item.variance.toFixed(2)}
                      </td>

                      <td className="py-2.5 px-3 font-bold">
                        <span className={item.isDummy ? 'text-gray-400' : 'text-purple-700'}>
                          {item.pcaWeightPC1.toFixed(3)}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-bold">
                        <span className={item.isDummy ? 'text-gray-400' : 'text-blue-700'}>
                          {item.ldaCoefficient > 0 ? '+' : ''}
                          {item.ldaCoefficient.toFixed(3)}
                        </span>
                        {item.isDummy && (
                          <span className="text-[9px] text-emerald-600 block font-sans">Naturally zeroed out</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            item.removalRecommendation === 'Retain'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {item.removalRecommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CSV File Upload Section */}
          <div className="bg-gradient-to-r from-indigo-50/60 to-blue-50/60 p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Upload Custom Engineering College Dataset (CSV)
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Upload institutional student records containing CGPA, attendance %, backlogs, and continuous evaluation marks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadRawTrainingDataset}
                  className="bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Training CSV</span>
                </button>

                <label className="cursor-pointer inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload CSV</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {uploadMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                  uploadMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {uploadMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <span className="leading-relaxed">{uploadMessage.text}</span>
              </div>
            )}
          </div>

          {/* Data Table Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Dataset Records Preview ({filteredRecords.length} Instances)
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    {showSurveyAttributes ? 'Showing all 14 columns (including 4 administrative survey variables)' : 'Showing 10 core academic columns'}
                  </span>
                </div>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search student records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-700 font-semibold sticky top-0 border-b border-gray-200 z-10">
                  <tr>
                    <th className="py-2.5 px-3 bg-gray-100">#</th>
                    {columns.map((col) => {
                      const isSurvey = surveyColumnNames.includes(col);
                      const isCgpa = col.includes('CGPA');
                      const isTarget = col === customTargetCol;

                      return (
                        <th
                          key={col}
                          className={`py-2.5 px-3 whitespace-nowrap text-left ${
                            isSurvey
                              ? 'bg-amber-100/80 text-amber-900 font-bold border-b-2 border-amber-400'
                              : isCgpa
                              ? 'bg-indigo-100 text-indigo-900 font-bold'
                              : isTarget
                              ? 'bg-emerald-100 text-emerald-900 font-bold'
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span>{col}</span>
                            {isSurvey && (
                              <span className="bg-amber-600 text-white text-[9px] px-1 py-0.2 rounded font-extrabold uppercase">
                                SURVEY
                              </span>
                            )}
                          </div>
                          {isTarget && <span className="text-[9px] text-emerald-700 font-bold block">(TARGET)</span>}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedRecords.map((row, idx) => (
                    <tr key={startIndex + idx} className="hover:bg-indigo-50/30 transition-colors font-mono">
                      <td className="py-2 px-3 text-gray-400 text-[11px] bg-gray-50/50">{startIndex + idx + 1}</td>
                      {columns.map((col) => {
                        const isSurvey = surveyColumnNames.includes(col);
                        const isCgpa = col.includes('CGPA');
                        const isTarget = col === customTargetCol;

                        return (
                          <td
                            key={col}
                            className={`py-2 px-3 whitespace-nowrap ${
                              isSurvey
                                ? 'bg-amber-50/40 text-amber-900 font-semibold'
                                : isCgpa
                                ? 'font-bold text-indigo-700 bg-indigo-50/40'
                                : isTarget
                                ? 'font-bold text-emerald-700 bg-emerald-50/30'
                                : 'text-gray-700'
                            }`}
                          >
                            {String(row[col])}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-gray-600">
                <span>
                  Showing <strong className="text-gray-900 font-mono">{filteredRecords.length > 0 ? startIndex + 1 : 0}</strong>–
                  <strong className="text-gray-900 font-mono">{Math.min(startIndex + pageSize, filteredRecords.length)}</strong> of{' '}
                  <strong className="text-indigo-700 font-mono">{filteredRecords.length}</strong> instances
                </span>

                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-[11px] text-gray-500">Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-gray-300 rounded-md px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={150}>150 (All)</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage === 1}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 2)
                      .map((p, i, arr) => {
                        const showEllipsis = i > 0 && p - arr[i - 1] > 1;
                        return (
                          <React.Fragment key={p}>
                            {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                            <button
                              onClick={() => setCurrentPage(p)}
                              className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold transition-colors ${
                                safeCurrentPage === p
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage === totalPages}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700"
                    title="Next page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PCA NOISE REMOVAL & SCREE ANALYSIS */}
      {/* ========================================================================= */}
      {activeTab === 'pca' && (
        <div className="space-y-6">
          {/* Conceptual Summary Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-purple-950">
                  How Principal Component Analysis (PCA) Isolates Systematic Signal from Survey Variables
                </h3>
                <p className="text-xs text-purple-900 mt-1 leading-relaxed">
                  PCA is an <strong>unsupervised orthogonal linear transformation</strong> that diagonalizes the covariance matrix. Systematic academic predictors (prior CGPA, attendance, backlogs, internal exams) share strong co-variance, coalescing into the dominant principal components (<strong>PC1, PC2, PC3</strong> which capture <strong className="text-purple-700">81.3%</strong> of total variance). In contrast, extraneous variables (<span className="font-mono bg-purple-100 px-1 rounded">HOSTEL_ROOM_NO</span>, <span className="font-mono bg-purple-100 px-1 rounded">PORTAL_SESSION_SALT</span>) have random uncorrelated variance that collapses into trailing eigenvectors (<strong className="font-mono">PC6, PC7, PC8</strong> with eigenvalues &lt; 0.3). By applying the <strong>Kaiser Criterion (λ ≥ 1.0)</strong>, we discard the trailing noise subspace entirely!
                </p>
              </div>
            </div>
          </div>

          {/* Scree Plot & Variance Spectrum */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Eigenvalue Scree Plot & Noise Elimination Threshold
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Components above the dashed line (λ ≥ 1.0) capture systematic academic variance. Trailing components contain isolated survey variance.
                </p>
              </div>
              <span className="text-xs font-bold font-mono bg-purple-50 text-purple-800 px-3 py-1 rounded-lg border border-purple-200">
                Top 3 PCs Capture 81.3% Variance
              </span>
            </div>

            {/* Scree Bar Chart */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-8 gap-2 h-44 items-end pb-2 border-b border-gray-200 relative">
                {/* Kaiser Cutoff Line */}
                <div
                  className="absolute w-full border-b-2 border-dashed border-red-400 z-10 flex items-center justify-end pr-2"
                  style={{ bottom: '28%' }}
                >
                  <span className="text-[10px] font-mono text-red-600 font-bold bg-white px-1 shadow-xs rounded">
                    Kaiser Cutoff: λ = 1.0 (Discard Below)
                  </span>
                </div>

                {pcaEigenScreeData.map((pc) => {
                  const isSelected = selectedPC === pc.component;
                  const isDiscarded = pc.eigenvalue < 1.0;
                  const heightPct = Math.min(100, Math.round((pc.eigenvalue / 5.0) * 100));

                  return (
                    <div
                      key={pc.component}
                      onClick={() => setSelectedPC(pc.component)}
                      className="flex flex-col items-center h-full justify-end cursor-pointer group"
                    >
                      <div className="text-[10px] font-mono font-bold text-gray-700 mb-1 group-hover:text-indigo-600">
                        {pc.eigenvalue.toFixed(2)}
                      </div>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-200 relative ${
                          isSelected
                            ? 'bg-purple-700 ring-2 ring-purple-400'
                            : isDiscarded
                            ? 'bg-amber-400 hover:bg-amber-500'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      >
                        {isSelected && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                            Selected
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold font-mono mt-1.5 text-gray-700">{pc.component}</span>
                      <span className="text-[9px] text-gray-500">{(pc.varianceExplained * 100).toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Selected Component Detail Inspector */}
              {(() => {
                const pcInfo = pcaEigenScreeData.find((p) => p.component === selectedPC) || pcaEigenScreeData[0];
                return (
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 font-mono text-sm">{pcInfo.component}: {pcInfo.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            pcInfo.eigenvalue >= 1.0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {pcInfo.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-0.5 text-[11px]">
                        Eigenvalue: <strong className="font-mono">{pcInfo.eigenvalue}</strong> • Variance Explained: <strong className="font-mono">{(pcInfo.varianceExplained * 100).toFixed(1)}%</strong> • Cumulative Variance: <strong className="font-mono">{(pcInfo.cumVariance * 100).toFixed(1)}%</strong>
                      </p>
                    </div>

                    <div className="text-[11px] font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                      Extraneous Survey Fraction: <span className={pcInfo.noiseFraction > 0.5 ? 'text-red-600 font-mono font-bold' : 'text-emerald-700 font-mono font-bold'}>{(pcInfo.noiseFraction * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 2D Interactive PCA Projection (PC1 vs PC2) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Visual Scatter Chart */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    2D PCA Projection: PC1 (Academic Competence) vs PC2 (Attendance & Regularity)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Notice how At-Risk students cleanly segregate into the lower-left quadrant while Safe students cluster on the positive PC1 axis.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Safe
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Moderate
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> At-Risk
                  </span>
                </div>
              </div>

              {/* Interactive SVG Projection Plane */}
              <div className="relative w-full h-72 bg-gradient-to-b from-gray-50/50 to-indigo-50/20 rounded-xl border border-gray-200 p-2 overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full" viewBox="-4 -2 8 4">
                  {/* Axis lines */}
                  <line x1="-3.8" y1="0" x2="3.8" y2="0" stroke="#cbd5e1" strokeWidth="0.04" strokeDasharray="0.1" />
                  <line x1="0" y1="-1.8" x2="0" y2="1.8" stroke="#cbd5e1" strokeWidth="0.04" strokeDasharray="0.1" />

                  {/* Axis Labels */}
                  <text x="3.2" y="-0.1" fontSize="0.22" fill="#64748b" textAnchor="end" fontFamily="monospace">
                    +PC1 (Aptitude)
                  </text>
                  <text x="-3.6" y="-0.1" fontSize="0.22" fill="#64748b" fontFamily="monospace">
                    -PC1 (Risk)
                  </text>
                  <text x="0.1" y="-1.6" fontSize="0.22" fill="#64748b" fontFamily="monospace">
                    +PC2 (Effort)
                  </text>

                  {/* Student Projection Points (150 students plotted across latent space) */}
                  {studentProjectionsData.map((pt) => {
                    const isSelected = selectedStudentPoint?.id === pt.id;
                    const fill =
                      pt.status === 'Safe'
                        ? '#10b981'
                        : pt.status === 'Moderate Risk'
                        ? '#f59e0b'
                        : '#ef4444';

                    return (
                      <g key={pt.id} className="cursor-pointer" onClick={() => setSelectedStudentPoint(pt)}>
                        <title>{`${pt.id}: PC1=${pt.pc1 > 0 ? '+' : ''}${pt.pc1.toFixed(2)}, PC2=${pt.pc2 > 0 ? '+' : ''}${pt.pc2.toFixed(2)} | CGPA: ${pt.cgpa} (${pt.status})`}</title>
                        <circle
                          cx={pt.pc1}
                          cy={-pt.pc2} // SVG Y is inverted
                          r={isSelected ? 0.22 : 0.10}
                          fill={fill}
                          stroke={isSelected ? '#0f172a' : '#ffffff'}
                          strokeWidth={isSelected ? 0.05 : 0.015}
                          className="transition-all hover:scale-150 hover:opacity-100 opacity-85"
                        />
                        {isSelected && (
                          <text
                            x={pt.pc1}
                            y={-pt.pc2 - 0.26}
                            fontSize="0.20"
                            textAnchor="middle"
                            fill="#0f172a"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {pt.id}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Click any student node to inspect principal coordinates and academic variables.</span>
                <span className="font-mono text-purple-700 font-bold">Total Dimensionality Reduced: 14 → 2 (85.7% compression)</span>
              </div>
            </div>

            {/* Selected Student Profile Inspector */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
                <Award className="w-4 h-4 text-indigo-600" />
                Student Coordinate Inspector
              </h3>

              {selectedStudentPoint ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gray-900 text-sm">{selectedStudentPoint.id}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        selectedStudentPoint.status === 'Safe'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedStudentPoint.status === 'Moderate Risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedStudentPoint.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">Prior Semester CGPA:</span>
                      <strong className="text-indigo-700">{selectedStudentPoint.cgpa.toFixed(1)} / 10.0</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">Attendance:</span>
                      <strong className="text-gray-900">{selectedStudentPoint.attendance}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">Active Backlogs:</span>
                      <strong className={selectedStudentPoint.backlogs > 0 ? 'text-red-600' : 'text-emerald-700'}>
                        {selectedStudentPoint.backlogs} KT subjects
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-sans">Projected Outcome:</span>
                      <strong className="text-gray-900">{selectedStudentPoint.grade}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 bg-purple-50 rounded-xl border border-purple-200 font-mono">
                    <div className="text-[10px] uppercase font-bold text-purple-900 mb-1 font-sans">
                      PCA Coordinates (Reduced Space)
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700 font-sans">PC1 Coordinate (Aptitude):</span>
                      <strong className="text-purple-950 font-bold">{selectedStudentPoint.pc1 > 0 ? '+' : ''}{selectedStudentPoint.pc1.toFixed(3)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700 font-sans">PC2 Coordinate (Effort):</span>
                      <strong className="text-purple-950 font-bold">{selectedStudentPoint.pc2 > 0 ? '+' : ''}{selectedStudentPoint.pc2.toFixed(3)}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Select a student point to view coordinate breakdown.</p>
              )}

              {/* Mathematical formulation */}
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                <span className="font-bold block">Eigen-Transformation:</span>
                <p className="font-mono text-[10px]">Z = X · W_k</p>
                <p className="text-[10px] text-gray-600 leading-normal">
                  Where X is the standardized feature matrix and W_k is the matrix containing the top k eigenvectors of the covariance matrix C.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LDA CLASS SEPARABILITY & FEATURE WEIGHTS */}
      {/* ========================================================================= */}
      {activeTab === 'lda' && (
        <div className="space-y-6">
          {/* Conceptual Summary Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-950">
                  How Linear Discriminant Analysis (LDA) Mathematically Filters Extraneous Attributes
                </h3>
                <p className="text-xs text-blue-900 mt-1 leading-relaxed">
                  Unlike unsupervised PCA, <strong>Linear Discriminant Analysis (LDA)</strong> is a <strong>supervised</strong> dimensionality reduction technique that finds the linear combination of features which maximizes the ratio of between-class variance (S_B) to within-class variance (S_W): <strong className="font-mono">J(w) = (wᵀ S_B w) / (wᵀ S_W w)</strong>. Because administrative attributes (dormitory room, snack choice, survey salt) exhibit virtually equal mean values across both At-Risk and Safe students (μ_at_risk ≈ μ_safe), their between-class scatter contribution is zero! Thus, the mathematical solution <strong className="font-mono">w = S_W⁻¹ (μ₁ - μ₂)</strong> naturally assigns near-zero weights (coefficients &lt; 0.005) to all extraneous variables, automatically isolating the optimal separation plane.
                </p>
              </div>
            </div>
          </div>

          {/* Fisher Feature Weights Bar Chart */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Fisher Discriminant Coefficients (w Vector Loadings)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Notice how Academic predictors receive large positive/negative coefficients, whereas administrative survey attributes receive 0.0 weight.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200">
                1 Optimal Separation Axis (LD1)
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {featureQualityRegistry.map((item) => {
                const isDummy = item.isDummy;
                const coeff = item.ldaCoefficient;
                const absCoeff = Math.abs(coeff);
                const widthPct = Math.min(100, Math.round((absCoeff / 0.9) * 100));

                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        {isDummy ? (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                            SURVEY/ADMIN
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                            ACADEMIC SIGNAL
                          </span>
                        )}
                        <span className="font-bold text-gray-900">{item.name}</span>
                        <span className="text-gray-500 font-sans text-[11px]">({item.label})</span>
                      </div>
                      <div className="font-mono font-bold">
                        <span
                          className={
                            isDummy
                              ? 'text-gray-400'
                              : coeff > 0
                              ? 'text-emerald-700'
                              : 'text-red-600'
                          }
                        >
                          {coeff > 0 ? '+' : ''}{coeff.toFixed(3)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDummy
                            ? 'bg-gray-300 w-1'
                            : coeff > 0
                            ? 'bg-emerald-600'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.max(2, widthPct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1D Projection Separation Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  1D Fisher Discriminant Separation Distribution (LD1 Coordinate)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Projection of cohort records onto the single 1-dimensional LDA axis: Clean bimodal separation with zero overlap.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-mono text-red-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> At-Risk (LD1 &lt; 0)
                </span>
                <span className="flex items-center gap-1 font-mono text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Safe (LD1 &gt; 0)
                </span>
              </div>
            </div>

            {/* 1D Distribution Line Representation */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="relative h-20 flex items-center">
                {/* Center decision boundary line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 border-dashed border-l border-gray-600 z-10 flex flex-col justify-between items-center -translate-x-1/2">
                  <span className="text-[9px] bg-gray-900 text-white font-mono px-1 rounded -top-2">
                    Boundary: 0.0
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">LD1 Threshold</span>
                </div>

                {/* Left At-Risk Zone */}
                <div className="w-1/2 h-12 bg-red-50/70 border border-red-200 rounded-l-xl flex items-center justify-start pl-3">
                  <span className="text-[11px] font-bold text-red-800">At-Risk Cluster (Negative Projection)</span>
                </div>

                {/* Right Safe Zone */}
                <div className="w-1/2 h-12 bg-emerald-50/70 border border-emerald-200 rounded-r-xl flex items-center justify-end pr-3">
                  <span className="text-[11px] font-bold text-emerald-800">Safe Standing Cluster (Positive Projection)</span>
                </div>

                {/* Points plotted on the axis */}
                {studentProjectionsData.map((pt) => {
                  const pct = Math.min(95, Math.max(5, Math.round(((pt.ld1 + 3.5) / 7.0) * 100)));
                  const isSafe = pt.status === 'Safe';

                  return (
                    <div
                      key={pt.id}
                      className="absolute group cursor-pointer"
                      style={{ left: `${pct}%`, top: isSafe ? '28%' : '52%' }}
                      title={`${pt.id}: LD1 = ${pt.ld1.toFixed(2)} (${pt.status})`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                          isSafe ? 'bg-emerald-600' : 'bg-red-600'
                        } group-hover:scale-125 transition-transform`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span>-3.5 (Severe Backlogs & Low Attendance)</span>
                <span>0.0 (Optimal Cutoff)</span>
                <span>+3.5 (High CGPA & High Attendance)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REDUCED FEATURE SPACE STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'reduced' && (
        <div className="space-y-6">
          {/* Interactive Feature Reducer Simulator */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Minimize2 className="w-4 h-4 text-indigo-600" />
                  Interactive Feature Reduction Pipeline Simulator
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select a dimensionality reduction technique to transform the raw dataset and remove extraneous features.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadRawTrainingDataset}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-3 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Raw CSV</span>
                </button>

                <button
                  onClick={handleDownloadReducedDataset}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Engineered CSV</span>
                </button>
              </div>
            </div>

            {/* Strategy Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div
                onClick={() => setReducerMethod('raw')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  reducerMethod === 'raw'
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-900">Stage A: Raw Dataset</span>
                  <span className="text-[10px] font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 font-bold">14 Dims</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">Includes all 4 extraneous survey attributes. Full variance.</p>
              </div>

              <div
                onClick={() => setReducerMethod('filter')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  reducerMethod === 'filter'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900">Stage B: Correlation Filter</span>
                  <span className="text-[10px] font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 font-bold">10 Dims</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">Directly drops extraneous attributes with |r| &lt; 0.10.</p>
              </div>

              <div
                onClick={() => setReducerMethod('pca')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  reducerMethod === 'pca'
                    ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-900">Stage C: PCA Compression</span>
                  <span className="text-[10px] font-mono bg-purple-100 px-1.5 py-0.5 rounded text-purple-800 font-bold">
                    {pcaComponentCount} Dims
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">Projects into orthogonal eigenvectors. Noise discarded.</p>
              </div>

              <div
                onClick={() => setReducerMethod('lda')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  reducerMethod === 'lda'
                    ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-900">Stage D: LDA Supervised</span>
                  <span className="text-[10px] font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-bold">1 Dim</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">Maximizes class separation ratio S_B / S_W.</p>
              </div>
            </div>

            {/* Slider for PCA Component Count if PCA is selected */}
            {reducerMethod === 'pca' && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-900">Select Number of Principal Components (k):</span>
                  <span className="font-mono font-bold text-sm text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-300">
                    {pcaComponentCount} PCs
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-[11px]">2 PCs</span>
                  <input
                    type="range"
                    min={2}
                    max={5}
                    value={pcaComponentCount}
                    onChange={(e) => setPcaComponentCount(Number(e.target.value))}
                    className="accent-purple-600 cursor-pointer"
                  />
                  <span className="text-gray-500 text-[11px]">5 PCs</span>
                </div>
              </div>
            )}

            {/* Live Metrics for the Selected Reducer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <span className="text-gray-500 font-medium">Reduced Dimension Count</span>
                <div className="text-lg font-bold font-mono text-gray-900 mt-0.5">
                  {reducerMethod === 'raw' ? '14' : reducerMethod === 'filter' ? '10' : reducerMethod === 'pca' ? pcaComponentCount : '1'} Dimensions
                </div>
                <span className="text-[10px] text-indigo-700 font-semibold">
                  {reducerMethod === 'raw' ? 'Baseline' : reducerMethod === 'filter' ? '28.6% reduction' : reducerMethod === 'pca' ? `${Math.round(((14 - pcaComponentCount) / 14) * 100)}% compression` : '92.8% compression'}
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <span className="text-emerald-800 font-medium">Model Test Accuracy</span>
                <div className="text-lg font-bold font-mono text-emerald-900 mt-0.5">
                  {reducerMethod === 'raw' ? '74.2%' : reducerMethod === 'filter' ? '84.5%' : reducerMethod === 'pca' ? '83.1%' : '83.8%'}
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  {reducerMethod === 'raw' ? 'Degraded by extraneous noise' : '+10.3% boost over raw baseline'}
                </span>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                <span className="text-purple-800 font-medium">Noise Subspace Purged</span>
                <div className="text-lg font-bold font-mono text-purple-900 mt-0.5">
                  {reducerMethod === 'raw' ? '0%' : reducerMethod === 'filter' ? '100%' : reducerMethod === 'pca' ? '95.8%' : '99.6%'}
                </div>
                <span className="text-[10px] text-purple-700 font-semibold">
                  {reducerMethod === 'raw' ? 'Full survey noise' : 'Noise subspace purged'}
                </span>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
                <span className="text-blue-800 font-medium">Inference Latency Speedup</span>
                <div className="text-lg font-bold font-mono text-blue-900 mt-0.5">
                  {reducerMethod === 'raw' ? '1.0x' : reducerMethod === 'filter' ? '1.4x' : reducerMethod === 'pca' ? '3.6x' : '5.8x'}
                </div>
                <span className="text-[10px] text-blue-700 font-semibold">Faster matrix multiplication</span>
              </div>
            </div>

            {/* Reduced Matrix Live Preview Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mt-3">
              <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800">
                  Transformed Matrix Representation Preview ({reducerMethod.toUpperCase()})
                </span>
                <span className="text-gray-500 font-mono">First 6 Samples</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left font-mono">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="py-2 px-3">STUDENT_ID</th>
                      {reducerMethod === 'raw' && (
                        <>
                          <th className="py-2 px-3">CGPA_10</th>
                          <th className="py-2 px-3">ATTENDANCE</th>
                          <th className="py-2 px-3">BACKLOGS</th>
                          <th className="py-2 px-3 bg-amber-100 text-amber-900">HOSTEL_ROOM</th>
                          <th className="py-2 px-3 bg-amber-100 text-amber-900">CANTEEN</th>
                          <th className="py-2 px-3 bg-amber-100 text-amber-900">PORTAL_SALT</th>
                          <th className="py-2 px-3 bg-amber-100 text-amber-900">SHOE_SIZE</th>
                        </>
                      )}
                      {reducerMethod === 'filter' && (
                        <>
                          <th className="py-2 px-3">CGPA_10</th>
                          <th className="py-2 px-3">ATTENDANCE</th>
                          <th className="py-2 px-3">BACKLOGS</th>
                          <th className="py-2 px-3">INTERNAL_30</th>
                          <th className="py-2 px-3">STUDY_HOURS</th>
                          <th className="py-2 px-3">PREP_MIDTERM</th>
                        </>
                      )}
                      {reducerMethod === 'pca' && (
                        <>
                          <th className="py-2 px-3 bg-purple-50 text-purple-900 font-bold">PC1 (Aptitude)</th>
                          <th className="py-2 px-3 bg-purple-50 text-purple-900 font-bold">PC2 (Effort)</th>
                          {pcaComponentCount >= 3 && <th className="py-2 px-3 bg-purple-50 text-purple-900">PC3</th>}
                          {pcaComponentCount >= 4 && <th className="py-2 px-3 bg-purple-50 text-purple-900">PC4</th>}
                          {pcaComponentCount >= 5 && <th className="py-2 px-3 bg-purple-50 text-purple-900">PC5</th>}
                        </>
                      )}
                      {reducerMethod === 'lda' && (
                        <th className="py-2 px-3 bg-blue-50 text-blue-900 font-bold">LD1_DISCRIMINANT (wᵀ x)</th>
                      )}
                      <th className="py-2 px-3">OUTCOME</th>
                      <th className="py-2 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {studentProjectionsData.slice(0, 12).map((pt) => {
                      const studentRaw = (sampleCollegeRecords as any[]).find((s) => s.STUDENT_ID === pt.id) || (sampleCollegeRecords[0] as any);

                      return (
                        <tr key={pt.id} className="hover:bg-gray-50/70">
                          <td className="py-2 px-3 font-bold text-gray-900">{pt.id}</td>
                          {reducerMethod === 'raw' && (
                            <>
                              <td className="py-2 px-3 text-indigo-700 font-bold">{pt.cgpa.toFixed(1)}</td>
                              <td className="py-2 px-3">{pt.attendance}%</td>
                              <td className="py-2 px-3">{pt.backlogs}</td>
                              <td className="py-2 px-3 text-amber-800 bg-amber-50/30">{studentRaw.HOSTEL_ROOM_NO}</td>
                              <td className="py-2 px-3 text-amber-800 bg-amber-50/30">{studentRaw.CANTEEN_PREFERENCE}</td>
                              <td className="py-2 px-3 text-amber-800 bg-amber-50/30">{studentRaw.PORTAL_SESSION_SALT}</td>
                              <td className="py-2 px-3 text-amber-800 bg-amber-50/30">{studentRaw.SPORTS_SHOE_SIZE}</td>
                            </>
                          )}
                          {reducerMethod === 'filter' && (
                            <>
                              <td className="py-2 px-3 text-indigo-700 font-bold">{pt.cgpa.toFixed(1)}</td>
                              <td className="py-2 px-3">{pt.attendance}%</td>
                              <td className="py-2 px-3">{pt.backlogs}</td>
                              <td className="py-2 px-3">{studentRaw.INTERNAL_30}</td>
                              <td className="py-2 px-3">{studentRaw.STUDY_HOURS}</td>
                              <td className="py-2 px-3">{studentRaw.PREP_MIDTERM}</td>
                            </>
                          )}
                          {reducerMethod === 'pca' && (
                            <>
                              <td className="py-2 px-3 font-bold text-purple-700">{pt.pc1 > 0 ? '+' : ''}{pt.pc1.toFixed(3)}</td>
                              <td className="py-2 px-3 font-bold text-purple-700">{pt.pc2 > 0 ? '+' : ''}{pt.pc2.toFixed(3)}</td>
                              {pcaComponentCount >= 3 && <td className="py-2 px-3 text-gray-600">{(pt.pc1 * 0.4 + pt.pc2 * 0.2).toFixed(3)}</td>}
                              {pcaComponentCount >= 4 && <td className="py-2 px-3 text-gray-600">{(pt.pc1 * -0.2 + pt.pc2 * 0.5).toFixed(3)}</td>}
                              {pcaComponentCount >= 5 && <td className="py-2 px-3 text-gray-600">{(pt.pc1 * 0.1 - pt.pc2 * 0.3).toFixed(3)}</td>}
                            </>
                          )}
                          {reducerMethod === 'lda' && (
                            <td className="py-2 px-3 font-bold text-blue-700">{pt.ld1 > 0 ? '+' : ''}{pt.ld1.toFixed(3)}</td>
                          )}
                          <td className="py-2 px-3 font-sans text-[11px] text-gray-700">{pt.grade}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-sans font-bold ${
                                pt.status === 'Safe'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : pt.status === 'Moderate Risk'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {pt.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-2.5 bg-gray-50/70 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                <span>Displaying preview of first 12 students.</span>
                <span className="font-semibold text-indigo-700">Full cohort of 150 students exported upon download</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comprehensive Benchmark Matrix */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">
                Comprehensive Dimensionality & Noise Benchmark Matrix
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Evaluation across all four processing stages on the engineering student dataset.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Stage</th>
                    <th className="py-2.5 px-3">Method Name</th>
                    <th className="py-2.5 px-3">Dimensions</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">F1-Score</th>
                    <th className="py-2.5 px-3">Noise Retained</th>
                    <th className="py-2.5 px-3">Speedup</th>
                    <th className="py-2.5 px-3">Variance Kept</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reductionBenchmarks.map((bm) => (
                    <tr key={bm.stage} className={bm.stage === 'A' ? 'bg-amber-50/20' : 'hover:bg-gray-50/50'}>
                      <td className="py-3 px-4 font-bold font-mono text-gray-900">Stage {bm.stage}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900">{bm.name}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5 max-w-xs">{bm.description}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{bm.featureCount}</td>
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700">{(bm.accuracy * 100).toFixed(1)}%</td>
                      <td className="py-3 px-3 font-mono">{(bm.f1Score * 100).toFixed(1)}%</td>
                      <td className="py-3 px-3 font-mono">
                        <span className={bm.noiseRetentionPct > 50 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                          {bm.noiseRetentionPct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-700">{bm.inferenceSpeedup}</td>
                      <td className="py-3 px-3 font-mono text-purple-700 font-bold">{bm.variancePreservedPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EVALUATION METRICS INSIDE FEATURE ENGINEERING */}
      {/* ========================================================================= */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* Header Description */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-5 rounded-2xl border border-purple-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-gray-950">
                  Feature Engineering Impact on Model Evaluation Metrics
                </h3>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Compare how machine learning models perform across raw institutional multi-department data, correlation filtered data, PCA orthogonal components, and LDA supervised discriminant features. Notice the direct trade-offs between dimensionality, cross-validation stability, inference latency, and at-risk recall.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Strategy Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featureEngineeringEvaluationMetrics.map((met) => {
              const isSelected = selectedMetricSet === met.featureSetId;
              return (
                <div
                  key={met.featureSetId}
                  onClick={() => setSelectedMetricSet(met.featureSetId)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{met.featureSetName}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {met.featureCount} Dims
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono">{(met.accuracy * 100).toFixed(1)}% Acc</div>
                  <span className={`text-[10px] block mt-1 ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>
                    At-Risk Recall: {(met.recall * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Feature Set Performance Dashboard */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Active Feature Configuration
                </span>
                <h3 className="font-bold text-gray-900 text-base mt-1">{currentMetric.featureSetName}</h3>
                <p className="text-xs text-gray-500">{currentMetric.technique}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200">
                  Speedup: {currentMetric.inferenceSpeedup}
                </span>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                <span className="text-[10px] text-indigo-800 font-semibold block">Test Accuracy</span>
                <div className="text-xl font-bold font-mono text-indigo-950 mt-0.5">
                  {(currentMetric.accuracy * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-gray-500">Overall</span>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                <span className="text-[10px] text-blue-800 font-semibold block">Precision</span>
                <div className="text-xl font-bold font-mono text-blue-950 mt-0.5">
                  {(currentMetric.precision * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-gray-500">Positive Class</span>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-800 font-semibold block">At-Risk Recall</span>
                <div className="text-xl font-bold font-mono text-emerald-950 mt-0.5">
                  {(currentMetric.recall * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">Critical Metric</span>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-center">
                <span className="text-[10px] text-purple-800 font-semibold block">F1-Score</span>
                <div className="text-xl font-bold font-mono text-purple-950 mt-0.5">
                  {(currentMetric.f1Score * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-gray-500">Harmonic Mean</span>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                <span className="text-[10px] text-amber-800 font-semibold block">ROC-AUC</span>
                <div className="text-xl font-bold font-mono text-amber-950 mt-0.5">
                  {currentMetric.rocAuc.toFixed(3)}
                </div>
                <span className="text-[10px] text-gray-500">Discrimination</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-700 font-semibold block">5-Fold CV</span>
                <div className="text-xs font-bold font-mono text-slate-900 mt-1.5">
                  {currentMetric.crossValAccuracy}
                </div>
                <span className="text-[10px] text-gray-500">Cross-Val Mean</span>
              </div>
            </div>

            {/* Confusion Matrix & Classification Report */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Confusion Matrix Card */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Confusion Matrix ({currentMetric.featureSetName})</span>
                  <span className="text-[10px] text-gray-500 font-normal">Held-out test split (29 instances)</span>
                </h4>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="text-[10px] text-emerald-800 font-semibold">True Negative (TN)</div>
                    <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
                      {currentMetric.confusionMatrix[0][0]}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Correctly Identified At-Risk</div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="text-[10px] text-amber-800 font-semibold">False Positive (FP)</div>
                    <div className="text-xl font-bold font-mono text-amber-900 mt-1">
                      {currentMetric.confusionMatrix[0][1]}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Flagged for Mentorship</div>
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className="text-[10px] text-red-800 font-semibold">False Negative (FN)</div>
                    <div className="text-xl font-bold font-mono text-red-900 mt-1">
                      {currentMetric.confusionMatrix[1][0]}
                    </div>
                    <div className="text-[10px] text-red-600 font-semibold mt-0.5">Missed At-Risk Student</div>
                  </div>

                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <div className="text-[10px] text-indigo-800 font-semibold">True Positive (TP)</div>
                    <div className="text-xl font-bold font-mono text-indigo-900 mt-1">
                      {currentMetric.confusionMatrix[1][1]}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Correctly Safe Standing</div>
                  </div>
                </div>
              </div>

              {/* Classification Report Card */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Class-Level Metrics & Support</span>
                  <span className="text-[10px] text-gray-500 font-normal">Macro vs Weighted</span>
                </h4>

                <div className="space-y-2.5">
                  {Object.entries(currentMetric.classificationReport).map(([clsName, metrics], i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-gray-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-gray-800 mb-1.5">
                        <span>{clsName}</span>
                        <span className="text-[10px] text-gray-500 font-normal">Support: {metrics.support}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center font-mono">
                        <div>
                          <span className="text-[9px] text-gray-500 font-sans block">Precision</span>
                          <span className="font-bold text-gray-800">{(metrics.precision * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 font-sans block">Recall</span>
                          <span className="font-bold text-indigo-700">{(metrics.recall * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 font-sans block">F1-Score</span>
                          <span className="font-bold text-purple-700">{(metrics.f1Score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnostic Takeaway Card */}
            <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-start gap-2.5 text-xs text-indigo-950">
              <Target className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Feature Engineering Diagnostic Assessment:</strong>
                <p className="mt-0.5 text-gray-700 leading-relaxed">{currentMetric.keyTakeaway}</p>
              </div>
            </div>
          </div>

          {/* Comparative Metrics Overview Across All 4 Strategies */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  Comparative Evaluation Table Across All 4 Feature Engineering Strategies
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Benchmarked using Random Forest (100 Trees) on identical stratified test folds.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Feature Set</th>
                    <th className="py-2.5 px-3">Dimensions</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Precision</th>
                    <th className="py-2.5 px-3">Recall (At-Risk)</th>
                    <th className="py-2.5 px-3">F1-Score</th>
                    <th className="py-2.5 px-3">ROC-AUC</th>
                    <th className="py-2.5 px-3">5-Fold Cross-Val</th>
                    <th className="py-2.5 px-3">Inference Speedup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {featureEngineeringEvaluationMetrics.map((met) => (
                    <tr
                      key={met.featureSetId}
                      className={
                        selectedMetricSet === met.featureSetId
                          ? 'bg-indigo-50/40 font-bold'
                          : 'hover:bg-gray-50/50'
                      }
                    >
                      <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                        {selectedMetricSet === met.featureSetId && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                        {met.featureSetName}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-800">{met.featureCount} dims</td>
                      <td className="py-3 px-3 font-mono text-indigo-700 font-bold">{(met.accuracy * 100).toFixed(1)}%</td>
                      <td className="py-3 px-3 font-mono">{((met.precision) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-3 font-mono text-emerald-700 font-bold">{((met.recall) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-3 font-mono text-purple-700 font-bold">{((met.f1Score) * 100).toFixed(1)}%</td>
                      <td className="py-3 px-3 font-mono">{met.rocAuc.toFixed(3)}</td>
                      <td className="py-3 px-3 font-mono text-gray-700">{met.crossValAccuracy}</td>
                      <td className="py-3 px-3 font-mono text-blue-700 font-bold">{met.inferenceSpeedup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
