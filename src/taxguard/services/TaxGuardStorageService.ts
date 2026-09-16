/**
 * TaxGuard AI – Core Storage & Data Management Service
 * Multi-tenant, role-isolated repository with cryptographic hashing.
 */

import {
  TaxGuardEngagementCase,
  TaxGuardDocument,
  TaxGuardExtractionDossier,
  TaxGuardDiscrepancy,
  TaxGuardMissingItem,
  TaxGuardExpenseItem,
  DraftWorkpaper,
  PublicVerificationRecord
} from '../types';
import { TaxGuardAuditService } from './TaxGuardAuditService';

// Initial synthetic cases for demonstration & staff workflows
const INITIAL_CASES: TaxGuardEngagementCase[] = [
  {
    id: 'case_2025_001',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    clientName: 'Daniel Henze (Henze Construction, LLC)',
    clientEmail: 'dhenzeconstruction@gmail.com',
    entityType: 'Single-Member LLC',
    taxYear: 2024,
    returnType: '1040',
    jurisdictions: ['Federal', 'South Carolina'],
    assignedPreparer: 'Marcus Vance, EA',
    assignedReviewer: 'Sarah Jenkins, CPA',
    assignedCpa: 'Desmond Hinds, Principal',
    status: 'extraction_review',
    priority: 'expedited',
    internalDeadline: '2025-03-15',
    filingDeadline: '2025-04-15',
    clientProgressPercent: 75,
    missingItemsCount: 2,
    discrepanciesCount: 1,
    lockedFinalPackage: false,
    makerCheckerSteps: [
      { stepNumber: 1, stepName: 'Client Intake Submission', description: 'Tax organizer and profile answered', requiredRole: 'client', riskTier: 'informational', completed: true, completedBy: 'Daniel Henze', completedAt: '2025-01-20' },
      { stepNumber: 2, stepName: 'Document Collection & Validation', description: 'MIME validation & quarantine checks', requiredRole: 'preparer', riskTier: 'routine', completed: true, completedBy: 'Marcus Vance, EA', completedAt: '2025-01-22' },
      { stepNumber: 3, stepName: 'AI Extraction & Confidence Triage', description: 'OCR extraction of W-2, 1099, & Bank PDFs', requiredRole: 'preparer', riskTier: 'material', completed: false, requiresDualAuthorization: true },
      { stepNumber: 4, stepName: 'Preparer Review & Reconciliation', description: 'Check variance analysis & Schedule C', requiredRole: 'preparer', riskTier: 'material', completed: false, requiresDualAuthorization: true },
      { stepNumber: 5, stepName: 'Senior CPA Technical Review', description: 'Section 179 depreciation & SC allocation', requiredRole: 'reviewer', riskTier: 'high_risk', completed: false, requiresDualAuthorization: true },
      { stepNumber: 6, stepName: 'Quality Control Sign-Off', description: 'Verify discrepancy closure', requiredRole: 'cpa', riskTier: 'high_risk', completed: false, requiresDualAuthorization: true },
      { stepNumber: 7, stepName: 'Client E-Sign Authorization', description: 'Form 8879 authorization e-signature', requiredRole: 'client', riskTier: 'filing_critical', completed: false, requiresDualAuthorization: true },
      { stepNumber: 8, stepName: 'Final Lock & Package Hashing', description: 'SHA-256 seal & QR code minting', requiredRole: 'cpa', riskTier: 'filing_critical', completed: false, requiresDualAuthorization: true },
      { stepNumber: 9, stepName: 'Filing Release (Drake / IRS MeF Gate)', description: 'Electronic filing transmission gate', requiredRole: 'cpa', riskTier: 'filing_critical', completed: false, requiresDualAuthorization: true },
      { stepNumber: 10, stepName: 'Statutory Archive & Chain of Custody', description: '7-year retention commit & audit freeze', requiredRole: 'admin', riskTier: 'filing_critical', completed: false, requiresDualAuthorization: false }
    ]
  },
  {
    id: 'case_2025_002',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_palmetto_002',
    clientName: 'Palmetto Ridge Holdings, Inc.',
    clientEmail: 'finance@palmettoridge.com',
    entityType: 'S-Corporation',
    taxYear: 2024,
    returnType: '1120-S',
    jurisdictions: ['Federal', 'South Carolina', 'North Carolina'],
    assignedPreparer: 'Marcus Vance, EA',
    assignedReviewer: 'Sarah Jenkins, CPA',
    assignedCpa: 'Desmond Hinds, Principal',
    status: 'cpa_review',
    priority: 'urgent_statute',
    internalDeadline: '2025-03-01',
    filingDeadline: '2025-03-15',
    clientProgressPercent: 90,
    missingItemsCount: 0,
    discrepanciesCount: 0,
    lockedFinalPackage: false,
    makerCheckerSteps: [
      { stepNumber: 1, stepName: 'Client Intake Submission', description: 'Corporate questionnaire complete', requiredRole: 'client', riskTier: 'informational', completed: true, completedBy: 'C. Calhoun, CFO', completedAt: '2025-01-15' },
      { stepNumber: 2, stepName: 'Document Collection & Validation', description: 'Trial balance, 1120-S prior returns', requiredRole: 'preparer', riskTier: 'routine', completed: true, completedBy: 'Marcus Vance, EA', completedAt: '2025-01-18' },
      { stepNumber: 3, stepName: 'AI Extraction & Confidence Triage', description: 'Extracted K-1s and 1099-DIV', requiredRole: 'preparer', riskTier: 'material', completed: true, completedBy: 'Marcus Vance, EA', completedAt: '2025-01-20' },
      { stepNumber: 4, stepName: 'Preparer Review & Reconciliation', description: 'Schedule M-1 book-to-tax reconciliation', requiredRole: 'preparer', riskTier: 'material', completed: true, completedBy: 'Marcus Vance, EA', completedAt: '2025-01-24' },
      { stepNumber: 5, stepName: 'Senior CPA Technical Review', description: 'Apportionment factors for SC / NC', requiredRole: 'reviewer', riskTier: 'high_risk', completed: false, requiresDualAuthorization: true },
      { stepNumber: 6, stepName: 'Quality Control Sign-Off', description: 'Dual review gate check', requiredRole: 'cpa', riskTier: 'high_risk', completed: false, requiresDualAuthorization: true },
      { stepNumber: 7, stepName: 'Client E-Sign Authorization', description: 'Form 8453-S signed', requiredRole: 'client', riskTier: 'filing_critical', completed: false, requiresDualAuthorization: true },
      { stepNumber: 8, stepName: 'Final Lock & Package Hashing', description: 'SHA-256 seal & QR code generation', requiredRole: 'cpa', riskTier: 'filing_critical', completed: false, requiresDualAuthorization: true },
      { stepNumber: 9, stepName: 'Filing Release (Drake / IRS MeF Gate)', description: 'Electronic filing transmission gate', requiredRole: 'cpa', riskTier: 'filing_critical', completed: false, requiresDualAuthorization: true },
      { stepNumber: 10, stepName: 'Statutory Archive & Chain of Custody', description: '7-year retention commit', requiredRole: 'admin', riskTier: 'filing_critical', completed: false, requiresDualAuthorization: false }
    ]
  }
];

