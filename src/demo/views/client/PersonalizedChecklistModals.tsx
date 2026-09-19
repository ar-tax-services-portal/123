/**
 * A/R Tax Services, LLC - Personalized Documents Engine Modals
 * Supports:
 * - Smart Upload & Document Scanner simulation with AI confidence scoring
 * - OCR Data Inspector with sensitive data masking and field-level audit trail
 * - Interactive Intake Questionnaire Editor (life events & state triggers)
 * - Tax Professional Override Modal with reason logging
 */

import React, { useState } from 'react';
import {
  UploadCloud,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Eye,
  Lock,
  ArrowRight,
  Info,
  Calendar,
  Building,
  DollarSign
} from 'lucide-react';
import {
  PersonalizedDocItem,
  IntakeResponses,
  OcrAuditEntry,
  detectUploadAnomalies
} from '../../services/personalizedDocumentsEngine';

// --------------------------------------------------------------------------
// 1. SMART UPLOAD & DOCUMENT SCANNER MODAL
// --------------------------------------------------------------------------

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDoc: PersonalizedDocItem | null;
  selectedTaxYear: number;
  allExistingDocs: PersonalizedDocItem[];
  onUploadSuccess: (
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
  ) => void;
}

export const SmartUploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  targetDoc,
  selectedTaxYear,
  allExistingDocs,
  onUploadSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [simulatedDocYear, setSimulatedDocYear] = useState<number>(selectedTaxYear);

  if (!isOpen || !targetDoc) return null;

  const handleSimulatedUpload = () => {
    setIsProcessing(true);
    setUploadProgress(20);

    const timer1 = setTimeout(() => setUploadProgress(60), 300);
    const timer2 = setTimeout(() => {
      setUploadProgress(100);

      const fileName = selectedFile
        ? selectedFile.name
        : `${simulatedDocYear}_${targetDoc.formNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Upload_${Math.floor(1000 + Math.random() * 9000)}.pdf`;

      const fileHash = `sha256_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;

      // Run anomaly check
      const anomaly = detectUploadAnomalies(
        {
          fileName,
          fileHash,
          taxYear: simulatedDocYear,
          formType: targetDoc.formNumber
        },
        allExistingDocs,
        selectedTaxYear
      );

      // Generate realistic extracted OCR fields
      const ocrFields: Record<string, string | number> = {
        taxYear: simulatedDocYear,
        taxpayerName: 'Taxpayer on Record',
        taxpayerSSNMasked: '***-**-8419',
        detectedForm: targetDoc.formNumber,
        issuingEntity: targetDoc.source === 'Employer' ? 'Apex Technology Corp' : 'Financial Custodian N.A.',
        scanTimestamp: new Date().toISOString()
      };

      if (targetDoc.category === 'Employment') {
        ocrFields.box1Wages = 145200.00;
        ocrFields.box2FedWithheld = 26800.00;
        ocrFields.box16StateWages = 145200.00;
        ocrFields.box17StateWithheld = 7410.00;
      } else if (targetDoc.category === 'Contract / Gig Work') {
        ocrFields.box1NonempComp = 38500.00;
      } else if (targetDoc.category === 'Mortgage Interest') {
        ocrFields.mortgageInterest = 18450.00;
        ocrFields.outstandingPrincipal = 420000.00;
      }

      onUploadSuccess(targetDoc.id, {
        fileName,
        fileSize: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : '1.34 MB',
        fileHash,
        confidenceScore: anomaly.isTaxYearMismatch ? 76 : 98,
        ocrData: ocrFields,
        taxYearMismatch: anomaly.isTaxYearMismatch,
        mismatchDetectedYear: anomaly.mismatchYear,
        possibleDuplicateOf: anomaly.duplicateMatchId
      });

      setIsProcessing(false);
      setSelectedFile(null);
      setIsCameraActive(false);
      onClose();
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A2544] text-[#E8C66A]">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Upload &amp; Scan Tax Document</h3>
              <p className="text-xs text-neutral-500 font-mono">Target: {targetDoc.formNumber} — {targetDoc.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Target Document Specs */}
          <div className="rounded-lg bg-neutral-50 p-3 text-xs border border-neutral-200 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold text-neutral-700">Category:</span>
              <span className="font-mono text-neutral-900">{targetDoc.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-neutral-700">Target Tax Year:</span>
              <span className="font-mono font-bold text-[#0A2544]">CY{selectedTaxYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-neutral-700">Issuing Source:</span>
              <span className="text-neutral-800">{targetDoc.source}</span>
            </div>
          </div>

          {/* Upload or Camera Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsCameraActive(false)}
              className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-semibold transition-all ${
                !isCameraActive
                  ? 'border-[#0A2544] bg-[#0A2544] text-white shadow-xs'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <UploadCloud className="h-4 w-4" />
              <span>File Browser / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCameraActive(true)}
              className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-semibold transition-all ${
                isCameraActive
                  ? 'border-[#0A2544] bg-[#0A2544] text-white shadow-xs'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>Camera / Mobile Scan</span>
            </button>
          </div>

          {/* Camera Simulation Mode */}
          {isCameraActive ? (
            <div className="rounded-lg border-2 border-dashed border-[#0A2544]/40 bg-neutral-900 p-6 text-center text-white">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 mb-3 animate-pulse">
                <Camera className="h-7 w-7 text-[#E8C66A]" />
              </div>
              <p className="text-xs font-semibold">Live High-Resolution Camera Mode</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Align document edges inside the viewport. Auto-edge detection &amp; perspective correction enabled.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-300">Scanner Ready (300 DPI Simulated)</span>
              </div>
            </div>
          ) : (
            /* Drag and Drop Zone */
            <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-6 text-center hover:bg-neutral-50 transition-colors">
              <input
                type="file"
                id="doc-file-input"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.tiff"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="doc-file-input" className="cursor-pointer block">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs border border-neutral-200 mb-2">
                  <FileText className="h-6 w-6 text-[#0A2544]" />
                </div>
                <p className="text-xs font-semibold text-neutral-900">
                  {selectedFile ? selectedFile.name : 'Click to select or drag PDF, JPG, PNG here'}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Multi-page PDFs supported up to 50 MB. 256-bit encrypted transit.
                </p>
              </label>
            </div>
          )}

          {/* Year Simulation Control for Mismatch Testing */}
          <div className="flex items-center justify-between rounded-lg bg-neutral-100 p-2.5 text-xs">
            <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-neutral-500" />
              Document Calendar Year:
            </span>
            <div className="flex gap-1.5">
              {[2026, 2025, 2024].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSimulatedDocYear(yr)}
                  className={`rounded px-2.5 py-1 text-xs font-mono font-semibold transition-colors ${
                    simulatedDocYear === yr
                      ? 'bg-[#0A2544] text-[#E8C66A]'
                      : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {simulatedDocYear !== selectedTaxYear && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Test Notice:</strong> Document year ({simulatedDocYear}) differs from currently active tax year ({selectedTaxYear}). This will trigger the Tax Year Mismatch audit flag upon upload.
              </span>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-neutral-700">
                <span>AI Optical Character Recognition &amp; Form Sorter...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full bg-[#0A2544] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSimulatedUpload}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-lg bg-[#0A2544] px-4 py-2 text-xs font-semibold text-[#E8C66A] shadow-sm hover:bg-[#061A2F]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isProcessing ? 'Processing...' : 'Complete Upload &amp; Scan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// 2. OCR INSPECTION & DATA AUDIT MODAL
// --------------------------------------------------------------------------

interface OcrInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: PersonalizedDocItem | null;
}

export const OcrInspectionModal: React.FC<OcrInspectionModalProps> = ({
  isOpen,
  onClose,
  doc
}) => {
  if (!isOpen || !doc) return null;

  const ocrData = doc.ocrData || {};
  const entries = Object.entries(ocrData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">OCR Extraction &amp; Field Audit Trail</h3>
              <p className="text-xs text-neutral-500 font-mono">{doc.formNumber} — {doc.uploadedFileName || 'Uploaded Document'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Metadata banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-neutral-50 p-3 border border-neutral-200 text-xs">
            <div>
              <span className="text-neutral-500 block text-[10px] font-mono uppercase">Confidence</span>
              <span className="font-bold text-emerald-700">{doc.confidenceScore || 98}% ({doc.confidenceTier || 'High'})</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] font-mono uppercase">Tax Year</span>
              <span className="font-bold text-[#0A2544]">CY{doc.taxYear}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] font-mono uppercase">Review Status</span>
              <span className="font-bold text-neutral-800">{doc.status}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] font-mono uppercase">Reviewer</span>
              <span className="font-medium text-neutral-700">{doc.reviewedBy || 'Marcus Vance, EA'}</span>
            </div>
          </div>

          {/* Extracted Key-Value Table */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-[#0A2544]" />
              <span>Extracted Tax Form Fields (Masked for Security)</span>
            </h4>

            {entries.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 p-4 text-center text-xs text-neutral-500">
                No structured OCR data available for this document.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-neutral-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 font-mono text-[11px] text-neutral-700">
                    <tr>
                      <th className="px-3 py-2">Field Description</th>
                      <th className="px-3 py-2">Extracted Value</th>
                      <th className="px-3 py-2">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {entries.map(([key, val]) => (
                      <tr key={key} className="hover:bg-neutral-50">
                        <td className="px-3 py-2 font-mono font-medium text-neutral-800">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </td>
                        <td className="px-3 py-2 font-mono text-neutral-900">
                          {typeof val === 'number'
                            ? `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                            : String(val)}
                        </td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Provenance and Chain of Custody */}
          <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200 text-xs space-y-1.5">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-neutral-600" />
              <span>Security, Hash &amp; Chain of Custody</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-neutral-600">
              <div>SHA-256 Hash: <span className="text-neutral-900">{doc.fileHash || 'sha256_e8910a293b8214'}</span></div>
              <div>Upload Timestamp: <span className="text-neutral-900">{doc.uploadedDate || '2026-02-14 14:22 EST'}</span></div>
              <div>Malware &amp; PDF Sanitization: <span className="text-emerald-700 font-bold">Passed (Zero Threats)</span></div>
              <div>PII Redaction Engine: <span className="text-emerald-700 font-bold">SSN &amp; Bank Accts Masked</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#0A2544] px-4 py-2 text-xs font-semibold text-white hover:bg-[#061A2F]"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// 3. INTERACTIVE INTAKE QUESTIONNAIRE MODAL
// --------------------------------------------------------------------------

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIntake: IntakeResponses;
  onSaveIntake: (updatedIntake: IntakeResponses) => void;
}

export const IntakeQuestionnaireModal: React.FC<IntakeModalProps> = ({
  isOpen,
  onClose,
  currentIntake,
  onSaveIntake
}) => {
  const [draft, setDraft] = useState<IntakeResponses>({ ...currentIntake });

  if (!isOpen) return null;

  const handleToggle = (key: keyof IntakeResponses) => {
    setDraft(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    onSaveIntake(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A2544] text-[#E8C66A]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Personalized Tax Intake &amp; Requirement Rules</h3>
              <p className="text-xs text-neutral-500">
                Adjusting life events and sources updates document requirements in real time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {/* State of Residence */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              Primary State of Residence for Tax Year {draft.taxYear}:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(['CA', 'NY', 'NC', 'SC', 'VA', 'TN', 'FL', 'NJ'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setDraft(prev => ({ ...prev, residenceState: st }))}
                  className={`rounded-lg py-2 text-xs font-bold font-mono transition-all border ${
                    draft.residenceState === st
                      ? 'border-[#0A2544] bg-[#0A2544] text-[#E8C66A] shadow-xs'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            {(draft.residenceState === 'FL' || draft.residenceState === 'TN') && (
              <p className="mt-2 text-xs font-medium text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                ✓ {draft.residenceState === 'FL' ? 'Florida' : 'Tennessee'} has NO state individual personal income tax. No state individual tax return will be prepared.
              </p>
            )}
          </div>

          {/* Income & Employment */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-500 mb-2">
              Employment &amp; Earned Income
            </h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">W-2 Employment</div>
                  <div className="text-[11px] text-neutral-500">Received Form W-2 from one or more employers</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.hadW2Employment}
                  onChange={() => handleToggle('hadW2Employment')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              {draft.hadW2Employment && (
                <div className="pl-4 pr-3 py-2 bg-neutral-50 border-l-2 border-[#0A2544] flex items-center justify-between text-xs">
                  <span className="text-neutral-700 font-medium">Number of W-2 Employers:</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setDraft(prev => ({ ...prev, w2Count: num }))}
                        className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                          draft.w2Count === num
                            ? 'bg-[#0A2544] text-[#E8C66A]'
                            : 'bg-white border border-neutral-300 text-neutral-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Independent Contracting &amp; Freelance (1099-NEC)</div>
                  <div className="text-[11px] text-neutral-500">Performed consulting, gig work, or independent contractor services</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.hadFreelanceOrContract}
                  onChange={() => handleToggle('hadFreelanceOrContract')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Payment Processor (1099-K)</div>
                  <div className="text-[11px] text-neutral-500">Processed card payments or online sales via Stripe, Square, PayPal, Venmo</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.received1099K}
                  onChange={() => handleToggle('received1099K')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>
            </div>
          </div>

          {/* Investments & Property */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-500 mb-2">
              Investments, Property &amp; Real Estate
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Sold Stocks / Investments (1099-B)</div>
                  <div className="text-[11px] text-neutral-500">Brokerage trades &amp; capital gains</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.soldInvestments}
                  onChange={() => handleToggle('soldInvestments')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Interest or Dividends (1099-INT/DIV)</div>
                  <div className="text-[11px] text-neutral-500">Bank accounts or dividend portfolios</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.receivedInterestOrDividends}
                  onChange={() => handleToggle('receivedInterestOrDividends')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Mortgage on Real Estate (Form 1098)</div>
                  <div className="text-[11px] text-neutral-500">Deductible mortgage interest &amp; escrow</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.hasMortgage}
                  onChange={() => handleToggle('hasMortgage')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Rental Real Estate (Schedule E)</div>
                  <div className="text-[11px] text-neutral-500">Owns residential/commercial rentals</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.ownsRentalProperty}
                  onChange={() => handleToggle('ownsRentalProperty')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Sold Real Estate (Form 1099-S)</div>
                  <div className="text-[11px] text-neutral-500">Sale of primary home or property</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.soldRealEstate}
                  onChange={() => handleToggle('soldRealEstate')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Pass-Through Entity (Schedule K-1)</div>
                  <div className="text-[11px] text-neutral-500">Partner, S-Corp shareholder, or trust</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.hasPassThroughK1}
                  onChange={() => handleToggle('hasPassThroughK1')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>
            </div>
          </div>

          {/* Healthcare & Specialized */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-500 mb-2">
              Healthcare, Education &amp; Retirement
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Marketplace Insurance (Form 1095-A)</div>
                  <div className="text-[11px] text-neutral-500">Healthcare.gov or state marketplace plan</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.hasMarketplaceInsurance}
                  onChange={() => handleToggle('hasMarketplaceInsurance')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Health Savings Account (1099-SA / 5498-SA)</div>
                  <div className="text-[11px] text-neutral-500">Distributions or contributions to HSA</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.hasHSAorMSA}
                  onChange={() => handleToggle('hasHSAorMSA')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Retirement Distributions (1099-R)</div>
                  <div className="text-[11px] text-neutral-500">Pensions, annuities, 401(k), IRA distributions</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.receivedRetirementDistributions}
                  onChange={() => handleToggle('receivedRetirementDistributions')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-neutral-900">Social Security Benefits (SSA-1099)</div>
                  <div className="text-[11px] text-neutral-500">Monthly Social Security benefits received</div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.receivedSocialSecurity}
                  onChange={() => handleToggle('receivedSocialSecurity')}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0A2544]"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-[#0A2544] px-4 py-2 text-xs font-semibold text-[#E8C66A] shadow-sm hover:bg-[#061A2F]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Apply Rules &amp; Regenerate Requirements</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// 4. TAX PROFESSIONAL STATUS OVERRIDE MODAL
// --------------------------------------------------------------------------

interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: PersonalizedDocItem | null;
  onApplyOverride: (docId: string, newStatus: PersonalizedDocItem['status'], reason: string) => void;
}

export const ProfessionalOverrideModal: React.FC<OverrideModalProps> = ({
  isOpen,
  onClose,
  doc,
  onApplyOverride
}) => {
  const [selectedStatus, setSelectedStatus] = useState<PersonalizedDocItem['status']>('Accepted');
  const [overrideReason, setOverrideReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !doc) return null;

  const handleSave = () => {
    if (!overrideReason.trim()) {
      setError('Professional override requires a documented statutory or audit explanation.');
      return;
    }
    onApplyOverride(doc.id, selectedStatus, overrideReason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A2544] text-[#E8C66A]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Tax Preparer Status Override</h3>
              <p className="text-xs text-neutral-500 font-mono">{doc.formNumber} — {doc.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-neutral-50 p-3 text-xs border border-neutral-200 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold text-neutral-600">Current Status:</span>
              <span className="font-bold text-neutral-900">{doc.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-neutral-600">Reviewer:</span>
              <span className="font-mono text-neutral-800">Elena Rostova, CPA (Senior Sign-off)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              Select New Review Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as PersonalizedDocItem['status'])}
              className="w-full rounded-lg border border-neutral-300 p-2 text-xs font-medium text-neutral-800 bg-white"
            >
              <option value="Accepted">Accepted — Validated &amp; Ready for Filing</option>
              <option value="Needs Review">Needs Review — Flagged for Clarification</option>
              <option value="Rejected / Replace">Rejected / Replace — Illegible or Incomplete</option>
              <option value="Not Applicable">Not Applicable — Statutory Exemption Applies</option>
              <option value="Awaiting Client">Awaiting Client Action</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              Documented Professional Reason (Required for Audit Trail):
            </label>
            <textarea
              value={overrideReason}
              onChange={(e) => {
                setOverrideReason(e.target.value);
                setError(null);
              }}
              rows={3}
              placeholder="e.g., Reviewed substitute 1099; corroborated with year-end banking tie-out. Statutory requirements met."
              className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:border-[#0A2544] focus:outline-hidden"
            />
            {error && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">{error}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#0A2544] px-4 py-2 text-xs font-semibold text-[#E8C66A] hover:bg-[#061A2F]"
          >
            Log Override &amp; Update Status
          </button>
        </div>
      </div>
    </div>
  );
};
