/**
 * A/R Tax Services, LLC - Client Dashboard Demo Services
 * Implements the concrete service classes for the 8 modular Client Portal sections.
 */

import { demoDataStore } from './DemoDataService';
import {
  ClientDashboardOverview,
  ClientDocumentItem,
  IDocumentService,
  ClientOrganizerState,
  IOrganizerService,
  ClientIncomeRecord,
  ClientExpenseRecord,
  IIncomeExpenseService,
  ClientDraftReturn,
  IReturnReviewService,
  ClientInvoiceRecord,
  IInvoiceService,
  ClientNoticeRecord,
  INoticeService,
  ClientAdvisoryPlan,
  IAdvisoryService
} from './clientDashboardInterfaces';

/**
 * 1. Overview Service
 */
export class DemoOverviewService {
  public async getOverview(clientId: string): Promise<ClientDashboardOverview> {
    const client = demoDataStore.getClientById(clientId);
    const eng = demoDataStore.getEngagements().find(e => e.clientId === clientId);
    const invs = demoDataStore.getInvoices().filter(i => i.clientId === clientId);
    const unpaidBalance = invs
      .filter(i => i.status !== 'Paid (Simulated)')
      .reduce((sum, i) => sum + i.balanceDue, 0);

    return {
      clientId: client?.id || clientId,
      entityName: client?.company || 'Perotti Capital Holdings LLC',
      clientName: client?.name || 'Michael Perotti',
      engagementTitle: eng?.title || '2025 Corporate & Multi-State Tax Compliance',
      nextDeadline: 'March 15, 2026 (Form 1120-S Statutory Filing)',
      taxYear: 2025,
      returnType: 'Form 1120-S (S-Corporation Federal & State)',
      completionPercentage: 82,
      lifecycleStageIndex: 10,
      currentLifecycleStage: 'Approve',
      responsibleRole: 'Senior Reviewer (CPA Elena Rostova)',
      returnReviewStatus: 'CPA Review Complete (Ready for Client Authorization)',
      signatureStatus: 'Form 8879-S Signature Pending',
      invoiceStatus: unpaidBalance > 0 ? 'Unpaid Balance' : 'Paid in Full',
      unpaidBalanceAmount: unpaidBalance,
      filingStatus: 'Awaiting Client E-Signature Authorization',
      immediateRequiredAction: 'Review Draft Form 1120-S & Authorize Form 8879-S',
      documentsRequiringAttention: 2,
      missingInformationCount: 1,
      assignedTeam: [
        { name: 'Elena Rostova, CPA', role: 'Senior Tax Reviewer & Managing CPA', email: 'elena.rostova@artaxservices.com' },
        { name: 'David Vance, EA', role: 'Staff Tax Preparer & Enrolled Agent', email: 'david.vance@artaxservices.com' },
        { name: 'Sarah Jenkins', role: 'Client Service Manager', email: 'sarah.jenkins@artaxservices.com' }
      ]
    };
  }
}

/**
 * 2. Document Vault Service
 */