const INITIAL_DOCUMENTS: TaxGuardDocument[] = [
  {
    id: 'doc_2024_w2_01',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    clientName: 'Daniel Henze',
    fileName: '2024_Form_W2_HenzeConstruction.pdf',
    fileSizeBytes: 245120,
    mimeType: 'application/pdf',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    uploadedAt: '2025-01-20T14:32:00Z',
    uploadedBy: 'Daniel Henze',
    uploadedByRole: 'client',
    proposedCategory: 'W-2',
    confirmedCategory: 'W-2',
    categoryConfirmedBy: 'Marcus Vance, EA',
    taxYear: 2024,
    malwareStatus: 'not_configured',
    malwareNotice: 'Malware scanning endpoint is not configured in this environment. Document held in quarantine pending professional verification.',
    isQuarantined: false,
    reviewStatus: 'in_review',
    version: 1,
    retentionExpiresAt: '2032-01-20T00:00:00Z',
    chainOfCustody: [
      { timestamp: '2025-01-20T14:32:00Z', action: 'UPLOAD', actor: 'Daniel Henze', actorRole: 'client', notes: 'Client uploaded from verified portal session' },
      { timestamp: '2025-01-20T14:32:05Z', action: 'MIME_CHECK', actor: 'TaxGuard System', actorRole: 'system', notes: 'MIME application/pdf confirmed' },
      { timestamp: '2025-01-21T09:15:00Z', action: 'CATEGORY_CONFIRM', actor: 'Marcus Vance, EA', actorRole: 'preparer', notes: 'Confirmed W-2 wage statement' }
    ]
  },
  {
    id: 'doc_2024_1099nec_01',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    clientName: 'Daniel Henze',
    fileName: '1099-NEC_ApexCommercialContractors.pdf',
    fileSizeBytes: 182400,
    mimeType: 'application/pdf',
    sha256Hash: 'a7c934298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c991',
    uploadedAt: '2025-01-21T11:20:00Z',
    uploadedBy: 'Daniel Henze',
    uploadedByRole: 'client',
    proposedCategory: '1099-NEC',
    confirmedCategory: '1099-NEC',
    categoryConfirmedBy: 'Marcus Vance, EA',
    taxYear: 2024,
    malwareStatus: 'not_configured',
    malwareNotice: 'Malware scanning endpoint is not configured in this environment. Document held in quarantine pending professional verification.',
    isQuarantined: false,
    reviewStatus: 'verified',
    version: 1,
    retentionExpiresAt: '2032-01-21T00:00:00Z',
    chainOfCustody: [
      { timestamp: '2025-01-21T11:20:00Z', action: 'UPLOAD', actor: 'Daniel Henze', actorRole: 'client' },
      { timestamp: '2025-01-21T11:20:02Z', action: 'MIME_CHECK', actor: 'TaxGuard System', actorRole: 'system' }
    ]
  },
  {
    id: 'doc_2024_bank_stmt_q4',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    clientName: 'Daniel Henze',
    fileName: 'FirstCitizens_Operating_Q4_2024.pdf',
    fileSizeBytes: 890400,
    mimeType: 'application/pdf',
    sha256Hash: 'c4e98f098fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852f821',
    uploadedAt: '2025-01-22T16:00:00Z',
    uploadedBy: 'Marcus Vance, EA',
    uploadedByRole: 'preparer',
    proposedCategory: 'Bank Statement',
    confirmedCategory: 'Bank Statement',
    taxYear: 2024,
    malwareStatus: 'not_configured',
    malwareNotice: 'Malware scanning endpoint is not configured in this environment.',
    isQuarantined: false,
    reviewStatus: 'in_review',
    version: 1,
    retentionExpiresAt: '2032-01-22T00:00:00Z',
    chainOfCustody: [
      { timestamp: '2025-01-22T16:00:00Z', action: 'UPLOAD', actor: 'Marcus Vance, EA', actorRole: 'preparer' }
    ]
  }
];

