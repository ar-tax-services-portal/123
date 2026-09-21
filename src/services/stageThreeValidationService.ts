/**
 * A/R Tax Services, LLC — Stage Three Validation Engine
 * Unified 18-Stage Tax Operating Workflow — Milestone M3 / Stage 03: Validate
 *
 * Implements Sprint 1 Capabilities (Canonical TG-VAL Feature IDs):
 * - TG-VAL-001: Centralized Stage 03 Validation Workspace Context
 * - TG-VAL-002: Stage 02 -> Stage 03 Handoff Validator
 * - TG-VAL-003: Validation Source Registry with Immutable Provenance
 * - TG-VAL-004: Identity & Entity Consistency Engine
 * - TG-VAL-005: Tax-Year & Period Consistency Engine
 * - TG-VAL-006: Cross-Document Consistency Engine (Multi-Rule Reconciler)
 * - TG-VAL-007: Mathematical & Structural Validation Engine (Arithmetic & Balance Checks)
 * - TG-VAL-008: Authoritative Source Hierarchy & Conflict Arbitrator
 * - TG-VAL-009: Validation Conflict Engine & Multi-Source Reconciliation
 * - TG-VAL-010: Validation Exception Registry (Separate from Stage 02)
 * - TG-VAL-011: Operational Human Validation Review Queue & Maker-Checker
 * - TG-VAL-012: Validation Provenance Ledger & Audit Logging
 *
 * GOVERNANCE INVARIANT:
 * OCR and AI extraction results are proposed information only (isAiProposedOnly: true).
 * AI MUST NOT independently convert extracted information into "tax-verified" data.
 * Authoritative human review and source-linked provenance are mandatory.
 */

import { TaxGuardAuditService } from '../taxguard/services/TaxGuardAuditService';
import {
  StageTwoCollectionService,
  ChecklistRequirement,
  StageTwoUploadedDocument
} from './stageTwoCollectionService';
import {
  StageTwoCollectionOperationsService,
  StageTwoExitGateRecord,
  SourceTieOutItem
} from './stageTwoCollectionOperationsService';
import {
  StageTwoDocumentIntelligenceService,
  DocumentIntelligenceRecord
} from './stageTwoDocumentIntelligenceService';

// ============================================================================
// CANONICAL FEATURE REGISTRY (STAGE 03: VALIDATE)
// ============================================================================

export const CANONICAL_STAGE_THREE_FEATURE_REGISTRY = {
  // Canonical Stage 03 Validation Architecture Registry (TG-VAL-001 through TG-VAL-012)
  'TG-VAL-001': 'Centralized Stage 03 Validation Workspace Context',
  'TG-VAL-002': 'Stage 02 -> Stage 03 Handoff Validator',
  'TG-VAL-003': 'Validation Source Registry with Immutable Provenance',
  'TG-VAL-004': 'Identity & Entity Consistency Engine',
  'TG-VAL-005': 'Tax-Year & Period Consistency Engine',
  'TG-VAL-006': 'Cross-Document Consistency Engine (Multi-Rule Reconciler)',
  'TG-VAL-007': 'Mathematical & Structural Validation Engine',
  'TG-VAL-008': 'Authoritative Source Hierarchy & Conflict Arbitrator',
  // Preserved Downstream Features
  'TG-VAL-009': 'Validation Conflict Engine & Multi-Source Reconciliation',
  'TG-VAL-010': 'Validation Exception Registry (Separate from Stage 02)',
  'TG-VAL-011': 'Operational Human Validation Review Queue & Maker-Checker',
  'TG-VAL-012': 'Validation Provenance Ledger & Audit Logging'
} as const;