export class DemoVaultService implements IDocumentService {
  private documents: ClientDocumentItem[] = [
    {
      id: 'doc_w2_2025_01',
      fileName: '2025_W2_Michael_Perotti.pdf',
      fileSize: '412 KB',
      entityName: 'Perotti Capital Holdings LLC',
      documentType: 'W-2',
      confidenceScore: 99,
      taxYear: 2025,
      uploadDate: '2026-01-20',
      securityCheckStatus: 'Clean (SHA-256 Verified)',
      reviewStatus: 'Approved',
      issuer: 'Perotti Capital Holdings LLC',
      isDraft: false,
      summary: {
        extractedFields: [
          { label: 'Employer Identification Number (EIN)', value: 'XX-XXX4192' },
          { label: 'Box 1 Wages, tips, other compensation', value: '$120,000.00' },
          { label: 'Box 2 Federal income tax withheld', value: '$22,410.00' },
          { label: 'Box 3 Social Security wages', value: '$120,000.00' },
          { label: 'Box 4 Social Security tax withheld', value: '$7,440.00' },
          { label: 'Box 5 Medicare wages', value: '$120,000.00' },
          { label: 'Box 6 Medicare tax withheld', value: '$1,740.00' }
        ],
        detectedIssues: [],
        confidenceNote: 'Extracted with 99% accuracy against payroll register.'
      },
      questions: []
    },
    {
      id: 'doc_1099b_2025_02',
      fileName: 'Apex_Investments_1099B_Consolidated.pdf',
      fileSize: '1.8 MB',
      entityName: 'Perotti Capital Holdings LLC',
      documentType: '1099',
      confidenceScore: 97,
      taxYear: 2025,
      uploadDate: '2026-02-04',
      securityCheckStatus: 'Clean (SHA-256 Verified)',
      reviewStatus: 'Approved',
      issuer: 'Apex Clearing Corp',
      isDraft: false,
      summary: {
        extractedFields: [
          { label: '1099-DIV Ordinary Dividends', value: '$18,450.00' },
          { label: '1099-DIV Qualified Dividends', value: '$14,200.00' },
          { label: '1099-INT Total Interest Income', value: '$3,180.00' },
          { label: '1099-B Net Short-Term Capital Gain', value: '$9,820.00' },
          { label: '1099-B Net Long-Term Capital Gain', value: '$34,600.00' }
        ],
        detectedIssues: [],
        confidenceNote: 'Wash-sale adjustments verified and matched to Schedule D.'
      },
      questions: []
    },
    {
      id: 'doc_k1_palmetto_2025',
      fileName: 'Palmetto_Commercial_RealEstate_K1.pdf',
      fileSize: '890 KB',
      entityName: 'Perotti Capital Holdings LLC',
      documentType: 'K-1',
      confidenceScore: 94,
      taxYear: 2025,
      uploadDate: '2026-02-12',
      securityCheckStatus: 'Clean (SHA-256 Verified)',
      reviewStatus: 'Pending Review',
      issuer: 'Palmetto Commercial Real Estate LP',
      isDraft: true,
      summary: {
        extractedFields: [
          { label: 'Entity Classification', value: 'Partnership (Form 1065)' },
          { label: 'Box 2 Net rental real estate income', value: '$42,500.00' },
          { label: 'Box 19 Code A Distributions', value: '$35,000.00' },
          { label: 'Box 20 Code Z Section 199A Information', value: 'Provided in Statement' }
        ],
        detectedIssues: ['Awaiting statement breakdown for Section 199A qualified business income.'],
        confidenceNote: 'Schedule K-1 parsed. CPA review requested for Box 20 Statement.'
      },
      questions: [
        {
          id: 'q1',
          author: 'Elena Rostova, CPA',
          question: 'Michael, please confirm if the partnership distributed cash or property for Box 19.',
          response: 'Confirmed cash wire received in December 2025.',
          date: '2026-02-14'
        }
      ]
    },
    {
      id: 'doc_bank_dec_2025',
      fileName: 'First_National_Bank_Dec2025_Statement.pdf',
      fileSize: '620 KB',
      entityName: 'Perotti Capital Holdings LLC',
      documentType: 'Bank',
      confidenceScore: 98,
      taxYear: 2025,
      uploadDate: '2026-01-15',
      securityCheckStatus: 'Clean (SHA-256 Verified)',
      reviewStatus: 'Approved',
      issuer: 'First National Bank',
      isDraft: false
    }
  ];

  public getDocuments(clientId: string): ClientDocumentItem[] {
    return this.documents;
  }

  public getDocumentById(id: string): ClientDocumentItem | undefined {
    return this.documents.find(d => d.id === id);
  }

  public uploadDocument(clientId: string, file: File): ClientDocumentItem {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    let docType = 'Receipt';
    if (file.name.toLowerCase().includes('w2')) docType = 'W-2';
    else if (file.name.toLowerCase().includes('1099')) docType = '1099';
    else if (file.name.toLowerCase().includes('k1') || file.name.toLowerCase().includes('k-1')) docType = 'K-1';
    else if (file.name.toLowerCase().includes('bank') || file.name.toLowerCase().includes('stmt')) docType = 'Bank';
    else if (file.name.toLowerCase().includes('notice') || file.name.toLowerCase().includes('cp')) docType = 'Notice';

    const newDoc: ClientDocumentItem = {
      id: `doc_${Date.now()}`,
      fileName: file.name,
      fileSize: `${Math.round(file.size / 1024) || 350} KB`,
      entityName: 'Perotti Capital Holdings LLC',
      documentType: docType,
      confidenceScore: 92,
      taxYear: 2025,
      uploadDate: new Date().toISOString().split('T')[0],
      securityCheckStatus: 'Clean (SHA-256 Verified)',
      reviewStatus: 'Pending Review',
      issuer: 'Client Upload',
      isDraft: true,
      summary: {
        extractedFields: [
          { label: 'Ingestion Format', value: ext },
          { label: 'Verification Protocol', value: 'Edge Anti-Malware Passed' },
          { label: 'OCR Status', value: 'Text Layer Normalized' }
        ],
        detectedIssues: [],
        confidenceNote: 'Uploaded document queued for automated optical indexing and CPA confirmation.'
      },
      questions: []
    };

    this.documents.unshift(newDoc);
    return newDoc;
  }