const INITIAL_EXTRACTIONS: TaxGuardExtractionDossier[] = [
  {
    id: 'ext_w2_001',
    tenantId: 'tenant_ar_tax_prod',
    documentId: 'doc_2024_w2_01',
    clientId: 'client_henze_001',
    taxYear: 2024,
    formDetected: 'W-2',
    overallConfidence: 0.94,
    status: 'partially_verified',
    lastProcessedAt: '2025-01-21T10:00:00Z',
    fields: [
      {
        id: 'fld_w2_01',
        fieldName: 'taxpayerName',
        fieldLabel: 'Employee Name (Box e)',
        extractedValue: 'Daniel Henze',
        sourceDocumentId: 'doc_2024_w2_01',
        sourceDocumentName: '2024_Form_W2_HenzeConstruction.pdf',
        sourcePageNumber: 1,
        confidenceScore: 0.99,
        provider: 'gemini-flash',
        modelVersion: 'gemini-2.5-flash-pro-tax-v1',
        extractedAt: '2025-01-21T10:00:00Z',
        requiresHumanReview: false,
        isMaterialField: true,
        humanReviewed: true,
        reviewedBy: 'Marcus Vance, EA',
        reviewedAt: '2025-01-21T11:00:00Z',
        correctionHistory: []
      },
      {
        id: 'fld_w2_02',
        fieldName: 'taxpayerSsnEnding',
        fieldLabel: 'Social Security Number (Masked)',
        extractedValue: '***-**-4892',
        sourceDocumentId: 'doc_2024_w2_01',
        sourceDocumentName: '2024_Form_W2_HenzeConstruction.pdf',
        sourcePageNumber: 1,
        confidenceScore: 0.98,
        provider: 'gemini-flash',
        modelVersion: 'gemini-2.5-flash-pro-tax-v1',
        extractedAt: '2025-01-21T10:00:00Z',
        requiresHumanReview: true,
        isMaterialField: true,
        humanReviewed: true,
        reviewedBy: 'Marcus Vance, EA',
        reviewedAt: '2025-01-21T11:00:00Z',
        correctionHistory: []
      },
      {
        id: 'fld_w2_03',
        fieldName: 'wagesTipsOtherComp',
        fieldLabel: 'Box 1 - Wages, tips, other compensation',
        extractedValue: 94250.00,
        sourceDocumentId: 'doc_2024_w2_01',
        sourceDocumentName: '2024_Form_W2_HenzeConstruction.pdf',
        sourcePageNumber: 1,
        confidenceScore: 0.96,
        provider: 'gemini-flash',
        modelVersion: 'gemini-2.5-flash-pro-tax-v1',
        extractedAt: '2025-01-21T10:00:00Z',
        requiresHumanReview: true,
        isMaterialField: true,
        humanReviewed: true,
        reviewedBy: 'Marcus Vance, EA',
        reviewedAt: '2025-01-21T11:05:00Z',
        correctionHistory: []
      },
      {
        id: 'fld_w2_04',
        fieldName: 'fedIncomeTaxWithheld',
        fieldLabel: 'Box 2 - Federal Income Tax Withheld',
        extractedValue: 14820.00,
        sourceDocumentId: 'doc_2024_w2_01',
        sourceDocumentName: '2024_Form_W2_HenzeConstruction.pdf',
        sourcePageNumber: 1,
        confidenceScore: 0.95,
        provider: 'gemini-flash',
        modelVersion: 'gemini-2.5-flash-pro-tax-v1',
        extractedAt: '2025-01-21T10:00:00Z',
        requiresHumanReview: true,
        isMaterialField: true,
        humanReviewed: true,
        reviewedBy: 'Marcus Vance, EA',
        reviewedAt: '2025-01-21T11:05:00Z',
        correctionHistory: []
      },
      {
        id: 'fld_w2_05',
        fieldName: 'stateWithholdingSC',
        fieldLabel: 'Box 17 - State Income Tax Withheld (SC)',
        extractedValue: 4610.00,
        sourceDocumentId: 'doc_2024_w2_01',
        sourceDocumentName: '2024_Form_W2_HenzeConstruction.pdf',
        sourcePageNumber: 1,
        confidenceScore: 0.81,
        provider: 'gemini-flash',
        modelVersion: 'gemini-2.5-flash-pro-tax-v1',
        extractedAt: '2025-01-21T10:00:00Z',
        requiresHumanReview: true, // Low confidence threshold < 0.85
        isMaterialField: true,
        humanReviewed: false,
        correctionHistory: []
      }
    ]
  }
];

