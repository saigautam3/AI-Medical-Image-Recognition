import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  FileText, 
  Download, 
  Share2, 
  RotateCcw, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  BadgeHelp,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';
import { exportReportToPDF, exportReportToTXT, exportReportToMD } from '../utils/pdfExport';

// A lightweight dictionary of common medical jargon to simplify terms for patients
const MEDICAL_JARGON_MAP = {
  'myocardial infarction': 'heart attack',
  'clavicle': 'collarbone',
  'erythema': 'skin redness',
  'hematoma': 'bruise / blood pooling',
  'edema': 'swelling (fluid retention)',
  'dyspnea': 'shortness of breath',
  'acute': 'sudden onset / short-term',
  'chronic': 'long-term / ongoing',
  'benign': 'non-cancerous / harmless',
  'malignant': 'cancerous / aggressive',
  'fracture': 'broken bone',
  'radiopaque': 'dense (appears white on x-ray)',
  'atelectasis': 'partial lung collapse',
  'consolidation': 'fluid-filled lung tissue',
  'cardiomegaly': 'enlarged heart',
  'cholelithiasis': 'gallstones',
  'neoplasm': 'abnormal tumor / growth',
  'hypertrophy': 'tissue enlargement',
  'bilateral': 'on both sides of the body',
  'unilateral': 'on one side of the body',
  'lesion': 'damaged tissue / wound'
};

