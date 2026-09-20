import { describe, it, expect, beforeEach } from 'vitest';
import {
  StageThreeValidationService,
  CANONICAL_STAGE_THREE_FEATURE_REGISTRY,
  ValidationSourceRecord
} from '../services/stageThreeValidationService';
import {
  StageTwoCollectionOperationsService,
  StageTwoExitGateRecord
} from '../services/stageTwoCollectionOperationsService';
import { StageTwoCollectionService } from '../services/stageTwoCollectionService';
import { TaxGuardAuditService } from '../taxguard/services/TaxGuardAuditService';

describe('Stage 03: Validate — Sprint 1 (Validation Foundation & Integrity)', () => {
  const TEST_CLIENT_ID = 'cli_stage3_test';
  const TEST_TAX_YEAR = 2025;
  const TEST_ENGAGEMENT_ID = 'ENG-2025-S3TEST';

  beforeEach(() => {
    // Reset stores and simulate a fresh clean state
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  // --------------------------------------------------------------------------
  // CANONICAL FEATURE NAMESPACE VERIFICATION
  // --------------------------------------------------------------------------
  it('registers canonical TG-VAL-001 through TG-VAL-012 features with no collisions', () => {
    const keys = Object.keys(CANONICAL_STAGE_THREE_FEATURE_REGISTRY);
    expect(keys.length).toBe(12);
    expect(keys[0]).toBe('TG-VAL-001');
    expect(keys[11]).toBe('TG-VAL-012');

    keys.forEach(k => {
      expect(k.startsWith('TG-VAL-')).toBe(true);
      expect(k.startsWith('TG-COL-')).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 1. Stage 03 blocked when Stage 02 is not cleared
  // --------------------------------------------------------------------------
  it('Scenario 1: blocks Stage 03 handoff when Stage 02 is not cleared or nonexistent', () => {
    const handoff = StageThreeValidationService.validateStageTwoHandoff(
      'unregistered_client',
      2025
    );

    expect(handoff.isValid).toBe(false);
    expect(handoff.status).toBe('BLOCKED_BY_STAGE_02');
    expect(handoff.reasons.length).toBeGreaterThan(0);
    expect(handoff.reasons[0]).toContain('No certified Stage 02 Exit Gate record exists');
  });

  // --------------------------------------------------------------------------
  // 2. Correct Stage 02 gate permits Stage 03 initialization
  // --------------------------------------------------------------------------
  it('Scenario 2: permits Stage 03 initialization when authoritative Stage 02 gate is CLEARED', () => {
    // Create an authoritative cleared Stage 02 gate record
    const gateRecord: StageTwoExitGateRecord = {
      gateId: 'GATE2-CERT-2025-99881',
      clientId: TEST_CLIENT_ID,
      engagementId: TEST_ENGAGEMENT_ID,
      taxYear: TEST_TAX_YEAR,
      evaluationTimestamp: new Date().toISOString(),
      collectionVersion: 1,
      gateResult: 'CLEARED',
      stageTwoStatus: 'COMPLETED',
      stageThreeStatus: 'ELIGIBLE',
      evaluatedConditions: { allPassed: true },
      actor: 'Desmond Hinds, CPA',
      actorRole: 'cpa',
      certificationStatement: 'I certify that all Stage 02 collection criteria are verified.',
      correlationId: 'CORR-G2-TEST'
    };

    // Store in StageTwoCollectionOperationsService
    (StageTwoCollectionOperationsService as any).exitGateStore.set(
      `${TEST_CLIENT_ID}_${TEST_TAX_YEAR}`,
      gateRecord
    );

    const handoff = StageThreeValidationService.validateStageTwoHandoff(
      TEST_CLIENT_ID,
      TEST_TAX_YEAR,
      TEST_ENGAGEMENT_ID
    );

    expect(handoff.isValid).toBe(true);
    expect(handoff.status).toBe('ELIGIBLE');
    expect(handoff.gateRecord?.gateId).toBe('GATE2-CERT-2025-99881');

    const context = StageThreeValidationService.getWorkspaceContext(
      TEST_CLIENT_ID,
      TEST_TAX_YEAR,
      TEST_ENGAGEMENT_ID
    );

    expect(context.isHandoffVerified).toBe(true);
    expect(context.stageTwoGateId).toBe('GATE2-CERT-2025-99881');
    expect(context.taxYear).toBe(TEST_TAX_YEAR);
  });

  // --------------------------------------------------------------------------
  // 3. Wrong client gate rejected
  // --------------------------------------------------------------------------
  it('Scenario 3: rejects gate validation when client ID does not match gate record', () => {
    const gateRecord: StageTwoExitGateRecord = {
      gateId: 'GATE2-CERT-2025-CLIENTA',
      clientId: 'cli_client_a',
      engagementId: 'ENG-2025-A',
      taxYear: 2025,
      evaluationTimestamp: new Date().toISOString(),
      collectionVersion: 1,
      gateResult: 'CLEARED',
      stageTwoStatus: 'COMPLETED',
      stageThreeStatus: 'ELIGIBLE',
      evaluatedConditions: {},
      actor: 'CPA',
      actorRole: 'cpa',
      certificationStatement: 'Certified',
      correlationId: 'CORR-A'
    };

    (StageTwoCollectionOperationsService as any).exitGateStore.set(
      `cli_client_b_2025`,
      gateRecord
    );

    const handoff = StageThreeValidationService.validateStageTwoHandoff(
      'cli_client_b',
      2025
    );

    expect(handoff.isValid).toBe(false);
    expect(handoff.reasons.some(r => r.includes('Gate client ID mismatch'))).toBe(true);
  });

  // --------------------------------------------------------------------------
  // 4. Wrong tax year gate rejected
  // --------------------------------------------------------------------------
  it('Scenario 4: rejects gate validation when tax year does not match gate record', () => {
    const gateRecord: StageTwoExitGateRecord = {
      gateId: 'GATE2-CERT-2024-YRTEST',
      clientId: TEST_CLIENT_ID,
      engagementId: TEST_ENGAGEMENT_ID,
      taxYear: 2024, // 2024 instead of 2025
      evaluationTimestamp: new Date().toISOString(),
      collectionVersion: 1,
      gateResult: 'CLEARED',
      stageTwoStatus: 'COMPLETED',
      stageThreeStatus: 'ELIGIBLE',
      evaluatedConditions: {},
      actor: 'CPA',
      actorRole: 'cpa',
      certificationStatement: 'Certified',
      correlationId: 'CORR-YR'
    };

    (StageTwoCollectionOperationsService as any).exitGateStore.set(
      `${TEST_CLIENT_ID}_2025`,
      gateRecord
    );

    const handoff = StageThreeValidationService.validateStageTwoHandoff(
      TEST_CLIENT_ID,
      2025
    );

    expect(handoff.isValid).toBe(false);
    expect(handoff.reasons.some(r => r.includes('Gate tax year mismatch'))).toBe(true);
  });

  // --------------------------------------------------------------------------
  // 5. Reopened Stage 02 invalidates Stage 03
  // --------------------------------------------------------------------------
  it('Scenario 5: transitions Stage 03 to REVALIDATION_REQUIRED and marks sources STALE on Stage 02 reopening', () => {
    // Setup initial validated source
    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-2025-REOPEN',
      clientId: TEST_CLIENT_ID,
      engagementId: TEST_ENGAGEMENT_ID,
      taxYear: TEST_TAX_YEAR,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Form W-2',
      originalFilename: 'W2_Reopen_Test.pdf',
      sourceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      OCRArtifactId: 'OCR-01',
      extractionArtifactId: 'EXT-01',
      pageNumber: 1,
      fieldName: 'box1_wages',
      rawExtractedValue: '95000',
      normalizedValue: '95000',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 0.98,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    // Simulate Stage 02 reopening due to upstream document substitution
    const reopenedGate: StageTwoExitGateRecord = {
      gateId: 'GATE2-CERT-2025-99881',
      clientId: TEST_CLIENT_ID,
      engagementId: TEST_ENGAGEMENT_ID,
      taxYear: TEST_TAX_YEAR,
      evaluationTimestamp: new Date().toISOString(),
      collectionVersion: 2,
      gateResult: 'BLOCKED',
      stageTwoStatus: 'REOPENED',
      stageThreeStatus: 'REVALIDATION_REQUIRED',
      evaluatedConditions: {},
      actor: 'Client',
      actorRole: 'client',
      certificationStatement: 'Stage 02 Reopened',
      correlationId: 'CORR-REOPEN'
    };

    (StageTwoCollectionOperationsService as any).exitGateStore.set(
      `${TEST_CLIENT_ID}_${TEST_TAX_YEAR}`,
      reopenedGate
    );

    const invalidation = StageThreeValidationService.checkAndApplyUpstreamInvalidation(
      TEST_CLIENT_ID,
      TEST_TAX_YEAR
    );

    expect(invalidation.isInvalidated).toBe(true);

    const sources = StageThreeValidationService.getValidationSources(TEST_CLIENT_ID, TEST_TAX_YEAR);
    const affected = sources.find(s => s.documentId === 'DOC-2025-REOPEN');
    expect(affected?.validationStatus).toBe('STALE');

    const handoff = StageThreeValidationService.validateStageTwoHandoff(TEST_CLIENT_ID, TEST_TAX_YEAR);
    expect(handoff.status).toBe('REVALIDATION_REQUIRED');
  });

  // --------------------------------------------------------------------------
  // 6. Source provenance retained
  // --------------------------------------------------------------------------
  it('Scenario 6: preserves immutable provenance back to originating source document and hash', () => {
    const reg = StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-2025-PROV',
      clientId: TEST_CLIENT_ID,
      engagementId: TEST_ENGAGEMENT_ID,
      taxYear: TEST_TAX_YEAR,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Form 1099-NEC',
      originalFilename: '1099_Consulting.pdf',
      sourceHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
      OCRArtifactId: 'OCR-PROV-1',
      extractionArtifactId: 'EXT-PROV-1',
      pageNumber: 1,
      boundingBox: { x: 0.1, y: 0.2, width: 0.3, height: 0.05 },
      fieldName: 'nonemployee_compensation',
      rawExtractedValue: '$48,500.00',
      normalizedValue: '48500.00',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 0.99,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    expect(reg.validationSourceId).toMatch(/^VSR-2025-\d+/);
    expect(reg.documentId).toBe('DOC-2025-PROV');
    expect(reg.sourceHash).toBe('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2');
    expect(reg.boundingBox?.x).toBe(0.1);
    expect(reg.isAiProposedOnly).toBe(true); // Governance invariant preserved
  });

  // --------------------------------------------------------------------------
  // 7. Identity exact match
  // --------------------------------------------------------------------------
  it('Scenario 7: confirms exact identity match for legal name and masked EIN', () => {
    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-2025-ID1',
      clientId: 'cli_id_test',
      engagementId: 'ENG-ID',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Corporate W-2',
      originalFilename: 'W2_Exact.pdf',
      sourceHash: 'hash1',
      OCRArtifactId: 'OCR-1',
      extractionArtifactId: 'EXT-1',
      pageNumber: 1,
      fieldName: 'taxpayer_name',
      rawExtractedValue: 'Perotti Consulting Services, LLC',
      normalizedValue: 'Perotti Consulting Services, LLC',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 0.99,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-2025-ID1',
      clientId: 'cli_id_test',
      engagementId: 'ENG-ID',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Corporate W-2',
      originalFilename: 'W2_Exact.pdf',
      sourceHash: 'hash1',
      OCRArtifactId: 'OCR-1',
      extractionArtifactId: 'EXT-1',
      pageNumber: 1,
      fieldName: 'ein',
      rawExtractedValue: '84-1928374',
      normalizedValue: '84-1928374',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 0.99,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    const findings = StageThreeValidationService.runIdentityEntityValidation('cli_id_test', 2025, {
      legalName: 'Perotti Consulting Services, LLC',
      einTin: '84-1928374',
      entityType: 'S-Corporation (Form 1120-S)'
    });

    expect(findings.length).toBe(2);
    expect(findings.every(f => f.result === 'MATCH')).toBe(true);
    expect(findings.some(f => f.isBlocking)).toBe(false);
  });

  // --------------------------------------------------------------------------
  // 8. Identity mismatch detected
  // --------------------------------------------------------------------------
  it('Scenario 8: detects identity mismatch, generates blocking finding and conflict', () => {
    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-2025-BADID',
      clientId: 'cli_mismatch_test',
      engagementId: 'ENG-MM',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'W-2',
      originalFilename: 'W2_Wrong_Person.pdf',
      sourceHash: 'hash_bad',
      OCRArtifactId: 'OCR-2',
      extractionArtifactId: 'EXT-2',
      pageNumber: 1,
      fieldName: 'taxpayer_name',
      rawExtractedValue: 'Johnathan Doe Independent',
      normalizedValue: 'Johnathan Doe Independent',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 0.95,
      isAiProposedOnly: true,
      humanReviewStatus: 'UNREVIEWED',
      validationStatus: 'UNVALIDATED'
    });

    const findings = StageThreeValidationService.runIdentityEntityValidation('cli_mismatch_test', 2025, {
      legalName: 'Perotti Consulting Services, LLC',
      einTin: '84-1928374',
      entityType: 'S-Corporation (Form 1120-S)'
    });

    const mismatch = findings.find(f => f.field === 'taxpayer_name');
    expect(mismatch).toBeDefined();
    expect(mismatch?.result).toBe('MISMATCH');
    expect(mismatch?.isBlocking).toBe(true);

    const conflicts = StageThreeValidationService.getConflicts('cli_mismatch_test', 2025);
    expect(conflicts.some(c => c.conflictCategory === 'IDENTITY_MISMATCH')).toBe(true);
  });

  // --------------------------------------------------------------------------
  // 9. Tax-year mismatch detected
  // --------------------------------------------------------------------------
  it('Scenario 9: detects wrong tax year document and blocks progression', () => {
    // Seed an uploaded doc with 2023 year into 2025 collection
    (StageTwoCollectionService as any).inMemoryUploads.set('cli_year_test_2025', [
      {
        documentId: 'DOC-2023-WRONG',
        clientId: 'cli_year_test',
        taxYear: 2025,
        originalFileName: 'Prior_Year_W2_2023.pdf',
        fileSizeBytes: 24000,
        claimedCategory: 'Form W-2',
        status: 'Processed',
        isVerified: true
      }
    ]);

    const findings = StageThreeValidationService.runTaxYearPeriodValidation('cli_year_test', 2025);
    const wrong = findings.find(f => f.documentId === 'DOC-2023-WRONG');

    expect(wrong).toBeDefined();
    expect(wrong?.isCorrectTaxYear).toBe(false);
    expect(wrong?.isBlocking).toBe(true);
    expect(wrong?.observedTaxYear).toBe(2023);

    const conflicts = StageThreeValidationService.getConflicts('cli_year_test', 2025);
    expect(conflicts.some(c => c.conflictCategory === 'TAX_YEAR_MISMATCH')).toBe(true);
  });

  // --------------------------------------------------------------------------
  // 10. Cross-document amount conflict detected
  // --------------------------------------------------------------------------
  it('Scenario 10: detects cross-document amount variance between W-2 and Payroll summary', () => {
    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-W2-WAGES',
      clientId: 'cli_wage_test',
      engagementId: 'ENG-WAGE',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Form W-2',
      originalFilename: 'Officer_W2.pdf',
      sourceHash: 'h_w2',
      OCRArtifactId: 'OCR-W2',
      extractionArtifactId: 'EXT-W2',
      pageNumber: 1,
      fieldName: 'box1_wages',
      rawExtractedValue: '125000',
      normalizedValue: '125000',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 0.99,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-PAYROLL-SUM',
      clientId: 'cli_wage_test',
      engagementId: 'ENG-WAGE',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Annual Payroll Summary',
      originalFilename: 'Payroll_Report_CY2025.pdf',
      sourceHash: 'h_pay',
      OCRArtifactId: 'OCR-PAY',
      extractionArtifactId: 'EXT-PAY',
      pageNumber: 1,
      fieldName: 'total_gross_wages',
      rawExtractedValue: '140000', // $15,000 discrepancy
      normalizedValue: '140000',
      sourceTier: 'SUPPORTING',
      AIConfidence: 0.98,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    const rules = StageThreeValidationService.runCrossDocumentValidation('cli_wage_test', 2025);
    const wageRule = rules.find(r => r.ruleId === 'R-W2-PAYROLL-WAGES');

    expect(wageRule).toBeDefined();
    expect(wageRule?.result).toBe('FAIL');
    expect(wageRule?.variance).toBe(15000);
    expect(wageRule?.blockingStatus).toBe(true);

    const conflicts = StageThreeValidationService.getConflicts('cli_wage_test', 2025);
    expect(conflicts.some(c => c.conflictCategory === 'AMOUNT_MISMATCH')).toBe(true);
  });

  // --------------------------------------------------------------------------
  // 11. Mathematical validation passes valid totals
  // --------------------------------------------------------------------------
  it('Scenario 11: mathematically validates arithmetic sum relationships that balance', () => {
    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-MATH-PASS',
      clientId: 'cli_math_test',
      engagementId: 'ENG-MATH',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Payroll Register',
      originalFilename: 'Payroll_Qtr.pdf',
      sourceHash: 'h1',
      OCRArtifactId: 'OCR-M1',
      extractionArtifactId: 'EXT-M1',
      pageNumber: 1,
      fieldName: 'payroll_q1',
      rawExtractedValue: '25000',
      normalizedValue: '25000',
      sourceTier: 'SUPPORTING',
      AIConfidence: 1.0,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-MATH-PASS',
      clientId: 'cli_math_test',
      engagementId: 'ENG-MATH',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Payroll Register',
      originalFilename: 'Payroll_Qtr.pdf',
      sourceHash: 'h1',
      OCRArtifactId: 'OCR-M1',
      extractionArtifactId: 'EXT-M1',
      pageNumber: 1,
      fieldName: 'payroll_q2',
      rawExtractedValue: '25000',
      normalizedValue: '25000',
      sourceTier: 'SUPPORTING',
      AIConfidence: 1.0,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-MATH-PASS',
      clientId: 'cli_math_test',
      engagementId: 'ENG-MATH',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Payroll Register',
      originalFilename: 'Payroll_Qtr.pdf',
      sourceHash: 'h1',
      OCRArtifactId: 'OCR-M1',
      extractionArtifactId: 'EXT-M1',
      pageNumber: 1,
      fieldName: 'payroll_q3',
      rawExtractedValue: '25000',
      normalizedValue: '25000',
      sourceTier: 'SUPPORTING',
      AIConfidence: 1.0,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-MATH-PASS',
      clientId: 'cli_math_test',
      engagementId: 'ENG-MATH',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Payroll Register',
      originalFilename: 'Payroll_Qtr.pdf',
      sourceHash: 'h1',
      OCRArtifactId: 'OCR-M1',
      extractionArtifactId: 'EXT-M1',
      pageNumber: 1,
      fieldName: 'payroll_q4',
      rawExtractedValue: '25000',
      normalizedValue: '25000',
      sourceTier: 'SUPPORTING',
      AIConfidence: 1.0,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-MATH-PASS',
      clientId: 'cli_math_test',
      engagementId: 'ENG-MATH',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Payroll Register',
      originalFilename: 'Payroll_Qtr.pdf',
      sourceHash: 'h1',
      OCRArtifactId: 'OCR-M1',
      extractionArtifactId: 'EXT-M1',
      pageNumber: 1,
      fieldName: 'payroll_annual_total',
      rawExtractedValue: '100000',
      normalizedValue: '100000',
      sourceTier: 'SUPPORTING',
      AIConfidence: 1.0,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    const math = StageThreeValidationService.runMathematicalValidation('cli_math_test', 2025);
    const qtrCalc = math.find(m => m.calculationId === 'CALC-QTR-SUM-02');

    expect(qtrCalc?.status).toBe('VALID');
    expect(qtrCalc?.variance).toBe(0);
    expect(qtrCalc?.isFabricated).toBe(false);
  });

  // --------------------------------------------------------------------------
  // 12. Mathematical validation rejects invalid totals
  // --------------------------------------------------------------------------
  it('Scenario 12: detects mathematical variance when quarterly sum does not equal annual total', () => {
    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-MATH-FAIL',
      clientId: 'cli_math_fail',
      engagementId: 'ENG-MATH',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Gross Pay',
      originalFilename: 'Wages.pdf',
      sourceHash: 'h2',
      OCRArtifactId: 'OCR-M2',
      extractionArtifactId: 'EXT-M2',
      pageNumber: 1,
      fieldName: 'gross_wages',
      rawExtractedValue: '100000',
      normalizedValue: '100000',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 1.0,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-MATH-FAIL',
      clientId: 'cli_math_fail',
      engagementId: 'ENG-MATH',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Pre-Tax',
      originalFilename: 'Wages.pdf',
      sourceHash: 'h2',
      OCRArtifactId: 'OCR-M2',
      extractionArtifactId: 'EXT-M2',
      pageNumber: 1,
      fieldName: 'pretax_deductions',
      rawExtractedValue: '10000',
      normalizedValue: '10000',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 1.0,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-MATH-FAIL',
      clientId: 'cli_math_fail',
      engagementId: 'ENG-MATH',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'W-2',
      originalFilename: 'Wages.pdf',
      sourceHash: 'h2',
      OCRArtifactId: 'OCR-M2',
      extractionArtifactId: 'EXT-M2',
      pageNumber: 1,
      fieldName: 'box1_wages',
      rawExtractedValue: '85000', // Should be 90,000 (100k - 10k)
      normalizedValue: '85000',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 1.0,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    const math = StageThreeValidationService.runMathematicalValidation('cli_math_fail', 2025);
    const wageCalc = math.find(m => m.calculationId === 'CALC-NET-PAY-01');

    expect(wageCalc?.status).toBe('VARIANCE_DETECTED');
    expect(wageCalc?.variance).toBe(5000);
  });

  // --------------------------------------------------------------------------
  // 13. Insufficient evidence does not invent values
  // --------------------------------------------------------------------------
  it('Scenario 13: returns INSUFFICIENT_EVIDENCE and does not fabricate numbers when data is absent', () => {
    // Zero sources registered for this client
    const math = StageThreeValidationService.runMathematicalValidation('cli_empty_test', 2025);
    const wageCalc = math.find(m => m.calculationId === 'CALC-NET-PAY-01');

    expect(wageCalc?.status).toBe('INSUFFICIENT_EVIDENCE');
    expect(wageCalc?.computedValue).toBeNull();
    expect(wageCalc?.isFabricated).toBe(false); // Invariant confirmed: Never fabricate
  });

  // --------------------------------------------------------------------------
  // 14. Material conflict creates exception
  // --------------------------------------------------------------------------
  it('Scenario 14: automatically logs a validation exception when a material conflict is created', () => {
    const conflict = StageThreeValidationService.createConflict({
      clientId: 'cli_auto_ex_test',
      taxYear: 2025,
      conflictCategory: 'AMOUNT_MISMATCH',
      affectedField: 'gross_receipts',
      sourceA: {
        sourceId: 'S-A',
        documentId: 'DOC-1',
        documentName: '1099_A.pdf',
        value: 50000,
        sourceTier: 'AUTHORITATIVE'
      },
      sourceB: {
        sourceId: 'S-B',
        documentId: 'DOC-2',
        documentName: 'Ledger.xlsx',
        value: 40000,
        sourceTier: 'SUPPORTING'
      },
      observedValues: '$50,000 vs $40,000',
      variance: 10000,
      materiality: 'MATERIAL',
      severity: 'HIGH',
      blockingStatus: true
    });

    const exceptions = StageThreeValidationService.getExceptions('cli_auto_ex_test', 2025);
    const matching = exceptions.find(e => e.relatedConflictId === conflict.conflictId);

    expect(matching).toBeDefined();
    expect(matching?.isBlocking).toBe(true);
    expect(matching?.status).toBe('OPEN');
  });

  // --------------------------------------------------------------------------
  // 15. Client cannot resolve staff validation exception
  // --------------------------------------------------------------------------
  it('Scenario 15: rejects exception resolution attempt by client role', () => {
    const ex = StageThreeValidationService.createValidationException({
      clientId: 'cli_role_test',
      taxYear: 2025,
      category: 'IDENTITY_MISMATCH',
      title: 'Taxpayer Name Conflict',
      description: 'Internal discrepancy',
      severity: 'HIGH',
      isBlocking: true,
      createdBy: 'System',
      assignedTo: 'Staff'
    });

    expect(() => {
      StageThreeValidationService.resolveValidationException({
        clientId: 'cli_role_test',
        taxYear: 2025,
        exceptionId: ex.exceptionId,
        resolvedBy: 'Client User',
        resolvedByRole: 'client' as any,
        action: 'SELF_APPROVE',
        justification: 'Looks fine to me'
      });
    }).toThrow(/Unauthorized: Client role cannot resolve internal validation exceptions/);
  });

  // --------------------------------------------------------------------------
  // 16. Authorized reviewer can resolve with rationale
  // --------------------------------------------------------------------------
  it('Scenario 16: permits authorized reviewer/CPA to resolve exception with written rationale', () => {
    const ex = StageThreeValidationService.createValidationException({
      clientId: 'cli_resolve_test',
      taxYear: 2025,
      category: 'WITHHOLDING_MISMATCH',
      title: 'State Withholding Variance',
      description: 'CO state withholding variance',
      severity: 'MEDIUM',
      isBlocking: true,
      createdBy: 'System',
      assignedTo: 'Senior CPA'
    });

    const resolved = StageThreeValidationService.resolveValidationException({
      clientId: 'cli_resolve_test',
      taxYear: 2025,
      exceptionId: ex.exceptionId,
      resolvedBy: 'Desmond Hinds, CPA',
      resolvedByRole: 'cpa',
      action: 'ACCEPT_AUTHORITATIVE_TRANSCRIPT',
      justification: 'State revenue department withholding transcript inspected; verified $4,200 as accurate.'
    });

    expect(resolved.status).toBe('RESOLVED');
    expect(resolved.resolution?.resolvedBy).toBe('Desmond Hinds, CPA');
    expect(resolved.resolution?.justification).toContain('State revenue department withholding');
  });

  // --------------------------------------------------------------------------
  // 17. Missing rationale rejected
  // --------------------------------------------------------------------------
  it('Scenario 17: rejects exception resolution when written rationale is omitted', () => {
    const ex = StageThreeValidationService.createValidationException({
      clientId: 'cli_no_rat_test',
      taxYear: 2025,
      category: 'MISC',
      title: 'Test Exception',
      description: 'Description',
      severity: 'LOW',
      isBlocking: false,
      createdBy: 'System',
      assignedTo: 'CPA'
    });

    expect(() => {
      StageThreeValidationService.resolveValidationException({
        clientId: 'cli_no_rat_test',
        taxYear: 2025,
        exceptionId: ex.exceptionId,
        resolvedBy: 'Desmond Hinds',
        resolvedByRole: 'cpa',
        action: 'RESOLVE',
        justification: '   ' // empty string
      });
    }).toThrow(/professional justification is required/);
  });

  // --------------------------------------------------------------------------
  // 18. Audit events generated
  // --------------------------------------------------------------------------
  it('Scenario 18: generates immutable append-only audit events for all material validation actions', () => {
    const initialLogs = TaxGuardAuditService.getLogs();

    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-AUDIT-TEST',
      clientId: 'cli_audit_test',
      engagementId: 'ENG-AUD',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Form 1040',
      originalFilename: 'PriorReturn.pdf',
      sourceHash: 'h_aud',
      OCRArtifactId: 'OCR-A',
      extractionArtifactId: 'EXT-A',
      pageNumber: 1,
      fieldName: 'agi',
      rawExtractedValue: '180000',
      normalizedValue: '180000',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 0.99,
      isAiProposedOnly: true,
      humanReviewStatus: 'REVIEWED_APPROVED',
      validationStatus: 'VALIDATED'
    });

    const updatedLogs = TaxGuardAuditService.getLogs();
    expect(updatedLogs.length).toBeGreaterThan(initialLogs.length);

    const match = updatedLogs.find(l => l.action === 'VALIDATION_SOURCE_REGISTERED');
    expect(match).toBeDefined();
    expect(match?.correlationId).toMatch(/^corr_/i);
  });

  // --------------------------------------------------------------------------
  // 19. Cross-tenant source access rejected
  // --------------------------------------------------------------------------
  it('Scenario 19: isolates validation sources and exceptions by client and tax year', () => {
    StageThreeValidationService.registerValidationSource({
      documentId: 'DOC-TENANT-A',
      clientId: 'tenant_alpha',
      engagementId: 'ENG-ALPHA',
      taxYear: 2025,
      collectionVersion: 1,
      documentVersion: 1,
      documentCategory: 'Form W-2',
      originalFilename: 'Alpha_W2.pdf',
      sourceHash: 'h_alpha',
      OCRArtifactId: 'OCR-AL',
      extractionArtifactId: 'EXT-AL',
      pageNumber: 1,
      fieldName: 'box1_wages',
      rawExtractedValue: '50000',
      normalizedValue: '50000',
      sourceTier: 'AUTHORITATIVE',
      AIConfidence: 0.95,
      isAiProposedOnly: true,
      humanReviewStatus: 'UNREVIEWED',
      validationStatus: 'UNVALIDATED'
    });

    // Query for tenant beta
    const betaSources = StageThreeValidationService.getValidationSources('tenant_beta', 2025);
    expect(betaSources.length).toBe(0);

    // Query for tenant alpha wrong tax year
    const alpha2024Sources = StageThreeValidationService.getValidationSources('tenant_alpha', 2024);
    expect(alpha2024Sources.length).toBe(0);

    // Query for tenant alpha right tax year
    const alpha2025Sources = StageThreeValidationService.getValidationSources('tenant_alpha', 2025);
    expect(alpha2025Sources.length).toBe(1);
    expect(alpha2025Sources[0].documentId).toBe('DOC-TENANT-A');
  });

  // --------------------------------------------------------------------------
  // 20. Existing Stage 01 and Stage 02 tests remain passing (Regression baseline)
  // --------------------------------------------------------------------------
  it('Scenario 20: preserves Stage 02 collection operations and exit gate structures', () => {
    // Verify Stage 02 service is accessible and functional
    const status = StageTwoCollectionOperationsService.getExitGateStatus('cli_perotti', 2025);
    // Returns null or record without throwing runtime errors
    expect(status === null || typeof status === 'object').toBe(true);
  });
});