const INITIAL_DISCREPANCIES: TaxGuardDiscrepancy[] = [
  {
    id: 'disc_001',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    taxYear: 2024,
    ruleCode: 'QC-008',
    category: 'income',
    severity: 'requires_review',
    title: 'Possible 1099-NEC vs. General Ledger Gross Revenue Variance',
    neutralDescription: 'Extracted non-employee compensation from Apex Commercial Contractors ($42,800.00) exceeds quarterly bank operating deposits recorded by $1,450.00.',
    affectedDocuments: ['1099-NEC_ApexCommercialContractors.pdf', 'FirstCitizens_Operating_Q4_2024.pdf'],
    affectedFields: ['Box 1 Nonemployee compensation', 'Operating Inflows Q4'],
    recommendedAction: 'Verify whether $1,450.00 retained retainage was withheld or deposited into an alternate account.',
    status: 'open',
    identifiedAt: '2025-01-22T17:30:00Z'
  }
];

const INITIAL_MISSING_ITEMS: TaxGuardMissingItem[] = [
  {
    id: 'miss_001',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    taxYear: 2024,
    requiredItemName: '2024 Form 1098 Mortgage Interest Statement',
    reasonNeeded: 'Required to substantiate itemized mortgage interest deduction and SC real property credit.',
    relatedFormOrSchedule: 'Schedule A (Form 1040) / SC Form 1040',
    priority: 'important',
    dueDate: '2025-02-15',
    status: 'pending_client',
    createdAt: '2025-01-20T15:00:00Z'
  },
  {
    id: 'miss_002',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    taxYear: 2024,
    requiredItemName: 'Final 2024 Commercial Vehicle Mileage Log / Depreciation Record',
    reasonNeeded: 'Required by Treasury Reg. § 1.274-5 to substantiate business vehicle mileage vs Section 179 write-off.',
    relatedFormOrSchedule: 'Form 4562 & Schedule C',
    priority: 'deadline_critical',
    dueDate: '2025-02-10',
    status: 'pending_client',
    createdAt: '2025-01-20T15:00:00Z'
  }
];

