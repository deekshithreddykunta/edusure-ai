import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark,
  Building2,
  Users,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Settings,
  Scale,
  TrendingUp,
  MapPin,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Search,
  ExternalLink,
} from 'lucide-react';

export const AicteView: React.FC = () => {
  const { institutions, students, issues, rules, toggleRule, showToast, setRole } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'institutions' | 'rules' | 'apis'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Regional metrics for India
  const regions = [
    { name: 'Western Region (Mumbai)', states: 'MH, Goa, Gujarat', colleges: 2140, intake: 780000, enrolled: 725400, complianceRate: 93.0, alerts: 34 },
    { name: 'Southern Region (Chennai)', states: 'TN, Kerala, Puducherry', colleges: 1890, intake: 690000, enrolled: 634800, complianceRate: 92.0, alerts: 21 },
    { name: 'South-Western (Bengaluru)', states: 'Karnataka', colleges: 1250, intake: 440000, enrolled: 396000, complianceRate: 90.0, alerts: 19 },
    { name: 'Northern Region (Kanpur)', states: 'UP, Delhi NCR, UK', colleges: 1980, intake: 710000, enrolled: 617700, complianceRate: 87.0, alerts: 42 },
    { name: 'North-Western (Chandigarh)', states: 'Punjab, Haryana, HP, J&K', colleges: 1120, intake: 380000, enrolled: 334400, complianceRate: 88.0, alerts: 18 },
    { name: 'Eastern Region (Kolkata)', states: 'WB, Odisha, North-East', colleges: 1032, intake: 240000, enrolled: 204000, complianceRate: 85.0, alerts: 28 },
  ];

  const handleExportNationalReport = () => {
    const reportContent = `AICTE NATIONAL ACADEMIC REGULATORY INTELLIGENCE REPORT
Date: ${new Date().toLocaleDateString()}
Total Approved Institutions: 9,412
Total Sanctioned Intake Capacity: 3,240,000
Total Enrolments Synced: 2,912,300 (89.88%)
Flagged Anomalies: ${issues.length} Active Cases
Cross-Institution Duplicate Alerts: 87

INSTITUTION BREAKDOWN:
${institutions
  .map(
    (i) =>
      `- ${i.name} (AICTE: ${i.aicteCode}) | Approved: ${i.totalApprovedIntake} | Enrolled: ${i.totalEnrolled} | DQ Score: ${i.dataQualityScore}% | Status: ${i.status}`
  )
  .join('\n')}
    `;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AICTE_National_Compliance_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showToast('AICTE National Compliance Report generated.', 'success');
  };

  const filteredInstitutions = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.aicteCode.includes(searchTerm) ||
      i.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* AICTE National Banner */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              NATIONAL REGULATORY HEADQUARTERS (NEW DELHI)
            </span>
            <span className="text-slate-400 text-xs">Statutory Body • Higher Technical Education</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            AICTE National Intelligence & Intake Oversight Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Pan-India aggregation of APAAR-linked enrolments, sanctioned seat thresholds, and cross-university anomaly detection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportNationalReport}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-brand-400" />
            <span>Export Official AICTE Report</span>
          </button>
        </div>
      </div>

      {/* National KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
            Approved Institutions
          </span>
          <div className="text-2xl font-extrabold text-slate-900">9,412</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 36 States & UTs</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
            Total Sanctioned Intake
          </span>
          <div className="text-2xl font-extrabold text-slate-900">3.24M</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Sanctioned for AY 2024-25</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
            Enrolment Upload Rate
          </span>
          <div className="text-2xl font-extrabold text-brand-700">89.8%</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            ↑ 4.2% YoY Improvement
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
            Active Anomaly Cases
          </span>
          <div className="text-2xl font-extrabold text-rose-600">{issues.length}</div>
          <span className="text-[11px] text-rose-700 font-medium mt-1 block">
            Assigned to Compliance Desk
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle">
          <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
            Cross-Institute Dual Flags
          </span>
          <div className="text-2xl font-extrabold text-amber-600">87</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Simultaneous enrolments</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'overview'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Regional Distribution & Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('institutions')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'institutions'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Institution Compliance Directory ({institutions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'rules'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Regulatory Rule Engine ({rules.length} Rules Active)</span>
        </button>

        <button
          onClick={() => setActiveTab('apis')}
          className={`pb-3 px-4 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'apis'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ExternalLink className="w-4 h-4" />
          <span>REST API Gateway (Req #7)</span>
        </button>
      </div>

      {/* Tab 1: Regional Heat Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              AICTE Regional Offices — Enrolment & Compliance Heatmap
            </h3>
            <span className="text-xs text-slate-500">Live AICTE Central Synchronisation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((reg, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-600" />
                      {reg.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">{reg.states}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                    {reg.complianceRate}% Comp.
                  </span>
                </div>

                <div className="space-y-2.5 text-xs mt-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Approved Colleges</span>
                    <span className="font-semibold text-slate-900">{reg.colleges.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Enrolled vs Approved Intake</span>
                    <span className="font-semibold text-slate-900">
                      {(reg.enrolled / 1000).toFixed(0)}k / {(reg.intake / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full"
                      style={{ width: `${reg.complianceRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500">Unresolved Anomaly Flags</span>
                    <span className="font-bold text-rose-600">{reg.alerts} cases</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Institutions Directory */}
      {activeTab === 'institutions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search college by name, AICTE code, or state..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
              />
            </div>
            <span className="text-xs text-slate-500">Showing {filteredInstitutions.length} institutions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Institution Name & AICTE Code</th>
                  <th className="py-3 px-4">Region / State</th>
                  <th className="py-3 px-4">Sanctioned vs Enrolled</th>
                  <th className="py-3 px-4">Data Quality Score</th>
                  <th className="py-3 px-4">Regulatory Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredInstitutions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        AICTE: {item.aicteCode} • AISHE: {item.aisheCode}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{item.state}</div>
                      <div className="text-[11px] text-slate-500">{item.region}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {item.totalEnrolled} / {item.totalApprovedIntake} Seats
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {Math.round((item.totalEnrolled / item.totalApprovedIntake) * 100)}% Capacity
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-emerald-600 text-sm">
                        {item.dataQualityScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'Compliant' ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold text-[11px]">
                          Compliant
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-semibold text-[11px]">
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setRole('institution');
                          showToast(`Opened institutional dashboard for ${item.name}.`, 'info');
                        }}
                        className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <span>View Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Regulatory Rule Configuration */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              AICTE Validation Rule Configuration Engine
            </h3>
            <p className="text-xs text-slate-500">
              Configure validation thresholds applied to all college batch submissions in real-time.
            </p>
          </div>

          <div className="space-y-4">
            {rules.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{r.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-100 text-brand-800">
                      {r.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{r.description}</p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Parameter: <span className="font-semibold text-slate-800">{r.parameterValue} {r.unit || ''}</span> • Last Updated: {r.lastUpdated}
                  </div>
                </div>

                <button
                  onClick={() => toggleRule(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors"
                >
                  {r.isActive ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                      <span>Enforcing</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                      <span>Disabled</span>
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: REST API Gateway & Institutional Integration (SIH Req #7) */}
      {activeTab === 'apis' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5 animate-fade-in-scale">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                AICTE Interoperable REST API Gateway (SIH Requirement #7)
              </h3>
              <p className="text-xs text-slate-500">
                Secure enterprise REST endpoints allowing college ERP systems to synchronize admissions, validate APAAR IDs, and query intake compliance in real time.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono text-xs font-semibold">
              OpenAPI 3.0 Ready
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Endpoint 1 */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[11px]">
                  POST
                </span>
                <span className="text-white font-semibold">/api/v1/institutions/upload</span>
                <span className="text-slate-400 font-sans text-[11px] ml-auto">
                  Bulk Student Records Ingestion
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Uploads batch records with APAAR format validation, intake cap verification, and duplicate isolation.
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg text-emerald-400 text-[11px] overflow-x-auto">
                {`{ "institutionId": "inst-001", "aicteCode": "1-938210331", "batchYear": "2024", "records": [ { "apaarId": "9823-4412-8819", "name": "Aarav Sharma", "courseCode": "BTECH-CSE", "quota": "General" } ] }`}
              </div>
            </div>

            {/* Endpoint 2 */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[11px]">
                  GET
                </span>
                <span className="text-white font-semibold">/api/v1/apaar/validate/:apaarId</span>
                <span className="text-slate-400 font-sans text-[11px] ml-auto">
                  Algorithmic & NAD Verification Check
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Validates 12-digit format, Verhoeff checksum, and queries whether the ID is already enrolled in another institution.
              </p>
            </div>

            {/* Endpoint 3 */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[11px]">
                  GET
                </span>
                <span className="text-white font-semibold">/api/v1/intake/compliance/:aicteCode</span>
                <span className="text-slate-400 font-sans text-[11px] ml-auto">
                  Live Intake vs Sanctioned Thresholds
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Returns branch-wise sanctioned seats, actual enrolment count, and supernumerary NRI (5%) / FN (15%) quota status.
              </p>
            </div>

            {/* Endpoint 4 */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[11px]">
                  GET
                </span>
                <span className="text-white font-semibold">/api/v1/credentials/verify/:token</span>
                <span className="text-slate-400 font-sans text-[11px] ml-auto">
                  Zero-Knowledge Public Verification
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Permits authorized verifiers and employers to check degree claims with redacted personal demographic attributes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
