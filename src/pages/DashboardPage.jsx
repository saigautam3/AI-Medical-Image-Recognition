import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '../components/ImageUpload';
import Loader from '../components/Loader';
import AnalysisResult from '../components/AnalysisResult';
import { analyzeImage } from '../services/api';
import { useHistory } from '../context/HistoryContext';
import { Sparkles, AlertCircle, FileImage, ShieldAlert } from 'lucide-react';

const DashboardPage = () => {
  const { addReport } = useHistory();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageSelected = (fileOrUrl) => {
    setSelectedFile(fileOrUrl);
    setError(null);
    setAnalysisResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  // Simulate loader progress steps while API is running
  const animateLoader = (finishCallback) => {
    setLoaderStep(0);
    
    const timeouts = [];
    timeouts.push(setTimeout(() => setLoaderStep(1), 600));
    timeouts.push(setTimeout(() => setLoaderStep(2), 1400));
    timeouts.push(setTimeout(() => setLoaderStep(3), 2100));

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const cancelLoaderAnimation = animateLoader();

    try {
      let result;
      if (typeof selectedFile === 'string') {
        const res = await fetch(selectedFile);
        const blob = await res.blob();
        const file = new File([blob], 'sample_image.jpg', { type: 'image/jpeg' });
        result = await analyzeImage(file);
      } else {
        result = await analyzeImage(selectedFile);
      }

      setLoaderStep(4);
      
      setTimeout(async () => {
        setIsLoading(false);
        cancelLoaderAnimation();
        
        if (result.valid) {
          const fileToSave = typeof selectedFile === 'string' 
            ? await fetch(selectedFile).then(r => r.blob())
            : selectedFile;
          
          const reportId = await addReport(result, fileToSave);
          setAnalysisResult({
            ...result,
            id: reportId
          });
        } else {
          setAnalysisResult(result);
        }
      }, 500);

    } catch (err) {
      cancelLoaderAnimation();
      setIsLoading(false);
      
      console.error("API analysis error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An unexpected connection error occurred. Please verify Flask is running.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)]">
      <div className="space-y-8">
        
        {!isLoading && !analysisResult && (
          <div className="text-center md:text-left max-w-3xl">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="h-7 w-7 text-sky-500" />
              Analyze Medical Image
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Upload your radiography scan, dermoscopy photo, or microscopic image. Our neural agent screens for validity and generates observations in seconds.
            </p>
          </div>
        )}

        <div className="flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait">
            
            {isLoading && (
              <motion.div
                key="loading-stepper"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex justify-center py-6"
              >
                <Loader currentStep={loaderStep} />
              </motion.div>
            )}

            {!isLoading && !analysisResult && (
              <motion.div
                key="upload-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-100/40 dark:shadow-none space-y-6"
              >
                <ImageUpload 
                  onImageSelected={handleImageSelected} 
                  selectedImage={selectedFile} 
                  onClear={handleClear} 
                />

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400">Analysis Failed</h4>
                      <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-0.5 leading-relaxed">{error}</p>
                    </div>
                  </motion.div>
                )}

                {selectedFile && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4"
                  >
                    <button
                      onClick={handleClear}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold transition-all duration-200"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleAnalyze}
                      className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-sky-500/10 hover:shadow-lg transition-all duration-200"
                    >
                      Generate Diagnosis
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {!isLoading && analysisResult && (
              <motion.div
                key="results-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full"
              >
                <AnalysisResult 
                  result={analysisResult} 
                  imageFile={selectedFile} 
                  onRegenerate={handleAnalyze} 
                  onReset={handleClear} 
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