const INITIAL_EXPENSES: TaxGuardExpenseItem[] = [
  {
    id: 'exp_001',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    transactionDate: '2024-11-14',
    payee: 'Home Depot Commercial #4521 Columbia SC',
    amount: 1420.50,
    proposedAccountCategory: 'Schedule C Line 22 - Supplies',
    taxTreatment: 'deductible',
    confidenceScore: 0.97,
    aiExplanation: 'Vendor categorization and invoice line items show job-site lumber and framing fasteners.',
    approvalStatus: 'preparer_approved',
    reviewedBy: 'Marcus Vance, EA',
    reviewedAt: '2025-01-22T14:10:00Z'
  },
  {
    id: 'exp_002',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    transactionDate: '2024-12-05',
    payee: 'Ruth’s Chris Steakhouse Columbia',
    amount: 345.80,
    proposedAccountCategory: 'Schedule C Line 24b - Deductible Meals (50%)',
    taxTreatment: 'partially_deductible_50',
    confidenceScore: 0.91,
    aiExplanation: 'IRC § 274(n) limits business meal deductions to 50%. Client stated meeting with subcontractor.',
    approvalStatus: 'pending'
  },
  {
    id: 'exp_003',
    tenantId: 'tenant_ar_tax_prod',
    clientId: 'client_henze_001',
    transactionDate: '2024-10-18',
    payee: 'Best Buy #882 Electronics',
    amount: 2199.99,
    proposedAccountCategory: 'Form 4562 - Section 179 Eligible Computer Equipment',
    taxTreatment: 'capitalized',
    confidenceScore: 0.88,
    aiExplanation: 'Equipment exceeds de minimis safe harbor threshold ($2,500 without AFS, but client elected Section 179 expensing).',
    approvalStatus: 'pending'
  }
];

const INITIAL_WORKPAPER: DraftWorkpaper = {
  id: 'wp_2024_henze_01',
  tenantId: 'tenant_ar_tax_prod',
  engagementId: 'case_2025_001',
  clientId: 'client_henze_001',
  clientName: 'Daniel Henze (Henze Construction, LLC)',
  taxYear: 2024,
  formType: '1040',
  version: 1,
  isDraft: true,
  watermarkText: 'DRAFT – NOT APPROVED FOR FILING',
  preparedBy: 'Marcus Vance, EA',
  preparedAt: '2025-01-22T15:30:00Z',
  sourceDocumentIndex: [
    { id: 'doc_2024_w2_01', name: '2024_Form_W2_HenzeConstruction.pdf', category: 'W-2', verified: true },
    { id: 'doc_2024_1099nec_01', name: '1099-NEC_ApexCommercialContractors.pdf', category: '1099-NEC', verified: true },
    { id: 'doc_2024_bank_stmt_q4', name: 'FirstCitizens_Operating_Q4_2024.pdf', category: 'Bank Statement', verified: false }
  ],
  scheduleTotals: {
    totalGrossIncome: 137050.00,
    totalAdjustments: 6850.00,
    adjustedGrossIncome: 130200.00,
    totalDeductions: 29200.00, // Standard deduction MFJ
    taxableIncome: 101000.00,
    totalFederalWithholding: 14820.00,
    totalEstimatedPayments: 4000.00,
    preliminaryTaxLiability: 12640.00,
    estimatedRefundOrDue: -6180.00 // Negative indicates estimated refund
  },
  openQuestions: [
    'Awaiting Form 1098 Mortgage Interest from client mortgage provider.',
    'Substantiation of vehicle mileage log for 2024 F-250 commercial truck.'
  ],
  reviewerNotes: [
    'Schedule C business gross receipts reconcile with 1099-NEC subject to retainage clearance.',
    'Self-employment tax deduction (50%) accurately computed at $4,845.'
  ],
  cryptographicHash: 'f4d92a098fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852e109',
  qrVerificationId: 'AR-TAX-2024-VRF-88219'
};

