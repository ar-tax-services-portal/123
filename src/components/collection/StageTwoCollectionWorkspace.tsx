/**
 * A/R Tax Services, LLC - Stage 02 Collection Workspace
 * Unified 18-Stage Tax Operating Workflow — Milestone M2 / Stage 02: Collect
 *
 * Implements:
 * - TG-COL-001: Centralized Tax-Year Collection Workspace
 *   Organized around: Client ID + Engagement + Tax Year + Entity/Return Type
 *   Access to: Document Checklist, Upload Center, Document Vault, Missing Documents,
 *              Document Requests, Processing Status, Exceptions, Human Review, Collection Readiness.
 * - TG-COL-002: Dynamic Rules-Driven Document Checklist Integration with Stable Requirement IDs
 * - TG-COL-003: Secure Upload Center Integration with SHA-256 Hashing, Unique Document IDs, & Audit Logging
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  UploadCloud,
  FolderLock,
  AlertCircle,
  Inbox,
  Sparkles,
  Eye,
  ShieldCheck,
  Building2,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  FileText,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Hash,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  Info,
  Layers,
  Camera,
  X,
  Plus
} from 'lucide-react';

import {
  StageTwoCollectionService,
  ChecklistRequirement,
  StageTwoUploadedDocument,
  CollectionReadinessReport,
  TaxYearCollectionWorkspaceContext,
  CollectionDocumentStatus
} from '../../services/stageTwoCollectionService';
import { StagedSecurityDocument } from '../../services/stageTwoIntakeSecurityService';

import { UploadScanCenterSection } from '../../demo/views/client/UploadScanCenterSection';
import { ClientVaultSection } from '../../demo/views/client/ClientVaultSection';
import { MissingDocumentsSection } from '../../demo/views/client/MissingDocumentsSection';
import { ClientDocumentRequestsView } from '../../demo/views/client/ClientSubViews';
import { AccountantReviewStatusSection } from '../../demo/views/client/AccountantReviewStatusSection';
import { DemoVaultService } from '../../demo/services/clientDashboardServices';

interface StageTwoCollectionWorkspaceProps {
  clientId?: string;
  selectedTaxYear: number;
  onTaxYearChange?: (year: number) => void;
  initialSubTab?: 'checklist' | 'upload' | 'vault' | 'missing' | 'requests' | 'processing' | 'security' | 'exceptions' | 'review' | 'readiness';
  onOpenAssistant?: () => void;
}

export const StageTwoCollectionWorkspace: React.FC<StageTwoCollectionWorkspaceProps> = ({
  clientId: propClientId,
  selectedTaxYear,
  onTaxYearChange,
  initialSubTab = 'checklist',
  onOpenAssistant
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'checklist' | 'upload' | 'vault' | 'missing' | 'requests' | 'processing' | 'security' | 'exceptions' | 'review' | 'readiness'
  >(initialSubTab);

  const [workspaceVersion, setWorkspaceVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Direct Upload Modal State (TG-COL-003)
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetRequirement, setTargetRequirement] = useState<ChecklistRequirement | null>(null);
  const [uploadCategory, setUploadCategory] = useState('Tax Return & Supporting Schedule');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);

  // Reusable vault service
  const vaultService = useMemo(() => new DemoVaultService(), []);

  // 1. Resolve Workspace Context (TG-COL-001)
  const context = useMemo<TaxYearCollectionWorkspaceContext>(() => {
    return StageTwoCollectionService.getWorkspaceContext(propClientId, selectedTaxYear);
  }, [propClientId, selectedTaxYear, workspaceVersion]);

  // 2. Fetch Requirements & Readiness (TG-COL-002)
  const requirements = useMemo<ChecklistRequirement[]>(() => {
    return StageTwoCollectionService.getRequirements(context.clientId, context.taxYear);
  }, [context.clientId, context.taxYear, workspaceVersion]);

  const readiness = useMemo<CollectionReadinessReport>(() => {
    return StageTwoCollectionService.evaluateCollectionReadiness(context.clientId, context.taxYear);
  }, [context.clientId, context.taxYear, workspaceVersion]);

  const uploadedDocs = useMemo<StageTwoUploadedDocument[]>(() => {
    return StageTwoCollectionService.getUploadedDocuments(context.clientId, context.taxYear);
  }, [context.clientId, context.taxYear, workspaceVersion]);

  // Sprint 2 Security & Quarantine Docs
  const stagedDocs = useMemo<StagedSecurityDocument[]>(() => {
    return StageTwoCollectionService.getStagedSecurityDocuments(context.clientId, context.taxYear);
  }, [context.clientId, context.taxYear, workspaceVersion]);

  const quarantinedDocs = useMemo<StagedSecurityDocument[]>(() => {
    return StageTwoCollectionService.getQuarantinedDocuments(context.clientId);
  }, [context.clientId, workspaceVersion]);

  // Quarantine disposition state (TG-COL-008)
  const [selectedQuarantineDoc, setSelectedQuarantineDoc] = useState<StagedSecurityDocument | null>(null);
  const [dispositionReason, setDispositionReason] = useState('');
  const [dispositionRole, setDispositionRole] = useState<'admin' | 'cpa' | 'compliance'>('cpa');
  const [dispositionStatusMessage, setDispositionStatusMessage] = useState<string | null>(null);

  const handleDisposition = (disposition: 'CLEARED' | 'REJECTED' | 'DELETED_DISPOSED') => {
    if (!selectedQuarantineDoc) return;
    if (!dispositionReason.trim()) {
      alert('A compliance or operational justification is required to disposition quarantined files.');
      return;
    }
    try {
      StageTwoCollectionService.dispositionQuarantinedDocument({
        documentId: selectedQuarantineDoc.documentId,
        actor: `Staff User (${dispositionRole.toUpperCase()})`,
        actorRole: dispositionRole,
        disposition,
        reason: dispositionReason
      });
      setDispositionStatusMessage(`Document ${selectedQuarantineDoc.documentId} marked as ${disposition}.`);
      setSelectedQuarantineDoc(null);
      setDispositionReason('');
      setWorkspaceVersion(v => v + 1);
      setTimeout(() => setDispositionStatusMessage(null), 3000);
    } catch (err: any) {
      alert(`Disposition failed: ${err.message}`);
    }
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    requirements.forEach(r => set.add(r.category));
    return Array.from(set).sort();
  }, [requirements]);

  // Filtered requirements
  const filteredRequirements = useMemo(() => {
    return requirements.filter(r => {
      const matchSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.formNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requirementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;

      const matchCategory =
        selectedCategoryFilter === 'ALL' || r.category === selectedCategoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [requirements, searchQuery, selectedStatusFilter, selectedCategoryFilter]);

  // Handle requirement status update
  const handleStatusChange = (reqId: string, newStatus: CollectionDocumentStatus) => {
    StageTwoCollectionService.updateRequirementStatus(
      context.clientId,
      context.taxYear,
      reqId,
      newStatus,
      'client',
      'Status manually toggled in Collection Workspace'
    );
    setWorkspaceVersion(v => v + 1);
  };

  // Handle opening upload for specific requirement
  const handleOpenUploadForReq = (req: ChecklistRequirement) => {
    setTargetRequirement(req);
    setUploadCategory(req.category);
    setUploadFile(null);
    setUploadErrorMessage(null);
    setUploadSuccessMessage(null);
    setUploadModalOpen(true);
  };

  // Submit direct upload (TG-COL-003)
  const handleExecuteUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadErrorMessage('Please select a file to upload.');
      return;
    }

    setIsSubmittingUpload(true);
    setUploadErrorMessage(null);

    try {
      const ingested = await StageTwoCollectionService.ingestDocumentUpload({
        clientId: context.clientId,
        engagementId: context.engagementId,
        taxYear: context.taxYear,
        uploaderSource: 'client_portal',
        uploadedBy: 'Client Portal User',
        originalFileName: uploadFile.name,
        fileSizeBytes: uploadFile.size,
        mimeType: uploadFile.type || 'application/pdf',
        claimedCategory: uploadCategory,
        associatedRequirementId: targetRequirement ? targetRequirement.requirementId : undefined,
        file: uploadFile
      });

      setUploadSuccessMessage(
        `Successfully ingested file with Document ID: ${ingested.documentId}. SHA-256: ${ingested.sha256Hash.substring(0, 12)}... (Status: Received — Awaiting Staff Verification)`
      );
      setUploadFile(null);
      setWorkspaceVersion(v => v + 1);

      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      setUploadErrorMessage(err.message || 'Failed to ingest document.');
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  return (
    <div className="space-y-6" id="stage-two-collection-workspace">
      {/* ========================================================================= */}
      {/* 1. TOP CONTEXT BAR: Client ID + Engagement + Tax Year + Entity/Return Type */}
      {/* ========================================================================= */}
      <div className="bg-[#061A2F] text-white border border-[#1A365D] rounded-xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#D7AC4A] text-[#061A2F] rounded-xs uppercase tracking-wider">
                Stage 02: Collect
              </span>
              <span className="px-2 py-0.5 text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 rounded-xs flex items-center gap-1">
                <Hash className="w-3 h-3 text-slate-400" />
                <span>Client ID: {context.clientId}</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 rounded-xs">
                {context.engagementId}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#D7AC4A] flex-shrink-0" />
                <span>{context.entityName}</span>
              </h1>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-sm text-slate-300 font-medium">
                {context.returnType}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>Jurisdictions: <strong className="text-slate-200">{context.jurisdictions.join(', ')}</strong></span>
              <span>•</span>
              <span>Assigned Preparer: <strong className="text-slate-200">{context.assignedPreparer}</strong></span>
              <span>•</span>
              <span>Assigned Reviewer: <strong className="text-slate-200">{context.assignedReviewer}</strong></span>
            </div>
          </div>

          {/* Tax Year Selection & Readiness Summary */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="tax-year-select" className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#D7AC4A]" />
                <span>Tax Year:</span>
              </label>
              <select
                id="tax-year-select"
                value={context.taxYear}
                onChange={(e) => onTaxYearChange && onTaxYearChange(parseInt(e.target.value, 10))}
                className="px-3 py-1.5 bg-[#031323] border border-slate-700 rounded-md text-xs font-mono font-bold text-white focus:outline-hidden focus:border-[#D7AC4A]"
              >
                {[2025, 2024, 2023, 2022].map(yr => (
                  <option key={yr} value={yr}>CY {yr}</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center gap-4 w-full sm:w-auto">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Collection Readiness
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold font-mono text-[#D7AC4A]">
                    {readiness.readinessScore}%
                  </span>
                  <span className="text-xs text-slate-300">
                    ({readiness.receivedCount} of {readiness.requiredCount} required received)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab('readiness')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors ml-auto"
              >
                Gate Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. COLLECTION WORKSPACE SUB-NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="bg-white border border-neutral-300 rounded-lg p-1.5 flex flex-wrap items-center gap-1 shadow-xs">
        {[
          { id: 'checklist', label: 'Document Checklist', icon: CheckSquare, count: requirements.length },
          { id: 'upload', label: 'Upload Center', icon: UploadCloud },
          { id: 'vault', label: 'Document Vault', icon: FolderLock },
          { id: 'missing', label: 'Missing Documents', icon: AlertCircle, count: readiness.missingCount, badgeColor: 'bg-rose-100 text-rose-800' },
          { id: 'requests', label: 'Document Requests', icon: Inbox },
          { id: 'processing', label: 'Processing Status', icon: Sparkles, count: uploadedDocs.length },
          { id: 'security', label: 'Security & Staging', icon: ShieldAlert, count: quarantinedDocs.length > 0 ? quarantinedDocs.length : undefined, badgeColor: 'bg-rose-100 text-rose-800' },
          { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle },
          { id: 'review', label: 'Human Review', icon: Eye },
          { id: 'readiness', label: 'Collection Readiness', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors ${
                isActive
                  ? 'bg-[#061A2F] text-white shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#D7AC4A]' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-slate-800 text-slate-200'
                      : tab.badgeColor || 'bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT VIEWS */}
      {/* ========================================================================= */}

      {/* SUB-TAB: CHECKLIST (TG-COL-002) */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-neutral-300 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requirement by title, form number, or ID..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-hidden focus:border-[#0A2544]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-neutral-500" />
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="text-xs border border-neutral-300 rounded-md px-2 py-1.5 bg-white text-neutral-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Required">Required</option>
                  <option value="Requested">Requested</option>
                  <option value="Received">Received</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Missing">Missing</option>
                  <option value="Superseded">Superseded</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="text-xs border border-neutral-300 rounded-md px-2 py-1.5 bg-white text-neutral-700"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setTargetRequirement(null);
                setUploadCategory('General Supporting Documentation');
                setUploadFile(null);
                setUploadModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#061A2F] hover:bg-[#0A2544] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-[#D7AC4A]" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Requirements Table / Grid */}
          <div className="space-y-3">
            {filteredRequirements.map((req) => (
              <div
                key={req.requirementId}
                className="p-4 bg-white border border-neutral-300 hover:border-neutral-400 rounded-lg shadow-xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 rounded">
                      {req.requirementId}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-800 rounded">
                      {req.formNumber}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 rounded">
                      {req.category}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono text-neutral-600 bg-neutral-50 rounded">
                      {req.jurisdiction}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900">{req.title}</h3>
                  <p className="text-xs text-neutral-600 line-clamp-2">{req.description}</p>

                  {req.statutoryBasis && (
                    <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#D7AC4A]" />
                      <span>Authority: {req.statutoryBasis}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-200">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-neutral-500">Status:</span>
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.requirementId, e.target.value as CollectionDocumentStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded border ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : req.status === 'Received' || req.status === 'Under Review'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : req.status === 'Missing' || req.status === 'Required'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                      }`}
                    >
                      <option value="Required">Required</option>
                      <option value="Requested">Requested</option>
                      <option value="Received">Received</option>
                      <option value="Processing">Processing</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Missing">Missing</option>
                      <option value="Superseded">Superseded</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleOpenUploadForReq(req)}
                    className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Attach Upload</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredRequirements.length === 0 && (
              <div className="p-8 text-center bg-neutral-50 border border-dashed border-neutral-300 rounded-lg text-neutral-500 text-xs">
                No checklist requirements matched your active filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: UPLOAD CENTER (TG-COL-003) */}
      {activeSubTab === 'upload' && (
        <div className="space-y-6">
          <UploadScanCenterSection
            selectedYear={context.taxYear}
            onDocumentProcessed={(doc) => {
              // Automatically ingest into Stage 02 Collection Service
              StageTwoCollectionService.ingestDocumentUpload({
                clientId: context.clientId,
                engagementId: context.engagementId,
                taxYear: context.taxYear,
                uploaderSource: 'scanner_intake',
                uploadedBy: 'Client Portal Scanner',
                originalFileName: doc.name || 'scanned_tax_document.pdf',
                fileSizeBytes: doc.sizeBytes || 250000,
                mimeType: doc.type || 'application/pdf',
                claimedCategory: doc.classificationSuggestion || 'Scanned Document'
              });
              setWorkspaceVersion(v => v + 1);
            }}
            onNavigateToAiPipeline={() => setActiveSubTab('processing')}
          />
        </div>
      )}

      {/* SUB-TAB: DOCUMENT VAULT */}
      {activeSubTab === 'vault' && (
        <div className="space-y-6">
          <ClientVaultSection
            vaultService={vaultService}
            clientId={context.clientId}
            onOpenAssistant={onOpenAssistant || (() => {})}
          />
        </div>
      )}

      {/* SUB-TAB: MISSING DOCUMENTS */}
      {activeSubTab === 'missing' && (
        <div className="space-y-6">
          <MissingDocumentsSection
            selectedYear={context.taxYear}
            onNavigateToUpload={() => setActiveSubTab('upload')}
            onOpenAssistant={onOpenAssistant || (() => {})}
          />
        </div>
      )}

      {/* SUB-TAB: DOCUMENT REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-6">
          <ClientDocumentRequestsView
            onNavigateToUpload={() => setActiveSubTab('upload')}
          />
        </div>
      )}

      {/* SUB-TAB: PROCESSING STATUS */}
      {activeSubTab === 'processing' && (
        <div className="p-6 bg-white border border-neutral-300 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Ingested Documents & Processing Pipeline</h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Every uploaded document receives a unique Document ID, client-side SHA-256 validation, and remains unverified until staff examination.
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 rounded">
              {uploadedDocs.length} Total Ingested
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.documentId}
                className="p-4 border border-neutral-300 rounded-lg bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white border border-neutral-300 rounded text-neutral-800">
                      {doc.documentId}
                    </span>
                    <span className="text-xs font-bold text-neutral-900">{doc.originalFileName}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {(doc.fileSizeBytes / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                    <span>Category: <strong>{doc.claimedCategory}</strong></span>
                    <span>•</span>
                    <span>Uploaded: {new Date(doc.uploadTimestamp).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">SHA-256: {doc.sha256Hash.substring(0, 16)}...</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] pt-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-semibold text-[10px]">
                      {doc.processingStatus}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      doc.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {doc.isVerified ? 'Staff Verified' : 'Unverified (Pending Review)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSubTab('vault')}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded text-xs font-medium"
                  >
                    View in Vault
                  </button>
                </div>
              </div>
            ))}

            {uploadedDocs.length === 0 && (
              <div className="p-8 text-center bg-neutral-50 border border-dashed border-neutral-300 rounded-lg text-neutral-500 text-xs">
                No documents uploaded yet for Tax Year {context.taxYear}. Use the Upload Center or Attach Upload button above to submit records.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: SECURITY & ISOLATED STAGING (M2 SPRINT 2) */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          {/* 1. Critical Invariants Callout */}
          <div className="p-4 bg-[#061A2F] border border-[#1A365D] rounded-xl text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#D7AC4A]">
                <ShieldAlert className="w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  M2 Stage 02 Security Pipeline & Invariant Boundaries
                </h2>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1A365D] text-slate-200 border border-slate-600 rounded">
                Sprint 2 Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Boundary 1</div>
                <div className="font-bold text-amber-300 mt-0.5">Upload ≠ Verified</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  A successful document receipt only confirms ingestion into staging. Verification requires full accounting inspection.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Boundary 2</div>
                <div className="font-bold text-amber-300 mt-0.5">Clean Scan ≠ Tax Verified</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Passing signature, archive, and malware screening does not certify that tax numbers or schedules are accurate.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Boundary 3</div>
                <div className="font-bold text-amber-300 mt-0.5">Encrypted Storage ≠ Human Reviewed</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  AES-256-GCM vault storage protects confidentiality at rest; CPA human sign-off remains mandatory before filing.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Boundary 4</div>
                <div className="font-bold text-emerald-400 mt-0.5">OCR Gate Locked</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Downstream OCR & AI extraction engines are strictly blocked from accessing any document that has not cleared all security gates.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Quarantine Alert & Queue (TG-COL-008) */}
          {quarantinedDocs.length > 0 && (
            <div className="p-5 bg-rose-50 border border-rose-300 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-900">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h3 className="text-sm font-bold">Active Quarantine Queue ({quarantinedDocs.length} Flagged)</h3>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-rose-200 text-rose-900 rounded">
                  Isolated from Vault & OCR
                </span>
              </div>

              <p className="text-xs text-rose-800">
                These documents were intercepted by signature, archive bomb, or malware detection heuristics. They cannot be downloaded normally or forwarded to OCR processing.
              </p>

              {dispositionStatusMessage && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded text-xs">
                  {dispositionStatusMessage}
                </div>
              )}

              <div className="space-y-3">
                {quarantinedDocs.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="p-4 bg-white border border-rose-200 rounded-lg shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300 rounded">
                          {doc.documentId}
                        </span>
                        <span className="text-xs font-bold text-neutral-900">{doc.originalFilename}</span>
                        <span className="text-[10px] text-rose-700 font-mono">
                          Status: {doc.quarantineStatus}
                        </span>
                      </div>
                      <p className="text-xs text-rose-800 font-medium">
                        Reason: {doc.quarantineReason || 'Security scan threat detection triggered'}
                      </p>
                      <div className="text-[11px] text-neutral-500 flex flex-wrap items-center gap-2 font-mono">
                        <span>Scanner: {doc.malwareScannerName}</span>
                        <span>•</span>
                        <span>Detected Type: {doc.signatureValidation.detectedFileType}</span>
                        <span>•</span>
                        <span>Quarantined: {doc.quarantineTimestamp ? new Date(doc.quarantineTimestamp).toLocaleString() : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSelectedQuarantineDoc(doc)}
                        className="px-3 py-1.5 bg-rose-800 hover:bg-rose-900 text-white rounded text-xs font-semibold"
                      >
                        Review Disposition
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disposition Action Form */}
              {selectedQuarantineDoc && (
                <div className="p-4 bg-white border border-neutral-300 rounded-lg shadow-sm space-y-3 mt-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="text-xs font-bold text-neutral-900">
                      Quarantine Disposition for {selectedQuarantineDoc.documentId} ({selectedQuarantineDoc.originalFilename})
                    </span>
                    <button
                      onClick={() => setSelectedQuarantineDoc(null)}
                      className="text-xs text-neutral-500 hover:text-neutral-800"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Authorized Role
                      </label>
                      <select
                        value={dispositionRole}
                        onChange={(e) => setDispositionRole(e.target.value as any)}
                        className="w-full px-2 py-1.5 border border-neutral-300 rounded bg-white text-xs"
                      >
                        <option value="cpa">CPA (Reviewer)</option>
                        <option value="compliance">Compliance Officer</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Compliance / Operational Reason (Mandatory)
                      </label>
                      <input
                        type="text"
                        value={dispositionReason}
                        onChange={(e) => setDispositionReason(e.target.value)}
                        placeholder="e.g. Verified harmless test artifact / Verified false positive"
                        className="w-full px-2 py-1.5 border border-neutral-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleDisposition('REJECTED')}
                      className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded text-xs font-semibold"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => handleDisposition('DELETED_DISPOSED')}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-semibold"
                    >
                      Permanently Delete
                    </button>
                    <button
                      onClick={() => handleDisposition('CLEARED')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
                    >
                      Release & Clear Quarantine
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Isolated File Staging Registry Table (TG-COL-004) */}
          <div className="p-6 bg-white border border-neutral-300 rounded-lg shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <FolderLock className="w-5 h-5 text-[#0A2544]" />
                  <span>Isolated File Staging Registry</span>
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Tracks all inbound documents through staging, MIME validation, anti-malware, and encryption gates.
                </p>
              </div>

              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 rounded self-start sm:self-auto">
                {stagedDocs.length} Documents in Registry
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-200 rounded-lg">
                <thead className="bg-neutral-50 text-neutral-700 uppercase font-mono text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="p-3">Document ID</th>
                    <th className="p-3">Filename & Size</th>
                    <th className="p-3">Uploader</th>
                    <th className="p-3">MIME / Signature</th>
                    <th className="p-3">Malware Scan</th>
                    <th className="p-3">Encryption</th>
                    <th className="p-3">Integrity (SHA-256)</th>
                    <th className="p-3">OCR Ready</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {stagedDocs.map((doc) => (
                    <tr key={doc.documentId} className="hover:bg-neutral-50/50">
                      <td className="p-3 font-mono font-bold text-neutral-900">
                        {doc.documentId}
                        <div className="text-[10px] text-neutral-500 font-normal">v{doc.provenance.versionNumber}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-neutral-900 max-w-[180px] truncate" title={doc.originalFilename}>
                          {doc.originalFilename}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-500">
                          {(doc.fileSizeBytes / 1024).toFixed(1)} KB • {doc.claimedCategory}
                        </div>
                      </td>

                      <td className="p-3 text-neutral-600">
                        <div>{doc.uploader}</div>
                        <div className="text-[10px] font-mono text-neutral-400">{doc.uploaderSource}</div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.signatureValidation.validationResult === 'PASSED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}>
                          {doc.signatureValidation.validationResult}
                        </span>
                        <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                          {doc.signatureValidation.detectedFileType}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.malwareScanStatus === 'CLEAN'
                            ? 'bg-emerald-100 text-emerald-900'
                            : doc.malwareScanStatus === 'INFECTED'
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {doc.malwareScanStatus}
                        </span>
                        <div className="text-[9px] font-mono text-neutral-500 mt-0.5 truncate max-w-[120px]" title={doc.malwareScannerName}>
                          {doc.malwareScannerName}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {doc.encryptionMetadata?.algorithm || 'AES-256-GCM'}
                        </span>
                        <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                          {doc.encryptionStatus}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.integrityRecord.integrityVerificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}>
                          {doc.integrityRecord.integrityVerificationStatus}
                        </span>
                        <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                          {doc.integrityRecord.originalHash.substring(0, 10)}...
                        </div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.isReadyForOcr
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {doc.isReadyForOcr ? 'GATE OPEN' : 'BLOCKED'}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {stagedDocs.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-neutral-500 text-xs">
                        No staged documents in intake registry for Tax Year {context.taxYear}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Subsystems Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-neutral-300 rounded-lg shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#0A2544]">
                <ShieldCheck className="w-4 h-4 text-[#D7AC4A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">MIME Magic Byte Validation</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                TG-COL-005 verifies file headers against binary signatures (%PDF-, PNG, JPEG, TIFF). Dangerous executable headers (MZ, ELF, scripts) are blocked before ingestion.
              </p>
            </div>

            <div className="p-4 bg-white border border-neutral-300 rounded-lg shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#0A2544]">
                <Layers className="w-4 h-4 text-[#D7AC4A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Archive Bomb Protection</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                TG-COL-006 enforces a 100:1 maximum decompression ratio, 100MB uncompressed limit, and nested zip detection before unpacking archives.
              </p>
            </div>

            <div className="p-4 bg-white border border-neutral-300 rounded-lg shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#0A2544]">
                <FolderLock className="w-4 h-4 text-[#D7AC4A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider">7-Year IRS Preservation</h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                TG-COL-011 preserves all superseded records with version provenance. Document replacement creates a new version while retaining original audit trails.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: EXCEPTIONS */}
      {activeSubTab === 'exceptions' && (
        <div className="p-6 bg-white border border-neutral-300 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold">Exceptions & Diagnostic Flags</h2>
          </div>
          <p className="text-xs text-neutral-600">
            Automated integrity and compliance exceptions identified across your uploaded records.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Tax Year Verification Check</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-900 rounded">
                  Flagged for Staff
                </span>
              </div>
              <p className="text-xs text-amber-800">
                Any document detected with a calendar year mismatch against active Tax Year {context.taxYear} is quarantined for human accountant sign-off.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Chain of Custody & Non-Alteration</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 rounded">
                  Enforced
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Cryptographic SHA-256 hashes generated at intake guarantee uploaded tax records cannot be modified after receipt.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: HUMAN REVIEW */}
      {activeSubTab === 'review' && (
        <div className="space-y-6">
          <AccountantReviewStatusSection />
        </div>
      )}

      {/* SUB-TAB: COLLECTION READINESS (EXIT GATE PREVIEW) */}
      {activeSubTab === 'readiness' && (
        <div className="p-6 bg-white border border-neutral-300 rounded-lg shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D7AC4A]" />
                <span>Stage 02 Collection Readiness Scorecard</span>
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Evaluation of all mandatory requirements before transitioning to Stage 03 (Validate) and Gate 2 clearance.
              </p>
            </div>

            <div className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold border ${
              readiness.stageTwoGateStatus === 'READY_FOR_REVIEW'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : readiness.stageTwoGateStatus === 'IN_PROGRESS'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-neutral-100 text-neutral-800 border-neutral-300'
            }`}>
              Gate Status: {readiness.stageTwoGateStatus}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Total Requirements</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">{readiness.totalRequirements}</div>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Mandatory Required</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">{readiness.requiredCount}</div>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Received Records</div>
              <div className="text-2xl font-bold font-mono text-blue-700 mt-1">{readiness.receivedCount}</div>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
              <div className="text-[10px] text-neutral-500 uppercase font-semibold">Missing Mandatory</div>
              <div className="text-2xl font-bold font-mono text-rose-700 mt-1">{readiness.missingCount}</div>
            </div>
          </div>

          {/* Blocking items list */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Gate 2 Blocking Conditions ({readiness.blockingItems.length})
            </h3>

            {readiness.blockingItems.map((item, i) => (
              <div
                key={i}
                className="p-3 bg-rose-50/60 border border-rose-200 rounded text-xs text-rose-900 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}

            {readiness.blockingItems.length === 0 && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>All mandatory document collection criteria satisfied. Ready for Stage 03 Validation and Pre-Filing Gate 2 certification.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DIRECT UPLOAD MODAL (TG-COL-003) */}
      {/* ========================================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-neutral-300 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Secure Document Ingestion</h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Direct upload into Stage 02 Collection Workspace with SHA-256 verification.
                </p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {targetRequirement && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <div className="font-bold text-slate-900">Target Requirement: {targetRequirement.title}</div>
                <div className="text-[11px] font-mono text-slate-600">ID: {targetRequirement.requirementId} • Form: {targetRequirement.formNumber}</div>
              </div>
            )}

            <form onSubmit={handleExecuteUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Document Category
                </label>
                <input
                  type="text"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-hidden focus:border-[#0A2544]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Select File (PDF, PNG, JPEG, TIFF)
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#061A2F] file:text-white hover:file:bg-[#0A2544]"
                  required
                />
              </div>

              {uploadSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded text-xs">
                  {uploadSuccessMessage}
                </div>
              )}

              {uploadErrorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded text-xs">
                  {uploadErrorMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpload || !uploadFile}
                  className="px-4 py-2 bg-[#061A2F] hover:bg-[#0A2544] disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 text-[#D7AC4A]" />
                  <span>{isSubmittingUpload ? 'Hashing & Ingesting...' : 'Ingest Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