  public removeDraftDocument(id: string): { success: boolean; error?: string } {
    const idx = this.documents.findIndex(d => d.id === id);
    if (idx === -1) return { success: false, error: 'Document not found.' };
    if (!this.documents[idx].isDraft) {
      return { success: false, error: 'Approved documents cannot be removed. Contact your CPA.' };
    }
    this.documents.splice(idx, 1);
    return { success: true };
  }

  public proposeClassificationCorrection(id: string, proposedType: string, author: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.documentType = proposedType;
      doc.reviewStatus = 'Pending Review';
    }
  }

  public addDocumentQuestion(id: string, question: string, author: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      if (!doc.questions) doc.questions = [];
      doc.questions.push({
        id: `q_${Date.now()}`,
        author,
        question,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
}

/**
 * 3. Tax Organizer Service
 */
export class DemoOrganizerService implements IOrganizerService {
  private organizerState: ClientOrganizerState = {
    taxYear: 2025,
    status: 'In Progress',
    completionPercentage: 75,
    activeSectionId: 1,
    sections: [
      { id: 1, title: 'Corporate Profile & Principal Activity', shortTitle: 'Entity Profile', status: 'completed', data: { legalName: 'Perotti Capital Holdings LLC', ein: 'XX-XXX4192', naicsCode: '531110', principalActivity: 'Lessors of Real Estate & Financial Asset Management', incorporationState: 'South Carolina', sElectionEffectiveDate: '2021-01-01' } },
      { id: 2, title: 'Shareholders & Stock Ownership', shortTitle: 'Shareholders', status: 'completed', data: { totalShares: 1000, shareholderName: 'Michael Perotti', ownershipPercentage: 100, ssnLastFour: '6821', address: '124 Charleston Way, Charleston, SC 29401' } },
      { id: 3, title: 'Officer Compensation & Payroll', shortTitle: 'Officer Payroll', status: 'completed', data: { officerSalaryPaid: 120000, compensationMethod: 'W-2 through ADP', reasonableCompStudyPerformed: true } },
      { id: 4, title: 'Accounting Method & Books', shortTitle: 'Accounting Method', status: 'completed', data: { accountingMethod: 'Accrual', softwareUsed: 'QuickBooks Online Accountant', inventoryMaintained: false } },
      { id: 5, title: 'Revenue & Gross Receipts', shortTitle: 'Revenues', status: 'completed', data: { gross1099KReceived: 0, grossTradeReceipts: 742500, salesReturnsAndAllowances: 0 } },
      { id: 6, title: 'Cost of Goods Sold (COGS)', shortTitle: 'COGS', status: 'completed', data: { hasInventory: false, laborCostDirect: 0, materialsCost: 0 } },
      { id: 7, title: 'Ordinary Business Deductions', shortTitle: 'Operating Expenses', status: 'completed', data: { officeRent: 36000, professionalLegalFees: 14500, utilities: 4800, businessInsurance: 8900 } },
      { id: 8, title: 'Depreciation & Section 179 Assets', shortTitle: 'Fixed Assets', status: 'completed', data: { placedInService2025: 'Mac Studio Server, Office Conference Furniture', totalNewAssetCost: 18500, electSection179: true } },
      { id: 9, title: 'Digital Assets & Virtual Currencies', shortTitle: 'Crypto & Digital', status: 'completed', data: { engagedInCryptoTransactions: false, receivedRewardsOrStaking: false } },
      { id: 10, title: 'Vehicles & Standard Mileage vs. Actual', shortTitle: 'Vehicles', status: 'completed', data: { totalBusinessMiles: 14200, totalPersonalMiles: 3100, vehicleModel: '2023 Tesla Model Y', writtenLogMaintained: true } },
      { id: 11, title: 'Business Meals & Entertainment', shortTitle: 'Meals', status: 'completed', data: { mealsSubjectTo50Percent: 6420, entertainmentCostZeroDeductible: 0 } },
      { id: 12, title: 'Health Insurance & Retirement Plans', shortTitle: 'Benefits', status: 'completed', data: { shareholderHealthPremiumsPaid: 12800, sepIraContribution: 25000 } },
      { id: 13, title: 'Related Party Loans & Distributions', shortTitle: 'Loans & Equity', status: 'completed', data: { shareholderDistributionsTotal: 145000, loansToOrFromShareholders: 0 } },
      { id: 14, title: 'State Tax Nexus & Apportionment', shortTitle: 'State Nexus', status: 'completed', data: { statesWithPropertyOrPayroll: 'South Carolina (100%)', multiStateApportionmentNeeded: false } },
      { id: 15, title: 'Pass-Through Entity Tax (SC Act 61)', shortTitle: 'PTE Election', status: 'completed', data: { electSouthCarolinaPTE: true, estimatedPteBenefit: 12800 } },
      { id: 16, title: 'Charitable Contributions', shortTitle: 'Charity', status: 'pending', data: { corporateCharitableGifts: 5000, writtenReceiptsOver250Kept: true } },
      { id: 17, title: 'Foreign Accounts (FBAR & Form 8938)', shortTitle: 'Foreign Accounts', status: 'pending', data: { foreignFinancialAccountsAggregateOver10k: false } },
      { id: 18, title: 'Estimated Quarterly Tax Payments Made', shortTitle: 'Estimates', status: 'pending', data: { q1FederalPaid: 12500, q2FederalPaid: 12500, q3FederalPaid: 12500, q4FederalPaid: 12500 } },
      { id: 19, title: 'Prior Year Carryforwards & Credits', shortTitle: 'Carryforwards', status: 'pending', data: { priorNOLAvailable: 0, rAndDCreditsClaimed: 0 } },
      { id: 20, title: 'Corporate Governance & Minutes', shortTitle: 'Governance', status: 'pending', data: { annualShareholderMinutesDrafted: true, bylawsCurrent: true } },
      { id: 21, title: 'Client Declaration & Filing Authorization', shortTitle: 'Final Declaration', status: 'pending', data: { taxpayerReviewedIntake: true, electronicSignatureAuthorized: false } }
    ]
  };

  public getOrganizer(clientId: string): ClientOrganizerState {
    return this.organizerState;
  }

  public updateField(clientId: string, sectionId: number, key: string, value: any): ClientOrganizerState {
    const section = this.organizerState.sections.find(s => s.id === sectionId);
    if (section) {
      section.data[key] = value;
      section.status = 'completed';
    }
    const completedCount = this.organizerState.sections.filter(s => s.status === 'completed').length;
    this.organizerState.completionPercentage = Math.round((completedCount / this.organizerState.sections.length) * 100);
    return { ...this.organizerState };
  }

  public saveDraft(clientId: string, sectionId: number): void {
    this.organizerState.activeSectionId = sectionId;
  }

  public submitOrganizer(clientId: string): { success: boolean; error?: string } {
    this.organizerState.status = 'Submitted';
    this.organizerState.completionPercentage = 100;
    this.organizerState.sections.forEach(s => (s.status = 'completed'));
    return { success: true };
  }

  public reopenOrganizer(clientId: string): { success: boolean; error?: string } {
    this.organizerState.status = 'In Progress';
    return { success: true };
  }
}

/**
 * 4. Income & Expense Service
 */
export class DemoIncomeExpenseService implements IIncomeExpenseService {
  private incomeRecords: ClientIncomeRecord[] = [
    { id: 'inc_1', date: '2025-01-15', payer: 'Broad Street Commercial Tenants', incomeType: 'Business revenue', entityName: 'Perotti Capital Holdings LLC', amount: 62500, withholding: 0, description: 'Commercial base lease rent - Q1', taxYear: 2025 },
    { id: 'inc_2', date: '2025-04-15', payer: 'Broad Street Commercial Tenants', incomeType: 'Business revenue', entityName: 'Perotti Capital Holdings LLC', amount: 62500, withholding: 0, description: 'Commercial base lease rent - Q2', taxYear: 2025 },
    { id: 'inc_3', date: '2025-07-15', payer: 'Broad Street Commercial Tenants', incomeType: 'Business revenue', entityName: 'Perotti Capital Holdings LLC', amount: 62500, withholding: 0, description: 'Commercial base lease rent - Q3', taxYear: 2025 },
    { id: 'inc_4', date: '2025-10-15', payer: 'Broad Street Commercial Tenants', incomeType: 'Business revenue', entityName: 'Perotti Capital Holdings LLC', amount: 62500, withholding: 0, description: 'Commercial base lease rent - Q4', taxYear: 2025 },
    { id: 'inc_5', date: '2025-11-20', payer: 'Palmetto Advisory Partners', incomeType: 'Business revenue', entityName: 'Perotti Capital Holdings LLC', amount: 492500, withholding: 0, description: 'Corporate portfolio management & advisory fees', taxYear: 2025 }
  ];

  private expenseRecords: ClientExpenseRecord[] = [
    { id: 'exp_1', date: '2025-01-10', vendor: 'South Carolina Commercial Realty', category: 'Rent', amount: 36000, entityName: 'Perotti Capital Holdings LLC', businessPurpose: 'Executive headquarters lease - Annual', paymentMethod: 'ACH Wire', taxYear: 2025 },
    { id: 'exp_2', date: '2025-02-14', vendor: 'Charleston Legal Counsel LLC', category: 'Legal and professional', amount: 14500, entityName: 'Perotti Capital Holdings LLC', businessPurpose: 'Operating agreement & contract review', paymentMethod: 'Corporate Check', taxYear: 2025 },
    { id: 'exp_3', date: '2025-03-22', vendor: 'Apex Tech Solutions', category: 'Office expense', amount: 4800, entityName: 'Perotti Capital Holdings LLC', businessPurpose: 'Cloud infrastructure & cybersecurity suite', paymentMethod: 'Credit Card', taxYear: 2025 },
    { id: 'exp_4', date: '2025-05-18', vendor: 'Palmetto Mutual Insurance', category: 'Insurance', amount: 8900, entityName: 'Perotti Capital Holdings LLC', businessPurpose: 'Commercial general liability & D&O policy', paymentMethod: 'ACH Wire', taxYear: 2025 },
    { id: 'exp_5', date: '2025-08-11', vendor: 'Apple Store Charleston', category: 'Supplies', amount: 3850, entityName: 'Perotti Capital Holdings LLC', businessPurpose: 'Hardware upgrade for financial modeling', paymentMethod: 'Credit Card', taxYear: 2025 },
    { id: 'exp_6', date: '2025-10-04', vendor: 'Delta Air Lines & Marriot', category: 'Travel', amount: 5240, entityName: 'Perotti Capital Holdings LLC', businessPurpose: 'Commercial asset acquisition due diligence trip', paymentMethod: 'Credit Card', taxYear: 2025 }
  ];

  public getIncomeRecords(clientId: string): ClientIncomeRecord[] {
    return this.incomeRecords;
  }

  public getExpenseRecords(clientId: string): ClientExpenseRecord[] {
    return this.expenseRecords;
  }

  public addIncomeRecord(clientId: string, record: Omit<ClientIncomeRecord, 'id'>): ClientIncomeRecord {
    const newRecord: ClientIncomeRecord = {
      ...record,
      id: `inc_${Date.now()}`
    };
    this.incomeRecords.unshift(newRecord);
    return newRecord;
  }

  public deleteIncomeRecord(id: string): boolean {
    const idx = this.incomeRecords.findIndex(i => i.id === id);
    if (idx !== -1) {
      this.incomeRecords.splice(idx, 1);
      return true;
    }
    return false;
  }

  public addExpenseRecord(clientId: string, record: Omit<ClientExpenseRecord, 'id'>): ClientExpenseRecord {
    const newRecord: ClientExpenseRecord = {
      ...record,
      id: `exp_${Date.now()}`
    };
    this.expenseRecords.unshift(newRecord);
    return newRecord;
  }

  public deleteExpenseRecord(id: string): boolean {
    const idx = this.expenseRecords.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.expenseRecords.splice(idx, 1);
      return true;
    }
    return false;
  }

  public getCategoryRecommendation(vendor: string, amount: number, purpose: string): {
    category: string;
    confidence: number;
    explanation: string;
  } {
    const lower = `${vendor} ${purpose}`.toLowerCase();
    if (lower.includes('law') || lower.includes('legal') || lower.includes('cpa') || lower.includes('attorney')) {
      return { category: 'Legal and professional', confidence: 98, explanation: 'Matches professional and legal service vendor definitions under IRC § 162.' };
    }
    if (lower.includes('rent') || lower.includes('lease') || lower.includes('realty')) {
      return { category: 'Rent', confidence: 96, explanation: 'Matches commercial real property lease expenditure under Line 13.' };
    }
    if (lower.includes('fly') || lower.includes('hotel') || lower.includes('airline') || lower.includes('delta')) {
      return { category: 'Travel', confidence: 95, explanation: 'Qualifies as ordinary and necessary business travel away from tax home.' };
    }
    if (lower.includes('dinner') || lower.includes('lunch') || lower.includes('restaurant') || lower.includes('meal')) {
      return { category: 'Meals (50%)', confidence: 92, explanation: 'Subject to statutory 50% limitation under IRC § 274(n).' };
    }
    return { category: 'Office expense', confidence: 85, explanation: 'Categorized as general trade or business operating supply under IRC § 162.' };
  }
}

/**
 * 5. Return Review Service
 */
export class DemoReturnReviewService implements IReturnReviewService {
  private draftReturn: ClientDraftReturn = {
    id: 'ret_2025_1120s_perotti',
    entityName: 'Perotti Capital Holdings LLC',
    taxYear: 2025,
    version: '1.2 (Technical Review Certified)',
    status: 'Ready for Signature',
    preparer: 'David Vance, EA (A/R Tax Services)',
    certifiedBy: 'Elena Rostova, CPA (License #SC-28419)',
    grossReceipts: 742500,
    totalDeductions: 382450,
    ordinaryBusinessIncome: 360050,
    shareholderDistributions: 145000,
    stateTaxLiability: 12600,
    refundOrBalanceDue: 0,
    lines: [
      { line: 'Line 1a', description: 'Gross receipts or sales', amount: 742500, notes: 'Tie-out with customer bank deposits & invoicing' },
      { line: 'Line 2', description: 'Cost of goods sold', amount: 0, notes: 'Service and holding entity — no inventory' },
      { line: 'Line 3', description: 'Gross profit', amount: 742500 },
      { line: 'Line 7', description: 'Compensation of officers', amount: 120000, notes: 'Supported by ADP W-2 filing and reasonable comp study' },
      { line: 'Line 8', description: 'Salaries and wages', amount: 84000 },
      { line: 'Line 12', description: 'Taxes and licenses', amount: 18450, notes: 'Includes SC PTE Act 61 elective tax payments' },
      { line: 'Line 13', description: 'Interest expense', amount: 6200 },
      { line: 'Line 14', description: 'Depreciation (Form 4562)', amount: 18500, notes: 'Section 179 expensing elected for technology upgrades' },
      { line: 'Line 16', description: 'Rents', amount: 36000 },
      { line: 'Line 19', description: 'Other deductions (statement attached)', amount: 99300, notes: 'Itemized Schedule: Legal $14.5k, Ins $8.9k, Travel $5.2k, Meals $3.2k, Office $67.5k' },
      { line: 'Line 20', description: 'Total deductions', amount: 382450 },
      { line: 'Line 21', description: 'Ordinary business income (loss)', amount: 360050, notes: 'Allocated 100% to Shareholder Michael Perotti on Schedule K-1' }
    ],
    signatures: [
      { role: 'Paid Preparer', name: 'David Vance, EA', signedAt: '2026-02-18 10:14 EST', ipAddress: '10.0.4.12' },
      { role: 'Senior CPA Reviewer', name: 'Elena Rostova, CPA', signedAt: '2026-02-19 14:32 EST', ipAddress: '10.0.4.18' }
    ],
    questions: [
      { id: 'rq1', author: 'Elena Rostova, CPA', text: 'Section 179 expensing has been optimized to leave ordinary income at $360,050 to maximize your QBI deduction threshold.', date: '2026-02-19', response: 'Understood and approved.' }
    ],
    corrections: []
  };

  public getDraftReturn(clientId: string, taxYear?: number): ClientDraftReturn | undefined {
    return this.draftReturn;
  }

  public approveDraftReturn(returnId: string, signatoryName: string, ipAddress: string): { success: boolean; error?: string } {
    this.draftReturn.status = 'Signed & Ready to File';
    if (!this.draftReturn.signatures) this.draftReturn.signatures = [];
    this.draftReturn.signatures.push({
      role: 'Taxpayer / Corporate Officer (Form 8879-S)',
      name: signatoryName,
      signedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
      ipAddress
    });
    return { success: true };
  }

  public requestCorrection(returnId: string, field: string, explanation: string, author: string): { success: boolean; error?: string } {
    this.draftReturn.status = 'Corrections Required';
    if (!this.draftReturn.corrections) this.draftReturn.corrections = [];
    this.draftReturn.corrections.push({
      id: `cor_${Date.now()}`,
      field,
      explanation,
      status: 'Open Review',
      requestedAt: new Date().toISOString().split('T')[0]
    });
    return { success: true };
  }

  public askQuestion(returnId: string, question: string, author: string): { success: boolean; error?: string } {
    if (!this.draftReturn.questions) this.draftReturn.questions = [];
    this.draftReturn.questions.push({
      id: `q_${Date.now()}`,
      author,
      text: question,
      date: new Date().toISOString().split('T')[0]
    });
    return { success: true };
  }
}
export const DemoReturnService = DemoReturnReviewService;

/**
 * 6. Invoices & Billing Service
 */
export class DemoInvoiceService implements IInvoiceService {
  private invoices: ClientInvoiceRecord[] = [
    {
      id: 'inv_2025_001',
      invoiceNumber: 'INV-2025-0842',
      issueDate: '2026-01-15',
      dueDate: '2026-02-15',
      taxYear: 2025,
      description: 'Annual Corporate Tax Compliance Retainer (Q1-Q4)',
      totalAmount: 4500,
      retainerApplied: 4500,
      balanceDue: 0,
      status: 'Paid (Simulated)',
      items: [
        { description: 'Corporate entity compliance retainer fee', amount: 4500 }
      ],
      paymentHistory: [
        { date: '2026-01-16', amount: 4500, method: 'Retainer Balance Draw', receiptId: 'RCP-89211' }
      ]
    },
    {
      id: 'inv_2025_002',
      invoiceNumber: 'INV-2026-0194',
      issueDate: '2026-02-19',
      dueDate: '2026-03-20',
      taxYear: 2025,
      description: '2025 Form 1120-S & SC1120S Preparation & CPA Technical Certification',
      totalAmount: 3250,
      retainerApplied: 1000,
      balanceDue: 2250,
      status: 'Outstanding',
      items: [
        { description: 'Federal Form 1120-S Corporate Return & K-1 Preparation', hours: 10, rate: 200, amount: 2000 },
        { description: 'South Carolina Form SC1120S & Act 61 PTE Election Filing', hours: 4, rate: 200, amount: 800 },
        { description: 'Senior CPA Quality Review & Technical Reviewer Sign-off', hours: 1.5, rate: 300, amount: 450 }
      ],
      paymentHistory: []
    }
  ];

  public getInvoices(clientId: string): ClientInvoiceRecord[] {
    return this.invoices;
  }

  public simulatePayment(invoiceId: string, amount: number, method: string): { success: boolean; receiptId?: string; error?: string } {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (!inv) return { success: false, error: 'Invoice not found.' };

    const receiptId = `RCP-SIM-${Math.floor(100000 + Math.random() * 900000)}`;
    inv.balanceDue = Math.max(0, inv.balanceDue - amount);
    if (inv.balanceDue === 0) {
      inv.status = 'Paid (Simulated)';
    }
    if (!inv.paymentHistory) inv.paymentHistory = [];
    inv.paymentHistory.push({
      date: new Date().toISOString().split('T')[0],
      amount,
      method,
      receiptId
    });

    return { success: true, receiptId };
  }

  public disputeInvoice(invoiceId: string, reason: string, author: string): void {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = 'Disputed';
    }
  }

  public requestPaymentPlan(invoiceId: string, installments: number, author: string): void {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = `Payment Plan (${installments}x)`;
    }
  }
}