const INITIAL_PUBLIC_VERIFICATIONS: Record<string, PublicVerificationRecord> = {
  'AR-TAX-2024-VRF-88219': {
    verificationId: 'AR-TAX-2024-VRF-88219',
    documentType: 'Official Tax Workpaper & Compliance Dossier (Draft Phase)',
    issuingOrganization: 'A/R Tax Services, LLC',
    jurisdiction: 'United States & South Carolina',
    issueDate: '2025-01-22',
    version: 1,
    status: 'valid',
    cryptographicSha256: 'f4d92a098fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852e109',
    authorizedSignatoryTitle: 'Senior Review Partner'
  },
  'AR-TAX-2023-VRF-44109': {
    verificationId: 'AR-TAX-2023-VRF-44109',
    documentType: 'Certified Client Tax Filing Summary (2023 Final)',
    issuingOrganization: 'A/R Tax Services, LLC',
    jurisdiction: 'United States & South Carolina',
    issueDate: '2024-04-12',
    version: 2,
    status: 'valid',
    cryptographicSha256: '882ac4098fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852f88a',
    authorizedSignatoryTitle: 'Desmond Hinds, Principal'
  }
};

export class TaxGuardStorageService {
  private static cases: TaxGuardEngagementCase[] = INITIAL_CASES;
  private static documents: TaxGuardDocument[] = INITIAL_DOCUMENTS;
  private static extractions: TaxGuardExtractionDossier[] = INITIAL_EXTRACTIONS;
  private static discrepancies: TaxGuardDiscrepancy[] = INITIAL_DISCREPANCIES;
  private static missingItems: TaxGuardMissingItem[] = INITIAL_MISSING_ITEMS;
  private static expenses: TaxGuardExpenseItem[] = INITIAL_EXPENSES;
  private static workpapers: DraftWorkpaper[] = [INITIAL_WORKPAPER];
  private static verifications: Record<string, PublicVerificationRecord> = INITIAL_PUBLIC_VERIFICATIONS;

  // Multi-tenant & Role-based Case Retrieval
  public static getCases(role: string, currentClientId?: string): TaxGuardEngagementCase[] {
    if (role === 'client' && currentClientId) {
      return this.cases.filter(c => c.clientId === currentClientId);
    }
    return this.cases;
  }

  public static getCaseById(caseId: string, role: string, currentClientId?: string): TaxGuardEngagementCase | undefined {
    const found = this.cases.find(c => c.id === caseId);
    if (!found) return undefined;
    if (role === 'client' && currentClientId && found.clientId !== currentClientId) {
      // Tenant boundary enforcement
      return undefined;
    }
    return found;
  }

  // Multi-tenant & Role-based Document Retrieval
  public static getDocuments(role: string, currentClientId?: string): TaxGuardDocument[] {
    if (role === 'client' && currentClientId) {
      return this.documents.filter(d => d.clientId === currentClientId);
    }
    return this.documents;
  }

