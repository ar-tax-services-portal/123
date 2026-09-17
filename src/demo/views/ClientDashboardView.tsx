/**
 * A/R Tax Services, LLC - Client / Taxpayer Demonstration Dashboard
 * Comprehensive 35+ function taxpayer portal with strict black-and-white theme.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  DemoClient, 
  DemoEngagement, 
  DemoDocument, 
  DemoInvoice, 
  DemoTransaction 
} from '../types';
import { demoDataStore } from '../services/DemoDataService';
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
  Lock,
  Camera
} from 'lucide-react';
import { 
  DocumentScanner, 
  DocumentUploadQueue, 
  MissingItemsPanel, 
  VerificationPanel,
  EstimatedPaymentsCenter,
  TaxGuardVoiceAssistant,
  TaxPlanningScenarioModeler
} from '../../taxguard';
import {
  DemoOverviewService,
  DemoVaultService,
  DemoOrganizerService,
  DemoIncomeExpenseService,
  DemoReturnReviewService,
  DemoInvoiceService,
  DemoNoticeService,
  DemoAdvisoryService,
  ClientDashboardOverview
} from '../services/clientDashboardServices';
import { ClientOverviewSection } from './client/ClientOverviewSection';
import { ClientVaultSection } from './client/ClientVaultSection';
import { ClientOrganizerSection } from './client/ClientOrganizerSection';
import { ClientIncomeExpensesSection } from './client/ClientIncomeExpensesSection';
import { ClientReturnReviewSection } from './client/ClientReturnReviewSection';
import { ClientInvoicesSection } from './client/ClientInvoicesSection';
import { ClientNoticesSection } from './client/ClientNoticesSection';
import { ClientAdvisorySection } from './client/ClientAdvisorySection';
import { ClientAssistantModal } from './client/ClientAssistantModal';

interface ClientDashboardViewProps {
  onOpenAiAssistant: () => void;
  activeNavId?: string;
  onSelectNav?: (id: string) => void;
}

export const ClientDashboardView: React.FC<ClientDashboardViewProps> = ({ 
  onOpenAiAssistant,
  activeNavId,
  onSelectNav
}) => {
  const [client, setClient] = useState<DemoClient | undefined>(undefined);
  const [engagements, setEngagements] = useState<DemoEngagement[]>([]);
  const [documents, setDocuments] = useState<DemoDocument[]>([]);
  const [invoices, setInvoices] = useState<DemoInvoice[]>([]);
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);

  // Discretion & Privacy Mode (Phase 8 & 23)
  const [discretionMode, setDiscretionMode] = useState<boolean>(true);

  // Live Camera Scanner State
  const [showScanner, setShowScanner] = useState<boolean>(false);

  // Active tab within Client Portal - drives or synchronizes with left sidebar
  const [internalTab, setInternalTab] = useState<string>('overview');
  const currentTab = activeNavId || internalTab;
  const setTab = onSelectNav || setInternalTab;

  // Modal State
  const [modalAction, setModalAction] = useState<SimulatedActionType | null>(null);
  const [selectedEngagement, setSelectedEngagement] = useState<DemoEngagement | undefined>(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<DemoInvoice | undefined>(undefined);

  // Modular Client Dashboard Services
  const overviewService = useMemo(() => new DemoOverviewService(), []);
  const vaultService = useMemo(() => new DemoVaultService(), []);
  const organizerService = useMemo(() => new DemoOrganizerService(), []);
  const incomeExpenseService = useMemo(() => new DemoIncomeExpenseService(), []);
  const returnService = useMemo(() => new DemoReturnReviewService(), []);
  const invoiceService = useMemo(() => new DemoInvoiceService(), []);
  const noticeService = useMemo(() => new DemoNoticeService(), []);
  const advisoryService = useMemo(() => new DemoAdvisoryService(), []);

  // Overview data and assistant modal state
  const [overviewData, setOverviewData] = useState<ClientDashboardOverview | null>(null);
  const [assistantModalOpen, setAssistantModalOpen] = useState<boolean>(false);

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
    overviewService.getOverview('cli_perotti').then(setOverviewData);
  };

  useEffect(() => {
    refresh();
    return demoDataStore.subscribe(refresh);
  }, [overviewService]);

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
      {/* 1. Portal Workspace Header & Discretion Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8DCE2] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#061A2F]">
            {currentTab === 'overview' && 'Client Overview & Active Filing Status'}
            {currentTab === 'vault' && 'Secure Document Vault & Records'}
            {currentTab === 'questionnaire' && 'Tax Organizer & Intake Questionnaire'}
            {currentTab === 'ledger' && 'Income & Expense Workpapers'}
            {currentTab === 'return_review' && 'Draft Return Review & Form 8879-S Authorization'}
            {currentTab === 'estimated_tax' && 'Estimated Tax & Safe Harbor Vouchers'}
            {currentTab === 'tax_planning' && 'Tax Strategy Forecast & Scenario Modeler'}
            {currentTab === 'voice_assistant' && 'TaxGuard Voice Assistant'}
            {currentTab === 'billing' && 'Fee Invoices & Payments'}
            {currentTab === 'notices' && 'Tax Notices & Transcripts'}
            {currentTab === 'archive' && 'Prior Year Tax Archive'}
          </h2>
          <p className="text-xs text-[#667085]">
            A/R Tax Services, LLC • Client Demonstration Portal
          </p>
        </div>

        {/* UHNW Privacy / Discretion Mode Toggle */}
        <button
          onClick={() => setDiscretionMode(!discretionMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
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

      {/* 2. TAB WORKSPACE SECTIONS */}

      {/* TAB: OVERVIEW */}
      {currentTab === 'overview' && (
        overviewData ? (
          <ClientOverviewSection
            overview={overviewData}
            onNavigate={(sec) => setTab(sec)}
            onOpenAssistant={() => setAssistantModalOpen(true)}
          />
        ) : (
          <div className="p-8 text-center text-xs font-mono text-[#667085] bg-white border border-[#D8DCE2] rounded-lg">
            Loading Client Overview &amp; Filing Dossier...
          </div>
        )
      )}

      {/* TAB: SECURE DOCUMENT VAULT */}
      {currentTab === 'vault' && (
        <ClientVaultSection
          vaultService={vaultService}
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: QUESTIONNAIRE & ORGANIZER */}
      {currentTab === 'questionnaire' && (
        <ClientOrganizerSection
          organizerService={organizerService}
          clientId="cli_perotti"
          onNavigateToVault={() => setTab('vault')}
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: LEDGER & EXPENSES */}
      {currentTab === 'ledger' && (
        <ClientIncomeExpensesSection
          incomeExpenseService={incomeExpenseService}
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: RETURN REVIEW & SIGNATURE */}
      {currentTab === 'return_review' && (
        <ClientReturnReviewSection
          returnService={returnService}
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: BILLING & INVOICES */}
      {currentTab === 'billing' && (
        <ClientInvoicesSection
          invoiceService={invoiceService}
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: TAX NOTICES & CONTROVERSY */}
      {currentTab === 'notices' && (
        <ClientNoticesSection
          noticeService={noticeService}
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: ADVISORY & SCENARIO MODELING */}
      {(currentTab === 'advisory' || currentTab === 'tax_planning') && (
        <ClientAdvisorySection
          advisoryService={advisoryService}
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: ESTIMATED TAX & SAFE HARBOR */}
      {currentTab === 'estimated_tax' && (
        <div className="pt-1">
          <EstimatedPaymentsCenter userRole="client" />
        </div>
      )}

      {/* TAB: VOICE ASSISTANT */}
      {currentTab === 'voice_assistant' && (
        <div className="pt-1">
          <TaxGuardVoiceAssistant userRole="client" />
        </div>
      )}

      {/* TAB: ARCHIVE */}
      {currentTab === 'archive' && (
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
            <div className="border border-[#D8DCE2] p-3.5 rounded bg-[#FBFAF7] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#061A2F]">Tax Year 2023 Form 1120-S Final Package</div>
                <div className="text-[11px] font-mono text-[#667085]">Filed March 14, 2024 • IRS Accepted</div>
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

      {/* Client Assistant Modal */}
      <ClientAssistantModal
        isOpen={assistantModalOpen}
        onClose={() => setAssistantModalOpen(false)}
        currentSection={currentTab}
        clientId="cli_perotti"
      />
    </div>
  );
};
