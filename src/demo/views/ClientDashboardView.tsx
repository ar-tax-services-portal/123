/**
 * A/R Tax Services, LLC - Client / Taxpayer Demonstration Dashboard
 * Comprehensive 35+ function taxpayer portal with strict black-and-white theme.
 */

import React, { useState, useEffect } from 'react';
import { 
  DemoClient, 
  DemoEngagement, 
  DemoDocument, 
  DemoInvoice, 
  DemoTransaction 
} from '../types';
import { demoDataStore } from '../services/DemoDataService';
import { WorkCycleProgress } from '../components/WorkCycleProgress';
import { SimulatedActionModal, SimulatedActionType } from '../components/SimulatedActionModal';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  PenTool, 
  MessageSquare, 
  Download, 
  ShieldCheck, 
  Folder, 
  Calendar,
  DollarSign,
  Clock,
  Sparkles,
  Send,
  Plus,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';

interface ClientDashboardViewProps {
  onOpenAiAssistant: () => void;
}

export const ClientDashboardView: React.FC<ClientDashboardViewProps> = ({ onOpenAiAssistant }) => {
  const [client, setClient] = useState<DemoClient | undefined>(undefined);
  const [engagements, setEngagements] = useState<DemoEngagement[]>([]);
  const [documents, setDocuments] = useState<DemoDocument[]>([]);
  const [invoices, setInvoices] = useState<DemoInvoice[]>([]);
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);

  // Discretion & Privacy Mode (Phase 8 & 23)
  const [discretionMode, setDiscretionMode] = useState<boolean>(true);

  // Active tab within Client Portal
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'questionnaire' | 'ledger' | 'return_review' | 'billing' | 'notices' | 'archive'>('overview');

  // Modal State
  const [modalAction, setModalAction] = useState<SimulatedActionType | null>(null);
  const [selectedEngagement, setSelectedEngagement] = useState<DemoEngagement | undefined>(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<DemoInvoice | undefined>(undefined);

  // Correction feedback note
  const [correctionNote, setCorrectionNote] = useState('');
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  // File upload simulation
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Form W-2 (Wage Statement)');
  const [isUploading, setIsUploading] = useState(false);

  // Refresh data from store
  const refresh = () => {
    const currentClient = demoDataStore.getClientById('cli_perotti');
    setClient(currentClient);
    const allEngs = demoDataStore.getEngagements().filter(e => e.clientId === 'cli_perotti');
    setEngagements(allEngs);
    const docs = demoDataStore.getDocumentsByClient('cli_perotti');
    setDocuments(docs);
    const invs = demoDataStore.getInvoices().filter(i => i.clientId === 'cli_perotti');
    setInvoices(invs);
    const txns = demoDataStore.getTransactions().filter(t => t.clientId === 'cli_perotti');
    setTransactions(txns);
  };

  useEffect(() => {
    refresh();
    return demoDataStore.subscribe(refresh);
  }, []);

  const activeEngagement = engagements.find(e => !e.isArchived) || engagements[0];

  // Helper to mask values if discretionMode is active
  const formatDiscreetAmount = (val: number | string) => {
    if (discretionMode) return '••••••';
    if (typeof val === 'number') {
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return val;
  };

  // Handle simulated upload
  const handleSimulatedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    setIsUploading(true);
    await new Promise(res => setTimeout(res, 400));

    demoDataStore.uploadDocument({
      clientId: 'cli_perotti',
      engagementId: activeEngagement?.id,
      fileName: uploadFileName.endsWith('.pdf') ? uploadFileName : `${uploadFileName}.pdf`,
      fileSize: '1.84 MB',
      fileType: 'application/pdf',
      category: uploadCategory,
      taxYear: 2025,
      uploadedBy: client?.name || 'Michael Perotti',
      notes: 'Uploaded via Client Demonstration Vault'
    });

    setUploadFileName('');
    setIsUploading(false);
  };

  // Submit correction request
  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNote.trim() || !activeEngagement) return;

    demoDataStore.logAudit({
      user: client?.name || 'Michael Perotti',
      role: 'client',
      action: 'Submitted Return Correction Request',
      record: `Engagement: ${activeEngagement.id}`,
      result: 'Warning (Simulated)',
      reason: correctionNote
    });

    setCorrectionSuccess(true);
    setCorrectionNote('');
    setTimeout(() => setCorrectionSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Portal Sub-Nav / Modules & Discretion Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8DCE2] pb-1">
        <div className="flex flex-wrap gap-1 text-xs">
          {[
            { id: 'overview', label: 'Overview & Status' },
            { id: 'vault', label: 'Secure Document Vault' },
            { id: 'questionnaire', label: 'Tax Organizer & Questionnaire' },
            { id: 'ledger', label: 'Income & Expense Records' },
            { id: 'return_review', label: 'Draft Return & Signature' },
            { id: 'billing', label: 'Fee Invoices & Payments' },
            { id: 'notices', label: 'Tax Notices & Transcripts' },
            { id: 'archive', label: 'Prior Year Archive' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 font-medium transition-all text-xs border-b-2 -mb-[1px] ${
                activeTab === tab.id
                  ? 'border-[#C99A32] text-[#061A2F] font-bold bg-[#FBFAF7]'
                  : 'border-transparent text-[#667085] hover:text-[#061A2F] hover:border-[#D8DCE2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* UHNW Privacy / Discretion Mode Toggle */}
        <button
          onClick={() => setDiscretionMode(!discretionMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
            discretionMode
              ? 'bg-[#F7F4ED] border-[#C99A32]/60 text-[#061A2F]'
              : 'bg-white border-[#D8DCE2] text-[#667085] hover:text-[#061A2F]'
          }`}
          title="Toggle sensitive balance and identifier masking for high-net-worth privacy"
        >
          {discretionMode ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-[#C99A32]" />
              <span className="font-semibold text-[11px]">Discretion Mode: Active</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-[#667085]" />
              <span className="text-[11px]">Discretion Mode: Revealed</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Primary Active Engagement Card with Master 12-Stage Cycle */}
      {activeEngagement && (
        <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D8DCE2] pb-3.5">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#667085] flex items-center gap-2">
                <span>Active Tax Filing Engagement</span>
                <span>•</span>
                <span>Tax Year {activeEngagement.taxYear}</span>
                <span>•</span>
                <span className="text-[#C99A32] font-semibold">TIN: {discretionMode ? '••-••••890' : '82-9104890'}</span>
              </div>
              <h2 className="text-base font-bold text-[#061A2F] tracking-tight mt-0.5">
                {activeEngagement.formType} — {activeEngagement.businessName || activeEngagement.clientName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-[#C99A32]/40 px-3 py-1 text-xs font-semibold uppercase bg-[#F7F4ED] text-[#061A2F] rounded">
                Status: {activeEngagement.currentStatus}
              </span>
              <span className="border border-[#D8DCE2] px-2.5 py-1 text-xs font-mono text-[#667085] bg-[#FBFAF7] rounded">
                Statutory Due: {activeEngagement.statutoryDeadline}
              </span>
            </div>
          </div>

          {/* Master 12-Stage Visual Progress */}
          <WorkCycleProgress currentStage={activeEngagement.currentStage} />

          {/* Key Engagement Metrics & Next Step */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
            <div className="border border-[#D8DCE2] p-3.5 bg-[#FBFAF7] rounded space-y-1">
              <span className="font-bold uppercase text-[10px] text-[#667085] tracking-wider">Assigned Practice Team</span>
              <div className="text-[#061A2F] font-semibold">{activeEngagement.assignedStaff}</div>
            </div>
            <div className="border border-[#D8DCE2] p-3.5 bg-[#FBFAF7] rounded space-y-1">
              <span className="font-bold uppercase text-[10px] text-[#667085] tracking-wider">Immediate Next Step</span>
              <div className="text-[#061A2F] font-semibold">{activeEngagement.nextAction}</div>
            </div>
            <div className="border border-[#D8DCE2] p-3.5 bg-[#FBFAF7] rounded space-y-1">
              <span className="font-bold uppercase text-[10px] text-[#667085] tracking-wider">Your Action Required</span>
              <div className="text-[#061A2F] font-semibold">{activeEngagement.clientResponsibility}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT */}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Action Alerts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                Priority Action Items For You
              </h3>

              {/* Ready for review card */}
              {activeEngagement?.approvalState === 'Reviewer Approved' && (
                <div className="border border-[#C99A32]/40 p-4 bg-[#F7F4ED] rounded space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-[#061A2F] text-xs">
                    <PenTool className="w-4 h-4 text-[#C99A32]" />
                    <span>Your 2025 Form 1120-S is Ready for Review &amp; Signature</span>
                  </div>
                  <p className="text-xs text-[#1A2028] leading-relaxed">
                    Elena Rostova, CPA has certified your return workpapers. Please inspect the draft return and authorize simulated Form 8879-S electronic filing.
                  </p>
                  <button
                    onClick={() => setActiveTab('return_review')}
                    className="px-4 py-2 bg-[#061A2F] text-white text-xs font-semibold tracking-wide rounded hover:bg-[#031323] transition-colors"
                  >
                    Open Return Review Workspace
                  </button>
                </div>
              )}

              {/* Outstanding Fee Invoices */}
              {invoices.some(i => i.balanceDue > 0) && (
                <div className="border border-[#D8DCE2] p-4 bg-[#FBFAF7] rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#061A2F] uppercase">Outstanding Professional Fee</span>
                    <span className="font-mono text-xs font-bold text-[#061A2F]">
                      {formatDiscreetAmount(3250)} Balance
                    </span>
                  </div>
                  <p className="text-xs text-[#667085]">
                    Invoice INV-2026-0144 covers Form 1120-S preparation and Q4 bookkeeping close.
                  </p>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="px-3.5 py-1.5 border border-[#061A2F] text-xs font-semibold text-[#061A2F] rounded hover:bg-[#061A2F] hover:text-white transition-colors"
                  >
                    View &amp; Simulate Payment
                  </button>
                </div>
              )}

              {/* Missing Documents Warning */}
              {activeEngagement?.missingRequirements && activeEngagement.missingRequirements.length > 0 && (
                <div className="border border-[#D8DCE2] p-4 bg-white rounded space-y-2">
                  <div className="font-bold text-[#061A2F] text-xs uppercase flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-[#C99A32]" />
                    <span>Pending Documentation Requests ({activeEngagement.missingRequirements.length})</span>
                  </div>
                  <ul className="text-xs text-[#1A2028] space-y-1.5 pl-1">
                    {activeEngagement.missingRequirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#C99A32] rounded-full" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setActiveTab('vault')}
                    className="px-3.5 py-1.5 border border-[#D8DCE2] text-xs font-medium text-[#061A2F] rounded hover:bg-[#F7F4ED] transition-colors"
                  >
                    Upload Missing Records
                  </button>
                </div>
              )}
            </div>

            {/* Estimated Tax Payment Calendar */}
            <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                Estimated Tax Payment Calendar (Tax Year 2026)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { quarter: 'Q1 Estimated', due: 'April 15, 2026', amount: 3800 },
                  { quarter: 'Q2 Estimated', due: 'June 15, 2026', amount: 3800 },
                  { quarter: 'Q3 Estimated', due: 'Sept 15, 2026', amount: 3800 },
                  { quarter: 'Q4 Estimated', due: 'Jan 15, 2027', amount: 3800 }
                ].map((q, i) => (
                  <div key={i} className="border border-[#D8DCE2] p-3 bg-[#FBFAF7] rounded space-y-1">
                    <span className="font-bold text-[#061A2F] text-[11px]">{q.quarter}</span>
                    <div className="text-[10px] text-[#667085] font-mono">Due: {q.due}</div>
                    <div className="font-bold text-[#061A2F] font-mono">
                      {formatDiscreetAmount(q.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Assigned Team & AI Concierge Card */}
          <div className="space-y-4">
            <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                Your Assigned Advisory Team
              </h3>
              <div className="space-y-2 text-xs">
                <div className="border border-[#D8DCE2] p-3 rounded bg-[#FBFAF7]">
                  <span className="text-[10px] font-mono text-[#667085] uppercase tracking-wider">Managing Principal</span>
                  <div className="font-bold text-[#061A2F]">Desmond Hinds, MSA</div>
                  <div className="text-[11px] text-[#667085]">founder@artaxservices.com</div>
                </div>
                <div className="border border-[#D8DCE2] p-3 rounded bg-[#FBFAF7]">
                  <span className="text-[10px] font-mono text-[#667085] uppercase tracking-wider">Senior Reviewer &amp; CPA</span>
                  <div className="font-bold text-[#061A2F]">Elena Rostova, CPA</div>
                  <div className="text-[11px] text-[#667085]">e.rostova@artaxservices.com</div>
                </div>
                <div className="border border-[#D8DCE2] p-3 rounded bg-[#FBFAF7]">
                  <span className="text-[10px] font-mono text-[#667085] uppercase tracking-wider">Tax Preparer</span>
                  <div className="font-bold text-[#061A2F]">Marcus Vance, EA</div>
                  <div className="text-[11px] text-[#667085]">m.vance.ea@artaxservices.com</div>
                </div>
              </div>
            </div>

            <div className="border border-[#C99A32]/40 rounded-lg p-5 space-y-3 bg-[#F7F4ED] shadow-xs">
              <div className="flex items-center gap-2 font-bold uppercase text-xs text-[#061A2F]">
                <Sparkles className="w-4 h-4 text-[#C99A32]" />
                <span>Client Tax Concierge</span>
              </div>
              <p className="text-xs text-[#1A2028] leading-relaxed">
                Have questions regarding quarterly filing deadlines, mileage logging standards, or document requests? Consult the demonstration assistant.
              </p>
              <button
                onClick={onOpenAiAssistant}
                className="w-full py-2.5 bg-[#061A2F] text-white text-xs font-semibold rounded hover:bg-[#031323] transition-colors"
              >
                Open Demonstration AI Assistant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SECURE DOCUMENT VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          {/* Upload Form */}
          <div className="border border-[#D8DCE2] p-5 bg-white rounded-lg shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F] flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#C99A32]" />
              <span>Upload Tax &amp; Accounting Records</span>
            </h3>
            <p className="text-xs text-[#667085]">
              Uploaded files are evaluated with client-side format checks and simulated SHA-256 cryptographic verification prior to vault ingestion.
            </p>

            <form onSubmit={handleSimulatedUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#061A2F] mb-1">
                  Document / File Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2025_Mileage_Log_Final.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D8DCE2] focus:outline-none focus:border-[#C99A32] rounded bg-[#FBFAF7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#061A2F] mb-1">
                  Document Category:
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D8DCE2] bg-[#FBFAF7] focus:outline-none focus:border-[#C99A32] rounded"
                >
                  <option>Form W-2 (Wage Statement)</option>
                  <option>Form 1099-NEC / 1099-MISC / 1099-K</option>
                  <option>Bank &amp; Credit Card Statements</option>
                  <option>Vehicle Mileage Log</option>
                  <option>Depreciation &amp; Equipment Receipts</option>
                  <option>Home Office Expense Substantiation</option>
                  <option>IRS / State DOR Notice</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isUploading || !uploadFileName.trim()}
                  className="w-full py-2 bg-[#061A2F] text-white text-xs font-semibold rounded hover:bg-[#031323] transition-colors disabled:opacity-40"
                >
                  {isUploading ? 'Computing Verification...' : 'Simulate Secure Upload'}
                </button>
              </div>
            </form>
          </div>

          {/* Document Vault Table */}
          <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#D8DCE2] pb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                Uploaded Dossier Records ({documents.length})
              </h4>
              <span className="text-[11px] font-mono text-[#667085]">
                Access-Controlled Encrypted Vault • Client-Side Verified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8DCE2] bg-[#FBFAF7] text-[10px] font-mono uppercase text-[#667085]">
                    <th className="p-2.5">File Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Uploaded At</th>
                    <th className="p-2.5">Verification</th>
                    <th className="p-2.5">Dossier Status</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8DCE2]">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#FBFAF7] transition-colors">
                      <td className="p-2.5 font-mono font-medium text-[#061A2F]">
                        {discretionMode ? doc.fileName.replace(/^[^_]+/, 'TaxRecord') : doc.fileName}
                      </td>
                      <td className="p-2.5 text-[#1A2028]">{doc.category}</td>
                      <td className="p-2.5 font-mono text-[#667085]">{doc.fileSize}</td>
                      <td className="p-2.5 font-mono text-[#667085]">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2.5">
                        <span className="border border-[#D8DCE2] px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#FBFAF7] text-[#061A2F] rounded">
                          {doc.malwareScanStatus}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className="border border-[#C99A32]/40 bg-[#F7F4ED] text-[#061A2F] px-2 py-0.5 text-[10px] font-semibold rounded">
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => alert(`Demonstration download initiated for ${doc.fileName}`)}
                          className="p-1.5 border border-[#D8DCE2] rounded hover:border-[#061A2F] text-[#061A2F]"
                          title="Download record"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: QUESTIONNAIRE & ORGANIZER */}
      {activeTab === 'questionnaire' && (
        <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-[#D8DCE2] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                Annual Tax Organizer &amp; Questionnaire (TY2025)
              </h3>
              <p className="text-xs text-[#667085]">
                Responses auto-save to demonstration memory as you update fields.
              </p>
            </div>
            <span className="text-[11px] font-mono border border-[#C99A32]/40 px-2.5 py-1 bg-[#F7F4ED] text-[#061A2F] font-bold rounded">
              Autosave: Active
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 border border-[#D8DCE2] bg-[#FBFAF7] rounded space-y-2">
              <label className="block font-bold uppercase text-[11px] text-[#061A2F]">
                1. Did your business purchase or place in service new machinery or equipment in 2025?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="q1" defaultChecked className="text-[#C99A32]" />
                  <span className="text-[#1A2028]">Yes (qualifies for Section 179 depreciation review)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="q1" className="text-[#C99A32]" />
                  <span className="text-[#1A2028]">No new equipment additions</span>
                </label>
              </div>
            </div>

            <div className="p-3.5 border border-[#D8DCE2] bg-[#FBFAF7] rounded space-y-2">
              <label className="block font-bold uppercase text-[11px] text-[#061A2F]">
                2. Total business miles driven in personal or company vehicle:
              </label>
              <input
                type="text"
                defaultValue={discretionMode ? '14,••• miles' : '14,820 miles'}
                className="w-full max-w-xs px-3 py-1.5 border border-[#D8DCE2] rounded text-xs font-mono bg-white"
              />
            </div>

            <div className="p-3.5 border border-[#D8DCE2] bg-[#FBFAF7] rounded space-y-2">
              <label className="block font-bold uppercase text-[11px] text-[#061A2F]">
                3. Total home office square footage and dedicated workspace description:
              </label>
              <input
                type="text"
                defaultValue="280 sq ft dedicated administrative executive office"
                className="w-full px-3 py-1.5 border border-[#D8DCE2] rounded text-xs bg-white"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert('Demonstration: Questionnaire responses saved.')}
                className="px-4 py-2 bg-[#061A2F] text-white text-xs font-semibold rounded hover:bg-[#031323] transition-colors"
              >
                Save Questionnaire Responses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LEDGER & EXPENSES */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                Income &amp; Expense Transaction Inbox
              </h3>
              <p className="text-xs text-[#667085]">
                Synced from First Citizens Commercial Checking and Amex Business Platinum.
              </p>
            </div>
            <button
              onClick={() => setModalAction('connect_bank')}
              className="px-3.5 py-1.5 border border-[#061A2F] text-[#061A2F] text-xs font-semibold rounded hover:bg-[#061A2F] hover:text-white transition-colors"
            >
              Simulate Bank Feed Sync
            </button>
          </div>

          <div className="border border-[#D8DCE2] bg-white rounded-lg shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D8DCE2] bg-[#FBFAF7] text-[10px] font-mono uppercase text-[#667085]">
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5">Account</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-right">Amount</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8DCE2]">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FBFAF7] transition-colors">
                    <td className="p-2.5 font-mono text-[#667085]">{t.date}</td>
                    <td className="p-2.5 font-medium text-[#061A2F]">{t.description}</td>
                    <td className="p-2.5 text-[#667085] font-mono text-[11px]">{t.account}</td>
                    <td className="p-2.5 text-[#1A2028]">{t.category}</td>
                    <td className={`p-2.5 font-mono font-bold text-right ${t.type === 'credit' ? 'text-[#061A2F]' : 'text-[#667085]'}`}>
                      {t.type === 'credit' ? '+' : '-'}{formatDiscreetAmount(t.amount)}
                    </td>
                    <td className="p-2.5 text-right">
                      <span className="border border-[#D8DCE2] bg-[#FBFAF7] px-2 py-0.5 text-[10px] font-mono rounded">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: RETURN REVIEW & SIGNATURE */}
      {activeTab === 'return_review' && (
        <div className="space-y-6">
          <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8DCE2] pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                  Prepared Tax Return Review &amp; Client Authorization
                </h3>
                <p className="text-xs text-[#667085]">
                  Carefully examine your completed draft return before providing electronic signature authorization.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="border border-[#C99A32]/40 bg-[#F7F4ED] text-[#061A2F] px-3 py-1 text-xs font-semibold uppercase rounded">
                  Approval State: {activeEngagement?.approvalState}
                </span>
              </div>
            </div>

            {/* Document Viewer Preview Box */}
            <div className="border border-[#D8DCE2] bg-[#FBFAF7] rounded-lg p-6 text-center space-y-3">
              <div className="inline-flex p-3.5 border border-[#C99A32]/40 bg-white rounded-lg">
                <FileText className="w-8 h-8 text-[#061A2F]" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-[#061A2F] text-sm">
                  Draft Form 1120-S &amp; SC1120S Client Review Package (Tax Year 2025)
                </div>
                <div className="text-xs text-[#667085] font-mono">
                  File Size: 4.80 MB • Pages: 14 • Certified by Elena Rostova, CPA
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => alert('Demonstration: Opening Form 1120-S review copy.')}
                  className="px-4 py-2 border border-[#061A2F] text-xs font-semibold text-[#061A2F] rounded hover:bg-[#061A2F] hover:text-white transition-colors"
                >
                  Download Draft Review PDF
                </button>
              </div>
            </div>

            {/* Signature Authorization Trigger */}
            <div className="border border-[#C99A32]/40 rounded-lg p-5 space-y-3 bg-[#F7F4ED]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                    Form 8879-S IRS E-File Authorization Signature
                  </h4>
                  <p className="text-xs text-[#1A2028]">
                    Signing authorizes A/R Tax Services, LLC to electronically transmit your corporate return to the IRS and SC DOR.
                  </p>
                </div>
                {activeEngagement?.approvalState === 'Signed & Ready to File' || activeEngagement?.approvalState === 'Filed (Simulated)' ? (
                  <span className="border border-[#C99A32] px-3.5 py-1.5 font-bold text-xs bg-[#061A2F] text-white rounded">
                    Signature Certified (Simulated)
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedEngagement(activeEngagement);
                      setModalAction('sign_return');
                    }}
                    className="px-5 py-2.5 bg-[#C99A32] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#D7AC4A] transition-colors"
                  >
                    Sign Form 8879-S (Simulated)
                  </button>
                )}
              </div>
            </div>

            {/* Send Correction Request */}
            <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
                Request Return Corrections or Clarifications
              </h4>
              <p className="text-xs text-[#667085]">
                Notice an error or missing deduction? Submit details directly to your assigned CPA review team.
              </p>

              {correctionSuccess && (
                <div className="border border-[#C99A32]/60 p-3 text-xs font-bold text-[#061A2F] bg-[#F7F4ED] rounded">
                  Correction request submitted and logged to practice audit ledger.
                </div>
              )}

              <form onSubmit={handleSubmitCorrection} className="space-y-2">
                <textarea
                  rows={3}
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  placeholder="Type specific corrections needed on Line items, partner distributions, or business expenses..."
                  className="w-full p-3 text-xs border border-[#D8DCE2] rounded focus:outline-none focus:border-[#C99A32] bg-[#FBFAF7]"
                />
                <button
                  type="submit"
                  disabled={!correctionNote.trim()}
                  className="px-4 py-2 border border-[#061A2F] text-xs font-semibold rounded hover:bg-[#061A2F] hover:text-white transition-colors disabled:opacity-40"
                >
                  Send Correction Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BILLING & INVOICES */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
              Professional Service Invoices &amp; Retainers
            </h3>
            <p className="text-xs text-[#667085]">
              Clear, transparent billing for corporate tax preparation and bookkeeping.
            </p>
          </div>

          <div className="border border-[#D8DCE2] bg-white rounded-lg shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D8DCE2] bg-[#FBFAF7] text-[10px] font-mono uppercase text-[#667085]">
                  <th className="p-2.5">Invoice #</th>
                  <th className="p-2.5">Date Issued</th>
                  <th className="p-2.5">Due Date</th>
                  <th className="p-2.5 text-right">Total Fee</th>
                  <th className="p-2.5 text-right">Balance Due</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8DCE2]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FBFAF7] transition-colors">
                    <td className="p-2.5 font-mono font-bold text-[#061A2F]">{inv.invoiceNumber}</td>
                    <td className="p-2.5 font-mono text-[#667085]">{inv.issueDate}</td>
                    <td className="p-2.5 font-mono text-[#667085]">{inv.dueDate}</td>
                    <td className="p-2.5 font-mono text-right">{formatDiscreetAmount(inv.amount)}</td>
                    <td className="p-2.5 font-mono font-bold text-right text-[#061A2F]">
                      {formatDiscreetAmount(inv.balanceDue)}
                    </td>
                    <td className="p-2.5">
                      <span className="border border-[#D8DCE2] bg-[#FBFAF7] px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      {inv.balanceDue > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setModalAction('pay_invoice');
                          }}
                          className="px-3.5 py-1.5 bg-[#061A2F] text-white text-xs font-semibold rounded hover:bg-[#031323] transition-colors"
                        >
                          Simulate Payment
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-[#C99A32] font-bold">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: NOTICES */}
      {activeTab === 'notices' && (
        <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-[#D8DCE2] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
              IRS &amp; State Department of Revenue Notices
            </h3>
            <p className="text-xs text-[#667085]">
              Active tax controversy records, examination responses, and official IRS transcripts.
            </p>
          </div>

          <div className="border border-[#D8DCE2] p-4 bg-[#FBFAF7] rounded space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#061A2F] text-xs">
              <CheckCircle className="w-4 h-4 text-[#C99A32]" />
              <span>Clean Transcript Status (Perotti Capital Holdings LLC)</span>
            </div>
            <p className="text-xs text-[#1A2028]">
              Zero active examination notices or CP2000 discrepancy letters for Tax Year 2024 or 2025.
            </p>
          </div>
        </div>
      )}

      {/* TAB: ARCHIVE */}
      {activeTab === 'archive' && (
        <div className="border border-[#D8DCE2] bg-white rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-[#D8DCE2] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A2F]">
              Prior Year Tax Return Archive
            </h3>
            <p className="text-xs text-[#667085]">
              Statutory 7-year retention vault for prior filed corporate returns.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="border border-[#D8DCE2] p-3.5 rounded bg-[#FBFAF7] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#061A2F]">Tax Year 2024 Form 1120-S Final Package</div>
                <div className="text-[11px] font-mono text-[#667085]">Filed March 12, 2025 • IRS Accepted</div>
              </div>
              <button
                onClick={() => alert('Demonstration archive downloaded.')}
                className="px-3.5 py-1.5 border border-[#D8DCE2] rounded hover:border-[#061A2F] font-medium text-[#061A2F]"
              >
                Download Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Professional & Regulatory Disclaimers Notice (Phase 6, 8, 23) */}
      <div className="border border-[#D8DCE2] bg-[#FBFAF7] p-4 rounded-lg text-xs text-[#667085] leading-relaxed space-y-1">
        <p className="font-bold text-[#061A2F] uppercase text-[10px] tracking-wider">
          Advisory &amp; Privacy Notice
        </p>
        <p>
          Client engagement files, draft returns, and electronic signature authorizations are access-controlled. Tax outcomes depend strictly on individual client documentation, statutory provisions, and regulatory determinations. A/R Tax Services, LLC is an independent firm and does not guarantee specific refund or examination determinations.
        </p>
      </div>

      {/* Simulated Action Modal */}
      {modalAction && (
        <SimulatedActionModal
          actionType={modalAction}
          engagement={selectedEngagement || activeEngagement}
          invoice={selectedInvoice}
          userRole="client"
          userName={client?.name || 'Michael Perotti'}
          onClose={() => setModalAction(null)}
          onCompleted={() => {
            refresh();
            setModalAction(null);
          }}
        />
      )}
    </div>
  );
};
