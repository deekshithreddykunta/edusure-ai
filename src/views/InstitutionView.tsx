import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BulkUploadModal } from '../components/BulkUploadModal';
import { AddStudentModal } from '../components/AddStudentModal';
import { ExplainableModal } from '../components/ExplainableModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  UserPlus,
  Search,
  Filter,
  FileDown,
  Clock,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  PieChart,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const InstitutionView: React.FC = () => {
  const {
    students,
    institutions,
    activeInstitutionId,
    issues,
    correctionRequests,
    updateCorrectionStatus,
    deleteStudent,
    updateStudent,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'analytics' | 'intake' | 'corrections'>('overview');

  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Active institution details
  const inst = institutions.find((i) => i.id === activeInstitutionId) || institutions[0];
  const instStudents = students.filter((s) => s.institutionId === inst.id);
  const flaggedStudents = instStudents.filter((s) => s.status === 'Flagged');
  const verifiedStudents = instStudents.filter((s) => s.status === 'Verified');

  // Filtered student list
  const filteredStudents = instStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.apaarId.includes(search) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branchFilter === 'ALL' || s.courseName.includes(branchFilter);
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const totalSanctioned = inst.courses.reduce((acc, c) => acc + c.approvedSeats, 0);
  const totalEnrolled = instStudents.length;
  const intakeUtilization = Math.round((totalEnrolled / totalSanctioned) * 100);

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || null;

  // Chart 1: Bar chart of Approved vs Enrolled
  const intakeChartData = {
    labels: inst.courses.map((c) => c.code),
    datasets: [
      {
        label: 'Approved Sanctioned Capacity',
        data: inst.courses.map((c) => c.approvedSeats),
        backgroundColor: '#4f46e5', // Royal Indigo
        borderRadius: 8,
      },
      {
        label: 'Actual Enrolled Students',
        data: inst.courses.map((c) => c.enrolledCount),
        backgroundColor: inst.courses.map((c) =>
          c.enrolledCount > c.approvedSeats ? '#f43f5e' : '#10b981'
        ),
        borderRadius: 8,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12, weight: '500' },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { size: 11, weight: '600' } },
        grid: { color: '#1e293b' },
      },
      y: {
        ticks: { color: '#94a3b8', font: { size: 11 } },
        grid: { color: '#1e293b' },
      },
    },
  };

  // Chart 2: Category Quota breakdown Doughnut
  const categoryCounts = {
    General: instStudents.filter((s) => s.category === 'General').length,
    OBC: instStudents.filter((s) => s.category === 'OBC').length,
    EWS: instStudents.filter((s) => s.category === 'EWS').length,
    SC_ST: instStudents.filter((s) => s.category === 'SC' || s.category === 'ST').length,
    NRI_FN: instStudents.filter((s) => s.category === 'NRI' || s.category === 'FN').length,
  };

  const quotaChartData = {
    labels: ['Open Merit (General)', 'OBC', 'EWS', 'SC / ST', 'NRI / Foreign (Supernumerary)'],
    datasets: [
      {
        data: [
          categoryCounts.General || 340,
          categoryCounts.OBC || 140,
          categoryCounts.EWS || 48,
          categoryCounts.SC_ST || 45,
          categoryCounts.NRI_FN || 15,
        ],
        backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
        borderWidth: 3,
        borderColor: '#0f172a',
      },
    ],
  };

  const exportCsv = () => {
    const headers = 'Name,APAAR ID,DOB,Course,Roll Number,Category,Status\n';
    const rows = instStudents
      .map(
        (s) =>
          `"${s.name}","${s.apaarId}","${s.dob}","${s.courseName}","${s.rollNumber}","${s.category}","${s.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inst.name.replace(/\s+/g, '_')}_Student_Registry.csv`;
    a.click();
    showToast('Exported student registry to CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* College Identity Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#131b2e] to-indigo-950/80 rounded-3xl p-7 shadow-2xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              COLLEGE PORTAL • AUTONOMOUS STATUS
            </span>
            <span className="text-slate-400 text-xs font-mono">
              AICTE: {inst.aicteCode} • AISHE: {inst.aisheCode}
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            {inst.name}
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed">
            {inst.region} • Western Regional Jurisdiction • Enrolment Batch 2024–25 Synced with Central Academic Depository
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all shadow-sm hover:text-white"
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Add Single Record</span>
          </button>
          <button
            onClick={() => setIsBulkOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk CSV / Excel Upload</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Intake & Enrolment */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 transition-all hover:border-indigo-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enrolment vs Sanctioned
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalEnrolled}</span>
            <span className="text-xs text-slate-400">/ {totalSanctioned} Seats</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-medium">
              <span>Intake Utilization</span>
              <span className="font-bold text-indigo-400">{intakeUtilization}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  intakeUtilization > 100 ? 'bg-rose-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(intakeUtilization, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Data Quality Score */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 transition-all hover:border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Data Quality Index
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{inst.dataQualityScore}%</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Grade A-
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Format check, low duplicates & valid DOBs</span>
          </p>
        </div>

        {/* Card 3: Anomaly / Flagged Records */}
        <div className="glass-card rounded-2xl p-5 border border-rose-500/30 transition-all hover:border-rose-500/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Flagged Anomalies
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-500">{flaggedStudents.length}</span>
            <span className="text-xs text-rose-400 font-semibold">Records Pending</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>CSE capacity breach & duplicate APAAR</span>
          </p>
        </div>

        {/* Card 4: Verified APAAR Records */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified & ABC Synced
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-400">{verifiedStudents.length}</span>
            <span className="text-xs text-slate-400">
              ({Math.round((verifiedStudents.length / (instStudents.length || 1)) * 100)}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <span>Linked to National Academic Depository</span>
          </p>
        </div>
      </div>

      {/* Role-Specific Navigation Tabs (ONLY INSTITUTION MODULES) */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'records'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Records Directory ({instStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Intake Charts & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('intake')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'intake'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Branch Quota Monitor</span>
          {inst.courses.some((c) => c.enrolledCount > c.approvedSeats) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('corrections')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'corrections'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Correction Requests ({correctionRequests.length})</span>
        </button>
      </div>

      {/* Tab: Overview (Summary) */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in-scale">
          {/* Action Callout if capacity is exceeded */}
          {inst.courses.some((c) => c.enrolledCount > c.approvedSeats) && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/40 text-rose-200 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Action Required: Computer Science & Engineering Capacity Breach (184 / 180 Seats)
                  </h3>
                  <p className="text-xs text-rose-300/90 mt-0.5">
                    AICTE Compliance Case #CR-1043 has been assigned. Please categorize lateral entry quota or resolve surplus admissions.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('analytics')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>View Intake Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Chart Preview */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    Branch Capacity Breakdown
                  </h3>
                  <p className="text-[11px] text-slate-400">Approved seats vs registered students</p>
                </div>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Full Analytics →
                </button>
              </div>
              <div className="h-64 w-full">
                <Bar data={intakeChartData} options={chartOptions} />
              </div>
            </div>

            {/* Department Status List */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Engineering Programmes
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">Live department enrolment quota</p>
              </div>

              <div className="space-y-2.5 text-xs">
                {inst.courses.map((c) => {
                  const isOver = c.enrolledCount > c.approvedSeats;
                  return (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-200">{c.code}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{c.name}</div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-bold font-mono text-xs ${
                            isOver ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {c.enrolledCount} / {c.approvedSeats}
                        </span>
                        {isOver && (
                          <span className="block text-[9px] font-bold text-rose-400 uppercase">
                            Overflow (+{c.enrolledCount - c.approvedSeats})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveTab('records')}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-indigo-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Browse All {instStudents.length} Student Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Analytics Charts */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-scale">
          {/* Bar Chart */}
          <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  Branch-wise Approved Intake vs Enrolled
                </h3>
                <p className="text-[11px] text-slate-400">
                  Red indicator highlights Computer Science & Engineering exceeding 180 sanctioned seats (184 enrolled)
                </p>
              </div>
              <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[10px] font-bold">
                CSE Capacity Breach
              </span>
            </div>
            <div className="h-80 w-full">
              <Bar data={intakeChartData} options={chartOptions} />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <PieChart className="w-4 h-4 text-emerald-400" />
                Admission Category Distribution
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">Quota classification breakdown</p>
              <div className="h-64 w-full flex items-center justify-center">
                <Doughnut
                  data={quotaChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: '#cbd5e1', font: { size: 10, weight: 500 } },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Student Records Directory */}
      {activeTab === 'records' && (
        <div className="glass-card rounded-2xl border border-slate-800 shadow-xl overflow-hidden animate-fade-in-scale">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student by name, APAAR ID, or roll number..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-900 text-white font-medium"
                />
              </div>

              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="py-2 px-3 text-xs border border-slate-700 rounded-xl bg-slate-900 text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Branches</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Artificial Intelligence">AI & Data Science</option>
                <option value="Electronics">Electronics & Comm.</option>
                <option value="Mechanical">Mechanical</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs border border-slate-700 rounded-xl bg-slate-900 text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Verified">Verified Only</option>
                <option value="Flagged">Flagged / Anomalies Only</option>
              </select>
            </div>

            <button
              onClick={exportCsv}
              className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080d1a] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">APAAR Identifier</th>
                  <th className="py-3 px-4">Branch / Batch</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">Diagnostic / Audit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No matching student records found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu) => {
                    const matchedIssue = issues.find((i) => i.studentId === stu.id);
                    return (
                      <tr key={stu.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{stu.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Roll: {stu.rollNumber} • {stu.dob || 'DOB Missing'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded font-medium ${
                              stu.status === 'Flagged'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-200'
                            }`}
                          >
                            {stu.apaarId}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">{stu.courseName}</div>
                          <div className="text-[11px] text-slate-400">{stu.admissionBatch}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                            {stu.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {stu.status === 'Verified' ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full text-[11px] border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-1 rounded-full text-[11px] border border-rose-500/30">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              Flagged
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          {stu.flagReason ? (
                            <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-800/60 leading-tight">
                              <span className="font-semibold block text-[10px] uppercase text-rose-400 mb-0.5">
                                {stu.flagSeverity || 'Discrepancy'} Flag
                              </span>
                              {stu.flagReason}
                              {matchedIssue && (
                                <button
                                  onClick={() => setSelectedIssueId(matchedIssue.id)}
                                  className="mt-1 text-indigo-400 hover:text-indigo-300 font-semibold block text-[11px] underline"
                                >
                                  Inspect Explainable Reason →
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">
                              Rule checks passed • {stu.validationSource}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {stu.status === 'Flagged' && (
                              <button
                                onClick={() => {
                                  const fixedId = prompt(
                                    `Enter corrected APAAR ID or Date of Birth for ${stu.name}:`,
                                    stu.dob ? '9823-4412-9999' : '2004-06-15'
                                  );
                                  if (fixedId) {
                                    if (fixedId.includes('-') && fixedId.length === 10) {
                                      updateStudent(stu.id, {
                                        dob: fixedId,
                                        status: 'Verified',
                                        flagReason: undefined,
                                      });
                                    } else {
                                      updateStudent(stu.id, {
                                        apaarId: fixedId,
                                        status: 'Verified',
                                        flagReason: undefined,
                                      });
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded text-[11px] font-semibold border border-indigo-500/40"
                              >
                                Fix Record
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Remove record for ${stu.name}?`)) {
                                  deleteStudent(stu.id);
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Intake Monitor */}
      {activeTab === 'intake' && (
        <div className="space-y-4 animate-fade-in-scale">
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">Regulatory Notice: Approved Intake Ceiling</span>
              Under AICTE Approval Process Handbook (APH 2024-25), no institution can admit students exceeding the
              sanctioned strength without formal extension of approval (EoA). Excess admissions are automatically flagged
              to the Regional AICTE Compliance Cell.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inst.courses.map((course) => {
              const isOverIntake = course.enrolledCount > course.approvedSeats;
              const isNriOver = course.nriEnrolled > course.nriQuota;
              const pct = Math.round((course.enrolledCount / course.approvedSeats) * 100);

              return (
                <div
                  key={course.id}
                  className={`glass-card rounded-2xl p-5 border shadow-xl ${
                    isOverIntake ? 'border-rose-500/50 ring-2 ring-rose-500/20' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-indigo-400 uppercase">
                      {course.code}
                    </span>
                    {isOverIntake ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-[10px] uppercase">
                        Capacity Exceeded (+{course.enrolledCount - course.approvedSeats})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold text-[10px]">
                        Within Cap
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-sm mb-3">{course.name}</h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Sanctioned Seats vs Enrolled</span>
                        <span className="font-bold text-white">
                          {course.enrolledCount} / {course.approvedSeats} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isOverIntake ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                      <div className={`p-2.5 rounded-xl ${isNriOver ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-slate-900/80 text-slate-300'}`}>
                        <span className="block text-slate-400 text-[10px]">NRI Quota (5% Cap)</span>
                        <span className="font-bold">
                          {course.nriEnrolled} / {course.nriQuota} Seats
                        </span>
                        {isNriOver && <span className="block text-[10px] text-rose-400 font-bold mt-0.5">Exceeds Cap</span>}
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300">
                        <span className="block text-slate-400 text-[10px]">FN / Gulf Quota (15%)</span>
                        <span className="font-bold">
                          {course.fnEnrolled} / {course.fnQuota} Seats
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Correction Requests */}
      {activeTab === 'corrections' && (
        <div className="glass-card rounded-2xl border border-slate-800 shadow-xl overflow-hidden animate-fade-in-scale">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60">
            <h3 className="font-bold text-sm text-white">
              Student Demographic Correction Requests
            </h3>
            <p className="text-xs text-slate-400">
              Review and act on data correction requests submitted by students through their APAAR portal.
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {correctionRequests.map((req) => (
              <div key={req.id} className="p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{req.studentName}</span>
                    <span className="font-mono text-slate-400">({req.apaarId})</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-bold text-[10px]">
                      {req.status}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    <span className="font-semibold text-slate-400">Requested Change on: </span>
                    <span className="font-mono text-indigo-400 font-bold">{req.fieldName}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                    <div>
                      <span className="text-slate-500">Current Value: </span>
                      <span className="font-medium line-through text-rose-400">{req.currentValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Requested Value: </span>
                      <span className="font-medium text-emerald-400 font-bold">{req.requestedValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Reason: </span>
                      <span>{req.reason}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => updateCorrectionStatus(req.id, 'Rejected')}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updateCorrectionStatus(req.id, 'Approved')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve & Apply
                      </button>
                    </>
                  ) : (
                    <span className="text-slate-500 italic">Decision Recorded</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <BulkUploadModal isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} />
      <AddStudentModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <ExplainableModal issue={selectedIssue} onClose={() => setSelectedIssueId(null)} />
    </div>
  );
};
