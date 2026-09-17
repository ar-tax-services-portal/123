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
import { ClientProfileEntitiesSection } from './client/ClientProfileEntitiesSection';
import { ClientBookkeepingSection } from './client/ClientBookkeepingSection';
import { ClientJournalLedgerSection } from './client/ClientJournalLedgerSection';
import { ClientBankConnectionsSection } from './client/ClientBankConnectionsSection';
import { ClientAccountingConnectionsSection } from './client/ClientAccountingConnectionsSection';
import { ClientReconciliationSection } from './client/ClientReconciliationSection';
import { ClientFinancialReportsSection } from './client/ClientFinancialReportsSection';
import { ClientTaxReadinessSection } from './client/ClientTaxReadinessSection';
import { ClientEstimatedTaxesSection } from './client/ClientEstimatedTaxesSection';
import { ClientMessagesTasksSection } from './client/ClientMessagesTasksSection';
import { ClientLenderPackageSection } from './client/ClientLenderPackageSection';
import { ClientAmendmentsClosureSection } from './client/ClientAmendmentsClosureSection';
import { ClientPriorArchiveSection } from './client/ClientPriorArchiveSection';
import { ClientSettingsConsentSection } from './client/ClientSettingsConsentSection';
import { ClientHelpSupportSection } from './client/ClientHelpSupportSection';

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
            {currentTab === 'entities' && 'Entity Profiles, Org Chart & Beneficial Ownership'}
            {currentTab === 'vault' && 'Secure Document Vault & Records'}
            {currentTab === 'questionnaire' && 'Tax Organizer & Intake Questionnaire'}
            {currentTab === 'bookkeeping' && 'Transaction Register & Bookkeeping Classification'}
            {currentTab === 'journal' && 'General Journal, Trial Balance & Fixed Assets'}
            {currentTab === 'bank_feeds' && 'Bank Feeds & Direct Aggregation Connections'}
            {currentTab === 'accounting_sync' && 'Cloud Accounting Sync & COA Tax Mapping'}
            {currentTab === 'reconciliation' && 'Bank & Credit Card Statement Reconciliation'}
            {currentTab === 'financial_reports' && 'Financial Statements & Management Reports'}
            {currentTab === 'ledger' && 'Income & Expense Workpapers'}
            {currentTab === 'return_review' && 'Draft Return Review & Form 8879-S Authorization'}
            {currentTab === 'readiness' && 'Tax Readiness & Statutory Compliance Scorecard'}
            {currentTab === 'estimated_tax' && 'Estimated Tax & Safe Harbor Vouchers'}
            {currentTab === 'advisory' && 'Tax Advisory, Strategy & Scenario Forecast'}
            {currentTab === 'tax_planning' && 'Tax Strategy Forecast & Scenario Modeler'}
            {currentTab === 'voice_assistant' && 'TaxGuard Voice Assistant'}
            {currentTab === 'messages' && 'Secure Messages, Inquiries & Actionable Tasks'}
            {currentTab === 'lender_package' && 'Credit, Lender & Underwriting Package Portal'}
            {currentTab === 'amendments' && 'Tax Return Amendments & Entity Dissolutions'}
            {currentTab === 'billing' && 'Fee Invoices & Payments'}
            {currentTab === 'notices' && 'Tax Notices, Audits & IRS Transcripts'}
            {currentTab === 'archive' && 'Prior Year Tax Archive & Multi-Year History'}
            {currentTab === 'settings' && 'Security, Consents & Authorized Representatives'}
            {currentTab === 'support' && 'Client Support, Tax Knowledge Base & Contacts'}
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

      {/* TAB: ENTITIES & OWNERSHIP */}
      {currentTab === 'entities' && (
        <ClientProfileEntitiesSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
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

      {/* TAB: BOOKKEEPING & REGISTERS */}
      {currentTab === 'bookkeeping' && (
        <ClientBookkeepingSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
          onNavigateToVault={() => setTab('vault')}
        />
      )}

      {/* TAB: GENERAL JOURNAL & TRIAL BALANCE */}
      {currentTab === 'journal' && (
        <ClientJournalLedgerSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
          onNavigateToReports={() => setTab('financial_reports')}
        />
      )}

      {/* TAB: BANK FEEDS & AGGREGATION */}
      {currentTab === 'bank_feeds' && (
        <ClientBankConnectionsSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
          onNavigateToBookkeeping={() => setTab('bookkeeping')}
        />
      )}

      {/* TAB: ACCOUNTING SYNC */}
      {currentTab === 'accounting_sync' && (
        <ClientAccountingConnectionsSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: RECONCILIATION */}
      {currentTab === 'reconciliation' && (
        <ClientReconciliationSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
          onNavigateToVault={() => setTab('vault')}
        />
      )}

      {/* TAB: FINANCIAL REPORTS */}
      {currentTab === 'financial_reports' && (
        <ClientFinancialReportsSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
          onNavigateToLenderPackage={() => setTab('lender_package')}
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

      {/* TAB: TAX READINESS */}
      {currentTab === 'readiness' && (
        <ClientTaxReadinessSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
          onNavigateToSignatures={() => setTab('return_review')}
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
        <ClientEstimatedTaxesSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: SECURE MESSAGES & TASKS */}
      {currentTab === 'messages' && (
        <ClientMessagesTasksSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
          onNavigateToVault={() => setTab('vault')}
          onNavigateToOrganizer={() => setTab('questionnaire')}
          onNavigateToSignatures={() => setTab('return_review')}
        />
      )}

      {/* TAB: LENDER PACKAGE */}
      {currentTab === 'lender_package' && (
        <ClientLenderPackageSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: AMENDMENTS & CLOSURES */}
      {currentTab === 'amendments' && (
        <ClientAmendmentsClosureSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: VOICE ASSISTANT */}
      {currentTab === 'voice_assistant' && (
        <div className="pt-1">
          <TaxGuardVoiceAssistant userRole="client" />
        </div>
      )}

      {/* TAB: ARCHIVE */}
      {currentTab === 'archive' && (
        <ClientPriorArchiveSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: SETTINGS & CONSENTS */}
      {currentTab === 'settings' && (
        <ClientSettingsConsentSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
      )}

      {/* TAB: HELP & SUPPORT */}
      {currentTab === 'support' && (
        <ClientHelpSupportSection
          clientId="cli_perotti"
          onOpenAssistant={() => setAssistantModalOpen(true)}
        />
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