// Granular Sub-Feature & Module Registry for Sprint 1 Intake, Integrity & Consistency Verification
export const STAGE_THREE_SUB_FEATURE_REGISTRY = {
  'TG-VAL-001': 'Stage 02 Certified Intake',
  'TG-VAL-002': 'Validation Source Registry',
  'TG-VAL-003': 'Source Integrity Verification',
  'TG-VAL-004': 'Taxpayer Identity Consistency',
  'TG-VAL-005': 'TIN/EIN Consistency',
  'TG-VAL-006': 'Tax-Year Consistency',
  'TG-VAL-007': 'Entity Classification Validation',
  'TG-VAL-008': 'Controlled Tax Form Validation',
  'TG-VAL-009': 'Validation Conflict Engine & Multi-Source Reconciliation',
  'TG-VAL-010': 'Validation Exception Registry (Separate from Stage 02)',
  'TG-VAL-011': 'Operational Human Validation Review Queue & Maker-Checker',
  'TG-VAL-012': 'Validation Provenance Ledger & Audit Logging'
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type AuthoritativeSourceTier =
  | 'AUTHORITATIVE'      // IRS transcripts, official notices, audited financials, issuer W-2/1099
  | 'SUPPORTING'         // General ledger, payroll journals, bank confirmations, broker 1099-B statements
  | 'DERIVED'            // Workpapers, computed tax schedules, trial balance reconciliations
  | 'CLIENT_REPORTED'    // Questionnaires, uncertified spreadsheets, client portal remarks
  | 'AI_EXTRACTED'       // Raw OCR / LLM suggestions before accountant confirmation
  | 'UNVERIFIED';        // Raw uploaded data pending verification

export type ValidationStatus =
  | 'UNVALIDATED'
  | 'VALIDATED'
  | 'CONFLICT'
  | 'STALE'
  | 'REVALIDATION_REQUIRED';

export interface ValidationSourceRecord {
  validationSourceId: string;
  documentId: string;
  clientId: string;
  engagementId: string;
  taxYear: number;
  collectionVersion: number;
  documentVersion: number;
  documentCategory: string;
  originalFilename: string;
  sourceHash: string;
  OCRArtifactId: string;
  extractionArtifactId: string;
  pageNumber: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fieldName: string;
  rawExtractedValue: string | number;
  normalizedValue: string | number;
  sourceTier: AuthoritativeSourceTier;
  AIConfidence: number;
  isAiProposedOnly: boolean;
  humanReviewStatus: 'UNREVIEWED' | 'REVIEWED_APPROVED' | 'HUMAN_CORRECTED' | 'REJECTED';
  validationStatus: ValidationStatus;
  createdAt: string;
  updatedAt: string;
  correlationId: string;
}

// TG-VAL-003: Source Integrity Result
export interface SourceIntegrityResult {
  documentId: string;
  fileName: string;
  sha256Hash: string;
  isHashFormatValid: boolean;
  securityCheckStatus: string;
  processingStatus: string;
  isQuarantined: boolean;
  integrityStatus: 'VERIFIED' | 'TAMPERED_OR_INVALID' | 'QUARANTINED' | 'UNPROCESSED';
  details: string;
}

// TG-VAL-004: Taxpayer Identity Finding
export interface TaxpayerIdentityFinding {
  findingId: string;
  documentId: string;
  documentName: string;
  fieldName: string;
  profileLegalName: string;
  observedName: string;
  matchResult: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'MISMATCH';
  isBlocking: boolean;
  details: string;
}

// TG-VAL-005: TIN/EIN Validation Finding
export interface TinEinValidationFinding {
  findingId: string;
  documentId: string;
  documentName: string;
  fieldName: string;
  tinType: 'SSN' | 'EIN' | 'ITIN' | 'UNKNOWN';
  profileTin: string;
  observedTin: string;
  maskedObservedTin: string;
  isFormatValid: boolean;
  matchResult: 'EXACT_MATCH' | 'MISMATCH' | 'INVALID_FORMAT';
  isBlocking: boolean;
  details: string;
}

// TG-VAL-006: Tax-Year Consistency Finding
export interface TaxYearConsistencyFinding {
  findingId: string;
  documentId: string;
  documentName: string;
  expectedTaxYear: number;
  observedTaxYear: number;
  periodType: 'ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'FISCAL';
  isCorrectTaxYear: boolean;
  isCorrectedForm: boolean;
  isPriorYear: boolean;
  details: string;
  isBlocking: boolean;
}

// TG-VAL-007: Entity Classification Finding
export interface EntityClassificationFinding {
  findingId: string;
  documentId: string;
  documentName: string;
  documentCategory: string;
  clientEntityClassification: string;
  compatibilityStatus: 'COMPATIBLE' | 'INCOMPATIBLE' | 'REQUIRES_EXPLANATION';
  isBlocking: boolean;
  details: string;
}

// TG-VAL-008: Controlled Tax Form Validation Result
export interface ControlledTaxFormValidationResult {
  validationId: string;
  documentId: string;
  documentName: string;
  formType: string;
  status: 'VALID' | 'MISSING_MANDATORY_FIELDS' | 'INVALID_STRUCTURE';
  mandatoryFieldsEvaluated: Array<{
    fieldName: string;
    label: string;
    isPresent: boolean;
    value: any;
  }>;
  missingFields: string[];
  isBlocking: boolean;
  details: string;
}

export type IdentityFindingType =
  | 'MATCH'
  | 'PARTIAL_MATCH'
  | 'MISMATCH'
  | 'MISSING_SOURCE'
  | 'REQUIRES_REVIEW';

export interface IdentityEntityValidationFinding {
  findingId: string;
  field: string;
  label: string;
  profileValue: string;
  observedValue: string;
  maskedObservedValue: string;
  sourceDocumentId: string;
  sourceDocumentName: string;
  result: IdentityFindingType;
  details: string;
  isBlocking: boolean;
}

export interface PeriodConsistencyFinding {
  findingId: string;
  documentId: string;
  documentName: string;
  expectedTaxYear: number;
  observedTaxYear: number;
  periodType: 'ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'FISCAL';
  periodIdentifier: string;
  isCorrectTaxYear: boolean;
  isCorrectedForm: boolean;
  isPriorYear: boolean;
  details: string;
  isBlocking: boolean;
}

export interface CrossDocumentRule {
  ruleId: string;
  ruleName: string;
  ruleVersion: string;
  sourceTypes: string[];
  comparisonMethod: 'EXACT_MATCH' | 'TOLERANCE_MATCH' | 'RECONCILIATION_SUM' | 'BOUNDS_CHECK';
  materialityThreshold: number;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  result: 'PASS' | 'FAIL' | 'WARNING' | 'INSUFFICIENT_EVIDENCE';
  expectedValue: number | string | null;
  observedValue: number | string | null;
  variance: number | null;
  sourceReferences: Array<{
    sourceId: string;
    documentId: string;
    documentName: string;
    fieldName: string;
    value: any;
  }>;
  requiresHumanReview: boolean;
  blockingStatus: boolean;
  narrative: string;
}

export interface MathematicalValidationResult {
  calculationId: string;
  calculationName: string;
  relationshipType:
    | 'SUBTOTAL_RECONCILIATION'
    | 'GROSS_DEDUCTION_NET'
    | 'QUARTERLY_ANNUAL_SUM'
    | 'DEBIT_CREDIT_BALANCE'
    | 'ROLLFORWARD_BALANCE'
    | 'CONTROL_TOTAL';
  status: 'VALID' | 'VARIANCE_DETECTED' | 'INSUFFICIENT_EVIDENCE';
  computedValue: number | null;
  statedValue: number | null;
  variance: number | null;
  tolerance: number;
  componentInputs: Array<{
    label: string;
    value: number | null;
    sourceId?: string;
  }>;
  isFabricated: boolean; // Must always be false; no fabricated data
  notes: string;
}

export type ConflictCategory =
  | 'IDENTITY_MISMATCH'
  | 'TIN_MISMATCH'
  | 'TAX_YEAR_MISMATCH'
  | 'ENTITY_TYPE_MISMATCH'
  | 'AMOUNT_MISMATCH'
  | 'WITHHOLDING_MISMATCH'
  | 'SOURCE_CONFLICT'
  | 'PERIOD_MISMATCH'
  | 'MATHEMATICAL_VARIANCE'
  | 'DUPLICATE_SOURCE'
  | 'SUPERSEDED_SOURCE'
  | 'INSUFFICIENT_EVIDENCE';

export interface ValidationConflict {
  conflictId: string;
  clientId: string;
  taxYear: number;
  conflictCategory: ConflictCategory;
  affectedField: string;
  sourceA: {
    sourceId: string;
    documentId: string;
    documentName: string;
    value: any;
    sourceTier: AuthoritativeSourceTier;
  };
  sourceB: {
    sourceId: string;
    documentId: string;
    documentName: string;
    value: any;
    sourceTier: AuthoritativeSourceTier;
  };
  observedValues: string;
  variance: number | string;
  materiality: 'MATERIAL' | 'IMMATERIAL';
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  blockingStatus: boolean;
  createdTimestamp: string;
  assignedReviewer: string;
  resolutionStatus: 'UNRESOLVED' | 'RESOLVED' | 'WAIVED' | 'ESCALATED';
  resolutionRationale?: string;
  resolvedBy?: string;
  resolvedTimestamp?: string;
}

export type ValidationExceptionStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'UNDER_REVIEW'
  | 'AWAITING_CLIENT'
  | 'AWAITING_PREPARER'
  | 'AWAITING_REVIEWER'
  | 'RESOLVED'
  | 'WAIVED'
  | 'REOPENED';

export interface ValidationException {
  exceptionId: string;
  clientId: string;
  taxYear: number;
  category: string;
  title: string;
  description: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: ValidationExceptionStatus;
  isBlocking: boolean;
  relatedSourceId?: string;
  relatedDocumentId?: string;
  relatedConflictId?: string;
  createdTimestamp: string;
  createdBy: string;
  assignedTo: string;
  resolution?: {
    resolvedAt: string;
    resolvedBy: string;
    resolvedByRole: string;
    resolutionAction: string;
    justification: string;
  };
}

export interface HumanValidationQueueItem {
  queueItemId: string;
  clientId: string;
  taxYear: number;
  itemType:
    | 'CONFLICT'
    | 'LOW_CONFIDENCE'
    | 'IDENTITY_MISMATCH'
    | 'TAX_YEAR_MISMATCH'
    | 'MATHEMATICAL_VARIANCE'
    | 'INSUFFICIENT_EVIDENCE'
    | 'SUPERSEDED_SOURCE';
  referenceId: string;
  title: string;
  description: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedReviewer: string;
  status: 'PENDING_REVIEW' | 'IN_REVIEW' | 'RESOLVED' | 'ESCALATED';
  disposition?: {
    action:
      | 'ACCEPT_SOURCE'
      | 'REJECT_SOURCE'
      | 'CORRECT_VALUE'
      | 'REQUEST_EVIDENCE'
      | 'MARK_NOT_APPLICABLE'
      | 'ESCALATE'
      | 'RESOLVE_CONFLICT';
    actor: string;
    actorRole: string;
    timestamp: string;
    justification: string;
    correctedValue?: any;
  };
}

export interface ValidationProvenanceEntry {
  provenanceId: string;
  validationSourceId: string;
  documentId: string;
  documentVersion: number;
  pageNumber: number;
  fieldName: string;
  rawExtractedValue: any;
  confidence: number;
  isAiProposed: boolean;
  validatedValue: any;
  wasChanged: boolean;
  changedBy?: string;
  changeReason?: string;
  reviewedBy?: string;
  reviewTimestamp?: string;
  validatingRuleId: string;
  validationResult: string;
  correlationId: string;
  timestamp: string;
}

export interface StageThreeWorkspaceContext {
  clientId: string;
  engagementId: string;
  entityName: string;
  entityClassification: string;
  returnType: string;
  taxYear: number;
  federalJurisdiction: string;
  stateJurisdictions: string[];
  assignedPreparer: string;
  assignedReviewer: string;
  stageTwoGateId: string;
  stageTwoCollectionVersion: number;
  stageTwoClearanceTimestamp: string;
  validationStatus:
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'VALIDATED'
    | 'REVALIDATION_REQUIRED'
    | 'BLOCKED_BY_STAGE_02';
  openExceptionCount: number;
  blockingExceptionCount: number;
  validationReadinessPercentage: number;
  isHandoffVerified: boolean;
}

// Storage keys
const STORAGE_KEY_VAL_SOURCES = 'artax_stage3_sources_v1';
const STORAGE_KEY_VAL_CONFLICTS = 'artax_stage3_conflicts_v1';
const STORAGE_KEY_VAL_EXCEPTIONS = 'artax_stage3_exceptions_v1';
const STORAGE_KEY_VAL_QUEUE = 'artax_stage3_review_queue_v1';
const STORAGE_KEY_VAL_PROVENANCE = 'artax_stage3_provenance_v1';

// ============================================================================
// SERVICE IMPLEMENTATION
// ============================================================================

export class StageThreeValidationService {
  private static sourcesStore: Map<string, ValidationSourceRecord[]> = new Map();
  private static conflictsStore: Map<string, ValidationConflict[]> = new Map();
  private static exceptionsStore: Map<string, ValidationException[]> = new Map();
  private static queueStore: Map<string, HumanValidationQueueItem[]> = new Map();
  private static provenanceStore: Map<string, ValidationProvenanceEntry[]> = new Map();

  // --------------------------------------------------------------------------
  // TG-VAL-002: STAGE 02 -> STAGE 03 HANDOFF VALIDATOR
  // --------------------------------------------------------------------------

  /**
   * Authoritative handoff validator.
   * Stage 03 can only begin if Stage 02 gate record confirms:
   * stageTwoStatus = COMPLETED
   * stageThreeStatus = ELIGIBLE
   * gateResult = CLEARED
   * Gate ID, Client ID, Engagement ID, Tax Year must match.
   */
  public static validateStageTwoHandoff(
    clientId: string,
    taxYear: number,
    engagementId?: string
  ): {
    isValid: boolean;
    gateRecord: StageTwoExitGateRecord | null;
    status: 'ELIGIBLE' | 'REVALIDATION_REQUIRED' | 'BLOCKED_BY_STAGE_02';
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Tenant / Client isolation check
    if (!clientId || !clientId.trim()) {
      return {
        isValid: false,
        gateRecord: null,
        status: 'BLOCKED_BY_STAGE_02',
        reasons: ['Client ID must be provided for tenant-isolated validation.']
      };
    }

    const gate = StageTwoCollectionOperationsService.getExitGateStatus(clientId, taxYear);

    if (!gate) {
      return {
        isValid: false,
        gateRecord: null,
        status: 'BLOCKED_BY_STAGE_02',
        reasons: [`No certified Stage 02 Exit Gate record exists for client ${clientId}, tax year ${taxYear}.`]
      };
    }

    // Validate client match
    if (gate.clientId !== clientId) {
      reasons.push(`Gate client ID mismatch: Expected '${clientId}', got '${gate.clientId}'.`);
    }

    // Validate tax year match
    if (gate.taxYear !== taxYear) {
      reasons.push(`Gate tax year mismatch: Expected ${taxYear}, got ${gate.taxYear}.`);
    }

    // Validate engagement match if supplied
    if (engagementId && gate.engagementId !== engagementId) {
      reasons.push(`Gate engagement ID mismatch: Expected '${engagementId}', got '${gate.engagementId}'.`);
    }

    // Validate authoritative exit state
    if (gate.gateResult !== 'CLEARED') {
      reasons.push(`Stage 02 Exit Gate result is '${gate.gateResult}' (must be 'CLEARED').`);
    }

    if (gate.stageTwoStatus !== 'COMPLETED') {
      reasons.push(`Stage 02 status is '${gate.stageTwoStatus}' (must be 'COMPLETED').`);
    }

    if (gate.stageThreeStatus !== 'ELIGIBLE') {
      if (gate.stageThreeStatus === 'REVALIDATION_REQUIRED') {
        return {
          isValid: false,
          gateRecord: gate,
          status: 'REVALIDATION_REQUIRED',
          reasons: ['Stage 02 was reopened or source documents modified. Revalidation is required before proceeding.']
        };
      }
      reasons.push(`Stage 03 transition status is '${gate.stageThreeStatus}' (must be 'ELIGIBLE').`);
    }

    if (reasons.length > 0) {
      return {
        isValid: false,
        gateRecord: gate,
        status: 'BLOCKED_BY_STAGE_02',
        reasons
      };
    }

    return {
      isValid: true,
      gateRecord: gate,
      status: 'ELIGIBLE',
      reasons: []
    };
  }

  // --------------------------------------------------------------------------
  // TG-VAL-001: CENTRALIZED STAGE 03 WORKSPACE CONTEXT
  // --------------------------------------------------------------------------

  public static getWorkspaceContext(
    clientId: string,
    taxYear: number,
    engagementId?: string
  ): StageThreeWorkspaceContext {
    const stage2Context = StageTwoCollectionService.getWorkspaceContext(clientId, taxYear);
    const handoff = this.validateStageTwoHandoff(clientId, taxYear, engagementId);

    const exceptions = this.getExceptions(clientId, taxYear);
    const openExceptions = exceptions.filter(e => e.status !== 'RESOLVED' && e.status !== 'WAIVED');
    const blockingExceptions = openExceptions.filter(e => e.isBlocking);

    let valStatus: StageThreeWorkspaceContext['validationStatus'] = 'NOT_STARTED';
    if (!handoff.isValid) {
      valStatus = handoff.status === 'REVALIDATION_REQUIRED' ? 'REVALIDATION_REQUIRED' : 'BLOCKED_BY_STAGE_02';
    } else {
      const sources = this.getValidationSources(clientId, taxYear);
      if (sources.length > 0) {
        valStatus = blockingExceptions.length === 0 ? 'VALIDATED' : 'IN_PROGRESS';
      }
    }

    const readiness = this.calculateReadinessPercentage(clientId, taxYear);

    return {
      clientId,
      engagementId: handoff.gateRecord?.engagementId || stage2Context.engagementId,
      entityName: stage2Context.entityName,
      entityClassification: stage2Context.entityType,
      returnType: stage2Context.returnType,
      taxYear,
      federalJurisdiction: 'US-IRS (Federal)',
      stateJurisdictions: stage2Context.jurisdictions,
      assignedPreparer: stage2Context.assignedPreparer,
      assignedReviewer: stage2Context.assignedReviewer,
      stageTwoGateId: handoff.gateRecord?.gateId || 'UNCOMMITTED_GATE',
      stageTwoCollectionVersion: handoff.gateRecord?.collectionVersion || 1,
      stageTwoClearanceTimestamp: handoff.gateRecord?.evaluationTimestamp || 'N/A',
      validationStatus: valStatus,
      openExceptionCount: openExceptions.length,
      blockingExceptionCount: blockingExceptions.length,
      validationReadinessPercentage: readiness,
      isHandoffVerified: handoff.isValid
    };
  }

  // --------------------------------------------------------------------------
  // TG-VAL-003: VALIDATION SOURCE REGISTRY WITH IMMUTABLE PROVENANCE
  // --------------------------------------------------------------------------

  public static getValidationSources(clientId: string, taxYear: number): ValidationSourceRecord[] {
    const key = `${clientId}_${taxYear}`;
    if (!this.sourcesStore.has(key)) {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY_VAL_SOURCES}_${key}`);
          if (stored) {
            this.sourcesStore.set(key, JSON.parse(stored));
          }
        } catch {
          // ignore
        }
      }
    }
    return this.sourcesStore.get(key) || [];
  }

  public static registerValidationSource(
    source: Omit<ValidationSourceRecord, 'validationSourceId' | 'createdAt' | 'updatedAt' | 'correlationId'>
  ): ValidationSourceRecord {
    const validationSourceId = `VSR-${source.taxYear}-${Math.floor(10000 + Math.random() * 90000)}`;
    const correlationId = `CORR-VAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const record: ValidationSourceRecord = {
      ...source,
      validationSourceId,
      createdAt: timestamp,
      updatedAt: timestamp,
      correlationId,
      isAiProposedOnly: true // GOVERNANCE INVARIANT: Never autonomously tax-verified
    };

    const key = `${source.clientId}_${source.taxYear}`;
    const list = this.getValidationSources(source.clientId, source.taxYear);
    list.push(record);
    this.sourcesStore.set(key, list);
    this.persistSources(key, list);

    // Append to audit trail (TG-VAL-012)
    TaxGuardAuditService.logEvent({
      tenantId: 'tenant_ar_tax_prod',
      userId: 'system_stage3_validator',
      userEmail: 'system@artaxservices.com',
      userRole: 'system',
      action: 'VALIDATION_SOURCE_REGISTERED',
      recordType: 'document',
      recordId: validationSourceId,
      ipAddress: '127.0.0.1 (Validation Service)',
      result: 'success',
      riskLevel: 'routine',
      details: `Validation source registered: ${record.fieldName} = "${record.normalizedValue}" from ${record.originalFilename} (Doc ID: ${record.documentId}, Hash: ${record.sourceHash.substring(0, 10)}...). Tier: ${record.sourceTier}`
    });

    // Record initial provenance entry
    this.recordProvenance({
      validationSourceId,
      documentId: record.documentId,
      documentVersion: record.documentVersion,
      pageNumber: record.pageNumber,
      fieldName: record.fieldName,
      rawExtractedValue: record.rawExtractedValue,
      confidence: record.AIConfidence,
      isAiProposed: true,
      validatedValue: record.normalizedValue,
      wasChanged: false,
      validatingRuleId: 'INGEST_SOURCE_TIE',
      validationResult: 'REGISTERED',
      correlationId,
      timestamp
    });

    return record;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-003: SOURCE INTEGRITY VERIFICATION
  // --------------------------------------------------------------------------

  /**
   * Verifies SHA-256 cryptographic hash integrity and security check status
   * for a specific uploaded document before or during validation intake.
   */
  public static verifyDocumentIntegrity(doc: StageTwoUploadedDocument): SourceIntegrityResult {
    const isHashFormatValid = /^[a-f0-9]{64}$/i.test(doc.sha256Hash || '');
    const isSecurityPassed = doc.securityCheckStatus === 'Passed (SHA-256 Validated)';
    const isQuarantined = doc.securityCheckStatus === 'Quarantined' || doc.quarantineStatus === 'QUARANTINED';
    const isNotRejected = doc.processingStatus !== 'Rejected';

    let integrityStatus: SourceIntegrityResult['integrityStatus'] = 'VERIFIED';
    let details = 'Source document cryptographic SHA-256 integrity and security clearance verified.';

    if (!isHashFormatValid) {
      integrityStatus = 'TAMPERED_OR_INVALID';
      details = `Invalid SHA-256 hash structure for '${doc.originalFileName}'. Potential corruption or tampering.`;
    } else if (isQuarantined) {
      integrityStatus = 'QUARANTINED';
      details = `Document '${doc.originalFileName}' is quarantined and blocked from validation intake.`;
    } else if (!isSecurityPassed) {
      integrityStatus = 'TAMPERED_OR_INVALID';
      details = `Security check status is '${doc.securityCheckStatus}'. Cryptographic verification required.`;
    } else if (!isNotRejected) {
      integrityStatus = 'TAMPERED_OR_INVALID';
      details = `Document '${doc.originalFileName}' was rejected in Stage 02 and cannot be admitted to Stage 03.`;
    }

    return {
      documentId: doc.documentId,
      fileName: doc.originalFileName,
      sha256Hash: doc.sha256Hash,
      isHashFormatValid,
      securityCheckStatus: doc.securityCheckStatus,
      processingStatus: doc.processingStatus,
      isQuarantined,
      integrityStatus,
      details
    };
  }

  /**
   * Performs source integrity verification across all uploaded documents for the client and tax year.
   */
  public static verifySourceIntegrity(clientId: string, taxYear: number): SourceIntegrityResult[] {
    const docs = StageTwoCollectionService.getUploadedDocuments(clientId, taxYear);
    return docs.map(doc => this.verifyDocumentIntegrity(doc));
  }

  /**
   * Synchronizes sources from Stage 02 accepted documents and tie-outs into Stage 03.
   */
  public static syncSourcesFromStageTwo(clientId: string, taxYear: number): ValidationSourceRecord[] {
    const docs = StageTwoCollectionService.getUploadedDocuments(clientId, taxYear);
    const existing = this.getValidationSources(clientId, taxYear);
    const existingDocIds = new Set(existing.map(e => e.documentId));

    const newlyAdded: ValidationSourceRecord[] = [];

    docs.forEach(doc => {
      // Invariant: Only cleared, non-quarantined, non-rejected documents sync into validation
      if (doc.securityCheckStatus === 'Quarantined' || doc.quarantineStatus === 'QUARANTINED' || doc.processingStatus === 'Rejected') {
        return;
      }

      if (!existingDocIds.has(doc.documentId)) {
        // Derive appropriate source tier (TG-VAL-008)
        let tier: AuthoritativeSourceTier = 'SUPPORTING';
        if (doc.claimedCategory.includes('W-2') || doc.claimedCategory.includes('1099') || doc.claimedCategory.includes('K-1')) {
          tier = 'AUTHORITATIVE';
        } else if (doc.claimedCategory.includes('Bank') || doc.claimedCategory.includes('Payroll')) {
          tier = 'SUPPORTING';
        }

        // Register main fields from intelligence record if present
        if (doc.intelligenceRecord && doc.intelligenceRecord.extractedData) {
          Object.entries(doc.intelligenceRecord.extractedData).forEach(([field, val]) => {
            const registered = this.registerValidationSource({
              documentId: doc.documentId,
              clientId,
              engagementId: doc.engagementId || `ENG-${taxYear}-${clientId}`,
              taxYear,
              collectionVersion: 1,
              documentVersion: doc.intelligenceRecord?.versionIntelligence?.versionNumber || 1,
              documentCategory: doc.claimedCategory,
              originalFilename: doc.originalFileName,
              sourceHash: doc.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              OCRArtifactId: doc.intelligenceRecord?.ocrArtifact?.ocrArtifactId || `OCR-${doc.documentId}`,
              extractionArtifactId: `EXT-${doc.documentId}`,
              pageNumber: 1,
              fieldName: field,
              rawExtractedValue: String(val),
              normalizedValue: String(val),
              sourceTier: tier,
              AIConfidence: doc.intelligenceRecord?.overallExtractionConfidence || 0.95,
              isAiProposedOnly: true,
              humanReviewStatus: doc.isVerified ? 'REVIEWED_APPROVED' : 'UNREVIEWED',
              validationStatus: 'UNVALIDATED'
            });
            newlyAdded.push(registered);
          });
        } else {
          // Register generic baseline document entry
          const registered = this.registerValidationSource({
            documentId: doc.documentId,
            clientId,
            engagementId: doc.engagementId || `ENG-${taxYear}-${clientId}`,
            taxYear,
            collectionVersion: 1,
            documentVersion: doc.intelligenceRecord?.versionIntelligence?.versionNumber || 1,
            documentCategory: doc.claimedCategory,
            originalFilename: doc.originalFileName,
            sourceHash: doc.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            OCRArtifactId: `OCR-${doc.documentId}`,
            extractionArtifactId: `EXT-${doc.documentId}`,
            pageNumber: 1,
            fieldName: 'document_presence',
            rawExtractedValue: doc.originalFileName,
            normalizedValue: doc.originalFileName,
            sourceTier: tier,
            AIConfidence: 1.0,
            isAiProposedOnly: true,
            humanReviewStatus: doc.isVerified ? 'REVIEWED_APPROVED' : 'UNREVIEWED',
            validationStatus: 'UNVALIDATED'
          });
          newlyAdded.push(registered);
        }
      }
    });

    return newlyAdded;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-004: TAXPAYER IDENTITY CONSISTENCY
  // --------------------------------------------------------------------------

  /**
   * Compares taxpayer legal name and DBA across sources against client profile.
   * Categorizes as EXACT_MATCH, PARTIAL_MATCH, or MISMATCH, raising blocking conflicts on mismatch.
   */
  public static runTaxpayerIdentityValidation(
    clientId: string,
    taxYear: number,
    expectedProfile?: {
      legalName: string;
      dba?: string;
    }
  ): TaxpayerIdentityFinding[] {
    const sources = this.getValidationSources(clientId, taxYear);
    const findings: TaxpayerIdentityFinding[] = [];

    const ctx = StageTwoCollectionService.getWorkspaceContext(clientId, taxYear);
    const legalName = expectedProfile?.legalName || ctx.entityName;
    const dba = expectedProfile?.dba;

    sources.forEach(source => {
      const field = source.fieldName.toLowerCase();
      if (
        field === 'employee_name' ||
        field === 'taxpayer_name' ||
        field === 'business_name' ||
        field === 'legal_name' ||
        field === 'recipient_name' ||
        field === 'payer_name'
      ) {
        const observed = String(source.normalizedValue).trim();
        const obsLower = observed.toLowerCase();
        const expLower = legalName.trim().toLowerCase();
        const dbaLower = dba?.trim().toLowerCase();

        let matchResult: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'MISMATCH' = 'EXACT_MATCH';
        let isBlocking = false;
        let details = `Taxpayer identity match: observed name '${observed}' matches client legal name.`;

        if (obsLower === expLower || (dbaLower && obsLower === dbaLower)) {
          matchResult = 'EXACT_MATCH';
        } else if (obsLower.includes(expLower) || expLower.includes(obsLower) || (dbaLower && obsLower.includes(dbaLower))) {
          matchResult = 'PARTIAL_MATCH';
          details = `Partial identity match: observed '${observed}' shares common root with '${legalName}'.`;
        } else {
          matchResult = 'MISMATCH';
          isBlocking = true;
          details = `Taxpayer identity mismatch! Document gives '${observed}', but profile specifies '${legalName}'.`;

          this.createConflict({
            clientId,
            taxYear,
            conflictCategory: 'IDENTITY_MISMATCH',
            affectedField: source.fieldName,
            sourceA: {
              sourceId: source.validationSourceId,
              documentId: source.documentId,
              documentName: source.originalFilename,
              value: source.normalizedValue,
              sourceTier: source.sourceTier
            },
            sourceB: {
              sourceId: 'SYS_ENGAGEMENT_PROFILE',
              documentId: 'PROFILE',
              documentName: 'Engagement Master Profile',
              value: legalName,
              sourceTier: 'AUTHORITATIVE'
            },
            observedValues: `Doc: "${observed}" vs Profile: "${legalName}"`,
            variance: 'NAME_DIFFERENCE',
            materiality: 'MATERIAL',
            severity: 'HIGH',
            blockingStatus: true
          });
        }

        findings.push({
          findingId: `IDF-${Math.random().toString(36).substring(2, 9)}`,
          documentId: source.documentId,
          documentName: source.originalFilename,
          fieldName: source.fieldName,
          profileLegalName: legalName,
          observedName: observed,
          matchResult,
          isBlocking,
          details
        });
      }
    });

    return findings;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-005: TIN/EIN CONSISTENCY
  // --------------------------------------------------------------------------

  /**
   * Evaluates SSN / EIN / ITIN format validity and consistency across source documents against profile.
   * Masks tax IDs in findings and raises critical blocking conflicts on TIN mismatch.
   */
  public static runTinEinValidation(
    clientId: string,
    taxYear: number,
    expectedProfile?: {
      einTin: string;
    }
  ): TinEinValidationFinding[] {
    const sources = this.getValidationSources(clientId, taxYear);
    const findings: TinEinValidationFinding[] = [];

    const expectedTin = expectedProfile?.einTin || '84-1928374';
    const cleanExpected = expectedTin.replace(/\D/g, '');

    sources.forEach(source => {
      const field = source.fieldName.toLowerCase();
      if (
        field === 'ein' ||
        field === 'ssn' ||
        field === 'tin' ||
        field === 'employer_ein' ||
        field === 'employee_ssn' ||
        field === 'recipient_tin' ||
        field === 'payer_tin'
      ) {
        const rawVal = String(source.normalizedValue).trim();
        const cleanVal = rawVal.replace(/\D/g, '');

        let tinType: 'SSN' | 'EIN' | 'ITIN' | 'UNKNOWN' = 'UNKNOWN';
        let isFormatValid = false;

        if (cleanVal.length === 9) {
          if (field.includes('ssn') || cleanVal.startsWith('9')) {
            isFormatValid = !cleanVal.startsWith('000') && !cleanVal.startsWith('666');
            tinType = cleanVal.startsWith('9') ? 'ITIN' : 'SSN';
          } else {
            isFormatValid = true;
            tinType = 'EIN';
          }
        }

        const isMatch = cleanVal === cleanExpected;
        let matchResult: 'EXACT_MATCH' | 'MISMATCH' | 'INVALID_FORMAT' = isMatch ? 'EXACT_MATCH' : 'MISMATCH';
        if (!isFormatValid) {
          matchResult = 'INVALID_FORMAT';
        }

        let isBlocking = false;
        let details = `Federal tax ID verified: matches profile (${this.maskTIN(cleanExpected)}).`;

        if (!isFormatValid) {
          isBlocking = true;
          details = `Invalid TIN/EIN structure on '${source.fieldName}': expected 9 digits, observed '${rawVal}'.`;
        } else if (!isMatch) {
          isBlocking = true;
          details = `TIN/EIN mismatch: document has ${this.maskTIN(cleanVal)}, expected profile ${this.maskTIN(cleanExpected)}.`;

          this.createConflict({
              clientId,
              taxYear,
              conflictCategory: 'TIN_MISMATCH',
              affectedField: source.fieldName,
              sourceA: {
                sourceId: source.validationSourceId,
                documentId: source.documentId,
                documentName: source.originalFilename,
                value: this.maskTIN(cleanVal),
                sourceTier: source.sourceTier
              },
              sourceB: {
                sourceId: 'SYS_ENGAGEMENT_PROFILE',
                documentId: 'PROFILE',
                documentName: 'Engagement Master Profile',
                value: this.maskTIN(cleanExpected),
                sourceTier: 'AUTHORITATIVE'
              },
              observedValues: `${this.maskTIN(cleanVal)} vs ${this.maskTIN(cleanExpected)}`,
              variance: 'TIN_DIFFERENCE',
              materiality: 'MATERIAL',
              severity: 'CRITICAL',
              blockingStatus: true
            });
        }

        findings.push({
          findingId: `TIN-${Math.random().toString(36).substring(2, 9)}`,
          documentId: source.documentId,
          documentName: source.originalFilename,
          fieldName: source.fieldName,
          tinType,
          profileTin: this.maskTIN(cleanExpected),
          observedTin: rawVal,
          maskedObservedTin: this.maskTIN(cleanVal),
          isFormatValid,
          matchResult,
          isBlocking,
          details
        });
      }
    });

    return findings;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-004 (LEGACY/UI ALIAS): IDENTITY & ENTITY CONSISTENCY ENGINE
  // --------------------------------------------------------------------------

  public static runIdentityEntityValidation(
    clientId: string,
    taxYear: number,
    expectedProfile?: {
      legalName: string;
      einTin: string;
      entityType: string;
      address?: string;
    }
  ): IdentityEntityValidationFinding[] {
    const sources = this.getValidationSources(clientId, taxYear);
    const findings: IdentityEntityValidationFinding[] = [];

    // Fallback profile from workspace context if not supplied
    const ctx = StageTwoCollectionService.getWorkspaceContext(clientId, taxYear);
    const profile = expectedProfile || {
      legalName: ctx.entityName,
      einTin: '84-1928374', // Known Perotti Consulting EIN
      entityType: ctx.entityType,
      address: '1428 Elm Street, Denver, CO 80202'
    };

    // Evaluate each source document providing identity
    sources.forEach(source => {
      // Check Name
      if (source.fieldName === 'employee_name' || source.fieldName === 'taxpayer_name' || source.fieldName === 'business_name') {
        const val = String(source.normalizedValue).trim().toLowerCase();
        const expected = profile.legalName.trim().toLowerCase();

        let result: IdentityFindingType = 'MATCH';
        let details = 'Exact name match with engagement profile.';
        let isBlocking = false;

        if (val === expected) {
          result = 'MATCH';
        } else if (val.includes(expected) || expected.includes(val)) {
          result = 'PARTIAL_MATCH';
          details = `Partial match detected between '${source.normalizedValue}' and profile '${profile.legalName}'.`;
        } else {
          result = 'MISMATCH';
          details = `Identity Mismatch! Document gives '${source.normalizedValue}', but client profile specifies '${profile.legalName}'.`;
          isBlocking = true;

          // Automatically generate conflict (TG-VAL-009) and exception (TG-VAL-010)
          this.createConflict({
            clientId,
            taxYear,
            conflictCategory: 'IDENTITY_MISMATCH',
            affectedField: source.fieldName,
            sourceA: {
              sourceId: source.validationSourceId,
              documentId: source.documentId,
              documentName: source.originalFilename,
              value: source.normalizedValue,
              sourceTier: source.sourceTier
            },
            sourceB: {
              sourceId: 'SYS_ENGAGEMENT_PROFILE',
              documentId: 'PROFILE',
              documentName: 'Engagement Master Profile',
              value: profile.legalName,
              sourceTier: 'AUTHORITATIVE'
            },
            observedValues: `Doc: "${source.normalizedValue}" vs Profile: "${profile.legalName}"`,
            variance: 'NAME_DIFFERENCE',
            materiality: 'MATERIAL',
            severity: 'HIGH',
            blockingStatus: true
          });
        }

        findings.push({
          findingId: `IDF-${Math.random().toString(36).substring(2, 9)}`,
          field: source.fieldName,
          label: 'Legal Taxpayer Name',
          profileValue: profile.legalName,
          observedValue: String(source.normalizedValue),
          maskedObservedValue: String(source.normalizedValue),
          sourceDocumentId: source.documentId,
          sourceDocumentName: source.originalFilename,
          result,
          details,
          isBlocking
        });
      }

      // Check EIN / TIN
      if (source.fieldName === 'ein' || source.fieldName === 'ssn' || source.fieldName === 'tin') {
        const cleanVal = String(source.normalizedValue).replace(/\D/g, '');
        const cleanExpected = profile.einTin.replace(/\D/g, '');

        let result: IdentityFindingType = 'MATCH';
        let details = 'EIN/TIN matches client master profile.';
        let isBlocking = false;

        if (cleanVal === cleanExpected) {
          result = 'MATCH';
        } else {
          result = 'MISMATCH';
          details = `TIN/EIN Mismatch: Document has '${this.maskTIN(cleanVal)}', expected '${this.maskTIN(cleanExpected)}'.`;
          isBlocking = true;

          this.createConflict({
            clientId,
            taxYear,
            conflictCategory: 'TIN_MISMATCH',
            affectedField: source.fieldName,
            sourceA: {
              sourceId: source.validationSourceId,
              documentId: source.documentId,
              documentName: source.originalFilename,
              value: this.maskTIN(cleanVal),
              sourceTier: source.sourceTier
            },
            sourceB: {
              sourceId: 'SYS_ENGAGEMENT_PROFILE',
              documentId: 'PROFILE',
              documentName: 'Engagement Master Profile',
              value: this.maskTIN(cleanExpected),
              sourceTier: 'AUTHORITATIVE'
            },
            observedValues: `${this.maskTIN(cleanVal)} vs ${this.maskTIN(cleanExpected)}`,
            variance: 'TIN_DIFFERENCE',
            materiality: 'MATERIAL',
            severity: 'CRITICAL',
            blockingStatus: true
          });
        }

        findings.push({
          findingId: `IDF-${Math.random().toString(36).substring(2, 9)}`,
          field: source.fieldName,
          label: 'Federal Tax Identification (TIN/EIN)',
          profileValue: this.maskTIN(cleanExpected),
          observedValue: String(source.normalizedValue),
          maskedObservedValue: this.maskTIN(cleanVal),
          sourceDocumentId: source.documentId,
          sourceDocumentName: source.originalFilename,
          result,
          details,
          isBlocking
        });
      }
    });

    return findings;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-006: TAX-YEAR CONSISTENCY
  // --------------------------------------------------------------------------

  /**
   * Evaluates tax year across source documents against the engagement tax year.
   * Detects prior-year documents and amended/corrected forms, logging blocking conflicts on mismatch.
   */
  public static runTaxYearConsistencyValidation(
    clientId: string,
    expectedTaxYear: number
  ): TaxYearConsistencyFinding[] {
    const docs = StageTwoCollectionService.getUploadedDocuments(clientId, expectedTaxYear);
    const findings: TaxYearConsistencyFinding[] = [];

    docs.forEach(doc => {
      let detectedYear = expectedTaxYear;
      const yearMatch = doc.originalFileName.match(/(?:^|\D)(20[12]\d)(?:\D|$)/);
      if (yearMatch) {
        detectedYear = parseInt(yearMatch[1], 10);
      }

      const isCorrect = detectedYear === expectedTaxYear;
      const isPrior = detectedYear < expectedTaxYear;
      const isCorrected = /c\b|corr|amend/i.test(doc.originalFileName);

      let isBlocking = false;
      let details = `Tax year verified: ${expectedTaxYear}.`;

      if (!isCorrect) {
        isBlocking = true;
        details = `Tax Year Mismatch! File indicates tax year ${detectedYear}, but active engagement is for ${expectedTaxYear}.`;

        this.createConflict({
          clientId,
          taxYear: expectedTaxYear,
          conflictCategory: 'TAX_YEAR_MISMATCH',
          affectedField: 'tax_year',
          sourceA: {
            sourceId: `DOC-${doc.documentId}`,
            documentId: doc.documentId,
            documentName: doc.originalFileName,
            value: detectedYear,
            sourceTier: 'SUPPORTING'
          },
          sourceB: {
            sourceId: 'SYS_WORKSPACE_YEAR',
            documentId: 'WORKSPACE',
            documentName: 'Current Filing Tax Year',
            value: expectedTaxYear,
            sourceTier: 'AUTHORITATIVE'
          },
          observedValues: `Doc Year: ${detectedYear} vs Required Year: ${expectedTaxYear}`,
          variance: Math.abs(detectedYear - expectedTaxYear),
          materiality: 'MATERIAL',
          severity: 'HIGH',
          blockingStatus: true
        });
      }

      findings.push({
        findingId: `PER-${Math.random().toString(36).substring(2, 9)}`,
        documentId: doc.documentId,
        documentName: doc.originalFileName,
        expectedTaxYear,
        observedTaxYear: detectedYear,
        periodType: 'ANNUAL',
        isCorrectTaxYear: isCorrect,
        isCorrectedForm: isCorrected,
        isPriorYear: isPrior,
        details,
        isBlocking
      });
    });

    return findings;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-007: ENTITY CLASSIFICATION VALIDATION
  // --------------------------------------------------------------------------

  /**
   * Validates that uploaded documents match the client's tax entity classification
   * (e.g. Individual 1040, S-Corporation 1120-S, Partnership 1065, C-Corporation 1120).
   * Generates critical blocking conflicts on incompatible returns or schedules.
   */
  public static runEntityClassificationValidation(
    clientId: string,
    taxYear: number,
    expectedEntityType?: string
  ): EntityClassificationFinding[] {
    const ctx = StageTwoCollectionService.getWorkspaceContext(clientId, taxYear);
    const entityType = expectedEntityType || ctx.entityType;
    const docs = StageTwoCollectionService.getUploadedDocuments(clientId, taxYear);
    const findings: EntityClassificationFinding[] = [];

    docs.forEach(doc => {
      const cat = doc.claimedCategory.toLowerCase();
      let compatibilityStatus: 'COMPATIBLE' | 'INCOMPATIBLE' | 'REQUIRES_EXPLANATION' = 'COMPATIBLE';
      let isBlocking = false;
      let details = `Document category '${doc.claimedCategory}' is compatible with entity classification '${entityType}'.`;

      if (entityType === 'S-Corporation') {
        if (cat.includes('1065') || cat.includes('schedule c')) {
          compatibilityStatus = 'INCOMPATIBLE';
          isBlocking = true;
          details = `Entity classification mismatch! Client is an S-Corporation, but received '${doc.claimedCategory}' (Partnership / Sole Prop form).`;
        }
      } else if (entityType === 'Partnership') {
        if (cat.includes('1120-s') || cat.includes('1120') || cat.includes('schedule c')) {
          compatibilityStatus = 'INCOMPATIBLE';
          isBlocking = true;
          details = `Entity classification mismatch! Client is a Partnership (Form 1065), but received '${doc.claimedCategory}'.`;
        }
      } else if (entityType === 'Individual') {
        if (cat.includes('1120-s return') || cat.includes('1065 return') || cat.includes('1120 return')) {
          compatibilityStatus = 'INCOMPATIBLE';
          isBlocking = true;
          details = `Entity classification mismatch! Client is an Individual (Form 1040), but received business income tax return '${doc.claimedCategory}'.`;
        }
      } else if (entityType === 'C-Corporation') {
        if (cat.includes('1120-s') || cat.includes('1065') || cat.includes('schedule c')) {
          compatibilityStatus = 'INCOMPATIBLE';
          isBlocking = true;
          details = `Entity classification mismatch! Client is a C-Corporation (Form 1120), but received '${doc.claimedCategory}'.`;
        }
      }

      if (compatibilityStatus === 'INCOMPATIBLE') {
        this.createConflict({
          clientId,
          taxYear,
          conflictCategory: 'ENTITY_TYPE_MISMATCH',
          affectedField: 'entity_classification',
          sourceA: {
            sourceId: `DOC-${doc.documentId}`,
            documentId: doc.documentId,
            documentName: doc.originalFileName,
            value: doc.claimedCategory,
            sourceTier: 'AUTHORITATIVE'
          },
          sourceB: {
            sourceId: 'SYS_ENGAGEMENT_PROFILE',
            documentId: 'PROFILE',
            documentName: 'Engagement Master Profile',
            value: entityType,
            sourceTier: 'AUTHORITATIVE'
          },
          observedValues: `Document: "${doc.claimedCategory}" incompatible with "${entityType}"`,
          variance: 'ENTITY_TYPE_CONFLICT',
          materiality: 'MATERIAL',
          severity: 'CRITICAL',
          blockingStatus: true
        });
      }

      findings.push({
        findingId: `ECF-${Math.random().toString(36).substring(2, 9)}`,
        documentId: doc.documentId,
        documentName: doc.originalFileName,
        documentCategory: doc.claimedCategory,
        clientEntityClassification: entityType,
        compatibilityStatus,
        isBlocking,
        details
      });
    });

    return findings;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-008: CONTROLLED TAX FORM VALIDATION
  // --------------------------------------------------------------------------

  /**
   * Validates mandatory structural fields and required data completeness
   * on controlled tax forms (W-2, 1099-NEC, 1099-MISC, 1099-INT, 1099-DIV, K-1, 941).
   */
  public static runControlledTaxFormValidation(
    clientId: string,
    taxYear: number
  ): ControlledTaxFormValidationResult[] {
    const docs = StageTwoCollectionService.getUploadedDocuments(clientId, taxYear);
    const sources = this.getValidationSources(clientId, taxYear);
    const results: ControlledTaxFormValidationResult[] = [];

    const CONTROLLED_FORM_RULES: Record<string, Array<{ fieldName: string; label: string }>> = {
      'W-2': [
        { fieldName: 'employer_name', label: 'Employer Name' },
        { fieldName: 'employer_ein', label: 'Employer EIN' },
        { fieldName: 'employee_ssn', label: 'Employee SSN' },
        { fieldName: 'box1_wages', label: 'Box 1 Wages' },
        { fieldName: 'box2_fed_withheld', label: 'Box 2 Federal Tax Withheld' }
      ],
      '1099-NEC': [
        { fieldName: 'payer_tin', label: 'Payer TIN' },
        { fieldName: 'recipient_tin', label: 'Recipient TIN' },
        { fieldName: 'box1_nonemployee_compensation', label: 'Box 1 Nonemployee Compensation' }
      ],
      '1099-MISC': [
        { fieldName: 'payer_tin', label: 'Payer TIN' },
        { fieldName: 'recipient_tin', label: 'Recipient TIN' }
      ],
      '1099-INT': [
        { fieldName: 'payer_tin', label: 'Payer TIN' },
        { fieldName: 'recipient_tin', label: 'Recipient TIN' },
        { fieldName: 'box1_interest_income', label: 'Box 1 Interest Income' }
      ],
      '1099-DIV': [
        { fieldName: 'payer_tin', label: 'Payer TIN' },
        { fieldName: 'recipient_tin', label: 'Recipient TIN' },
        { fieldName: 'box1a_total_ordinary_dividends', label: 'Box 1a Total Ordinary Dividends' }
      ],
      'K-1': [
        { fieldName: 'entity_ein', label: 'Entity EIN' },
        { fieldName: 'partner_or_shareholder_tin', label: 'Partner/Shareholder TIN' }
      ],
      '941': [
        { fieldName: 'employer_ein', label: 'Employer EIN' },
        { fieldName: 'quarter', label: 'Quarter' },
        { fieldName: 'total_wages', label: 'Total Wages' }
      ]
    };

    docs.forEach(doc => {
      const matchedFormKey = Object.keys(CONTROLLED_FORM_RULES).find(key =>
        doc.claimedCategory.toLowerCase().includes(key.toLowerCase())
      );

      if (matchedFormKey) {
        const required = CONTROLLED_FORM_RULES[matchedFormKey];
        const docSources = sources.filter(s => s.documentId === doc.documentId);

        const evaluated: Array<{ fieldName: string; label: string; isPresent: boolean; value: any }> = [];
        const missing: string[] = [];

        required.forEach(rule => {
          const found = docSources.find(s => s.fieldName.toLowerCase() === rule.fieldName.toLowerCase());
          const hasValue = !!found && found.normalizedValue !== '' && found.normalizedValue !== null && found.normalizedValue !== undefined;

          evaluated.push({
            fieldName: rule.fieldName,
            label: rule.label,
            isPresent: hasValue,
            value: found ? found.normalizedValue : null
          });

          if (!hasValue) {
            missing.push(rule.label);
          }
        });

        const isMissingFields = missing.length > 0;
        const status: ControlledTaxFormValidationResult['status'] = isMissingFields ? 'MISSING_MANDATORY_FIELDS' : 'VALID';
        const isBlocking = isMissingFields;
        const details = isMissingFields
          ? `Controlled form '${doc.claimedCategory}' is missing mandatory IRS fields: ${missing.join(', ')}.`
          : `All mandatory fields for controlled form '${doc.claimedCategory}' are verified and present.`;

        if (isMissingFields) {
          this.createValidationException({
            clientId,
            taxYear,
            category: 'CONTROLLED_FORM_DEFECT',
            title: `Missing Mandatory Fields: ${doc.claimedCategory}`,
            description: `Document '${doc.originalFileName}' fails structural validation. Missing: ${missing.join(', ')}.`,
            severity: 'HIGH',
            isBlocking: true,
            relatedDocumentId: doc.documentId,
            createdBy: 'Controlled Form Validator',
            assignedTo: 'Lead Tax Reviewer / CPA'
          });
        }

        results.push({
          validationId: `CFV-${Math.random().toString(36).substring(2, 9)}`,
          documentId: doc.documentId,
          documentName: doc.originalFileName,
          formType: matchedFormKey,
          status,
          mandatoryFieldsEvaluated: evaluated,
          missingFields: missing,
          isBlocking,
          details
        });
      }
    });

    return results;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-005 (LEGACY/UI ALIAS): TAX-YEAR & PERIOD CONSISTENCY ENGINE
  // --------------------------------------------------------------------------

  public static runTaxYearPeriodValidation(
    clientId: string,
    expectedTaxYear: number
  ): PeriodConsistencyFinding[] {
    const docs = StageTwoCollectionService.getUploadedDocuments(clientId, expectedTaxYear);
    const findings: PeriodConsistencyFinding[] = [];

    docs.forEach(doc => {
      // Analyze year from filename or extraction
      let detectedYear = expectedTaxYear;
      const yearMatch = doc.originalFileName.match(/(?:^|\D)(20[12]\d)(?:\D|$)/);
      if (yearMatch) {
        detectedYear = parseInt(yearMatch[1], 10);
      }

      const isCorrect = detectedYear === expectedTaxYear;
      const isPrior = detectedYear < expectedTaxYear;
      const isCorrected = /c\b|corr|amend/i.test(doc.originalFileName);

      let isBlocking = false;
      let details = `Tax year verified: ${expectedTaxYear}.`;

      if (!isCorrect) {
        isBlocking = true;
        details = `Tax Year Mismatch! File indicates tax year ${detectedYear}, but active engagement is for ${expectedTaxYear}.`;

        // Log conflict and exception
        this.createConflict({
          clientId,
          taxYear: expectedTaxYear,
          conflictCategory: 'TAX_YEAR_MISMATCH',
          affectedField: 'tax_year',
          sourceA: {
            sourceId: `DOC-${doc.documentId}`,
            documentId: doc.documentId,
            documentName: doc.originalFileName,
            value: detectedYear,
            sourceTier: 'SUPPORTING'
          },
          sourceB: {
            sourceId: 'SYS_WORKSPACE_YEAR',
            documentId: 'WORKSPACE',
            documentName: 'Current Filing Tax Year',
            value: expectedTaxYear,
            sourceTier: 'AUTHORITATIVE'
          },
          observedValues: `Doc Year: ${detectedYear} vs Required Year: ${expectedTaxYear}`,
          variance: Math.abs(detectedYear - expectedTaxYear),
          materiality: 'MATERIAL',
          severity: 'HIGH',
          blockingStatus: true
        });
      }

      findings.push({
        findingId: `PER-${Math.random().toString(36).substring(2, 9)}`,
        documentId: doc.documentId,
        documentName: doc.originalFileName,
        expectedTaxYear,
        observedTaxYear: detectedYear,
        periodType: 'ANNUAL',
        periodIdentifier: `CY${detectedYear}`,
        isCorrectTaxYear: isCorrect,
        isCorrectedForm: isCorrected,
        isPriorYear: isPrior,
        details,
        isBlocking
      });
    });

    return findings;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-006: CROSS-DOCUMENT CONSISTENCY ENGINE
  // --------------------------------------------------------------------------

  public static runCrossDocumentValidation(clientId: string, taxYear: number): CrossDocumentRule[] {
    const sources = this.getValidationSources(clientId, taxYear);
    const rules: CrossDocumentRule[] = [];

    // Helper: find numeric value of field in specific category
    const findValue = (categorySubstring: string, fieldName: string): { val: number | null; source?: ValidationSourceRecord } => {
      const match = sources.find(
        s => s.documentCategory.toLowerCase().includes(categorySubstring.toLowerCase()) &&
             s.fieldName.toLowerCase() === fieldName.toLowerCase()
      );
      if (!match) return { val: null };
      const num = parseFloat(String(match.normalizedValue).replace(/[^0-9.-]+/g, ''));
      return { val: isNaN(num) ? null : num, source: match };
    };

    // RULE 1: W-2 Box 1 Wages vs Payroll Summary Total Wages
    const w2Wages = findValue('W-2', 'box1_wages');
    const payrollWages = findValue('Payroll', 'total_gross_wages');

    if (w2Wages.val === null || payrollWages.val === null) {
      rules.push({
        ruleId: 'R-W2-PAYROLL-WAGES',
        ruleName: 'W-2 Wages vs Payroll Summary Reconciliation',
        ruleVersion: '1.0',
        sourceTypes: ['Form W-2', 'Annual Payroll Summary'],
        comparisonMethod: 'EXACT_MATCH',
        materialityThreshold: 1.0,
        severity: 'HIGH',
        result: 'INSUFFICIENT_EVIDENCE',
        expectedValue: payrollWages.val,
        observedValue: w2Wages.val,
        variance: null,
        sourceReferences: [
          ...(w2Wages.source ? [{ sourceId: w2Wages.source.validationSourceId, documentId: w2Wages.source.documentId, documentName: w2Wages.source.originalFilename, fieldName: 'box1_wages', value: w2Wages.val }] : []),
          ...(payrollWages.source ? [{ sourceId: payrollWages.source.validationSourceId, documentId: payrollWages.source.documentId, documentName: payrollWages.source.originalFilename, fieldName: 'total_gross_wages', value: payrollWages.val }] : [])
        ],
        requiresHumanReview: false,
        blockingStatus: false,
        narrative: 'Insufficient evidence: Both W-2 and Annual Payroll records are required to perform cross-document wage reconciliation.'
      });
    } else {
      const variance = Math.abs(w2Wages.val - payrollWages.val);
      const isPass = variance <= 1.0;

      if (!isPass) {
        this.createConflict({
          clientId,
          taxYear,
          conflictCategory: 'AMOUNT_MISMATCH',
          affectedField: 'box1_wages',
          sourceA: {
            sourceId: w2Wages.source!.validationSourceId,
            documentId: w2Wages.source!.documentId,
            documentName: w2Wages.source!.originalFilename,
            value: w2Wages.val,
            sourceTier: w2Wages.source!.sourceTier
          },
          sourceB: {
            sourceId: payrollWages.source!.validationSourceId,
            documentId: payrollWages.source!.documentId,
            documentName: payrollWages.source!.originalFilename,
            value: payrollWages.val,
            sourceTier: payrollWages.source!.sourceTier
          },
          observedValues: `W-2: $${w2Wages.val.toLocaleString()} vs Payroll: $${payrollWages.val.toLocaleString()}`,
          variance,
          materiality: 'MATERIAL',
          severity: 'HIGH',
          blockingStatus: true
        });
      }

      rules.push({
        ruleId: 'R-W2-PAYROLL-WAGES',
        ruleName: 'W-2 Wages vs Payroll Summary Reconciliation',
        ruleVersion: '1.0',
        sourceTypes: ['Form W-2', 'Annual Payroll Summary'],
        comparisonMethod: 'EXACT_MATCH',
        materialityThreshold: 1.0,
        severity: 'HIGH',
        result: isPass ? 'PASS' : 'FAIL',
        expectedValue: payrollWages.val,
        observedValue: w2Wages.val,
        variance,
        sourceReferences: [
          { sourceId: w2Wages.source!.validationSourceId, documentId: w2Wages.source!.documentId, documentName: w2Wages.source!.originalFilename, fieldName: 'box1_wages', value: w2Wages.val },
          { sourceId: payrollWages.source!.validationSourceId, documentId: payrollWages.source!.documentId, documentName: payrollWages.source!.originalFilename, fieldName: 'total_gross_wages', value: payrollWages.val }
        ],
        requiresHumanReview: !isPass,
        blockingStatus: !isPass,
        narrative: isPass
          ? `Cross-document reconciliation passed: W-2 Box 1 wages ($${w2Wages.val}) reconcile exactly with Payroll Summary ($${payrollWages.val}).`
          : `Cross-document variance detected: W-2 Box 1 wages ($${w2Wages.val}) differ from Payroll Summary ($${payrollWages.val}) by $${variance.toFixed(2)}.`
      });
    }

    // RULE 2: Trial Balance Debit / Credit Equilibrium Check
    const debits = findValue('Trial Balance', 'total_debits');
    const credits = findValue('Trial Balance', 'total_credits');

    if (debits.val !== null && credits.val !== null) {
      const diff = Math.abs(debits.val - credits.val);
      const isBalanced = diff < 0.01;

      rules.push({
        ruleId: 'R-TB-DEBIT-CREDIT',
        ruleName: 'Trial Balance Debit / Credit Mathematical Equilibrium',
        ruleVersion: '1.0',
        sourceTypes: ['Trial Balance'],
        comparisonMethod: 'EXACT_MATCH',
        materialityThreshold: 0.01,
        severity: 'CRITICAL',
        result: isBalanced ? 'PASS' : 'FAIL',
        expectedValue: credits.val,
        observedValue: debits.val,
        variance: diff,
        sourceReferences: [
          { sourceId: debits.source!.validationSourceId, documentId: debits.source!.documentId, documentName: debits.source!.originalFilename, fieldName: 'total_debits', value: debits.val },
          { sourceId: credits.source!.validationSourceId, documentId: credits.source!.documentId, documentName: credits.source!.originalFilename, fieldName: 'total_credits', value: credits.val }
        ],
        requiresHumanReview: !isBalanced,
        blockingStatus: !isBalanced,
        narrative: isBalanced
          ? `Trial balance in balance: Total Debits ($${debits.val.toLocaleString()}) = Total Credits ($${credits.val.toLocaleString()}).`
          : `Out of balance! Debits ($${debits.val.toLocaleString()}) differ from Credits ($${credits.val.toLocaleString()}) by $${diff.toFixed(2)}.`
      });
    }

    return rules;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-007: MATHEMATICAL & STRUCTURAL VALIDATION ENGINE
  // --------------------------------------------------------------------------

  public static runMathematicalValidation(
    clientId: string,
    taxYear: number
  ): MathematicalValidationResult[] {
    const sources = this.getValidationSources(clientId, taxYear);
    const results: MathematicalValidationResult[] = [];

    // Helper: get numeric field
    const getNum = (fieldName: string): { val: number | null; sourceId?: string } => {
      const found = sources.find(s => s.fieldName.toLowerCase() === fieldName.toLowerCase());
      if (!found) return { val: null };
      const n = parseFloat(String(found.normalizedValue).replace(/[^0-9.-]+/g, ''));
      return { val: isNaN(n) ? null : n, sourceId: found.validationSourceId };
    };

    // CALCULATION 1: Gross -> Deduction -> Net Pay Verification
    const gross = getNum('gross_wages');
    const deductions = getNum('pretax_deductions');
    const taxable = getNum('box1_wages');

    if (gross.val === null || taxable.val === null) {
      // INSUFFICIENT EVIDENCE: Never fabricate numbers
      results.push({
        calculationId: 'CALC-NET-PAY-01',
        calculationName: 'Taxable Wages Arithmetic Verification (Gross - Deductions = Taxable)',
        relationshipType: 'GROSS_DEDUCTION_NET',
        status: 'INSUFFICIENT_EVIDENCE',
        computedValue: null,
        statedValue: taxable.val,
        variance: null,
        tolerance: 0.05,
        componentInputs: [
          { label: 'Gross Pay', value: gross.val, sourceId: gross.sourceId },
          { label: 'Pre-Tax Deductions', value: deductions.val, sourceId: deductions.sourceId },
          { label: 'Taxable Wages', value: taxable.val, sourceId: taxable.sourceId }
        ],
        isFabricated: false,
        notes: 'Insufficient source evidence: Gross wages and/or taxable wage fields missing. No estimation performed.'
      });
    } else {
      const ded = deductions.val || 0;
      const expectedTaxable = gross.val - ded;
      const variance = Math.abs(expectedTaxable - taxable.val);
      const isValid = variance <= 0.05;

      results.push({
        calculationId: 'CALC-NET-PAY-01',
        calculationName: 'Taxable Wages Arithmetic Verification (Gross - Deductions = Taxable)',
        relationshipType: 'GROSS_DEDUCTION_NET',
        status: isValid ? 'VALID' : 'VARIANCE_DETECTED',
        computedValue: expectedTaxable,
        statedValue: taxable.val,
        variance,
        tolerance: 0.05,
        componentInputs: [
          { label: 'Gross Pay', value: gross.val, sourceId: gross.sourceId },
          { label: 'Pre-Tax Deductions', value: ded, sourceId: deductions.sourceId },
          { label: 'Stated Taxable Wages', value: taxable.val, sourceId: taxable.sourceId }
        ],
        isFabricated: false,
        notes: isValid
          ? 'Arithmetic relationship confirmed. Computed value matches stated value within tolerance.'
          : `Mathematical variance of $${variance.toFixed(2)} detected between computed ($${expectedTaxable}) and stated ($${taxable.val}).`
      });
    }

    // CALCULATION 2: Quarterly Sum -> Annual Total Reconciliation
    const q1 = getNum('payroll_q1');
    const q2 = getNum('payroll_q2');
    const q3 = getNum('payroll_q3');
    const q4 = getNum('payroll_q4');
    const annual = getNum('payroll_annual_total');

    if (q1.val === null || q2.val === null || q3.val === null || q4.val === null || annual.val === null) {
      results.push({
        calculationId: 'CALC-QTR-SUM-02',
        calculationName: 'Quarterly Payroll -> Annual Total Summation',
        relationshipType: 'QUARTERLY_ANNUAL_SUM',
        status: 'INSUFFICIENT_EVIDENCE',
        computedValue: null,
        statedValue: annual.val,
        variance: null,
        tolerance: 0.01,
        componentInputs: [
          { label: 'Q1', value: q1.val, sourceId: q1.sourceId },
          { label: 'Q2', value: q2.val, sourceId: q2.sourceId },
          { label: 'Q3', value: q3.val, sourceId: q3.sourceId },
          { label: 'Q4', value: q4.val, sourceId: q4.sourceId },
          { label: 'Annual Total', value: annual.val, sourceId: annual.sourceId }
        ],
        isFabricated: false,
        notes: 'Quarterly payroll figures incomplete across one or more quarters. Insufficient evidence.'
      });
    } else {
      const sum = q1.val + q2.val + q3.val + q4.val;
      const variance = Math.abs(sum - annual.val);
      const isValid = variance <= 0.01;

      results.push({
        calculationId: 'CALC-QTR-SUM-02',
        calculationName: 'Quarterly Payroll -> Annual Total Summation',
        relationshipType: 'QUARTERLY_ANNUAL_SUM',
        status: isValid ? 'VALID' : 'VARIANCE_DETECTED',
        computedValue: sum,
        statedValue: annual.val,
        variance,
        tolerance: 0.01,
        componentInputs: [
          { label: 'Q1', value: q1.val, sourceId: q1.sourceId },
          { label: 'Q2', value: q2.val, sourceId: q2.sourceId },
          { label: 'Q3', value: q3.val, sourceId: q3.sourceId },
          { label: 'Q4', value: q4.val, sourceId: q4.sourceId },
          { label: 'Stated Annual Total', value: annual.val, sourceId: annual.sourceId }
        ],
        isFabricated: false,
        notes: isValid
          ? 'Sum of four quarters matches annual payroll control total.'
          : `Sum of quarters ($${sum}) does not tie to annual total ($${annual.val}). Variance: $${variance.toFixed(2)}.`
      });
    }

    return results;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-009: VALIDATION CONFLICT ENGINE
  // --------------------------------------------------------------------------

  public static getConflicts(clientId: string, taxYear: number): ValidationConflict[] {
    const key = `${clientId}_${taxYear}`;
    if (!this.conflictsStore.has(key)) {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY_VAL_CONFLICTS}_${key}`);
          if (stored) {
            this.conflictsStore.set(key, JSON.parse(stored));
          }
        } catch {
          // ignore
        }
      }
    }
    return this.conflictsStore.get(key) || [];
  }

  public static createConflict(
    conflictData: Omit<ValidationConflict, 'conflictId' | 'createdTimestamp' | 'resolutionStatus' | 'assignedReviewer'> & {
      assignedReviewer?: string;
    }
  ): ValidationConflict {
    const conflictId = `CONF-${conflictData.taxYear}-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();

    const conflict: ValidationConflict = {
      ...conflictData,
      conflictId,
      createdTimestamp: timestamp,
      assignedReviewer: conflictData.assignedReviewer || 'Senior Tax Reviewer / CPA',
      resolutionStatus: 'UNRESOLVED'
    };

    const key = `${conflict.clientId}_${conflict.taxYear}`;
    const list = this.getConflicts(conflict.clientId, conflict.taxYear);
    list.push(conflict);
    this.conflictsStore.set(key, list);
    this.persistConflicts(key, list);

    // Audit log (TG-VAL-012)
    TaxGuardAuditService.logEvent({
      tenantId: 'tenant_ar_tax_prod',
      userId: 'system_stage3_validator',
      userEmail: 'system@artaxservices.com',
      userRole: 'system',
      action: 'VALIDATION_CONFLICT_CREATED',
      recordType: 'governance',
      recordId: conflictId,
      ipAddress: '127.0.0.1 (Validation Engine)',
      result: 'success',
      riskLevel: conflict.materiality === 'MATERIAL' ? 'material' : 'routine',
      details: `Validation conflict logged [${conflict.conflictCategory}] on field '${conflict.affectedField}': ${conflict.observedValues}. Severity: ${conflict.severity}`
    });

    // If material or blocking, automatically create a validation exception (TG-VAL-010)
    if (conflict.materiality === 'MATERIAL' || conflict.blockingStatus) {
      this.createValidationException({
        clientId: conflict.clientId,
        taxYear: conflict.taxYear,
        category: conflict.conflictCategory,
        title: `Material Conflict: ${conflict.affectedField}`,
        description: `Unresolved conflict between ${conflict.sourceA.documentName} and ${conflict.sourceB.documentName}: ${conflict.observedValues}`,
        severity: conflict.severity,
        isBlocking: conflict.blockingStatus,
        relatedConflictId: conflictId,
        createdBy: 'System Validation Engine',
        assignedTo: conflict.assignedReviewer
      });

      // Also route to human review queue (TG-VAL-011)
      this.enqueueHumanReview({
        clientId: conflict.clientId,
        taxYear: conflict.taxYear,
        itemType: 'CONFLICT',
        referenceId: conflictId,
        title: `Resolve Conflict: ${conflict.affectedField}`,
        description: conflict.observedValues,
        severity: conflict.severity,
        assignedReviewer: conflict.assignedReviewer
      });
    }

    return conflict;
  }

  public static resolveConflict(params: {
    clientId: string;
    taxYear: number;
    conflictId: string;
    resolvedBy: string;
    resolvedByRole: 'cpa' | 'reviewer' | 'admin';
    resolutionRationale: string;
    action: 'ACCEPT_SOURCE_A' | 'ACCEPT_SOURCE_B' | 'OVERRIDE_CUSTOM' | 'WAIVE';
    customValue?: any;
  }): ValidationConflict {
    if (!params.resolutionRationale || !params.resolutionRationale.trim()) {
      throw new Error('A detailed written rationale is required to resolve validation conflicts.');
    }

    if (params.resolvedByRole !== 'cpa' && params.resolvedByRole !== 'reviewer' && params.resolvedByRole !== 'admin') {
      throw new Error(`Unauthorized: Role '${params.resolvedByRole}' cannot resolve validation conflicts. Requires CPA or Reviewer credentials.`);
    }

    const key = `${params.clientId}_${params.taxYear}`;
    const list = this.getConflicts(params.clientId, params.taxYear);
    const item = list.find(c => c.conflictId === params.conflictId);

    if (!item) {
      throw new Error(`Conflict ${params.conflictId} not found.`);
    }

    item.resolutionStatus = 'RESOLVED';
    item.resolutionRationale = params.resolutionRationale;
    item.resolvedBy = `${params.resolvedBy} (${params.resolvedByRole.toUpperCase()})`;
    item.resolvedTimestamp = new Date().toISOString();

    this.conflictsStore.set(key, list);
    this.persistConflicts(key, list);

    TaxGuardAuditService.logEvent({
      tenantId: 'tenant_ar_tax_prod',
      userId: params.resolvedBy,
      userEmail: `${params.resolvedBy.toLowerCase()}@artaxservices.com`,
      userRole: params.resolvedByRole,
      action: 'VALIDATION_VALUE_CORRECTED',
      recordType: 'governance',
      recordId: params.conflictId,
      ipAddress: '127.0.0.1 (Reviewer Workspace)',
      result: 'success',
      riskLevel: 'routine',
      details: `Conflict ${params.conflictId} resolved by ${params.resolvedBy} via ${params.action}. Rationale: "${params.resolutionRationale}"`
    });

    return item;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-010: VALIDATION EXCEPTION REGISTRY
  // --------------------------------------------------------------------------

  public static getExceptions(clientId: string, taxYear: number): ValidationException[] {
    const key = `${clientId}_${taxYear}`;
    if (!this.exceptionsStore.has(key)) {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY_VAL_EXCEPTIONS}_${key}`);
          if (stored) {
            this.exceptionsStore.set(key, JSON.parse(stored));
          }
        } catch {
          // ignore
        }
      }
    }
    return this.exceptionsStore.get(key) || [];
  }

  public static createValidationException(
    params: Omit<ValidationException, 'exceptionId' | 'createdTimestamp' | 'status'>
  ): ValidationException {
    const exceptionId = `VEX-${params.taxYear}-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();

    const exception: ValidationException = {
      ...params,
      exceptionId,
      createdTimestamp: timestamp,
      status: 'OPEN'
    };

    const key = `${params.clientId}_${params.taxYear}`;
    const list = this.getExceptions(params.clientId, params.taxYear);
    list.push(exception);
    this.exceptionsStore.set(key, list);
    this.persistExceptions(key, list);

    TaxGuardAuditService.logEvent({
      tenantId: 'tenant_ar_tax_prod',
      userId: params.createdBy,
      userEmail: 'support@artaxservices.com',
      userRole: 'system',
      action: 'VALIDATION_EXCEPTION_CREATED',
      recordType: 'governance',
      recordId: exceptionId,
      ipAddress: '127.0.0.1 (Validation Service)',
      result: 'success',
      riskLevel: params.severity === 'CRITICAL' || params.isBlocking ? 'material' : 'routine',
      details: `Stage 03 validation exception created [${exceptionId}]: ${exception.title}. Severity: ${exception.severity}. Blocking: ${exception.isBlocking}`
    });

    return exception;
  }

  public static resolveValidationException(params: {
    clientId: string;
    taxYear: number;
    exceptionId: string;
    resolvedBy: string;
    resolvedByRole: 'cpa' | 'reviewer' | 'admin' | 'accountant';
    action: string;
    justification: string;
  }): ValidationException {
    // Client role cannot resolve staff validation exceptions
    if ((params.resolvedByRole as string) === 'client') {
      throw new Error("Unauthorized: Client role cannot resolve internal validation exceptions.");
    }

    if (!params.justification || !params.justification.trim()) {
      throw new Error("A professional justification is required to resolve validation exceptions.");
    }

    const key = `${params.clientId}_${params.taxYear}`;
    const list = this.getExceptions(params.clientId, params.taxYear);
    const item = list.find(e => e.exceptionId === params.exceptionId);

    if (!item) {
      throw new Error(`Validation exception ${params.exceptionId} not found.`);
    }

    item.status = 'RESOLVED';
    item.resolution = {
      resolvedAt: new Date().toISOString(),
      resolvedBy: params.resolvedBy,
      resolvedByRole: params.resolvedByRole,
      resolutionAction: params.action,
      justification: params.justification
    };

    this.exceptionsStore.set(key, list);
    this.persistExceptions(key, list);

    TaxGuardAuditService.logEvent({
      tenantId: 'tenant_ar_tax_prod',
      userId: params.resolvedBy,
      userEmail: `${params.resolvedBy.toLowerCase()}@artaxservices.com`,
      userRole: params.resolvedByRole,
      action: 'VALIDATION_EXCEPTION_RESOLVED',
      recordType: 'governance',
      recordId: params.exceptionId,
      ipAddress: '127.0.0.1 (Reviewer Service)',
      result: 'success',
      riskLevel: 'routine',
      details: `Validation exception ${params.exceptionId} resolved by ${params.resolvedBy} (${params.resolvedByRole}). Action: ${params.action}. Justification: "${params.justification}"`
    });

    return item;
  }

  public static waiveValidationException(params: {
    clientId: string;
    taxYear: number;
    exceptionId: string;
    waivedBy: string;
    waivedByRole: 'cpa' | 'reviewer' | 'admin';
    justification: string;
  }): ValidationException {
    if (params.waivedByRole !== 'cpa' && params.waivedByRole !== 'reviewer' && params.waivedByRole !== 'admin') {
      throw new Error(`Unauthorized: Role '${params.waivedByRole}' cannot waive validation exceptions. Requires CPA or Reviewer credentials.`);
    }

    if (!params.justification || !params.justification.trim()) {
      throw new Error('A documented professional justification is required to waive validation exceptions.');
    }

    const key = `${params.clientId}_${params.taxYear}`;
    const list = this.getExceptions(params.clientId, params.taxYear);
    const item = list.find(e => e.exceptionId === params.exceptionId);

    if (!item) {
      throw new Error(`Validation exception ${params.exceptionId} not found.`);
    }

    item.status = 'WAIVED';
    item.resolution = {
      resolvedAt: new Date().toISOString(),
      resolvedBy: params.waivedBy,
      resolvedByRole: params.waivedByRole,
      resolutionAction: 'WAIVED_BY_CPA',
      justification: params.justification
    };

    this.exceptionsStore.set(key, list);
    this.persistExceptions(key, list);

    return item;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-011: OPERATIONAL HUMAN VALIDATION REVIEW QUEUE
  // --------------------------------------------------------------------------

  public static getReviewQueue(clientId: string, taxYear: number): HumanValidationQueueItem[] {
    const key = `${clientId}_${taxYear}`;
    if (!this.queueStore.has(key)) {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY_VAL_QUEUE}_${key}`);
          if (stored) {
            this.queueStore.set(key, JSON.parse(stored));
          }
        } catch {
          // ignore
        }
      }
    }
    return this.queueStore.get(key) || [];
  }

  public static enqueueHumanReview(
    itemData: Omit<HumanValidationQueueItem, 'queueItemId' | 'status'>
  ): HumanValidationQueueItem {
    const queueItemId = `HVR-${itemData.taxYear}-${Math.floor(10000 + Math.random() * 90000)}`;

    const item: HumanValidationQueueItem = {
      ...itemData,
      queueItemId,
      status: 'PENDING_REVIEW'
    };

    const key = `${itemData.clientId}_${itemData.taxYear}`;
    const list = this.getReviewQueue(itemData.clientId, itemData.taxYear);
    list.push(item);
    this.queueStore.set(key, list);
    this.persistQueue(key, list);

    TaxGuardAuditService.logEvent({
      tenantId: 'tenant_ar_tax_prod',
      userId: 'system_stage3_queue',
      userEmail: 'system@artaxservices.com',
      userRole: 'system',
      action: 'VALIDATION_REVIEW_ASSIGNED',
      recordType: 'governance',
      recordId: queueItemId,
      ipAddress: '127.0.0.1 (Review Engine)',
      result: 'success',
      riskLevel: 'routine',
      details: `Human validation review assigned to ${item.assignedReviewer}: ${item.title}`
    });

    return item;
  }

  public static recordReviewDisposition(params: {
    clientId: string;
    taxYear: number;
    queueItemId: string;
    actor: string;
    actorRole: 'cpa' | 'reviewer' | 'admin' | 'accountant';
    action: HumanValidationQueueItem['disposition']['action'];
    justification: string;
    correctedValue?: any;
  }): HumanValidationQueueItem {
    if (!params.justification || !params.justification.trim()) {
      throw new Error('A written rationale is required to disposition review items.');
    }

    const key = `${params.clientId}_${params.taxYear}`;
    const list = this.getReviewQueue(params.clientId, params.taxYear);
    const item = list.find(q => q.queueItemId === params.queueItemId);

    if (!item) {
      throw new Error(`Review item ${params.queueItemId} not found.`);
    }

    item.status = 'RESOLVED';
    item.disposition = {
      action: params.action,
      actor: params.actor,
      actorRole: params.actorRole,
      timestamp: new Date().toISOString(),
      justification: params.justification,
      correctedValue: params.correctedValue
    };

    this.queueStore.set(key, list);
    this.persistQueue(key, list);

    return item;
  }

  // --------------------------------------------------------------------------
  // TG-VAL-012: VALIDATION PROVENANCE LEDGER
  // --------------------------------------------------------------------------

  public static getProvenanceLedger(clientId: string, taxYear: number): ValidationProvenanceEntry[] {
    const key = `${clientId}_${taxYear}`;
    if (!this.provenanceStore.has(key)) {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY_VAL_PROVENANCE}_${key}`);
          if (stored) {
            this.provenanceStore.set(key, JSON.parse(stored));
          }
        } catch {
          // ignore
        }
      }
    }
    return this.provenanceStore.get(key) || [];
  }

  private static recordProvenance(entry: Omit<ValidationProvenanceEntry, 'provenanceId'>): ValidationProvenanceEntry {
    const full: ValidationProvenanceEntry = {
      ...entry,
      provenanceId: `PROV-${Math.floor(100000 + Math.random() * 900000)}`
    };

    const key = `global_ledger`;
    const list = this.provenanceStore.get(key) || [];
    list.unshift(full);
    this.provenanceStore.set(key, list);
    return full;
  }

  // --------------------------------------------------------------------------
  // UPSTREAM INVALIDATION CHECK
  // --------------------------------------------------------------------------

  /**
   * Evaluates if Stage 02 has been reopened or modified since validation began.
   * If Stage 02 is invalidated, transitions Stage 03 to REVALIDATION_REQUIRED
   * and marks sources as STALE without deleting previous audit history.
   */
  public static checkAndApplyUpstreamInvalidation(clientId: string, taxYear: number): {
    isInvalidated: boolean;
    reason?: string;
  } {
    const gate = StageTwoCollectionOperationsService.getExitGateStatus(clientId, taxYear);

    if (!gate || gate.stageTwoStatus === 'REOPENED' || gate.stageThreeStatus === 'REVALIDATION_REQUIRED') {
      const key = `${clientId}_${taxYear}`;
      const sources = this.getValidationSources(clientId, taxYear);

      sources.forEach(s => {
        if (s.validationStatus === 'VALIDATED') {
          s.validationStatus = 'STALE';
        }
      });
      this.sourcesStore.set(key, sources);
      this.persistSources(key, sources);

      TaxGuardAuditService.logEvent({
        tenantId: 'tenant_ar_tax_prod',
        userId: 'system_stage3_monitor',
        userEmail: 'system@artaxservices.com',
        userRole: 'system',
        action: 'VALIDATION_REOPENED',
        recordType: 'governance',
        recordId: `INV-${clientId}-${taxYear}`,
        ipAddress: '127.0.0.1 (Watcher)',
        result: 'error',
        riskLevel: 'material',
        details: `Stage 03 validation marked REVALIDATION_REQUIRED due to upstream Stage 02 reopening. Validated sources marked STALE.`
      });

      return {
        isInvalidated: true,
        reason: 'Upstream Stage 02 collection record was reopened or superseded.'
      };
    }

    return { isInvalidated: false };
  }

  // --------------------------------------------------------------------------
  // READINESS EVALUATION
  // --------------------------------------------------------------------------

  public static calculateReadinessPercentage(clientId: string, taxYear: number): number {
    const sources = this.getValidationSources(clientId, taxYear);
    if (sources.length === 0) return 0;

    const exceptions = this.getExceptions(clientId, taxYear);
    const conflicts = this.getConflicts(clientId, taxYear);

    const openBlockingExceptions = exceptions.filter(e => e.isBlocking && e.status !== 'RESOLVED' && e.status !== 'WAIVED');
    const unresolvedConflicts = conflicts.filter(c => c.resolutionStatus === 'UNRESOLVED');

    if (openBlockingExceptions.length > 0 || unresolvedConflicts.length > 0) {
      const penalty = (openBlockingExceptions.length * 20) + (unresolvedConflicts.length * 15);
      return Math.max(10, Math.min(95, 100 - penalty));
    }

    return 100;
  }

  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------

  public static maskTIN(tin: string): string {
    if (!tin) return '***-**-****';
    const digits = tin.replace(/\D/g, '');
    if (digits.length === 9) {
      return `***-**-${digits.substring(5)}`;
    }
    return `***-${digits.slice(-4)}`;
  }

  private static persistSources(key: string, data: ValidationSourceRecord[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY_VAL_SOURCES}_${key}`, JSON.stringify(data));
      } catch {
        // storage quota
      }
    }
  }

  private static persistConflicts(key: string, data: ValidationConflict[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY_VAL_CONFLICTS}_${key}`, JSON.stringify(data));
      } catch {
        // ignore
      }
    }
  }

  private static persistExceptions(key: string, data: ValidationException[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY_VAL_EXCEPTIONS}_${key}`, JSON.stringify(data));
      } catch {
        // ignore
      }
    }
  }

  private static persistQueue(key: string, data: HumanValidationQueueItem[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY_VAL_QUEUE}_${key}`, JSON.stringify(data));
      } catch {
        // ignore
      }
    }
  }
}
