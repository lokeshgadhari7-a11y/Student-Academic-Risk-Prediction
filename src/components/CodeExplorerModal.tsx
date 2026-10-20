import React, { useState } from 'react';
import { codebaseFiles, CodeFile } from '../data/codebaseFiles';
import JSZip from 'jszip';
import {
  FileCode,
  Download,
  Copy,
  Check,
  Folder,
  FolderOpen,
  File,
  X,
  ExternalLink,
  Archive,
  Layers,
  Sparkles,
  FileText,
} from 'lucide-react';
import { generateAndDownloadProjectReportPDF } from '../utils/generatePdfReport';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(codebaseFiles[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'flutter' | 'backend' | 'docs'>('all');

  if (!isOpen) return null;

  const filteredFiles = categoryFilter === 'all'
    ? codebaseFiles
    : codebaseFiles.filter((f) => f.category === categoryFilter);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      codebaseFiles.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Add a README with quick start instructions
      zip.file(
        'README.md',
        `# Student Performance and At-Risk Prediction System
Academic Mini-Project for Third-Year AI & Data Science.

## 1. Quick Start - Python FastAPI Backend
\`\`\`bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

## 2. Quick Start - Flutter Application
\`\`\`bash
cd flutter_app
flutter pub get
flutter run
\`\`\`
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_performance_ml_project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Top Header */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Project Codebase & Academic Deliverables Explorer
              </h2>
              <p className="text-xs text-gray-400">
                Complete Flutter M3 App + Python FastAPI + ML Pipelines + Viva Preparation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateAndDownloadProjectReportPDF()}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              title="Download exhaustive 10-page final project report PDF"
            >
              <FileText className="w-4 h-4" />
              <span>Project Report (PDF)</span>
            </button>
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Archive className="w-4 h-4" />
              <span>{isZipping ? 'Bundling ZIP...' : 'Download Project (ZIP)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter categories */}
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              categoryFilter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Files ({codebaseFiles.length})
          </button>
          <button
            onClick={() => setCategoryFilter('flutter')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              categoryFilter === 'flutter' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Flutter Project ({codebaseFiles.filter((f) => f.category === 'flutter').length})
          </button>
          <button
            onClick={() => setCategoryFilter('backend')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              categoryFilter === 'backend' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            FastAPI Backend ({codebaseFiles.filter((f) => f.category === 'backend').length})
          </button>
          <button
            onClick={() => setCategoryFilter('docs')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              categoryFilter === 'docs' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Project Docs & Reports ({codebaseFiles.filter((f) => f.category === 'docs').length})
          </button>
        </div>

        {/* Content Split: Left File Tree, Right Code Preview */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: File Tree list */}
          <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto p-3 space-y-1 text-xs">
            {filteredFiles.map((f) => {
              const isSelected = selectedFile.path === f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-100/80 text-blue-900 font-bold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <File className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase">{f.language}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Code Editor & Syntax Display */}
          <div className="flex-1 flex flex-col bg-gray-900 text-gray-100 overflow-hidden">
            {/* File info bar */}
            <div className="p-3 bg-gray-950 border-b border-gray-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-gray-300">
                <span className="text-blue-400">{selectedFile.path}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-500">{selectedFile.description}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-200 text-xs flex items-center gap-1 font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownloadSingle}
                  className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-200 text-xs flex items-center gap-1 font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-gray-200 leading-relaxed selection:bg-blue-600 selection:text-white">
              <pre>{selectedFile.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
