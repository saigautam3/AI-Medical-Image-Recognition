import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveImage, getImage, deleteImage } from '../utils/db';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load history metadata on mount
  useEffect(() => {
    const saved = localStorage.getItem('reports_history');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reports history from localstorage:", e);
      }
    }
    setLoading(false);
  }, []);

  // Save history metadata when reports state changes
  const saveReportsToLocalStorage = (newReports) => {
    localStorage.setItem('reports_history', JSON.stringify(newReports));
    setReports(newReports);
  };

  const addReport = async (reportData, imageFile) => {
    const reportId = crypto.randomUUID();
    const newReport = {
      id: reportId,
      timestamp: reportData.timestamp || new Date().toISOString(),
      modelUsed: reportData.model_used || reportData.modelUsed,
      rawResponse: reportData.raw_response || reportData.rawResponse,
      disclaimer: reportData.disclaimer || "AI-generated observation report.",
      valid: reportData.valid,
    };

    // Save image to IndexedDB
    if (imageFile) {
      await saveImage(reportId, imageFile);
    }

    const updated = [newReport, ...reports];
    saveReportsToLocalStorage(updated);
    return reportId;
  };

  const deleteReport = async (id) => {
    // Delete image from IndexedDB
    await deleteImage(id);
    // Delete metadata from state/localStorage
    const updated = reports.filter(r => r.id !== id);
    saveReportsToLocalStorage(updated);
  };

  const clearHistory = async () => {
    // Delete all images in IndexedDB
    for (const report of reports) {
      await deleteImage(report.id);
    }
    saveReportsToLocalStorage([]);
  };

  const getReportImage = async (id) => {
    return await getImage(id);
  };

  return (
    <HistoryContext.Provider value={{ reports, loading, addReport, deleteReport, clearHistory, getReportImage }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
