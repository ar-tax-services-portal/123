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
  Plus
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
      {/* 1. Portal Sub-Nav / Modules */}
      <div className="border-b border-neutral-300 flex flex-wrap gap-1 text-xs">
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
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-black text-black font-bold'
                : 'border-transparent text-neutral-600 hover:text-black hover:border-neutral-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Primary Active Engagement Card with Master 12-Stage Cycle */}
      {activeEngagement && (
        <div className="border border-neutral-300 bg-white p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                Active Tax Filing Engagement • Tax Year {activeEngagement.taxYear}
              </div>
              <h2 className="text-base font-bold text-black uppercase">
                {activeEngagement.formType} — {activeEngagement.businessName || activeEngagement.clientName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-black px-2.5 py-1 text-xs font-bold uppercase bg-white text-black">
                Status: {activeEngagement.currentStatus}
              </span>
              <span className="border border-neutral-300 px-2 py-1 text-xs font-mono text-neutral-600">
                Due: {activeEngagement.statutoryDeadline}
              </span>
            </div>
          </div>

          {/* Master 12-Stage Visual Progress */}
          <WorkCycleProgress currentStage={activeEngagement.currentStage} />

          {/* Key Engagement Metrics & Next Step */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="border border-neutral-200 p-3 bg-neutral-50 space-y-1">
              <span className="font-bold uppercase text-[10px] text-neutral-500">Assigned Practice Team</span>
              <div className="text-black font-medium">{activeEngagement.assignedStaff}</div>
            </div>
            <div className="border border-neutral-200 p-3 bg-neutral-50 space-y-1">
              <span className="font-bold uppercase text-[10px] text-neutral-500">Immediate Next Step</span>
              <div className="text-black font-medium">{activeEngagement.nextAction}</div>
            </div>
            <div className="border border-neutral-200 p-3 bg-neutral-50 space-y-1">
              <span className="font-bold uppercase text-[10px] text-neutral-500">Your Action Required</span>
              <div className="text-black font-medium">{activeEngagement.clientResponsibility}</div>
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
            <div className="border border-neutral-300 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                Priority Action Items For You
              </h3>

              {/* Ready for review card */}
              {activeEngagement?.approvalState === 'Reviewer Approved' && (
                <div className="border border-black p-4 bg-neutral-50 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-black text-xs">
                    <PenTool className="w-4 h-4" />
                    <span>Your 2025 Form 1120-S is Ready for Review &amp; Signature</span>
                  </div>
                  <p className="text-xs text-neutral-700">
                    Elena Rostova, CPA has certified your return workpapers. Please inspect the draft return and authorize simulated Form 8879-S electronic filing.
                  </p>
                  <button
                    onClick={() => setActiveTab('return_review')}
                    className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                  >
                    Open Return Review Workspace
                  </button>
                </div>
              )}

              {/* Outstanding Fee Invoices */}
              {invoices.some(i => i.balanceDue > 0) && (
                <div className="border border-neutral-300 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black uppercase">Outstanding Professional Fee</span>
                    <span className="font-mono text-xs font-bold">$3,250.00 Balance</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Invoice INV-2026-0144 covers Form 1120-S preparation and Q4 bookkeeping close.
                  </p>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="px-4 py-1.5 border border-black text-xs font-bold uppercase hover:bg-neutral-100"
                  >
                    View &amp; Simulate Payment
                  </button>
                </div>
              )}

              {/* Missing Documents Warning */}
              {activeEngagement?.missingRequirements && activeEngagement.missingRequirements.length > 0 && (
                <div className="border border-neutral-300 p-4 space-y-2">
                  <div className="font-bold text-black text-xs uppercase">
                    Pending Documentation Requests ({activeEngagement.missingRequirements.length})
                  </div>
                  <ul className="text-xs text-neutral-700 space-y-1">
                    {activeEngagement.missingRequirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-black" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setActiveTab('vault')}
                    className="px-3 py-1 border border-neutral-300 text-xs font-medium hover:border-black"
                  >
                    Upload Missing Records
                  </button>
                </div>
              )}
            </div>

            {/* Estimated Tax Payment Calendar */}
            <div className="border border-neutral-300 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                Estimated Tax Payment Calendar (Tax Year 2026)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { quarter: 'Q1 Estimated', due: 'April 15, 2026', amount: '$3,800.00' },
                  { quarter: 'Q2 Estimated', due: 'June 15, 2026', amount: '$3,800.00' },
                  { quarter: 'Q3 Estimated', due: 'Sept 15, 2026', amount: '$3,800.00' },
                  { quarter: 'Q4 Estimated', due: 'Jan 15, 2027', amount: '$3,800.00' }
                ].map((q, i) => (
                  <div key={i} className="border border-neutral-200 p-2.5 bg-neutral-50 space-y-1">
                    <span className="font-bold text-black text-[11px]">{q.quarter}</span>
                    <div className="text-[10px] text-neutral-500 font-mono">Due: {q.due}</div>
                    <div className="font-bold text-black font-mono">{q.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Assigned Team & AI Concierge Card */}
          <div className="space-y-4">
            <div className="border border-neutral-300 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                Your Assigned Advisory Team
              </h3>
              <div className="space-y-2 text-xs">
                <div className="border border-neutral-200 p-2.5">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Managing Principal</span>
                  <div className="font-bold text-black">Desmond Hinds, MSA</div>
                  <div className="text-[11px] text-neutral-600">founder@artaxservices.com</div>
                </div>
                <div className="border border-neutral-200 p-2.5">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Senior Reviewer &amp; CPA</span>
                  <div className="font-bold text-black">Elena Rostova, CPA</div>
                  <div className="text-[11px] text-neutral-600">e.rostova@artaxservices.com</div>
                </div>
                <div className="border border-neutral-200 p-2.5">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Tax Preparer</span>
                  <div className="font-bold text-black">Marcus Vance, EA</div>
                  <div className="text-[11px] text-neutral-600">m.vance.ea@artaxservices.com</div>
                </div>
              </div>
            </div>

            <div className="border border-black p-4 space-y-3 bg-neutral-50">
              <div className="flex items-center gap-2 font-bold uppercase text-xs text-black">
                <Sparkles className="w-4 h-4" />
                <span>Client Tax Concierge</span>
              </div>
              <p className="text-xs text-neutral-700">
                Ask questions about your home office deduction, mileage logging, or document requirements.
              </p>
              <button
                onClick={onOpenAiAssistant}
                className="w-full py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
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
          <div className="border border-neutral-300 p-5 bg-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              <span>Upload Tax &amp; Accounting Records</span>
            </h3>
            <p className="text-xs text-neutral-600">
              Files are evaluated client-side with simulated SHA-256 cryptographic hashing and simulated anti-malware verification.
            </p>

            <form onSubmit={handleSimulatedUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-black mb-1">
                  Document / File Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2025_Mileage_Log_Final.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 focus:outline-none focus:border-black rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-black mb-1">
                  Document Category:
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 bg-white focus:outline-none focus:border-black rounded-none"
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
                  className="w-full py-2 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 disabled:bg-neutral-300"
                >
                  {isUploading ? 'Computing SHA-256...' : 'Simulate Secure Upload'}
                </button>
              </div>
            </form>
          </div>

          {/* Document Vault Table */}
          <div className="border border-neutral-300 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                Uploaded Dossier Records ({documents.length})
              </h4>
              <span className="text-[11px] font-mono text-neutral-500">
                SHA-256 Verified • Sandbox Storage
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-mono uppercase text-neutral-600">
                    <th className="p-2">File Name</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Size</th>
                    <th className="p-2">Uploaded At</th>
                    <th className="p-2">Malware Status</th>
                    <th className="p-2">Dossier Status</th>
                    <th className="p-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutral-50">
                      <td className="p-2 font-mono font-medium text-black">
                        {doc.fileName}
                      </td>
                      <td className="p-2 text-neutral-700">{doc.category}</td>
                      <td className="p-2 font-mono text-neutral-500">{doc.fileSize}</td>
                      <td className="p-2 font-mono text-neutral-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <span className="border border-black px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-black">
                          {doc.malwareScanStatus}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className="border border-neutral-300 px-1.5 py-0.5 text-[10px] font-medium">
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => alert(`Demonstration download initiated for ${doc.fileName}`)}
                          className="p-1 border border-neutral-300 hover:border-black"
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
        <div className="border border-neutral-300 p-5 space-y-4">
          <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                Annual Tax Organizer &amp; Questionnaire (TY2025)
              </h3>
              <p className="text-xs text-neutral-600">
                Responses auto-save to demonstration memory as you update fields.
              </p>
            </div>
            <span className="text-[11px] font-mono border border-black px-2 py-0.5 bg-neutral-50 font-bold">
              Autosave: Active
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 border border-neutral-200 space-y-2">
              <label className="block font-bold uppercase text-[11px] text-black">
                1. Did your business purchase or place in service new machinery or equipment in 2025?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5">
                  <input type="radio" name="q1" defaultChecked className="border border-black" />
                  <span>Yes (qualifies for Section 179 depreciation review)</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="radio" name="q1" className="border border-black" />
                  <span>No new equipment additions</span>
                </label>
              </div>
            </div>

            <div className="p-3 border border-neutral-200 space-y-2">
              <label className="block font-bold uppercase text-[11px] text-black">
                2. Total business miles driven in personal or company vehicle:
              </label>
              <input
                type="text"
                defaultValue="14,820 miles"
                className="w-full max-w-xs px-3 py-1.5 border border-neutral-300 text-xs font-mono"
              />
            </div>

            <div className="p-3 border border-neutral-200 space-y-2">
              <label className="block font-bold uppercase text-[11px] text-black">
                3. Total home office square footage and dedicated workspace description:
              </label>
              <input
                type="text"
                defaultValue="280 sq ft dedicated administrative executive office"
                className="w-full px-3 py-1.5 border border-neutral-300 text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert('Demonstration: Questionnaire responses saved.')}
                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800"
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
          <div className="border border-neutral-300 p-4 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                Income &amp; Expense Transaction Inbox
              </h3>
              <p className="text-xs text-neutral-600">
                Synced from First Citizens Commercial Checking and Amex Business Platinum.
              </p>
            </div>
            <button
              onClick={() => setModalAction('connect_bank')}
              className="px-3 py-1.5 border border-black text-xs font-bold uppercase hover:bg-neutral-100"
            >
              Simulate Bank Feed Sync
            </button>
          </div>

          <div className="border border-neutral-300 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-50 text-[10px] font-mono uppercase text-neutral-600">
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5">Account</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-right">Amount</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50">
                    <td className="p-2.5 font-mono text-neutral-600">{t.date}</td>
                    <td className="p-2.5 font-medium text-black">{t.description}</td>
                    <td className="p-2.5 text-neutral-600 font-mono text-[11px]">{t.account}</td>
                    <td className="p-2.5 text-neutral-800">{t.category}</td>
                    <td className={`p-2.5 font-mono font-bold text-right ${t.type === 'credit' ? 'text-black' : 'text-neutral-800'}`}>
                      {t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-right">
                      <span className="border border-neutral-300 px-1.5 py-0.5 text-[10px] font-mono">
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
          <div className="border border-neutral-300 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                  Prepared Tax Return Review &amp; Client Authorization
                </h3>
                <p className="text-xs text-neutral-600">
                  Carefully examine your completed draft return before providing electronic signature authorization.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="border border-black px-2.5 py-1 text-xs font-bold uppercase">
                  Approval State: {activeEngagement?.approvalState}
                </span>
              </div>
            </div>

            {/* Document Viewer Preview Box */}
            <div className="border border-neutral-300 bg-neutral-50 p-6 text-center space-y-3">
              <div className="inline-flex p-3 border border-black bg-white">
                <FileText className="w-8 h-8 text-black" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-black text-sm uppercase">
                  Draft Form 1120-S &amp; SC1120S Client Review Package (Tax Year 2025)
                </div>
                <div className="text-xs text-neutral-600 font-mono">
                  File Size: 4.80 MB • Pages: 14 • Certified by Elena Rostova, CPA
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => alert('Demonstration: Opening Form 1120-S review copy.')}
                  className="px-4 py-1.5 border border-black text-xs font-bold uppercase hover:bg-neutral-100"
                >
                  Download Draft Review PDF
                </button>
              </div>
            </div>

            {/* Signature Authorization Trigger */}
            <div className="border border-black p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                    Form 8879-S IRS E-File Authorization Signature
                  </h4>
                  <p className="text-xs text-neutral-600">
                    Signing authorizes A/R Tax Services, LLC to electronically transmit your corporate return to the IRS and SC DOR.
                  </p>
                </div>
                {activeEngagement?.approvalState === 'Signed & Ready to File' || activeEngagement?.approvalState === 'Filed (Simulated)' ? (
                  <span className="border border-black px-3 py-1 font-bold text-xs bg-black text-white">
                    Signature Certified (Simulated)
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedEngagement(activeEngagement);
                      setModalAction('sign_return');
                    }}
                    className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                  >
                    Sign Form 8879-S (Simulated)
                  </button>
                )}
              </div>
            </div>

            {/* Send Correction Request */}
            <div className="border border-neutral-300 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                Request Return Corrections or Clarifications
              </h4>
              <p className="text-xs text-neutral-600">
                Notice an error or missing deduction? Submit details directly to your assigned CPA review team.
              </p>

              {correctionSuccess && (
                <div className="border border-black p-2.5 text-xs font-bold text-black bg-neutral-50">
                  Correction request submitted and logged to practice audit ledger.
                </div>
              )}

              <form onSubmit={handleSubmitCorrection} className="space-y-2">
                <textarea
                  rows={3}
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  placeholder="Type specific corrections needed on Line items, partner distributions, or business expenses..."
                  className="w-full p-2.5 text-xs border border-neutral-300 focus:outline-none focus:border-black rounded-none"
                />
                <button
                  type="submit"
                  disabled={!correctionNote.trim()}
                  className="px-4 py-1.5 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white disabled:opacity-40"
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
          <div className="border border-neutral-300 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">
              Professional Service Invoices &amp; Retainers
            </h3>
            <p className="text-xs text-neutral-600">
              Clear, transparent billing for corporate tax preparation and bookkeeping.
            </p>
          </div>

          <div className="border border-neutral-300 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-50 text-[10px] font-mono uppercase text-neutral-600">
                  <th className="p-2.5">Invoice #</th>
                  <th className="p-2.5">Date Issued</th>
                  <th className="p-2.5">Due Date</th>
                  <th className="p-2.5 text-right">Total Fee</th>
                  <th className="p-2.5 text-right">Balance Due</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50">
                    <td className="p-2.5 font-mono font-bold text-black">{inv.invoiceNumber}</td>
                    <td className="p-2.5 font-mono text-neutral-600">{inv.issueDate}</td>
                    <td className="p-2.5 font-mono text-neutral-600">{inv.dueDate}</td>
                    <td className="p-2.5 font-mono text-right">${inv.amount.toFixed(2)}</td>
                    <td className="p-2.5 font-mono font-bold text-right text-black">
                      ${inv.balanceDue.toFixed(2)}
                    </td>
                    <td className="p-2.5">
                      <span className="border border-black px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase">
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
                          className="px-3 py-1 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800"
                        >
                          Simulate Payment
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-neutral-500 font-bold">
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
        <div className="border border-neutral-300 p-5 space-y-4">
          <div className="border-b border-neutral-200 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">
              IRS &amp; State Department of Revenue Notices
            </h3>
            <p className="text-xs text-neutral-600">
              Active tax controversy records, examination responses, and official IRS transcripts.
            </p>
          </div>

          <div className="border border-neutral-200 p-4 bg-neutral-50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-black text-xs">
              <CheckCircle className="w-4 h-4 text-black" />
              <span>Clean Transcript Status (Perotti Capital Holdings LLC)</span>
            </div>
            <p className="text-xs text-neutral-700">
              Zero active examination notices or CP2000 discrepancy letters for Tax Year 2024 or 2025.
            </p>
          </div>
        </div>
      )}

      {/* TAB: ARCHIVE */}
      {activeTab === 'archive' && (
        <div className="border border-neutral-300 p-5 space-y-4">
          <div className="border-b border-neutral-200 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">
              Prior Year Tax Return Archive
            </h3>
            <p className="text-xs text-neutral-600">
              Statutory 7-year retention vault for prior filed corporate returns.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="border border-neutral-200 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-black">Tax Year 2024 Form 1120-S Final Package</div>
                <div className="text-[11px] font-mono text-neutral-500">Filed March 12, 2025 • IRS Accepted</div>
              </div>
              <button
                onClick={() => alert('Demonstration archive downloaded.')}
                className="px-3 py-1 border border-neutral-300 hover:border-black font-medium"
              >
                Download Return
              </button>
            </div>
          </div>
        </div>
      )}

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
