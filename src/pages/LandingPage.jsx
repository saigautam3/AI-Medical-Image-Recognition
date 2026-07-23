import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Activity, 
  Heart, 
  Brain, 
  Microscope, 
  Stethoscope, 
  ShieldCheck, 
  FileCheck,
  CheckCircle,
  Cpu
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Automated Image Screen',
      desc: 'Smart validation model checks whether the uploaded subject contains relevant clinical matter, rejecting false positive inputs instantly.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      title: 'Active Gemini Analysis',
      desc: 'Utilizes Google Gemini Vision API to evaluate visual markers, text labels, and structural shapes with extreme precision.',
      icon: Cpu,
      color: 'text-sky-500 bg-sky-500/10'
    },
    {
      title: 'Detailed Report Exporter',
      desc: 'Creates printable documentation with observations, possible findings, and recommendations. Exportable to PDF, TXT, or MD formats.',
      icon: FileCheck,
      color: 'text-indigo-500 bg-indigo-500/10'
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden animated-bg">
      {/* Background decorations - floating medical icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Heart Icon floating */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] text-rose-500/15 dark:text-rose-400/10"
        >
          <Heart className="h-16 w-16" />
        </motion.div>
        {/* Brain Icon floating */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-[12%] text-indigo-500/15 dark:text-indigo-400/10"
        >
          <Brain className="h-20 w-20" />
        </motion.div>
        {/* Microscope floating */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-32 left-[15%] text-sky-500/15 dark:text-sky-400/10"
        >
          <Microscope className="h-16 w-16" />
        </motion.div>
        {/* Stethoscope floating */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-24 right-[18%] text-emerald-500/15 dark:text-emerald-400/10"
        >
          <Stethoscope className="h-16 w-16" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex-grow flex flex-col justify-center">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Headline Announcement Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-sky-200/50 bg-sky-500/10 dark:border-sky-850 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Activity className="h-3.5 w-3.5 animate-pulse text-sky-500" />
            <span>AI Diagnostic Engine v1.0 Active</span>
          </motion.div>

          {/* Large Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            AI Medical Image Recognition &{' '}
            <span className="bg-gradient-to-r from-sky-500 via-sky-400 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Clinical Description Generator
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-350 max-w-3xl mx-auto leading-relaxed"
          >
            Analyze medical images using Google Gemini Vision and generate intelligent clinical descriptions in seconds.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-650 hover:to-indigo-750 text-white font-extrabold rounded-2xl shadow-xl shadow-sky-500/25 dark:shadow-none hover:scale-103 transform transition-all duration-200 text-base"
            >
              <span>Analyze Image</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all duration-200 text-base backdrop-blur-sm"
            >
              <span>Learn More</span>
            </a>
          </motion.div>

        </div>
      </div>

      {/* Features Overview */}
      <div id="features" className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Advanced Clinical Diagnostics
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              State-of-the-art framework designed for rapid medical analysis and documentation support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className={`inline-flex p-3 rounded-2xl ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