/**
 * 7. Tax Notices Service
 */
export class DemoNoticeService implements INoticeService {
  private notices: ClientNoticeRecord[] = [
    {
      id: 'ntc_irs_cp2000_sample',
      authority: 'Internal Revenue Service (IRS)',
      noticeNumber: 'CP2000',
      noticeTitle: 'Proposed Information Return Discrepancy (Tax Year 2024)',
      taxYear: 2024,
      receivedDate: '2025-11-10',
      responseDeadline: '2025-12-15',
      amountRequested: 0,
      status: 'Resolved by CPA (No Tax Due)',
      assignedCpa: 'Elena Rostova, CPA',
      aiSummary: 'IRS proposed tax adjustment based on 1099-B cost basis mismatch. Elena Rostova submitted Form 8821 response with certified broker schedule. IRS issued complete closure letter confirming $0 balance.',
      messages: [
        { id: 'm1', author: 'Elena Rostova, CPA', text: 'Rebuttal package filed with Brookhaven Campus on Nov 18. Agency accepted full basis reconciliation.', date: '2025-11-18' }
      ]
    },
    {
      id: 'ntc_sc_act61_confirmation',
      authority: 'South Carolina Department of Revenue',
      noticeNumber: 'SC-L-2025',
      noticeTitle: 'Notice of Pass-Through Entity Tax Election Acceptance',
      taxYear: 2025,
      receivedDate: '2026-01-28',
      responseDeadline: '2026-04-15',
      amountRequested: 0,
      status: 'Informational Only',
      assignedCpa: 'Elena Rostova, CPA',
      aiSummary: 'Confirmation of active elective PTE status under SC Act 61. Entity authorized to remit tax at corporate level.',
      messages: []
    }
  ];

