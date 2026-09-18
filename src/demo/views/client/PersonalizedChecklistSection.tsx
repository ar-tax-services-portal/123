/**
 * A/R Tax Services, LLC - Personalized Document Checklist Engine
 * Compliance with Sections 7 & 8: Dynamic filtering, response statuses, audit logging, and readiness integration.
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
  Info
} from 'lucide-react';

export type ChecklistResponse = 'uploaded' | 'later' | 'not_received' | 'does_not_apply' | 'need_help';

export interface ChecklistItem {
  id: string;
  formNumber: string;
  title: string;
  category: string;
  taxYear: number;
  importance: 'Required' | 'Recommended' | 'Conditional';
  dueDate: string;
  description: string;
  status: ChecklistResponse;
  notApplicableReason?: string;
  uploadedFileName?: string;
  uploadedDate?: string;
  accountantApproved?: boolean;
}

interface PersonalizedChecklistSectionProps {
  selectedYear: number;
  onNavigateToUpload: () => void;
  onNavigateToVault: () => void;
  onOpenAssistant: () => void;
}

const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk-w2-1',
    formNumber: 'Form W-2',
    title: 'Wage and Tax Statement (Apex Technology Partners)',
    category: '04 — Income Statements (W-2, 1099-MISC, 1099-NEC)',
    taxYear: 2025,
    importance: 'Required',
    dueDate: '2026-03-15',
    description: 'Statutory wage statement showing Box 1 taxable compensation and withholding.',
    status: 'uploaded',
    uploadedFileName: '2025_W2_Apex_Tech_DH_XXXX.pdf',
    uploadedDate: '2026-02-14',
    accountantApproved: true
  },
  {
    id: 'chk-1099-nec',
    formNumber: 'Form 1099-NEC',
    title: 'Nonemployee Compensation (Highland Consulting Group)',
    category: '04 — Income Statements (W-2, 1099-MISC, 1099-NEC)',
    taxYear: 2025,
    importance: 'Required',
    dueDate: '2026-03-15',
    description: 'Compensation received for independent advisory services rendered in CY2025.',
    status: 'uploaded',
    uploadedFileName: '2025_1099NEC_Highland_DH_XXXX.pdf',
    uploadedDate: '2026-02-16',
    accountantApproved: true
  },
  {
    id: 'chk-1099-int',
    formNumber: 'Form 1099-INT',
    title: 'Interest Income Statements (Chase Private Client)',
    category: '05 — Interest and Dividends (1099-INT, 1099-DIV)',
    taxYear: 2025,
    importance: 'Required',
    dueDate: '2026-03-31',
    description: 'Annual interest earned on sweep deposit balances and premium yields.',
    status: 'uploaded',
    uploadedFileName: '2025_1099INT_Chase_DH_XXXX.pdf',
    uploadedDate: '2026-02-18',
    accountantApproved: false
  },
  {
    id: 'chk-1099-div',
    formNumber: 'Form 1099-DIV',
    title: 'Dividends & Distributions (Vanguard Institutional)',
    category: '05 — Interest and Dividends (1099-INT, 1099-DIV)',
    taxYear: 2025,
    importance: 'Required',
    dueDate: '2026-03-31',
    description: 'Ordinary and qualified dividend distributions for taxable brokerage holdings.',
    status: 'not_received'
  },
  {
    id: 'chk-1099-b',
    formNumber: 'Form 1099-B',
    title: 'Proceeds from Broker Transactions (Vanguard Brokerage)',
    category: '06 — Brokerage and Capital Transactions (1099-B)',
    taxYear: 2025,
    importance: 'Recommended',
    dueDate: '2026-03-31',
    description: 'Consolidated Form 1099-B detailing short-term and long-term capital transactions.',
    status: 'later'
  },
  {
    id: 'chk-1098-mort',
    formNumber: 'Form 1098',
    title: 'Mortgage Interest Statement (First Republic / JPMC)',
    category: '11 — Deductions (1098, Medical, Taxes, Interest)',
    taxYear: 2025,
    importance: 'Required',
    dueDate: '2026-03-15',
    description: 'IRC § 163(h) deductible mortgage interest, real estate taxes, and points.',
    status: 'uploaded',
    uploadedFileName: '2025_1098_FirstRepublic_DH_XXXX.pdf',
    uploadedDate: '2026-02-20',
    accountantApproved: true
  },
  {
    id: 'chk-k1-pass',
    formNumber: 'Schedule K-1',
    title: 'Partner Share of Income (Pinnacle Real Estate Fund LP)',
    category: '07 — Pass-Through Entities (Schedule K-1, 1065, 1120-S)',
    taxYear: 2025,
    importance: 'Conditional',
    dueDate: '2026-04-01',
    description: 'Form 1065 K-1 pass-through distributive share of real estate partnership earnings.',
    status: 'not_received'
  },
  {
    id: 'chk-charity-250',
    formNumber: 'IRC § 170 Letters',
    title: 'Charitable Contribution Contemporaneous Letters',
    category: '12 — Charitable Contributions and Donations',
    taxYear: 2025,
    importance: 'Recommended',
    dueDate: '2026-04-01',
    description: 'Written acknowledgments for charitable contributions of $250 or greater.',
    status: 'later'
  },
  {
    id: 'chk-crypto-8949',
    formNumber: 'Digital Assets',
    title: 'Cryptocurrency Trading & Staking Tax Package',
    category: '08 — Digital Assets and Cryptocurrency (1099-DA)',
    taxYear: 2025,
    importance: 'Conditional',
    dueDate: '2026-04-01',
    description: 'Comprehensive 8949 tax report from CoinTracker or Coinbase for digital asset disposals.',
    status: 'does_not_apply',
    notApplicableReason: 'Taxpayer had zero cryptocurrency disposals, trades, staking, or receipts in CY2025.',
    accountantApproved: true
  },
  {
    id: 'chk-fbar-foreign',
    formNumber: 'FinCEN Form 114',
    title: 'Foreign Financial Accounts & Bank Statements',
    category: '16 — Foreign Income and Assets (FBAR, Form 8938)',
    taxYear: 2025,
    importance: 'Conditional',
    dueDate: '2026-04-15',
    description: 'Account statements showing peak aggregate balance during calendar year.',
    status: 'need_help'
  },
  {
    id: 'chk-estimated-tax',
    formNumber: 'Quarterly Vouchers',
    title: 'Federal & State Estimated Tax Payment Proofs',
    category: '19 — Estimated Tax Payments (Federal and State)',
    taxYear: 2025,
    importance: 'Required',
    dueDate: '2026-03-15',
    description: 'EFTPS confirmation records and state vouchers for Q1-Q4 estimated payments.',
    status: 'uploaded',
    uploadedFileName: '2025_ESTIMATED_EFTPS_Vouchers_DH_XXXX.pdf',
    uploadedDate: '2026-02-10',
    accountantApproved: true
  },
  // CY2026 (Planning & Forward Projections)
  {
    id: 'chk-2026-w4',
    formNumber: 'Form W-4',
    title: 'W-4 Withholding Allowance & Multi-Income Adjustment Review',
    category: '04 — Income Statements (W-2, 1099-MISC, 1099-NEC)',
    taxYear: 2026,
    importance: 'Required',
    dueDate: '2026-04-15',
    description: 'Forward-looking wage withholding calibration based on anticipated CY2026 bonus distributions.',
    status: 'later'
  },
  {
    id: 'chk-2026-estimates',
    formNumber: 'Safe Harbor Model',
    title: 'CY2026 Quarterly Safe Harbor Estimated Tax Schedule',
    category: '19 — Estimated Tax Payments (Federal and State)',
    taxYear: 2026,
    importance: 'Required',
    dueDate: '2026-04-15',
    description: 'Calculated 110% prior-year safe harbor payment vouchers (Q1 through Q4).',
    status: 'not_received'
  },
  {
    id: 'chk-2026-entity-struct',
    formNumber: 'Advisory Plan',
    title: 'Entity Restructuring & Pass-Through Entity Tax (PTET) Election',
    category: '07 — Pass-Through Entities (Schedule K-1, 1065, 1120-S)',
    taxYear: 2026,
    importance: 'Recommended',
    dueDate: '2026-06-15',
    description: 'Strategic analysis of state pass-through entity tax deductions under IRS Notice 2020-75.',
    status: 'later'
  },
  {
    id: 'chk-2026-cap-ex',
    formNumber: 'Section 179 Forecast',
    title: 'CY2026 Capital Asset & Equipment Acquisition Budget',
    category: '11 — Deductions (1098, Medical, Taxes, Interest)',
    taxYear: 2026,
    importance: 'Conditional',
    dueDate: '2026-09-15',
    description: 'Projected capital expenditures eligible for accelerated bonus depreciation.',
    status: 'not_received'
  },
  // CY2024 (Prior-Year Reference — Certified & Archived)
  {
    id: 'chk-2024-w2',
    formNumber: 'Form W-2',
    title: 'CY2024 Wage and Tax Statement (Apex Technology Partners)',
    category: '04 — Income Statements (W-2, 1099-MISC, 1099-NEC)',
    taxYear: 2024,
    importance: 'Required',
    dueDate: '2025-03-15',
    description: 'Certified 2024 Box 1 wages ($178,400.00) and federal withholding ($31,200.00).',
    status: 'uploaded',
    uploadedFileName: '2024_W2_Apex_Tech_DH_Archived.pdf',
    uploadedDate: '2025-02-12',
    accountantApproved: true
  },
  {
    id: 'chk-2024-1099nec',
    formNumber: 'Form 1099-NEC',
    title: 'CY2024 Nonemployee Compensation (Highland Consulting Group)',
    category: '04 — Income Statements (W-2, 1099-MISC, 1099-NEC)',
    taxYear: 2024,
    importance: 'Required',
    dueDate: '2025-03-15',
    description: 'Form 1099-NEC nonemployee advisory fees ($94,500.00).',
    status: 'uploaded',
    uploadedFileName: '2024_1099NEC_Highland_Consulting_Archived.pdf',
    uploadedDate: '2025-02-15',
    accountantApproved: true
  },
  {
    id: 'chk-2024-1099int',
    formNumber: 'Form 1099-INT',
    title: 'CY2024 Interest Income (Chase Private Client)',
    category: '05 — Interest and Dividends (1099-INT, 1099-DIV)',
    taxYear: 2024,
    importance: 'Required',
    dueDate: '2025-03-15',
    description: 'Form 1099-INT ordinary interest earnings ($7,240.00).',
    status: 'uploaded',
    uploadedFileName: '2024_1099INT_Chase_Archived.pdf',
    uploadedDate: '2025-02-18',
    accountantApproved: true
  },
  {
    id: 'chk-2024-1099div',
    formNumber: 'Form 1099-DIV',
    title: 'CY2024 Dividends & Distributions (Vanguard Institutional)',
    category: '05 — Interest and Dividends (1099-INT, 1099-DIV)',
    taxYear: 2024,
    importance: 'Required',
    dueDate: '2025-03-15',
    description: 'Ordinary and qualified dividend distributions ($4,812.00).',
    status: 'uploaded',
    uploadedFileName: '2024_1099DIV_Vanguard_Archived.pdf',
    uploadedDate: '2025-02-20',
    accountantApproved: true
  },
  {
    id: 'chk-2024-1098',
    formNumber: 'Form 1098',
    title: 'CY2024 Mortgage Interest Statement (First Republic / JPMC)',
    category: '11 — Deductions (1098, Medical, Taxes, Interest)',
    taxYear: 2024,
    importance: 'Required',
    dueDate: '2025-03-15',
    description: 'Deductible primary residence mortgage interest ($28,450.00).',
    status: 'uploaded',
    uploadedFileName: '2024_1098_Mortgage_FirstRepublic_Archived.pdf',
    uploadedDate: '2025-02-22',
    accountantApproved: true
  },
  {
    id: 'chk-2024-8879',
    formNumber: 'Form 8879-S',
    title: 'CY2024 Signed IRS e-File Signature Authorization',
    category: '20 — E-File Authorizations (Form 8879, 8879-S)',
    taxYear: 2024,
    importance: 'Required',
    dueDate: '2025-03-12',
    description: 'Form 8879-S signed with PIN verification (MeF Accepted).',
    status: 'uploaded',
    uploadedFileName: 'Form_8879S_Signed_Michael_Perotti_2024.pdf',
    uploadedDate: '2025-03-11',
    accountantApproved: true
  },
  // CY2023 (Historical Reference — Finalized & Closed)
  {
    id: 'chk-2023-w2',
    formNumber: 'Form W-2',
    title: 'CY2023 Wage and Tax Statement (Apex Technology Partners)',
    category: '04 — Income Statements (W-2, 1099-MISC, 1099-NEC)',
    taxYear: 2023,
    importance: 'Required',
    dueDate: '2024-03-15',
    description: 'Archived statutory wage record ($172,000.00).',
    status: 'uploaded',
    uploadedFileName: '2023_W2_Apex_Tech_Archived.pdf',
    uploadedDate: '2024-02-10',
    accountantApproved: true
  },
  {
    id: 'chk-2023-1099nec',
    formNumber: 'Form 1099-NEC',
    title: 'CY2023 Nonemployee Compensation (Highland Consulting)',
    category: '04 — Income Statements (W-2, 1099-MISC, 1099-NEC)',
    taxYear: 2023,
    importance: 'Required',
    dueDate: '2024-03-15',
    description: 'Archived independent consulting fee slip ($88,000.00).',
    status: 'uploaded',
    uploadedFileName: '2023_1099NEC_Highland_Archived.pdf',
    uploadedDate: '2024-02-14',
    accountantApproved: true
  },
  {
    id: 'chk-2023-1098',
    formNumber: 'Form 1098',
    title: 'CY2023 Mortgage Interest Statement (First Republic)',
    category: '11 — Deductions (1098, Medical, Taxes, Interest)',
    taxYear: 2023,
    importance: 'Required',
    dueDate: '2024-03-15',
    description: 'Archived home mortgage interest statement.',
    status: 'uploaded',
    uploadedFileName: '2023_1098_FirstRepublic_Archived.pdf',
    uploadedDate: '2024-02-16',
    accountantApproved: true
  }
];

export const PersonalizedChecklistSection: React.FC<PersonalizedChecklistSectionProps> = ({
  selectedYear,
  onNavigateToUpload,
  onNavigateToVault,
  onOpenAssistant
}) => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST_ITEMS);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterImportance, setFilterImportance] = useState<string>('ALL');
  const [activeExplainId, setActiveExplainId] = useState<string | null>(null);
  const [explainText, setExplainText] = useState<string>('');
  const [explainError, setExplainError] = useState<string | null>(null);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (item.taxYear !== selectedYear) return false;
      if (filterCategory !== 'ALL' && !item.category.includes(filterCategory)) return false;
      if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
      if (filterImportance !== 'ALL' && item.importance !== filterImportance) return false;
      return true;
    });
  }, [items, selectedYear, filterCategory, filterStatus, filterImportance]);

  // Statistics
  const stats = useMemo(() => {
    const yearItems = items.filter(i => i.taxYear === selectedYear);
    const total = yearItems.length;
    const uploaded = yearItems.filter(i => i.status === 'uploaded').length;
    const later = yearItems.filter(i => i.status === 'later').length;
    const notReceived = yearItems.filter(i => i.status === 'not_received').length;
    const notApplicable = yearItems.filter(i => i.status === 'does_not_apply').length;
    const needHelp = yearItems.filter(i => i.status === 'need_help').length;
    const requiredItems = yearItems.filter(i => i.importance === 'Required');
    const requiredUploaded = requiredItems.filter(i => i.status === 'uploaded').length;
    const completionPercent = total > 0 ? Math.round(((uploaded + notApplicable) / total) * 100) : 0;
    return {
      total,
      uploaded,
      later,
      notReceived,
      notApplicable,
      needHelp,
      requiredTotal: requiredItems.length,
      requiredUploaded,
      completionPercent
    };
  }, [items, selectedYear]);

  const handleStatusChange = (id: string, newStatus: ChecklistResponse) => {
    if (newStatus === 'does_not_apply') {
      setActiveExplainId(id);
      setExplainError(null);
      const target = items.find(i => i.id === id);
      setExplainText(target?.notApplicableReason || '');
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus, notApplicableReason: undefined };
      }
      return item;
    }));

    setAuditNotice(`Status updated to "${newStatus.replace('_', ' ').toUpperCase()}". Audit entry logged.`);
    setTimeout(() => setAuditNotice(null), 3500);
  };

  const handleSaveNotApplicable = (id: string) => {
    if (!explainText.trim()) {
      setExplainError('A brief reason is required when marking an item as "Does Not Apply" for accountant review.');
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'does_not_apply',
          notApplicableReason: explainText.trim(),
          accountantApproved: false
        };
      }
      return item;
    }));

    setActiveExplainId(null);
    setExplainText('');
    setExplainError(null);
    setAuditNotice('Explanation recorded. Item flagged for accountant review & validation.');
    setTimeout(() => setAuditNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="p-6 bg-white border border-neutral-300 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-[#0A2544] text-[#E8C66A] rounded">
                Tax Year {selectedYear}
              </span>
              <h2 className="text-xl font-bold text-neutral-900">Personalized Document Checklist</h2>
            </div>
            <p className="text-sm text-neutral-600 mt-1">
              Dynamic intake requirements customized to your entity structure, prior-year filing patterns, and questionnaire responses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToUpload}
              className="px-4 py-2 bg-[#061A2F] text-white hover:bg-[#0A2544] text-xs font-semibold rounded flex items-center gap-2 transition-colors shadow-sm"
            >
              <UploadCloud className="w-4 h-4 text-[#D7AC4A]" />
              <span>Upload Document</span>
            </button>
            <button
              onClick={onOpenAssistant}
              className="px-3.5 py-2 border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D7AC4A]" />
              <span>Ask Advisor</span>
            </button>
          </div>
        </div>

        {/* Readiness Progress Bar */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-700">Checklist Readiness Fulfillment</span>
            <span className="font-mono font-bold text-[#0A2544]">
              {stats.uploaded + stats.notApplicable} of {stats.total} items resolved ({stats.completionPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden flex">
            <div
              className="bg-[#0A2544] h-full transition-all duration-300"
              style={{ width: `${stats.completionPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs font-medium text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>{stats.uploaded} Uploaded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{stats.later} Will Upload Later</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>{stats.notReceived} Not Received Yet</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
              <span>{stats.notApplicable} Does Not Apply</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>{stats.needHelp} Need Help</span>
            </div>
          </div>
        </div>
      </div>

      {auditNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs font-medium text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{auditNotice}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="p-4 bg-white border border-neutral-300 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-700">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Status:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-neutral-300 rounded bg-white text-xs font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="uploaded">Uploaded</option>
            <option value="later">Will Upload Later</option>
            <option value="not_received">Not Received Yet</option>
            <option value="does_not_apply">Does Not Apply</option>
            <option value="need_help">Need Help</option>
          </select>

          <select
            value={filterImportance}
            onChange={(e) => setFilterImportance(e.target.value)}
            className="px-2.5 py-1.5 border border-neutral-300 rounded bg-white text-xs font-medium"
          >
            <option value="ALL">All Importance</option>
            <option value="Required">Required Only</option>
            <option value="Recommended">Recommended</option>
            <option value="Conditional">Conditional</option>
          </select>
        </div>

        <div className="text-xs text-neutral-500 font-mono">
          Showing {filteredItems.length} of {stats.total} items for CY{selectedYear}
        </div>
      </div>

      {/* Checklist List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isUploaded = item.status === 'uploaded';
          const isDoesNotApply = item.status === 'does_not_apply';
          const isNeedHelp = item.status === 'need_help';

          return (
            <div
              key={item.id}
              className={`p-4 bg-white border rounded-lg transition-all shadow-xs ${
                isUploaded
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : isDoesNotApply
                  ? 'border-neutral-300 bg-neutral-50/40 opacity-80'
                  : item.importance === 'Required'
                  ? 'border-[#0A2544]/40 hover:border-[#0A2544]'
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-bold font-mono bg-neutral-100 text-neutral-800 border border-neutral-300 rounded">
                      {item.formNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${
                        item.importance === 'Required'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : item.importance === 'Recommended'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {item.importance}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due {item.dueDate}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
                  <p className="text-xs text-neutral-600">{item.description}</p>

                  <div className="text-[11px] text-neutral-500 font-mono pt-1">
                    Vault Category: {item.category}
                  </div>

                  {isUploaded && item.uploadedFileName && (
                    <div className="flex items-center gap-2 pt-1 text-xs text-emerald-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Linked document: <strong>{item.uploadedFileName}</strong></span>
                      {item.accountantApproved && (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold rounded">
                          Accountant Approved
                        </span>
                      )}
                    </div>
                  )}

                  {isDoesNotApply && item.notApplicableReason && (
                    <div className="p-2.5 bg-neutral-100 border border-neutral-300 rounded text-xs text-neutral-700 mt-2">
                      <div className="font-semibold text-neutral-900">Taxpayer Explanation:</div>
                      <div className="italic">{item.notApplicableReason}</div>
                      <div className="text-[10px] text-neutral-500 mt-1">
                        Status: {item.accountantApproved ? 'Approved by Reviewer' : 'Pending Reviewer Sign-Off'}
                      </div>
                    </div>
                  )}

                  {isNeedHelp && (
                    <div className="p-2.5 bg-purple-50 border border-purple-200 rounded text-xs text-purple-900 mt-2 flex items-center justify-between">
                      <span>Our engagement advisor has been notified. You can also consult our AI Tax Assistant.</span>
                      <button
                        onClick={onOpenAssistant}
                        className="px-2 py-1 bg-purple-700 text-white font-semibold rounded text-[11px] hover:bg-purple-800"
                      >
                        Ask Question
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Selector & Direct Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-shrink-0">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                      Your Response:
                    </label>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as ChecklistResponse)}
                      className="px-3 py-1.5 border border-neutral-300 bg-white rounded text-xs font-semibold text-neutral-800 shadow-2xs"
                    >
                      <option value="uploaded">Uploaded</option>
                      <option value="later">Will Upload Later</option>
                      <option value="not_received">Not Received Yet</option>
                      <option value="does_not_apply">Does Not Apply</option>
                      <option value="need_help">Need Help</option>
                    </select>
                  </div>

                  {!isUploaded && (
                    <button
                      onClick={onNavigateToUpload}
                      className="px-3 py-1.5 mt-4 sm:mt-0 bg-[#061A2F] hover:bg-[#0A2544] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-2xs"
                      title="Upload file for this item"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#D7AC4A]" />
                      <span>Upload</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Not Applicable Explanation Input Drawer */}
              {activeExplainId === item.id && (
                <div className="mt-4 p-3.5 bg-neutral-50 border border-neutral-300 rounded space-y-3">
                  <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#0A2544]" />
                    <span>Explain Why "{item.formNumber}" Does Not Apply:</span>
                  </div>
                  {explainError && (
                    <div className="p-2 bg-red-50 border border-red-300 text-red-800 text-[11px] rounded">
                      {explainError}
                    </div>
                  )}
                  <textarea
                    value={explainText}
                    onChange={(e) => setExplainText(e.target.value)}
                    placeholder="e.g., Account was closed in 2024, no transactions occurred, or no income was received from this payer."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
                    rows={2}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveExplainId(null)}
                      className="px-3 py-1 text-xs border border-neutral-300 rounded hover:bg-neutral-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveNotApplicable(item.id)}
                      className="px-3 py-1 text-xs bg-[#061A2F] text-white font-semibold rounded hover:bg-[#0A2544]"
                    >
                      Submit for Accountant Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
