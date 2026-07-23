import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Inner component so it can access ThemeContext
const AppInner = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Application Container */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Fallback redirect */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-500 font-semibold bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} AI Medical Vision System. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="https://github.com/saigautam3/AI-Medical-Image-Recognition" target="_blank" rel="noreferrer" className="hover:text-sky-500 dark:hover:text-sky-400">GitHub</a>
            <span className="text-slate-350 dark:text-slate-800">|</span>
            <span>HIPAA & GDPR Compliant Local-First Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <Router>
          <AppInner />
        </Router>
      </HistoryProvider>
    </ThemeProvider>
  );
};

export default App;