  public getNotices(clientId: string): ClientNoticeRecord[] {
    return this.notices;
  }

  public uploadNotice(clientId: string, notice: Partial<ClientNoticeRecord>): ClientNoticeRecord {
    const newNotice: ClientNoticeRecord = {
      id: `ntc_${Date.now()}`,
      authority: notice.authority || 'Internal Revenue Service (IRS)',
      noticeNumber: notice.noticeNumber || 'Notice',
      noticeTitle: notice.noticeTitle || 'Tax Authority Notice',
      taxYear: notice.taxYear || 2025,
      receivedDate: notice.receivedDate || new Date().toISOString().split('T')[0],
      responseDeadline: notice.responseDeadline || '2026-04-15',
      amountRequested: notice.amountRequested || 0,
      status: 'Under CPA Review',
      assignedCpa: notice.assignedCpa || 'Elena Rostova, CPA',
      aiSummary: notice.aiSummary || 'Document uploaded and logged into defense workflow. CPA assigned to analyze statutory deadlines.',
      messages: [
        { id: 'm_init', author: 'TaxGuard System', text: 'Notice safely archived in encrypted vault. Response calendar locked.', date: new Date().toISOString().split('T')[0] }
      ]
    };
    this.notices.unshift(newNotice);
    return newNotice;
  }

