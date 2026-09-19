/**
 * A/R Tax Services, LLC - Personalized Document Checklist Engine
 * Compliance with Federal & Multi-State Standards (CA, NY, NC, SC, VA, TN, FL, NJ)
 *
 * Implements:
 * - Dynamic Federal & State tax document requirements center
 * - Accurate state handling (including explicit notices for FL & TN no-income-tax rules)
 * - 8 realistic Demo Taxpayer Profiles with seamless switcher
 * - Interactive Intake Questionnaire Editor allowing real-time rule regeneration
 * - Federal vs State vs Overall Readiness Scorecard
 * - Smart Upload, Camera Scan simulation, OCR data inspection, and Duplicate/Mismatch checks
 * - Rich Document Cards with "Why We Need It", "Where Can I Find It", and "Why Am I Asked For This?"
 * - Professional status override with audit logging
 */

import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Filter,
  UploadCloud,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  Building,
  DollarSign,
  Layers,
  Search,
  Eye,
  Camera,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Sliders,
  UserCheck
} from 'lucide-react';

import {
  PersonalizedDocItem,
  IntakeResponses,
  DocumentCategory,
  TargetJurisdiction,
  DocumentStatus,
  PriorityLevel,
  DEMO_PROFILES,
  STATE_RULES_REGISTRY,
  generatePersonalizedChecklist,
  calculateReadinessScorecard
} from '../../services/personalizedDocumentsEngine';

import {
  SmartUploadModal,
  OcrInspectionModal,
  IntakeQuestionnaireModal,
  ProfessionalOverrideModal
} from './PersonalizedChecklistModals';

interface PersonalizedChecklistSectionProps {
  selectedYear: number;
  onNavigateToUpload: () => void;
  onNavigateToVault: () => void;
  onOpenAssistant: () => void;
}

