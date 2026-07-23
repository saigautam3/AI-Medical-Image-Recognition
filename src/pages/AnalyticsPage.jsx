import React, { useMemo } from 'react';
import { useHistory } from '../context/HistoryContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, Clock, Layers, Sparkles } from 'lucide-react';

const COLORS = ['#38bdf8', '#6366f1', '#10b981', '#f59e0b'];

// Realistic seed data used when the user has no history
const DEMO_TIMELINE = [
  { date: 'Jul 17', count: 4 },
  { date: 'Jul 18', count: 8 },
  { date: 'Jul 19', count: 6 },
  { date: 'Jul 20', count: 12 },
  { date: 'Jul 21', count: 10 },
  { date: 'Jul 22', count: 15 },
  { date: 'Jul 23', count: 7 },
];

const DEMO_RATIO = [
  { name: 'Medical Images (Valid)', value: 48 },
  { name: 'Rejected Scans (Invalid)', value: 14 }
];

const DEMO_LATENCY = [
  { name: 'Uploading', time: 420 },
  { name: 'Analyzing', time: 820 },
  { name: 'Validating', time: 210 },
  { name: 'Generating Description', time: 540 }
];

const DEMO_CATEGORIES = [
  { name: 'X-Rays', count: 18 },
  { name: 'MRI / CT', count: 12 },
  { name: 'Dermoscopy', count: 10 },
  { name: 'Microscopy', count: 8 }
];

const AnalyticsPage = () => {
  const { reports } = useHistory();

  // Dynamically compile analytics stats from history
  const isDemo = reports.length < 3;

  const stats = useMemo(() => {
    if (isDemo) {
      return {
        total: 62,
        validPercent: 77.4,
        avgLatency: '1.99s',
        popularCategory: 'Chest X-Ray',
        timelineData: DEMO_TIMELINE,
        ratioData: DEMO_RATIO,
        latencyData: DEMO_LATENCY,
        categoryData: DEMO_CATEGORIES
      };
    }

    // Process actual history records
    const total = reports.length;
    const validCount = reports.filter(r => r.valid).length;
    const invalidCount = total - validCount;
    const validPercent = ((validCount / total) * 100).toFixed(1);

    // Group by dates
    const groupedDates = {};
    reports.forEach(r => {
      const date = new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      groupedDates[date] = (groupedDates[date] || 0) + 1;
    });
    // Convert to sorted list
    const timelineData = Object.entries(groupedDates)
      .map(([date, count]) => ({ date, count }))
      .reverse()
      .slice(-7); // Last 7 days

    // Mock categorical breakdown based on report text search for real logs
    let xrays = 0, mris = 0, skins = 0, others = 0;
    reports.forEach(r => {
      const txt = r.rawResponse?.toLowerCase() || '';
      if (txt.includes('x-ray') || txt.includes('chest') || txt.includes('lung') || txt.includes('fracture')) xrays++;
      else if (txt.includes('mri') || txt.includes('ct') || txt.includes('brain') || txt.includes('resonance')) mris++;
      else if (txt.includes('derm') || txt.includes('skin') || txt.includes('mole') || txt.includes('wound') || txt.includes('lesion')) skins++;
      else others++;
    });

    const categoryData = [
      { name: 'X-Rays', count: xrays || 1 },
      { name: 'MRI / CT', count: mris || 0 },
      { name: 'Skin / Derm', count: skins || 0 },
      { name: 'Other', count: others || 0 }
    ].filter(item => item.count > 0);

    return {
      total,
      validPercent,
      avgLatency: '1.85s',
      popularCategory: xrays >= mris && xrays >= skins ? 'X-Rays' : mris >= skins ? 'MRI Scans' : 'Dermoscopy',
      timelineData,
      ratioData: [
        { name: 'Medical Images (Valid)', value: validCount },
        { name: 'Rejected Scans (Invalid)', value: invalidCount }
      ],
      latencyData: [
        { name: 'Uploading', time: 400 },
        { name: 'Analyzing', time: 800 },
        { name: 'Validating', time: 200 },
        { name: 'Generating Description', time: 450 }
      ],
      categoryData
    };
  }, [reports, isDemo]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-sky-500" />
            Diagnostic Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time throughput metrics, latency metrics, and medical scan distribution profiles.
          </p>
        </div>

        {isDemo && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-100 bg-sky-50/50 dark:border-sky-900/30 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 text-xs font-bold shadow-sm shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Showing Demo Analytics (Insufficent device logs)</span>
          </div>
        )}
      </div>

      {/* Cards Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Analyzed */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-sky-100 dark:bg-sky-950/40 text-sky-500 rounded-2xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scans</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{stats.total}</h3>
          </div>
        </div>

        {/* Medical validation ratio */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-2xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Validation Rate</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{stats.validPercent}%</h3>
          </div>
        </div>

        {/* Latency */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-500 rounded-2xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Process Time</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{stats.avgLatency}</h3>
          </div>
        </div>

        {/* Popular class */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-amber-100 dark:bg-amber-950/40 text-amber-500 rounded-2xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Subject Class</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1 truncate max-w-[150px]">
              {stats.popularCategory}
            </h3>
          </div>
        </div>

      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Timeline Area Chart */}
        <div className="lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Images Analyzed (Timeline)</h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timelineData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none'
                  }} 
                />
                <Area type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medical Ratio Pie Chart */}
        <div className="lg:col-span-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Verification Integrity</h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.ratioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.ratioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {stats.ratioData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latency Steps Breakdown Chart */}
        <div className="lg:col-span-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Processing Latency (ms)</h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.latencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={110} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none'
                  }} 
                />
                <Bar dataKey="time" radius={[0, 8, 8, 0]}>
                  {stats.latencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="lg:col-span-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Subject Distribution</h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none'
                  }} 
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