  // Upload new document with quarantine status and security checks
  public static addDocument(doc: Omit<TaxGuardDocument, 'id' | 'uploadedAt' | 'chainOfCustody' | 'version' | 'retentionExpiresAt'>): TaxGuardDocument {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const retentionDate = new Date(Date.now() + 7 * 365 * 24 * 3600 * 1000).toISOString(); // 7-year statutory IRS retention

    const newDoc: TaxGuardDocument = {
      ...doc,
      id,
      uploadedAt: now,
      version: 1,
      retentionExpiresAt: retentionDate,
      chainOfCustody: [
        {
          timestamp: now,
          action: 'UPLOAD_MIME_CHECK',
          actor: doc.uploadedBy,
          actorRole: doc.uploadedByRole,
          notes: 'MIME validated. Placed in non-processable quarantine pending scanning configuration.'
        }
      ]
    };

    this.documents.unshift(newDoc);

    TaxGuardAuditService.logEvent({
      tenantId: doc.tenantId,
      userId: doc.uploadedBy,
      userEmail: `${doc.uploadedBy.toLowerCase().replace(/\s+/g, '')}@client.artaxservices.com`,
      userRole: doc.uploadedByRole,
      action: 'DOCUMENT_UPLOAD',
      recordType: 'document',
      recordId: id,
      ipAddress: 'Client-Authenticated Node',
      result: 'success',
      riskLevel: 'routine',
      details: `Document "${doc.fileName}" (${(doc.fileSizeBytes / 1024).toFixed(1)} KB) uploaded. SHA-256: ${doc.sha256Hash}`
    });

    return newDoc;
  }

  // Extractions
  public static getExtractions(role: string, currentClientId?: string): TaxGuardExtractionDossier[] {
    if (role === 'client' && currentClientId) {
      return this.extractions.filter(e => e.clientId === currentClientId);
    }
    return this.extractions;
  }

  public static updateExtractedField(dossierId: string, fieldId: string, newValue: string | number, reviewerName: string, reason: string): boolean {
    const dossier = this.extractions.find(e => e.id === dossierId);
    if (!dossier) return false;

    const field = dossier.fields.find(f => f.id === fieldId);
    if (!field) return false;

    const prevValue = field.extractedValue;
    field.correctionHistory.push({
      previousValue: prevValue,
      newValue,
      changedBy: reviewerName,
      changedAt: new Date().toISOString(),
      reason
    });

    field.extractedValue = newValue;
    field.correctedValue = newValue;
    field.correctionReason = reason;
    field.humanReviewed = true;
    field.reviewedBy = reviewerName;
    field.reviewedAt = new Date().toISOString();

    TaxGuardAuditService.logEvent({
      tenantId: dossier.tenantId,
      userId: reviewerName,
      userEmail: 'staff@artaxservices.com',
      userRole: 'preparer',
      action: 'EXTRACTION_FIELD_CORRECTION',
      recordType: 'extraction',
      recordId: fieldId,
      ipAddress: 'Office LAN 10.0.4.12',
      result: 'success',
      riskLevel: field.isMaterialField ? 'material' : 'routine',
      details: `Field "${field.fieldLabel}" corrected from "${prevValue}" to "${newValue}". Reason: ${reason}`
    });

    return true;
  }

  // Discrepancies
  public static getDiscrepancies(role: string, currentClientId?: string): TaxGuardDiscrepancy[] {
    if (role === 'client' && currentClientId) {
      return this.discrepancies.filter(d => d.clientId === currentClientId);
    }
    return this.discrepancies;
  }

  public static resolveDiscrepancy(id: string, reviewerName: string, notes: string): boolean {
    const disc = this.discrepancies.find(d => d.id === id);
    if (!disc) return false;
    disc.status = 'resolved';
    disc.reviewedBy = reviewerName;
    disc.reviewerNotes = notes;
    disc.resolvedAt = new Date().toISOString();

    TaxGuardAuditService.logEvent({
      tenantId: disc.tenantId,
      userId: reviewerName,
      userEmail: 'reviewer@artaxservices.com',
      userRole: 'reviewer',
      action: 'DISCREPANCY_RESOLVED',
      recordType: 'case',
      recordId: id,
      ipAddress: 'Office LAN 10.0.4.15',
      result: 'success',
      riskLevel: 'material',
      details: `Discrepancy ${disc.ruleCode} marked resolved. Notes: ${notes}`
    });

    return true;
  }