  public addNoticeMessage(noticeId: string, text: string, author: string): void {
    const notice = this.notices.find(n => n.id === noticeId);
    if (notice) {
      if (!notice.messages) notice.messages = [];
      notice.messages.push({
        id: `msg_${Date.now()}`,
        author,
        text,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }

  public requestPoa(clientId: string): void {
    // Simulated power of attorney generation
  }
}

/**
 * 8. Advisory & Strategy Service
 */
export class DemoAdvisoryService implements IAdvisoryService {
  private plan: ClientAdvisoryPlan = {
    clientId: 'cli_perotti',
    taxYear: 2025,
    entityType: 'S-Corporation (South Carolina)',
    recommendations: [
      {
        id: 'adv_pte_act61',
        title: 'South Carolina Act 61 Pass-Through Entity (PTE) Election',
        category: 'State Tax Arbitrage',
        annualEstimatedSavings: 12800,
        implementationEffort: 'Low (Handled in return filing)',
        statutoryBasis: 'S.C. Code Ann. § 12-6-545(G)',
        status: 'Active & Selected for 2025',
        description: 'Allows S-Corporation to pay SC state income taxes at the entity level, fully bypassing the individual $10,000 SALT deduction cap on federal Form 1040.'
      },
      {
        id: 'adv_reasonable_comp',
        title: 'Officer Reasonable Compensation Optimization',
        category: 'Payroll & FICA Tax',
        annualEstimatedSavings: 14200,
        implementationEffort: 'Medium (Requires payroll adjustment)',
        statutoryBasis: 'Rev. Rul. 74-44 & IRC § 3121',
        status: 'Implemented',
        description: 'Aligning officer salary to $120,000 while distributing remaining $145,000 profit as corporate dividend distributions, eliminating 15.3% self-employment tax on dividend portions.'
      },
      {
        id: 'adv_defined_benefit',
        title: 'Cash Balance Defined Benefit Pension Integration',
        category: 'Retirement & Wealth Shelter',
        annualEstimatedSavings: 28500,
        implementationEffort: 'High (Actuarial plan design)',
        statutoryBasis: 'IRC § 401(a)(2) & IRC § 415',
        status: 'Proposed for Tax Year 2026',
        description: 'Pairing existing 401(k) with a cash balance plan to enable pre-tax contributions up to $150,000 annually, shielding top-bracket personal income.'
      }
    ],
    quarterlyEstimates: [
      { quarter: 'Q1 (Due Apr 15, 2026)', dueDate: '2026-04-15', federalAmount: 18500, stateAmount: 3200, status: 'Upcoming' },
      { quarter: 'Q2 (Due Jun 15, 2026)', dueDate: '2026-06-15', federalAmount: 18500, stateAmount: 3200, status: 'Scheduled' },
      { quarter: 'Q3 (Due Sep 15, 2026)', dueDate: '2026-09-15', federalAmount: 18500, stateAmount: 3200, status: 'Scheduled' },
      { quarter: 'Q4 (Due Jan 15, 2027)', dueDate: '2027-01-15', federalAmount: 18500, stateAmount: 3200, status: 'Scheduled' }
    ]
  };

  public getAdvisoryPlan(clientId: string): ClientAdvisoryPlan {
    return this.plan;
  }

  public requestConsultation(clientId: string, topic: string): void {
    // Consultation logged
  }
}
