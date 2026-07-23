import React, { useMemo } from 'react';
import { useHistory } from '../context/HistoryContext';
import { User, Activity, FileSpreadsheet, Eye, Award, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { reports } = useHistory();

  const activityLogs = useMemo(() => {
    return reports.slice(0, 5).map(r => {
      const date = new Date(r.timestamp);
      return {
        id: r.id,
        action: r.valid ? 'Completed clinical image description analysis' : 'Validation screen caught invalid subject',
        time: date.toLocaleString(),
        valid: r.valid
      };
    });
  }, [reports]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)] space-y-8">
      {/* Header Profile Banner */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 p-1 shrink-0">
          <div className="h-full w-full bg-white dark:bg-slate-950 rounded-full flex items-center justify-center text-slate-800 dark:text-white">
            <User className="h-10 w-10 text-sky-500" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dr. Sai Gautam, MD</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-sky-100/50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-sky-200/20">
              <Award className="h-3 w-3" /> Resident Radiologist
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Tester
          </p>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Active workspace: <code>e:/Projects/Modified Medicine-Recognition-System</code>
          </div>
        </div>
      </div>

      {/* Grid: Activity and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-slate-850 dark:text-white">Practice Summary</h3>

            {/* Total reports */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-100/50 dark:bg-sky-950/40 text-sky-500 rounded-xl">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Reports Handled</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{reports.length}</span>
              </div>
            </div>

            {/* Verification checks completed */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100/50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Verified Valid</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">
                  {reports.filter(r => r.valid).length}
                </span>
              </div>
            </div>

            {/* Workspace status */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Engine Status</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Online & Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Logs Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-slate-850 dark:text-white">Device Audit Feed</h3>

            {activityLogs.length > 0 ? (
              <div className="space-y-6">
                {activityLogs.map((log, idx) => (
                  <div key={log.id} className="flex gap-3 items-start">
                    <div className="mt-1 flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${log.valid ? 'bg-sky-500 shadow-md shadow-sky-500/20' : 'bg-rose-500 shadow-md shadow-rose-500/20'
                        }`} />
                      {idx !== activityLogs.length - 1 && (
                        <div className="w-0.5 h-12 bg-slate-100 dark:bg-slate-800 mt-1" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-250 leading-relaxed">
                        {log.action}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        <Clock className="h-3 w-3" />
                        <span>{log.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                No recent activity logged.{' '}
                <Link to="/dashboard" className="text-sky-500 hover:underline">
                  Analyze an image
                </Link>{' '}
                to populate the log.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
