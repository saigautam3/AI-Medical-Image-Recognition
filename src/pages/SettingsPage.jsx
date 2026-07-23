import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getBackendStatus } from '../services/api';
import { 
  Settings, 
  Database, 
  Cpu, 
  Smartphone, 
  Bell, 
  Info, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  
  const [backendStatus, setBackendStatus] = useState('checking');
  const [geminiStatus, setGeminiStatus] = useState('checking');
  const [activeModel, setActiveModel] = useState('checking');
  const [version, setVersion] = useState('checking');
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('settings_notifications');
    return saved === 'true';
  });

  const checkStatus = async () => {
    setBackendStatus('checking');
    setGeminiStatus('checking');
    try {
      const data = await getBackendStatus();
      if (data.status === 'healthy') {
        setBackendStatus('healthy');
      } else {
        setBackendStatus('warning');
      }
      setGeminiStatus(data.gemini_status || 'disconnected');
      setActiveModel(data.model || 'gemini-3.1-flash-lite');
      setVersion(data.version || '1.0.0');
    } catch (e) {
      console.error("Failed to fetch backend status", e);
      setBackendStatus('offline');
      setGeminiStatus('disconnected');
      setActiveModel('Unavailable');
      setVersion('1.0.0');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleNotificationChange = (e) => {
    const checked = e.target.checked;
    setNotifications(checked);
    localStorage.setItem('settings_notifications', checked);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)] space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-7 w-7 text-sky-500" />
            Device Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor API statuses, check application metrics, and toggle diagnostic choices.
          </p>
        </div>
        
        <button
          onClick={checkStatus}
          className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-sky-500 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-350"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: Quick Preferences */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General settings card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Smartphone className="h-4.5 w-4.5 text-sky-500" />
              User Experience
            </h3>

            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Color Palette</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={`p-3 rounded-2xl border text-xs font-bold capitalize transition-all duration-200 ${
                      theme === mode
                        ? 'bg-sky-50 border-sky-500 text-sky-600 dark:bg-sky-950/30 dark:border-sky-400 dark:text-sky-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {mode} Theme
                  </button>
                ))}
                
                {/* System Default button */}
                <button
                  onClick={() => {
                    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    setTheme(system);
                  }}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all duration-200"
                >
                  System default
                </button>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-6">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-indigo-500" />
                  Diagnostic Notifications
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-sm">
                  Send desktop notifications when image reports finish rendering or validation screenings trigger.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={handleNotificationChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-500" />
              </label>
            </div>
          </div>

          {/* About / Info */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl flex items-start gap-4">
            <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-750 dark:text-slate-200">Application Architecture</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This Single Page Application utilizes a Python Flask REST backend to serve a fast React frontend compiled by Vite. Gemini Vision acts as the key reasoning agent, with all image files stored locally on this machine using browser-level IndexedDB configurations.
              </p>
            </div>
          </div>

        </div>

        {/* Right column: Status Panel */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-sky-500" />
              API Connectors
            </h3>

            {/* Flask Service Status */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Flask Service:</span>
                {backendStatus === 'checking' && (
                  <span className="text-slate-400 font-bold">Checking...</span>
                )}
                {backendStatus === 'healthy' && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" /> Healthy
                  </span>
                )}
                {backendStatus === 'offline' && (
                  <span className="inline-flex items-center gap-1 text-rose-500 font-bold">
                    <AlertTriangle className="h-3.5 w-3.5" /> Offline
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    backendStatus === 'healthy' ? 'bg-emerald-500 w-full' : backendStatus === 'checking' ? 'bg-slate-300 w-1/2 animate-pulse' : 'bg-rose-500 w-full'
                  }`} 
                />
              </div>
            </div>

            {/* Gemini LLM Status */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Google Gemini API:</span>
                {geminiStatus === 'checking' && (
                  <span className="text-slate-400 font-bold">Checking...</span>
                )}
                {geminiStatus === 'connected' && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" /> Connected
                  </span>
                )}
                {geminiStatus === 'disconnected' && (
                  <span className="inline-flex items-center gap-1 text-rose-500 font-bold">
                    <AlertTriangle className="h-3.5 w-3.5" /> Disconnected
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    geminiStatus === 'connected' ? 'bg-emerald-500 w-full' : geminiStatus === 'checking' ? 'bg-slate-300 w-1/2 animate-pulse' : 'bg-rose-500 w-full'
                  }`} 
                />
              </div>
            </div>

            {/* Model Name */}
            <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-850 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active LLM Engine</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-750 dark:text-slate-350">
                <Cpu className="h-3.5 w-3.5 text-indigo-500" />
                <span>{activeModel}</span>
              </div>
            </div>

            {/* Version */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Software Version</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-750 dark:text-slate-350">
                <Info className="h-3.5 w-3.5 text-slate-400" />
                <span>{version} (Vite-Tailwind Redesign)</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
