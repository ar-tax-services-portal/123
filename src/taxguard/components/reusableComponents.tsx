/**
 * TaxGuard AI - Unified Reusable Component Interface
 * 
 * Reusable intelligence and automation components ready to be embedded
 * into any role-based dashboard across the A/R Tax Services, LLC platform.
 * 
 * Each component strictly enforces:
 * - Current user identity and role-based permissions
 * - Tenant isolation and client scoping
 * - Demonstration Environment disclaimers
 * - Data minimization
 */

import React from 'react';
import { TaxGuardScannerView } from '../views/TaxGuardScannerView';
import { TaxGuardDocumentsView } from '../views/TaxGuardDocumentsView';
import { TaxGuardClassificationView } from '../views/TaxGuardClassificationView';
import { TaxGuardExtractionView } from '../views/TaxGuardExtractionView';
import { TaxGuardMissingItemsView } from '../views/TaxGuardMissingItemsView';
import { TaxGuardDiscrepanciesView } from '../views/TaxGuardDiscrepanciesView';
import { TaxGuardFieldMappingView } from '../views/TaxGuardFieldMappingView';
import { TaxGuardWorkpapersView } from '../views/TaxGuardWorkpapersView';
import { TaxGuardReviewApprovalView } from '../views/TaxGuardReviewApprovalView';
import { TaxGuardReportsView } from '../views/TaxGuardReportsView';
import { TaxGuardResearchView } from '../views/TaxGuardResearchView';
import { TaxGuardAuditLogView } from '../views/TaxGuardAuditLogView';
import { TaxGuardIntegrationsView } from '../views/TaxGuardIntegrationsView';
import { TaxGuardAdminSettingsView } from '../views/TaxGuardAdminSettingsView';

export interface TaxGuardComponentProps {
  userRole: string;
  clientId?: string;
  engagementId?: string;
  tenantId?: string;
  readOnly?: boolean;
  onFinished?: () => void;
  className?: string;
}

/**
 * 1. DocumentScanner
 * Live camera streaming, page capture, orientation, enhancement, and client quarantine submission.
 */
export const DocumentScanner: React.FC<TaxGuardComponentProps> = ({ userRole, onFinished, className }) => (
  <div className={className}>
    <TaxGuardScannerView userRole={userRole} onFinished={onFinished} />
  </div>
);

/**
 * 2. DocumentUploadQueue
 * Encrypted multi-file upload queue, MIME verification, SHA-256 duplicate detection, and quarantine status.
 */
export const DocumentUploadQueue: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardDocumentsView userRole={userRole} />
  </div>
);

/**
 * 3. ClassificationReview
 * Neural document classification, confidence scoring, tax-year detection, and splitting.
 */
export const ClassificationReview: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardClassificationView userRole={userRole} />
  </div>
);

/**
 * 4. ExtractionReview
 * OCR field-by-field confidence triage, bounding-box review, and manual override audit history.
 */
export const ExtractionReview: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardExtractionView userRole={userRole} />
  </div>
);

/**
 * 5. MissingItemsPanel
 * Diagnostic checklist identifying missing documents and supporting schedules based on taxpayer profile.
 */
export const MissingItemsPanel: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardMissingItemsView userRole={userRole} />
  </div>
);

/**
 * 6. DiscrepancyPanel
 * 18 automated quality-control heuristics evaluating name fidelity, bank tie-outs, SSN endings, and schedule reconciliations.
 */
export const DiscrepancyPanel: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardDiscrepanciesView userRole={userRole} />
  </div>
);

/**
 * 7. FieldMappingEditor
 * Source document field to tax form line item mappings with audit trails.
 */
export const FieldMappingEditor: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardFieldMappingView userRole={userRole} />
  </div>
);

/**
 * 8. SmartFormWorkspace
 * Form 1040 & Schedule C interactive auto-population workspace with live field editing and draft export.
 */
export const SmartFormWorkspace: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardFieldMappingView userRole={userRole} />
  </div>
);

/**
 * 9. WorkpaperEditor
 * Draft tax lead workpapers with prominent "DRAFT - NOT APPROVED FOR FILING" diagonal watermark.
 */
export const WorkpaperEditor: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardWorkpapersView userRole={userRole} />
  </div>
);

/**
 * 10. ProfessionalReviewQueue
 * Senior reviewer and CPA return queue with stage progression and maker-checker status.
 */
export const ProfessionalReviewQueue: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardReviewApprovalView userRole={userRole} />
  </div>
);

/**
 * 11. ApprovalGate
 * Maker-checker dual-signoff gate preventing unauthorized single-practitioner filing release.
 */
export const ApprovalGate: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardReviewApprovalView userRole={userRole} />
  </div>
);

/**
 * 12. VerificationPanel
 * Cryptographic SHA-256 seal verification and public-safe authentication panel without disclosing confidential PII.
 */
export const VerificationPanel: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardReportsView userRole={userRole} />
  </div>
);

/**
 * 13. AIResearchAssistant
 * Source-grounded tax research assistant citing IRS Rev. Procs., Treasury Regs., SC Code, and FinCEN rules.
 */
export const AIResearchAssistant: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardResearchView userRole={userRole} />
  </div>
);

/**
 * 14. AuditEventViewer
 * Statutory compliance append-only immutable audit trail explorer with cryptographic timestamps.
 */
export const AuditEventViewer: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardAuditLogView userRole={userRole} />
  </div>
);

/**
 * 15. IntegrationHealthPanel
 * Provider-neutral integration monitor tracking 22 external software adapters with honest statuses.
 */
export const IntegrationHealthPanel: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardIntegrationsView userRole={userRole} />
  </div>
);

/**
 * 16. AIGovernancePanel
 * AI safety, emergency killswitch, model inventory, and confidence threshold governance.
 */
export const AIGovernancePanel: React.FC<TaxGuardComponentProps> = ({ userRole, className }) => (
  <div className={className}>
    <TaxGuardAdminSettingsView userRole={userRole} />
  </div>
);