  // Missing Items
  public static getMissingItems(role: string, currentClientId?: string): TaxGuardMissingItem[] {
    if (role === 'client' && currentClientId) {
      return this.missingItems.filter(m => m.clientId === currentClientId);
    }
    return this.missingItems;
  }

  public static respondToMissingItem(id: string, note: string): boolean {
    const item = this.missingItems.find(m => m.id === id);
    if (!item) return false;
    item.clientResponseNote = note;
    item.status = 'received_pending_review';

    TaxGuardAuditService.logEvent({
      tenantId: item.tenantId,
      userId: 'Client',
      userEmail: 'client@artaxservices.com',
      userRole: 'client',
      action: 'MISSING_ITEM_RESPONSE',
      recordType: 'case',
      recordId: id,
      ipAddress: 'Client Portal SSL Session',
      result: 'success',
      riskLevel: 'routine',
      details: `Client responded to missing item "${item.requiredItemName}". Note: ${note}`
    });

    return true;
  }

  // Expenses
  public static getExpenses(role: string, currentClientId?: string): TaxGuardExpenseItem[] {
    if (role === 'client' && currentClientId) {
      return this.expenses.filter(e => e.clientId === currentClientId);
    }
    return this.expenses;
  }

  public static approveExpense(id: string, reviewer: string, approvedCategory?: string): boolean {
    const exp = this.expenses.find(e => e.id === id);
    if (!exp) return false;
    exp.approvalStatus = 'preparer_approved';
    exp.reviewedBy = reviewer;
    exp.reviewedAt = new Date().toISOString();
    if (approvedCategory) {
      exp.approvedAccountCategory = approvedCategory;
    }
    return true;
  }

  // Workpapers
  public static getWorkpapers(role: string, currentClientId?: string): DraftWorkpaper[] {
    if (role === 'client' && currentClientId) {
      return this.workpapers.filter(w => w.clientId === currentClientId);
    }
    return this.workpapers;
  }

  // Maker-Checker Review Step Approval
  public static completeReviewStep(caseId: string, stepNumber: number, reviewerRole: string, reviewerName: string, notes: string): { success: boolean; error?: string } {
    const c = this.cases.find(item => item.id === caseId);
    if (!c) return { success: false, error: 'Case not found' };

    const step = c.makerCheckerSteps.find(s => s.stepNumber === stepNumber);
    if (!step) return { success: false, error: 'Step not found' };

    // Enforce separation of duties: maker cannot checker high-risk steps
    if (step.requiresDualAuthorization && (step.riskTier === 'high_risk' || step.riskTier === 'filing_critical')) {
      if (stepNumber >= 5 && reviewerRole === 'preparer') {
        return { 
          success: false, 
          error: 'Separation of duties violation: Staff preparer cannot sign off on Senior Reviewer or CPA Quality Control approval gates.' 
        };
      }
    }

    step.completed = true;
    step.completedBy = reviewerName;
    step.completedAt = new Date().toISOString();
    step.signoffNotes = notes;

    TaxGuardAuditService.logEvent({
      tenantId: c.tenantId,
      userId: reviewerName,
      userEmail: `${reviewerName.toLowerCase().replace(/\s+/g, '')}@artaxservices.com`,
      userRole: reviewerRole,
      action: 'MAKER_CHECKER_STEP_SIGNOFF',
      recordType: 'approval',
      recordId: `${caseId}_step_${stepNumber}`,
      ipAddress: '10.0.4.22',
      result: 'success',
      riskLevel: step.riskTier === 'filing_critical' ? 'high_risk' : 'material',
      details: `Step ${stepNumber} (${step.stepName}) approved by ${reviewerName} (${reviewerRole}). Notes: ${notes}`
    });

    return { success: true };
  }

  // Safe Public Verification Lookup
  public static verifyRecord(verificationId: string): PublicVerificationRecord | null {
    const cleanId = (verificationId || '').trim();
    if (!cleanId || !this.verifications[cleanId]) {
      return null;
    }
    return this.verifications[cleanId];
  }
}
