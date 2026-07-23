import React, { useState, useEffect } from 'react';
import { useHistory } from '../context/HistoryContext';
import { Search, Trash2, Calendar, Clock, Download, Eye, FileSpreadsheet, ArrowLeft, Archive, Plus } from 'lucide-react';
import { exportReportToPDF } from '../utils/pdfExport';
import { useNavigate } from 'react-router-dom';
import AnalysisResult from '../components/AnalysisResult';
import { motion, AnimatePresence } from 'framer-motion';

// Separate HistoryItem component to load its image asynchronously from IndexedDB
const HistoryItem = ({ report, onDelete, onView }) => {
  const { getReportImage } = useHistory();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const blob = await getReportImage(report.id);
      if (blob) {
        if (typeof blob === 'string') {
          setImageUrl(blob);
        } else {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          return () => URL.revokeObjectURL(url);
        }
      }
    };
    loadImage();
  }, [report.id, getReportImage]);

  const dateStr = new Date(report.timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const timeStr = new Date(report.timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Thumbnail preview */}
        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Thumbnail preview" className="h-full w-full object-cover" />
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-slate-350 border-t-sky-500 animate-spin" />
          )}
        </div>
        
        {/* Info */}
        <div className="space-y-1 truncate">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[250px] sm:max-w-[400px]">
            {report.rawResponse?.substring(0, 75).replace(/[*#`_-]/g, '')}...
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeStr}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase font-bold tracking-wider">
              {report.modelUsed || 'Gemini'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          onClick={() => onView(report)}
          className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-sky-500 rounded-xl text-slate-500 dark:text-slate-400 transition-colors duration-200"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => exportReportToPDF({ ...report, rawResponse: report.rawResponse })}
          className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-sky-500 rounded-xl text-slate-500 dark:text-slate-400 transition-colors duration-200"
          title="Export PDF"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(report.id)}
          className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl text-slate-500 dark:text-slate-400 transition-colors duration-200"
          title="Delete Report"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

const HistoryPage = () => {
  const { reports, deleteReport, clearHistory, getReportImage } = useHistory();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportImage, setSelectedReportImage] = useState(null);

  // Search filter
  const filteredReports = reports.filter(report => {
    const raw = report.rawResponse?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return raw.includes(q);
  });

  const handleViewReport = async (report) => {
    setSelectedReport(report);
    // Fetch image for details
    const imageBlob = await getReportImage(report.id);
    setSelectedReportImage(imageBlob);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
    setSelectedReportImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)]">
      <AnimatePresence mode="wait">
        
        {/* Detail view overlay */}
        {selectedReport ? (
          <motion.div
            key="details-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <button
              onClick={handleCloseDetails}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-350 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to History</span>
            </button>
            
            <AnalysisResult
              result={{
                valid: selectedReport.valid,
                raw_response: selectedReport.rawResponse,
                disclaimer: selectedReport.disclaimer,
                model_used: selectedReport.modelUsed,
                timestamp: selectedReport.timestamp
              }}
              imageFile={selectedReportImage}
              onRegenerate={() => {}} // Disabled for historical view
              onReset={handleCloseDetails}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Archive className="h-7 w-7 text-sky-500" />
                  Recent Reports
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage and download historical scans analyzed on this device.
                </p>
              </div>

              {reports.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 border border-rose-200 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-950/20 text-rose-500 dark:text-rose-400 text-xs font-bold rounded-xl transition-colors duration-200"
                >
                  Clear All History
                </button>
              )}
            </div>

            {/* List and Search */}
            {reports.length > 0 ? (
              <div className="space-y-6">
                {/* Search query input */}
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search clinical text observations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-1 focus:ring-sky-500/20 dark:text-white placeholder-slate-400 transition-all duration-200"
                  />
                </div>

                {/* Main Items list */}
                <div className="space-y-4">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <HistoryItem
                        key={report.id}
                        report={report}
                        onDelete={deleteReport}
                        onView={handleViewReport}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 text-sm text-slate-400 dark:text-slate-500 font-medium">
                      No reports match your search query.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="max-w-md mx-auto text-center py-20 space-y-6">
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <FileSpreadsheet className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Reports Yet</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
                    You haven't run any clinical image evaluations yet. Analyses performed locally will appear here.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-650 hover:to-indigo-750 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-sky-500/10 hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Analyze Your First Image</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPage;