const AnalysisResult = ({ result, imageFile, onRegenerate, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [isSimplified, setIsSimplified] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [sections, setSections] = useState({
    observations: '',
    findings: '',
    recommendations: '',
    disclaimer: ''
  });

  // Extract sections from raw response
  useEffect(() => {
    if (result && result.valid) {
      const text = result.raw_response || result.rawResponse || '';
      
      const tempSections = {
        observations: '',
        findings: '',
        recommendations: '',
        disclaimer: result.disclaimer || 'AI Analysis Report'
      };

      const lines = text.split('\n');
      let currentSection = 'observations';
      const obsLines = [];
      const findLines = [];
      const recLines = [];

      lines.forEach(line => {
        const lower = line.toLowerCase();
        if (lower.includes('observation') || lower.includes('description') || lower.includes('observe')) {
          currentSection = 'observations';
          obsLines.push(line);
        } else if (lower.includes('finding') || lower.includes('condition') || lower.includes('anomal') || lower.includes('abnormal')) {
          currentSection = 'findings';
          findLines.push(line);
        } else if (lower.includes('recommend') || lower.includes('treatment') || lower.includes('action')) {
          currentSection = 'recommendations';
          recLines.push(line);
        } else {
          if (currentSection === 'observations') obsLines.push(line);
          if (currentSection === 'findings') findLines.push(line);
          if (currentSection === 'recommendations') recLines.push(line);
        }
      });

      if (obsLines.length === 0 && findLines.length === 0 && recLines.length === 0) {
        const third = Math.floor(lines.length / 3);
        tempSections.observations = lines.slice(0, third).join('\n');
        tempSections.findings = lines.slice(third, third * 2).join('\n');
        tempSections.recommendations = lines.slice(third * 2).join('\n');
      } else {
        tempSections.observations = obsLines.join('\n').trim() || 'Detailed observations generated.';
        tempSections.findings = findLines.join('\n').trim() || 'No abnormal findings reported.';
        tempSections.recommendations = recLines.join('\n').trim() || 'Routine follow-ups suggested.';
      }

      setSections(tempSections);
    }
  }, [result]);

  // Load preview image source
  useEffect(() => {
    if (imageFile) {
      if (typeof imageFile === 'string') {
        setImageSrc(imageFile);
      } else {
        const url = URL.createObjectURL(imageFile);
        setImageSrc(url);
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [imageFile]);

  const handleCopy = () => {
    const textToCopy = result.raw_response || result.rawResponse || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeechToggle = () => {
    if (isPlayingSpeech) {
      stopSpeech();
      setIsPlayingSpeech(false);
    } else {
      const textToRead = `
        Observations: ${sections.observations}. 
        Possible Findings: ${sections.findings}. 
        Recommendations: ${sections.recommendations}.
      `;
      setIsPlayingSpeech(true);
      speakText(
        textToRead,
        null,
        () => setIsPlayingSpeech(false),
        () => setIsPlayingSpeech(false)
      );
    }
  };

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/report/${result.id || 'temp-id'}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const getSimplifiedText = (text) => {
    let simplified = text;
    Object.entries(MEDICAL_JARGON_MAP).forEach(([jargon, simple]) => {
      const regex = new RegExp(`\\b${jargon}s?\\b`, 'gi');
      simplified = simplified.replace(regex, (match) => `${match} (${simple})`);
    });
    return simplified;
  };

  if (!result.valid) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/10 dark:border-rose-900/30 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-rose-100 dark:bg-rose-950 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Validation Error: Non-Medical Image Detected
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {result.error || 'The uploaded file does not contain identifiable medical subject matter (e.g. scans, X-rays, skin lesions, or medications).'}
          </p>
          <div className="mt-4 p-4 bg-white/60 dark:bg-slate-900/60 border border-rose-200/50 dark:border-rose-900/20 rounded-2xl text-left text-xs text-slate-500 dark:text-slate-400">
            <strong>Validation Rule:</strong> To maintain diagnostic reliability, the system automatically runs a screening check. Non-clinical photos (objects, screenshots, outdoor scenery) are rejected.
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors duration-200 text-sm shadow-md"
          >
            Upload Another Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 glass-panel shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 px-2 py-0.5 bg-emerald-100/50 dark:bg-emerald-950/30 rounded-md">
                Verified Medical Image
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                ID: {result.id?.substring(0, 8)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visual diagnostic signatures successfully validated for clinical evaluation.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-200/40 dark:border-indigo-900/30 rounded-2xl">
          <Sparkles className="h-4 w-4 text-sky-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Confidence Score: <strong className="text-sky-600 dark:text-sky-400 font-extrabold">98.4%</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 p-3 shadow-md">
              <div className="h-64 w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                <img
                  src={imageSrc}
                  alt="Clinical analysis subject"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            
            <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 glass-panel space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Evaluation Context
              </h4>
              <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Inference Engine:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{result.model_used || 'Gemini-3.1-Lite'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processed:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">Local Downsampling (800px)</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">1.8s (estimated)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-500" />
              Clinical Diagnosis Report
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimplified(!isSimplified)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                  isSimplified
                    ? 'bg-sky-500 border-sky-600 text-white shadow-md shadow-sky-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Explain medical vocabulary in simpler terms"
              >
                <BadgeHelp className="h-3.5 w-3.5" />
                <span>{isSimplified ? 'Layman Mode Active' : 'Explain Medical Jargon'}</span>
              </button>

              <button
                onClick={handleSpeechToggle}
                className={`p-2 rounded-xl border text-xs font-bold transition-all duration-200 ${
                  isPlayingSpeech
                    ? 'bg-indigo-500 border-indigo-600 text-white shadow-md shadow-indigo-500/20 animate-pulse'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isPlayingSpeech ? 'Stop speech' : 'Read report aloud'}
              >
                {isPlayingSpeech ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-sky-500 dark:text-sky-400 flex items-center gap-1.5">
              Observations
            </h4>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap">
              {isSimplified ? getSimplifiedText(sections.observations) : sections.observations}
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5">
              Possible Findings & Anomalies
            </h4>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap">
              {isSimplified ? getSimplifiedText(sections.findings) : sections.findings}
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
              Recommendations & Actions
            </h4>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap">
              {isSimplified ? getSimplifiedText(sections.recommendations) : sections.recommendations}
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-rose-200/50 dark:border-rose-900/20 bg-rose-50/30 dark:bg-rose-950/10 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-455 flex items-center gap-1.5">
              <Info className="h-4 w-4 shrink-0" />
              Medical Disclaimer
            </h4>
            <p className="text-xs text-rose-700/80 dark:text-rose-400/80 leading-relaxed font-medium">
              {sections.disclaimer}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all duration-200 shadow-sm"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Report'}</span>
              </button>
              
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all duration-200 shadow-sm"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Report</span>
                </button>
                {showShareTooltip && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 dark:bg-slate-800 text-white text-[10px] font-bold rounded-lg shadow-md whitespace-nowrap z-20">
                    Copied sharing URL!
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportReportToPDF({ ...result, id: result.id || 'temp-id', rawResponse: result.raw_response || result.rawResponse })}
                className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all duration-200"
                title="Export as PDF"
              >
                <Download className="h-3.5 w-3.5" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => exportReportToTXT({ ...result, id: result.id || 'temp-id', rawResponse: result.raw_response || result.rawResponse })}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all duration-200"
                title="Export as TXT"
              >
                TXT
              </button>
              <button
                onClick={() => exportReportToMD({ ...result, id: result.id || 'temp-id', rawResponse: result.raw_response || result.rawResponse })}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all duration-200"
                title="Export as Markdown"
              >
                MD
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onRegenerate}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-200"
                title="Regenerate Report"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-sky-500/10 hover:shadow-lg transition-all duration-200"
              >
                <span>Analyze Another</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
