import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';

const Loader = ({ currentStep }) => {
  const steps = [
    { label: 'Uploading Image...', desc: 'Sending image payload to the secure clinical handler.' },
    { label: 'Analyzing Structure...', desc: 'Verifying pixel properties and contrast arrays.' },
    { label: 'Medical Content Validation...', desc: 'Checking visual markers for valid clinical subject matter.' },
    { label: 'Generating Clinical Description...', desc: 'Prompting Google Gemini LLM for detailed diagnostics.' },
    { label: 'Completed', desc: 'Rendering observation panels and download packages.' }
  ];

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 glass-panel shadow-xl shadow-slate-100/50 dark:shadow-none transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        {/* Animated Spinnner Icon */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-sky-500 dark:border-t-sky-400"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-sky-500 dark:text-sky-400 animate-pulse" />
          </div>
        </div>

        {/* Current Step Typography */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-200">
          {steps[currentStep]?.label || 'Initializing Analysis...'}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          {steps[currentStep]?.desc || 'Preparing systems.'}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mt-8 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-sky-500 via-sky-400 to-indigo-600 dark:from-sky-400 dark:to-indigo-500 rounded-full"
          />
        </div>
        
        {/* Step checklist */}
        <div className="w-full mt-8 text-left space-y-4">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div 
                key={step.label} 
                className={`flex items-start gap-3 transition-opacity duration-300 ${
                  isCompleted ? 'opacity-100' : isActive ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-sky-500 dark:text-sky-400 shrink-0 animate-spin mt-0.5" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 mt-0.5 flex items-center justify-center text-xs text-slate-400 dark:text-slate-600 font-bold">
                    {idx + 1}
                  </div>
                )}
                <div>
                  <p className={`text-sm font-bold ${
                    isActive ? 'text-sky-600 dark:text-sky-400' : isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Loader;
