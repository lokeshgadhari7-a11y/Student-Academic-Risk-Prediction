import React, { useEffect, useState } from 'react';
import { GraduationCap, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  apiStatus: 'checking' | 'online' | 'embedded';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, apiStatus }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Engineering ML Engine...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(50);
      setStatusText('Validating 1.0 - 10.0 CGPA Scaler & Preprocessing...');
    }, 450);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Calibrating Random Forest & SVM (College Dataset)...');
    }, 1000);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready! Loading System...');
    }, 1500);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[580px] p-6 text-center select-none bg-gradient-to-b from-indigo-50/60 via-white to-blue-50/40">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 border-4 border-white animate-pulse">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
        Engineering Student Performance &<br />At-Risk Prediction System
      </h1>

      <p className="text-xs uppercase tracking-wider font-semibold text-indigo-700 bg-indigo-100/70 px-3.5 py-1 rounded-full mb-6">
        Department of Artificial Intelligence & Data Science • Third Year Mini-Project
      </p>

      <div className="w-full max-w-xs mb-4">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-600 flex items-center justify-center gap-1.5 font-medium min-h-[20px]">
        <Cpu className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
        {statusText}
      </p>

      <div className="mt-8 flex items-center gap-2 text-[11px] text-gray-500 bg-white/80 border border-gray-200/80 px-3.5 py-1.5 rounded-full shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>Standard 10-Point CGPA Scale • UCI Higher Education Evaluation</span>
      </div>
    </div>
  );
};