export const PersonalizedChecklistSection: React.FC<PersonalizedChecklistSectionProps> = ({
  selectedYear: externalSelectedYear,
  onNavigateToUpload,
  onNavigateToVault,
  onOpenAssistant
}) => {
  // 1. Current State Profile & Intake Configuration
  const [activeProfileKey, setActiveProfileKey] = useState<string>('SC');
  const activeProfile = DEMO_PROFILES[activeProfileKey] || DEMO_PROFILES.SC;

  const [activeTaxYear, setActiveTaxYear] = useState<number>(externalSelectedYear || 2025);
  const [currentIntake, setCurrentIntake] = useState<IntakeResponses>(activeProfile.intake);
  const [items, setItems] = useState<PersonalizedDocItem[]>(() => {
    return generatePersonalizedChecklist(activeProfile.intake, activeProfile.seededItems);
  });

  // 2. Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetUploadDoc, setTargetUploadDoc] = useState<PersonalizedDocItem | null>(null);

  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [targetOcrDoc, setTargetOcrDoc] = useState<PersonalizedDocItem | null>(null);

  const [intakeModalOpen, setIntakeModalOpen] = useState(false);

  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetOverrideDoc, setTargetOverrideDoc] = useState<PersonalizedDocItem | null>(null);

  // 3. Filters & UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [showAllPossible, setShowAllPossible] = useState<boolean>(false);
  const [showMissingOnly, setShowMissingOnly] = useState<boolean>(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // 4. "Does Not Apply" Explanation Drawer
  const [activeExplainId, setActiveExplainId] = useState<string | null>(null);
  const [explainText, setExplainText] = useState('');
  const [explainError, setExplainError] = useState<string | null>(null);

  // 5. Audit & Action Notifications
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  // When user switches profile in the top selector
  const handleSwitchProfile = (key: string) => {
    setActiveProfileKey(key);
    const profile = DEMO_PROFILES[key] || DEMO_PROFILES.SC;
    setCurrentIntake(profile.intake);
    const updated = generatePersonalizedChecklist(profile.intake, profile.seededItems);
    setItems(updated);
    setAuditNotice(`Switched to demo profile: ${profile.name} (${profile.state}). State-specific requirements re-evaluated.`);
    setTimeout(() => setAuditNotice(null), 4000);
  };

  // When intake questionnaire is updated
  const handleSaveIntake = (updatedIntake: IntakeResponses) => {
    setCurrentIntake(updatedIntake);
    const refreshed = generatePersonalizedChecklist(updatedIntake, items);
    setItems(refreshed);
    setAuditNotice('Checklist requirements dynamically regenerated based on updated tax facts.');
    setTimeout(() => setAuditNotice(null), 4000);
  };

  // Readiness scorecard
  const scorecard = useMemo(() => {
    return calculateReadinessScorecard(items, activeTaxYear, currentIntake.residenceState);
  }, [items, activeTaxYear, currentIntake.residenceState]);

  // State rules
  const stateRule = STATE_RULES_REGISTRY[currentIntake.residenceState] || STATE_RULES_REGISTRY.SC;

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Year matching
      if (item.taxYear !== activeTaxYear) return false;

      // Missing only quick toggle
      if (showMissingOnly) {
        if (item.status !== 'Missing' && item.status !== 'Rejected / Replace') return false;
      }

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.formNumber.toLowerCase().includes(q) || item.title.toLowerCase().includes(q);
        const matchesPayer = item.ocrData?.payerName ? String(item.ocrData.payerName).toLowerCase().includes(q) : false;
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesPayer && !matchesCategory) return false;
      }

      // Category filter
      if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;

      // Status filter
      if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;

      // Priority filter
      if (filterPriority !== 'ALL' && item.priority !== filterPriority) return false;

      // If showAllPossible is false, exclude items marked "Not Applicable" unless specifically filtered for
      if (!showAllPossible && filterStatus === 'ALL' && item.status === 'Not Applicable') {
        return false;
      }

      return true;
    });
  }, [items, activeTaxYear, searchQuery, filterCategory, filterStatus, filterPriority, showAllPossible, showMissingOnly]);

  // Categories list for filter dropdown
  const categoryList: DocumentCategory[] = useMemo(() => {
    const set = new Set<DocumentCategory>();
    items.forEach(i => set.add(i.category));
    return Array.from(set);
  }, [items]);

  // Handle client status change
  const handleClientStatusChange = (id: string, newStatus: DocumentStatus) => {
    if (newStatus === 'Not Applicable') {
      setActiveExplainId(id);
      setExplainError(null);
      const target = items.find(i => i.id === id);
      setExplainText(target?.notApplicableReason || '');
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          notApplicableReason: undefined
        };
      }
      return item;
    }));

    setAuditNotice(`Item status updated to "${newStatus}". Audit log recorded.`);
    setTimeout(() => setAuditNotice(null), 3500);
  };

  // Handle saving "Does Not Apply" reason
  const handleSaveNotApplicable = (id: string) => {
    if (!explainText.trim()) {
      setExplainError('A brief statutory or factual reason is required when marking an item as "Does Not Apply".');
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Not Applicable',
          notApplicableReason: explainText.trim(),
          accountantApproved: false
        };
      }
      return item;
    }));

    setActiveExplainId(null);
    setExplainText('');
    setExplainError(null);
    setAuditNotice('Explanation recorded. Item marked as "Does Not Apply" and flagged for accountant verification.');
    setTimeout(() => setAuditNotice(null), 4000);
  };

  // Upload handler
  const handleUploadSuccess = (
    docId: string,
    uploadedData: {
      fileName: string;
      fileSize: string;
      fileHash: string;
      confidenceScore: number;
      ocrData: Record<string, string | number>;
      taxYearMismatch?: boolean;
      mismatchDetectedYear?: number;
      possibleDuplicateOf?: string;
    }
  ) => {
    setItems(prev => prev.map(item => {
      if (item.id === docId) {
        const isMismatched = uploadedData.taxYearMismatch;
        return {
          ...item,
          status: isMismatched ? 'Needs Review' : 'Accepted',
          uploadedFileName: uploadedData.fileName,
          uploadedFileSize: uploadedData.fileSize,
          uploadedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          fileHash: uploadedData.fileHash,
          confidenceScore: uploadedData.confidenceScore,
          confidenceTier: uploadedData.confidenceScore >= 95 ? 'High' : 'Medium',
          ocrData: uploadedData.ocrData,
          taxYearMismatch: uploadedData.taxYearMismatch,
          mismatchDetectedYear: uploadedData.mismatchDetectedYear,
          possibleDuplicateOf: uploadedData.possibleDuplicateOf,
          accountantApproved: !isMismatched,
          reviewedBy: !isMismatched ? 'Elena Rostova, CPA' : undefined,
          needsReviewReason: isMismatched
            ? `Tax Year Mismatch: Document detected for calendar year ${uploadedData.mismatchDetectedYear}, but filing year is CY${activeTaxYear}.`
            : undefined
        };
      }
      return item;
    }));

    setAuditNotice(`Document "${uploadedData.fileName}" uploaded, scanned, and indexed successfully.`);
    setTimeout(() => setAuditNotice(null), 4000);
  };

  // Professional override handler
  const handleApplyOverride = (docId: string, newStatus: DocumentStatus, reason: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === docId) {
        return {
          ...item,
          status: newStatus,
          professionalOverrideNote: reason,
          overriddenBy: 'Elena Rostova, CPA',
          overriddenAt: new Date().toISOString(),
          accountantApproved: newStatus === 'Accepted'
        };
      }
      return item;
    }));

    setAuditNotice(`Professional override logged by Elena Rostova, CPA: Status changed to "${newStatus}".`);
    setTimeout(() => setAuditNotice(null), 4500);
  };

  // Add Multi-Instance document (e.g. additional W-2 or 1099)
  const handleAddMultiInstance = (baseFormNumber: string) => {
    const existing = items.filter(i => i.formNumber === baseFormNumber && i.taxYear === activeTaxYear);
    const nextIndex = existing.length + 1;

    const newItem: PersonalizedDocItem = {
      id: `gen_${baseFormNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`,
      formNumber: baseFormNumber,
      title: `${baseFormNumber} (Additional Issuer #${nextIndex})`,
      category: existing[0]?.category || 'Employment',
      whyWeNeedIt: existing[0]?.whyWeNeedIt || 'Reports additional earned or investment income for tax year.',
      whereCanIFindIt: 'Obtain directly from the issuing employer, broker, or payer portal.',
      whyAmIAsked: 'Added manually to declare supplemental income source.',
      source: existing[0]?.source || 'Employer',
      appliesTo: 'Multi-State',
      stateCode: currentIntake.residenceState,
      taxYear: activeTaxYear,
      priority: 'Required',
      status: 'Missing',
      instanceIndex: nextIndex,
      totalInstances: nextIndex,
      isMultiInstanceAllowed: true
    };

    setItems(prev => [...prev, newItem]);
    setAuditNotice(`Added new instance for ${baseFormNumber} (Issuer #${nextIndex}).`);
    setTimeout(() => setAuditNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* 1. DEMO TAXPAYER PROFILE SWITCHER BAR                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 bg-[#0A2544] text-white rounded-xl shadow-md border border-[#061A2F]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#E8C66A] text-[#0A2544] rounded uppercase tracking-wider">
                DEMO / FICTIONAL TAXPAYER
              </span>
              <span className="text-xs text-neutral-300">
                Multi-State Service Market Compliance Engine
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {activeProfile.name}
            </h2>
            <p className="text-xs text-neutral-300">
              {activeProfile.title} &bull; {activeProfile.scenarioDescription}
            </p>
          </div>

          {/* Profile Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 mr-1">
              Select Market:
            </span>
            {(['CA', 'NY', 'NC', 'SC', 'VA', 'TN', 'FL', 'NJ'] as const).map(st => {
              const isSelected = activeProfileKey === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSwitchProfile(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-[#E8C66A] text-[#0A2544] shadow-sm ring-2 ring-[#E8C66A]/50'
                      : 'bg-[#061A2F]/80 text-neutral-200 hover:bg-[#061A2F] border border-white/10'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. STATE COMPLIANCE & STATUTORY NOTICES                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 font-mono font-bold text-xs rounded border border-neutral-300">
                {stateRule.name} ({currentIntake.residenceState})
              </span>
              <span className="text-xs font-semibold text-neutral-700">
                Agency: {stateRule.governingAgency}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                Return: {stateRule.returnFormName}
              </span>
            </div>

            {/* Special notices for FL & TN */}
            {!stateRule.hasIndividualIncomeTax ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900">
                    Statutory Rule: No Personal State Income Tax Return Required
                  </div>
                  <div className="text-emerald-800 mt-0.5">
                    {stateRule.statutoryWarning} Only federal Form 1040 document requirements are tracked for this taxpayer.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-800">State Compliance Features: </span>
                {stateRule.keyComplianceFeatures.join(' • ')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIntakeModalOpen(true)}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-neutral-300"
            >
              <Sliders className="w-3.5 h-3.5 text-[#0A2544]" />
              <span>Edit Taxpayer Intake</span>
            </button>
            <button
              type="button"
              onClick={onOpenAssistant}
              className="px-3.5 py-2 border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D7AC4A]" />
              <span>Ask Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. READINESS SCORECARD & WORKFLOW STAGE                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-neutral-900">Tax Package Readiness &amp; Compliance Scorecard</h3>
              <span className={`px-2.5 py-0.5 text-xs font-bold font-mono rounded ${
                scorecard.filingWorkflowStage === 'Documents Complete'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : scorecard.filingWorkflowStage === 'Professional Review'
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                Stage: {scorecard.filingWorkflowStage}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Readiness is calculated strictly across applicable items for Tax Year {activeTaxYear}. Items marked "Does Not Apply" are excluded from denominator.
            </p>
          </div>

          {/* Tax Year Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 px-2 font-semibold">
              Tax Year:
            </span>
            {[2026, 2025, 2024, 2023].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setActiveTaxYear(yr)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  activeTaxYear === yr
                    ? 'bg-[#0A2544] text-[#E8C66A] shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Meters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Federal Readiness */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-800">Federal Readiness (Form 1040)</span>
              <span className="font-mono font-bold text-[#0A2544]">{scorecard.federalReadinessPct}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="bg-[#0A2544] h-full transition-all duration-300"
                style={{ width: `${scorecard.federalReadinessPct}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-500 flex justify-between font-mono">
              <span>Required items: {scorecard.requiredReceived} of {scorecard.requiredTotal}</span>
              <span>Missing: {scorecard.requiredMissing}</span>
            </div>
          </div>

          {/* State Readiness */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-800">
                {stateRule.name} ({currentIntake.residenceState}) Readiness
              </span>
              <span className="font-mono font-bold text-[#0A2544]">
                {!stateRule.hasIndividualIncomeTax ? '100% (No Tax)' : `${scorecard.stateReadinessPct}%`}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${!stateRule.hasIndividualIncomeTax ? 100 : scorecard.stateReadinessPct}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-500 flex justify-between font-mono">
              <span>Return: {stateRule.returnFormName}</span>
              <span>Agency: {currentIntake.residenceState}</span>
            </div>
          </div>

          {/* Overall Tax Package Readiness */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-800">Overall Intake Fulfillment</span>
              <span className="font-mono font-bold text-emerald-700">{scorecard.overallReadinessPct}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${scorecard.overallReadinessPct}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-500 flex justify-between font-mono">
              <span>Total Applicable: {scorecard.totalApplicable}</span>
              <span>Verified / Accepted: {scorecard.receivedOrAccepted}</span>
            </div>
          </div>
        </div>

        {/* Status Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-neutral-200 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{scorecard.receivedOrAccepted} Accepted</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span className="font-medium">{scorecard.requiredMissing} Required Missing</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-900">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="font-medium">{scorecard.needsReviewCount} Needs Review</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="font-medium">{scorecard.optionalMissing} Optional Missing</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-800">
            <XCircle className="w-4 h-4 text-neutral-500" />
            <span className="font-medium">{items.filter(i => i.status === 'Not Applicable').length} Not Applicable</span>
          </div>
        </div>
      </div>

      {/* Audit Toast Notice */}
      {auditNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-medium text-emerald-900 flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{auditNotice}</span>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. SEARCH, FILTERS & CONTROLS BAR                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-3 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search forms, issuers, categories (e.g., W-2, Schwab, 1095-A)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#0A2544]"
            />
          </div>

          {/* Quick Filter Buttons & Multi-Instance Adder */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMissingOnly(!showMissingOnly)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                showMissingOnly
                  ? 'bg-rose-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Missing Only</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAllPossible(!showAllPossible)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                showAllPossible
                  ? 'bg-[#0A2544] text-[#E8C66A]'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Show All Library Forms</span>
            </button>

            {/* Add instance dropdown */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAddMultiInstance('Form W-2')}
                className="px-2.5 py-1.5 bg-[#061A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#0A2544] flex items-center gap-1"
                title="Add second W-2 employer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#E8C66A]" />
                <span>+ W-2</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddMultiInstance('Form 1099-NEC')}
                className="px-2.5 py-1.5 bg-[#061A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#0A2544] flex items-center gap-1"
                title="Add second 1099-NEC payer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#E8C66A]" />
                <span>+ 1099-NEC</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddMultiInstance('Schedule K-1')}
                className="px-2.5 py-1.5 bg-[#061A2F] text-white text-xs font-semibold rounded-lg hover:bg-[#0A2544] flex items-center gap-1"
                title="Add second Schedule K-1 entity"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#E8C66A]" />
                <span>+ K-1</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-700">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <span>Filter By:</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 border border-neutral-300 rounded-md bg-white text-xs"
          >
            <option value="ALL">All Categories</option>
            {categoryList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-neutral-300 rounded-md bg-white text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Missing">Missing</option>
            <option value="Accepted">Accepted</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Awaiting Client">Awaiting Client</option>
            <option value="Awaiting Tax Professional">Awaiting Tax Professional</option>
            <option value="Not Applicable">Not Applicable</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 border border-neutral-300 rounded-md bg-white text-xs"
          >
            <option value="ALL">All Priorities</option>
            <option value="Required">Required Only</option>
            <option value="Required if applicable">Required if applicable</option>
            <option value="Recommended">Recommended</option>
            <option value="Optional">Optional</option>
          </select>

          <span className="text-neutral-500 font-mono text-[11px] ml-auto">
            Displaying {filteredItems.length} documents for CY{activeTaxYear}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 5. DOCUMENT CARDS LIST                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-white border border-neutral-200 rounded-xl text-neutral-500 text-xs">
            No tax documents match the current filter criteria for Tax Year {activeTaxYear}.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isAccepted = item.status === 'Accepted';
            const isMissing = item.status === 'Missing';
            const isNeedsReview = item.status === 'Needs Review';
            const isNotApplicable = item.status === 'Not Applicable';
            const isExpanded = !!expandedCards[item.id];

            return (
              <div
                key={item.id}
                className={`p-5 bg-white border rounded-xl transition-all shadow-2xs ${
                  isAccepted
                    ? 'border-emerald-300 bg-emerald-50/15'
                    : isNeedsReview
                    ? 'border-purple-300 bg-purple-50/15'
                    : isMissing && item.priority === 'Required'
                    ? 'border-rose-300 bg-rose-50/10'
                    : isNotApplicable
                    ? 'border-neutral-200 bg-neutral-50/50 opacity-75'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Possible Duplicate Alert Banner */}
                {item.possibleDuplicateOf && (
                  <div className="mb-3 p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>POSSIBLE DUPLICATE DETECTED:</strong> This upload matches an existing record. Both documents are retained in custody for professional review.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setItems(prev => prev.map(i => i.id === item.id ? { ...i, possibleDuplicateOf: undefined } : i));
                      }}
                      className="text-[11px] font-bold text-amber-800 hover:underline flex-shrink-0"
                    >
                      Dismiss Warning
                    </button>
                  </div>
                )}

                {/* Tax Year Mismatch Warning Banner */}
                {item.taxYearMismatch && (
                  <div className="mb-3 p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-900 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>TAX YEAR MISMATCH:</strong> Scanned file indicates calendar year {item.mismatchDetectedYear}, but active filing is CY{item.taxYear}. Flagged for accountant review.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setItems(prev => prev.map(i => i.id === item.id ? { ...i, taxYearMismatch: false } : i));
                      }}
                      className="text-[11px] font-bold text-rose-800 hover:underline flex-shrink-0"
                    >
                      Acknowledge
                    </button>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Form Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Form Code */}
                      <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-md">
                        {item.formNumber}
                      </span>

                      {/* Multi-instance index */}
                      {item.instanceIndex && (
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-[#0A2544] text-[#E8C66A] rounded">
                          #{item.instanceIndex}
                        </span>
                      )}

                      {/* Priority Badge */}
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                        item.priority === 'Required'
                          ? 'bg-rose-100 text-rose-900 border border-rose-200'
                          : item.priority === 'Required if applicable'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}>
                        {item.priority}
                      </span>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 ${
                        isAccepted
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isNeedsReview
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : isMissing
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : isNotApplicable
                          ? 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {isAccepted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isMissing && <AlertCircle className="w-3 h-3 text-rose-600" />}
                        {isNeedsReview && <Clock className="w-3 h-3 text-purple-600" />}
                        <span>{item.status}</span>
                      </span>

                      {/* Jurisdiction */}
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-neutral-50 text-neutral-600 border border-neutral-200 rounded">
                        Applies to: {item.appliesTo}
                      </span>

                      {/* Source */}
                      <span className="px-2 py-0.5 text-[10px] text-neutral-500 font-mono">
                        Source: {item.source}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-neutral-900">
                      {item.title}
                    </h4>

                    {/* Plain Language "WHY WE NEED IT" */}
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      <strong className="text-neutral-800">Why we need it: </strong>
                      {item.whyWeNeedIt}
                    </p>

                    {/* Where to find it */}
                    <p className="text-xs text-neutral-500">
                      <strong className="text-neutral-700">Where to find it: </strong>
                      {item.whereCanIFindIt}
                    </p>

                    {/* Trigger: "WHY AM I BEING ASKED FOR THIS?" */}
                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-700 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-[#0A2544] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-neutral-900">Why am I being asked for this? </span>
                        <span>{item.whyAmIAsked}</span>
                      </div>
                    </div>

                    {/* Uploaded File Info & AI Sorter Meta */}
                    {item.uploadedFileName && (
                      <div className="p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-1 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-emerald-950 font-medium">
                            <FileText className="w-4 h-4 text-emerald-700" />
                            <span>Linked file: <strong>{item.uploadedFileName}</strong> ({item.uploadedFileSize || '1.2 MB'})</span>
                          </div>
                          {item.confidenceScore && (
                            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              AI Classification: {item.confidenceScore}% Confidence ({item.confidenceTier})
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-600 font-mono pt-1">
                          <span>Uploaded: {item.uploadedDate || '2026-02-14'} &bull; Hash: {item.fileHash || 'sha256_verified'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetOcrDoc(item);
                              setOcrModalOpen(true);
                            }}
                            className="text-[#0A2544] font-bold hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Extracted Tax Boxes (OCR)</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reviewer Note if Overridden or Reviewed */}
                    {item.professionalOverrideNote && (
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 space-y-0.5">
                        <div className="font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                          <span>Accountant Sign-Off ({item.overriddenBy || 'Elena Rostova, CPA'}):</span>
                        </div>
                        <div className="italic text-purple-950">"{item.professionalOverrideNote}"</div>
                      </div>
                    )}

                    {/* Taxpayer "Does Not Apply" Note */}
                    {isNotApplicable && item.notApplicableReason && (
                      <div className="p-2.5 bg-neutral-100 border border-neutral-300 rounded-lg text-xs text-neutral-800">
                        <strong>Taxpayer Exemption Statement: </strong>
                        <span className="italic">{item.notApplicableReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {/* Status Selector */}
                    <div className="w-full sm:w-auto text-left">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
                        Client Response:
                      </label>
                      <select
                        value={item.status}
                        onChange={(e) => handleClientStatusChange(item.id, e.target.value as DocumentStatus)}
                        className="w-full px-3 py-1.5 border border-neutral-300 bg-white rounded-lg text-xs font-semibold text-neutral-800 shadow-2xs focus:border-[#0A2544]"
                      >
                        <option value="Accepted">Uploaded / Verified</option>
                        <option value="Awaiting Client">Will Upload Later</option>
                        <option value="Missing">Not Received Yet</option>
                        <option value="Needs Review">Need Help / Review</option>
                        <option value="Not Applicable">Does Not Apply</option>
                      </select>
                    </div>

                    {/* Upload & Scanner Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setTargetUploadDoc(item);
                          setUploadModalOpen(true);
                        }}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-[#061A2F] hover:bg-[#0A2544] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#E8C66A]" />
                        <span>{item.uploadedFileName ? 'Replace' : 'Upload / Scan'}</span>
                      </button>

                      {/* Preparer Override Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          setTargetOverrideDoc(item);
                          setOverrideModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg flex items-center gap-1"
                        title="Accountant Status Override & Audit Logging"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0A2544]" />
                        <span className="hidden sm:inline">Override</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* "Does Not Apply" Reason Input Drawer */}
                {activeExplainId === item.id && (
                  <div className="mt-4 p-4 bg-neutral-100 border border-neutral-300 rounded-xl space-y-3">
                    <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-[#0A2544]" />
                      <span>Document Why "{item.formNumber}" Does Not Apply for CY{activeTaxYear}:</span>
                    </div>
                    {explainError && (
                      <div className="p-2 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded">
                        {explainError}
                      </div>
                    )}
                    <textarea
                      value={explainText}
                      onChange={(e) => setExplainText(e.target.value)}
                      placeholder="e.g., Sold this property in CY2024, closed account with zero activity, or had no distributions."
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white"
                      rows={2}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveExplainId(null)}
                        className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNotApplicable(item.id)}
                        className="px-3 py-1.5 text-xs bg-[#061A2F] text-white font-semibold rounded-lg hover:bg-[#0A2544]"
                      >
                        Submit Reason for Accountant Sign-off
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 6. MODALS                                                          */}
      {/* ------------------------------------------------------------------ */}
      <SmartUploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setTargetUploadDoc(null);
        }}
        targetDoc={targetUploadDoc}
        selectedTaxYear={activeTaxYear}
        allExistingDocs={items}
        onUploadSuccess={handleUploadSuccess}
      />

      <OcrInspectionModal
        isOpen={ocrModalOpen}
        onClose={() => {
          setOcrModalOpen(false);
          setTargetOcrDoc(null);
        }}
        doc={targetOcrDoc}
      />

      <IntakeQuestionnaireModal
        isOpen={intakeModalOpen}
        onClose={() => setIntakeModalOpen(false)}
        currentIntake={currentIntake}
        onSaveIntake={handleSaveIntake}
      />

      <ProfessionalOverrideModal
        isOpen={overrideModalOpen}
        onClose={() => {
          setOverrideModalOpen(false);
          setTargetOverrideDoc(null);
        }}
        doc={targetOverrideDoc}
        onApplyOverride={handleApplyOverride}
      />
    </div>
  );
};
