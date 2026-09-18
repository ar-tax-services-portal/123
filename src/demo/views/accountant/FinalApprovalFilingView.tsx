/**
 * A/R Tax Services, LLC - Final Return Approval & Demo Filing Workflow
 * Sections 30, 31, 32, 33:
 * Final Return Summary, 6-Point Attestation, E-File Simulation Engine, and Post-Filing Records.
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  AlertOctagon, 
  ShieldCheck, 
  FileCheck, 
  RotateCcw, 
  FileText, 
  Lock, 
  Unlock, 
  Hash, 
  Clock, 
  Building2,
  Globe2,
  Printer
} from 'lucide-react';
import { accountantCenterService } from '../../services/AccountantCenterService';

interface FinalApprovalFilingViewProps {
  isDark: boolean;
  onNavigateToQc?: () => void;
}

export const FinalApprovalFilingView: React.FC<FinalApprovalFilingViewProps> = ({ isDark, onNavigateToQc }) => {
  const [attestationClientInfo, setAttestationClientInfo] = useState(false);
  const [attestationDocs, setAttestationDocs] = useState(false);
  const [attestationExceptions, setAttestationExceptions] = useState(false);
  const [attestationSupporting, setAttestationSupporting] = useState(false);
  const [attestationQc, setAttestationQc] = useState(false);
  const [attestationFirmProcedures, setAttestationFirmProcedures] = useState(false);

  const client = accountantCenterService.getSelectedClient();
  const taxYear = accountantCenterService.getSelectedTaxYear();
  const finalApproval = accountantCenterService.getFinalApprovalState();
  const filingRecord = accountantCenterService.getFilingRecord();
  const { canApproveForFiling, blockingReasons } = accountantCenterService.evaluateHardStopGates();

  const allAttestationsChecked = 
    attestationClientInfo && 
    attestationDocs && 
    attestationExceptions && 
    attestationSupporting && 
    attestationQc && 
    attestationFirmProcedures;

  const handleCommitApproval = () => {
    if (!canApproveForFiling) {
      alert('Mandatory Hard-Stop Gates are currently blocking sign-off. Please clear all gates in Pre-Filing QC.');
      return;
    }
    if (!allAttestationsChecked) {
      alert('You must check all 6 statutory and firm attestation boxes to record approval.');
      return;
    }

    accountantCenterService.commitFinalApproval('Marcus Vance, EA');
  };

  const handleSimulateFiling = () => {
    accountantCenterService.simulateEfiling();
  };

  const handleSimulateStatus = (status: 'Accepted' | 'Rejected' | 'Resubmitted') => {
    accountantCenterService.updateFilingStatus(status, status === 'Rejected' ? 'Form 8938 Foreign Account reporting schedule verification code check failed' : undefined);
  };

  const cardBg = isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300';
  const textPrimary = isDark ? 'text-white' : 'text-neutral-900';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-neutral-600';

  return (
    <div className="space-y-6">
      {/* MANDATORY PROMINENT DISCLAIMER (Sections 32 & 54) */}
      <div className="p-4 border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 rounded-lg shadow-sm space-y-1">
        <div className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>DEMONSTRATION ENVIRONMENT — STATUTORY DISCLOSURE</span>
        </div>
        <p className="text-xs leading-relaxed">
          No real tax return has been filed or transmitted to the Internal Revenue Service or South Carolina Department of Revenue. This is a simulated demonstration environment intended for accounting workflow review, compliance verification, and firm procedures.
        </p>
      </div>

      {/* Header */}
      <div className={`p-5 border rounded-lg shadow-sm ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="text-[10px] font-mono uppercase bg-neutral-200/80 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-0.5 rounded inline-block font-bold mb-1">
            Sections 30, 31, 32, 33 &bull; Final Approvals &amp; Electronic Filing
          </div>
          <h2 className={`text-lg font-bold uppercase tracking-tight ${textPrimary}`}>
            Final Accountant Approval &amp; Filing Simulation
          </h2>
          <p className={`text-xs ${textSecondary} mt-0.5`}>
            Client: <strong>{client.name}</strong> &bull; Tax Year: <strong className="font-mono">TY{taxYear}</strong> &bull; Status: <strong className="font-mono">{finalApproval.isApproved ? 'Approved' : 'Pending Attestation'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-3 py-1.5 rounded font-bold border ${
            finalApproval.isApproved
              ? 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200'
              : 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200'
          }`}>
            {finalApproval.isApproved ? '✓ APPROVED FOR FILING' : 'APPROVAL PENDING'}
          </span>
        </div>
      </div>

      {/* SECTION 30: FINAL RETURN REVIEW SUMMARY */}
      <div className={`p-5 border rounded-lg shadow-sm ${cardBg} space-y-4`}>
        <div className="border-b pb-3 border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${textPrimary}`}>
            30. Comprehensive Return Dossier Summary
          </h3>
          <span className="text-xs font-mono text-neutral-400">IRS Form 1040 &amp; SC1040</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 border rounded bg-neutral-50 dark:bg-neutral-800/40">
            <span className="text-[10px] text-neutral-500 uppercase block">Total Extracted Income</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">$277,570.00</span>
          </div>
          <div className="p-3 border rounded bg-neutral-50 dark:bg-neutral-800/40">
            <span className="text-[10px] text-neutral-500 uppercase block">Total Payments &amp; WH</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">$56,600.00</span>
          </div>
          <div className="p-3 border rounded bg-neutral-50 dark:bg-neutral-800/40">
            <span className="text-[10px] text-neutral-500 uppercase block">Schedule C Net Profit</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">$66,350.00</span>
          </div>
          <div className="p-3 border rounded bg-neutral-50 dark:bg-neutral-800/40">
            <span className="text-[10px] text-neutral-500 uppercase block">Rental Net Income</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">$14,580.00</span>
          </div>
        </div>

        <div className="p-3 border rounded border-neutral-200 dark:border-neutral-800 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>Foreign Accounts: <strong className="text-emerald-600">✓ Form 8938 + FBAR Attached</strong></div>
          <div>Prior Year Variance: <strong className="text-emerald-600">✓ Reconciled +$10k</strong></div>
          <div>AI Exceptions: <strong className="text-emerald-600">✓ All Discrepancies Cleared</strong></div>
          <div>Substantiations: <strong className="text-emerald-600">✓ Complete Workpapers</strong></div>
        </div>
      </div>

      {/* SECTION 31: FINAL ACCOUNTANT APPROVAL PANEL */}
      {!finalApproval.isApproved ? (
        <div className={`p-5 border-2 ${
          canApproveForFiling ? 'border-neutral-900 dark:border-white' : 'border-amber-400'
        } rounded-lg shadow-sm ${cardBg} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-neutral-200 dark:border-neutral-800">
            <div>
              <h3 className={`text-base font-bold uppercase tracking-tight ${textPrimary} flex items-center gap-2`}>
                <Lock className="w-4 h-4 text-neutral-500" />
                <span>31. Final Accountant Approval Panel</span>
              </h3>
              <p className={`text-xs ${textSecondary}`}>
                Professional certification required prior to transmission authorization.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              Signer: <strong>Marcus Vance, EA (PTIN: P01849201)</strong>
            </span>
          </div>

          {!canApproveForFiling && (
            <div className="p-3 border rounded border-red-300 bg-red-50 dark:bg-red-950/30 text-xs text-red-900 dark:text-red-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                <span>Approval Locked: {blockingReasons.length} Hard-Stop Gates Unresolved</span>
              </div>
              <p className="text-[11px]">
                You must resolve all exceptions and complete all mandatory gates in the Pre-Filing QC center before this panel can be signed.
              </p>
              {onNavigateToQc && (
                <button
                  onClick={onNavigateToQc}
                  className="mt-1 text-xs font-bold underline font-mono"
                >
                  Jump to Pre-Filing Quality Control &rarr;
                </button>
              )}
            </div>
          )}

          {/* 6 Required Attestation Checkboxes */}
          <div className="space-y-2.5 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
              <input
                type="checkbox"
                checked={attestationClientInfo}
                onChange={e => setAttestationClientInfo(e.target.checked)}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-neutral-800 dark:text-neutral-200">
                <strong>1. Client Information:</strong> I have reviewed the required client identification, filing status, residency, and dependent information.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
              <input
                type="checkbox"
                checked={attestationDocs}
                onChange={e => setAttestationDocs(e.target.checked)}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-neutral-800 dark:text-neutral-200">
                <strong>2. Source Documents &amp; Workpapers:</strong> I have reviewed and cross-footed all source documents, trial balances, and schedule workpapers.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
              <input
                type="checkbox"
                checked={attestationExceptions}
                onChange={e => setAttestationExceptions(e.target.checked)}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-neutral-800 dark:text-neutral-200">
                <strong>3. AI Exceptions &amp; Discrepancies:</strong> I have reviewed and formally resolved all identified exceptions, classification flags, and tax-year mismatches.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
              <input
                type="checkbox"
                checked={attestationSupporting}
                onChange={e => setAttestationSupporting(e.target.checked)}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-neutral-800 dark:text-neutral-200">
                <strong>4. Supporting Substantiations:</strong> I have reviewed and confirmed all required supporting documentation and legal waivers.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
              <input
                type="checkbox"
                checked={attestationQc}
                onChange={e => setAttestationQc(e.target.checked)}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-neutral-800 dark:text-neutral-200">
                <strong>5. Quality-Control Review:</strong> I have completed the applicable pre-filing quality-control and statutory diagnostic reviews.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
              <input
                type="checkbox"
                checked={attestationFirmProcedures}
                onChange={e => setAttestationFirmProcedures(e.target.checked)}
                className="mt-0.5 rounded text-black focus:ring-0"
              />
              <span className="text-neutral-800 dark:text-neutral-200">
                <strong>6. Firm Due Diligence:</strong> I have prepared and reviewed the return in full accordance with firm tax practice standards and Circular 230.
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              onClick={handleCommitApproval}
              disabled={!canApproveForFiling || !allAttestationsChecked}
              className={`px-6 py-2.5 rounded text-xs font-bold uppercase flex items-center gap-2 shadow transition-all ${
                canApproveForFiling && allAttestationsChecked
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90'
                  : 'bg-neutral-300 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve for Filing — Demo</span>
            </button>
          </div>
        </div>
      ) : (
        /* SECTION 32 & 33: DEMO FILING WORKFLOW & POST-FILING RECORD */
        <div className="space-y-6">
          {/* Approved Banner */}
          <div className="p-4 border border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="text-sm font-bold text-emerald-950 dark:text-emerald-100 uppercase">
                  Return Certified &amp; Approved for Filing — Demo
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                  Signer: {finalApproval.approvedBy} &bull; Timestamp: {new Date(finalApproval.approvalTimestamp!).toLocaleString()}
                </div>
              </div>
            </div>

            {filingRecord.status === 'Ready for Filing — Demo' && (
              <button
                onClick={handleSimulateFiling}
                className="px-4 py-2 bg-emerald-700 text-white rounded text-xs font-bold uppercase hover:bg-emerald-800 flex items-center gap-1.5 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Simulate E-Filing</span>
              </button>
            )}
          </div>

          {/* SECTION 33: POST-FILING RECORD */}
          <div className={`p-5 border rounded-lg shadow-sm ${cardBg} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-neutral-200 dark:border-neutral-800">
              <div>
                <div className="text-[10px] font-mono uppercase text-neutral-500">
                  Section 33 &bull; Electronic Return Originator (ERO) Record
                </div>
                <h3 className={`text-base font-bold uppercase tracking-tight ${textPrimary}`}>
                  Post-Filing Audit &amp; Transmission Ledger
                </h3>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                filingRecord.status.includes('Accepted') ? 'bg-emerald-100 text-emerald-900' :
                filingRecord.status.includes('Rejected') ? 'bg-red-100 text-red-900' :
                'bg-blue-100 text-blue-900'
              }`}>
                {filingRecord.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 border rounded bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-[10px] text-neutral-500 uppercase block">Submission ID</span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">{filingRecord.submissionId}</span>
              </div>
              <div className="p-3 border rounded bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-[10px] text-neutral-500 uppercase block">Return Type</span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">{filingRecord.returnType}</span>
              </div>
              <div className="p-3 border rounded bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-[10px] text-neutral-500 uppercase block">E-File Provider</span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">{filingRecord.efileProvider}</span>
              </div>
              <div className="p-3 border rounded bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-[10px] text-neutral-500 uppercase block">Filing Timestamp</span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  {filingRecord.filingTimestamp ? new Date(filingRecord.filingTimestamp).toLocaleTimeString() : 'Pending'}
                </span>
              </div>
            </div>

            <div className="p-3 border rounded border-neutral-200 dark:border-neutral-800 text-xs font-mono space-y-1.5 bg-neutral-50/50 dark:bg-neutral-800/20">
              <div><strong>Transmission Hash:</strong> {filingRecord.transmissionHash}</div>
              <div><strong>Firm EFIN:</strong> 574892 &bull; <strong>Preparer PTIN:</strong> P01849201 (Marcus Vance, EA)</div>
              <div><strong>Audit Trail Reference:</strong> {filingRecord.auditTrailId}</div>
              {filingRecord.rejectionReason && (
                <div className="text-red-600 font-bold">
                  Simulated Rejection Reason: {filingRecord.rejectionReason}
                </div>
              )}
            </div>

            {/* Simulated Transmission Controls (Section 32) */}
            <div className="p-3 border rounded border-neutral-300 dark:border-neutral-700 bg-neutral-100/60 dark:bg-neutral-800/60 space-y-2">
              <div className="text-xs font-bold uppercase font-mono text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simulate Agency Gateway Responses (Demo Sandbox Controls)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSimulateStatus('Accepted')}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold uppercase hover:bg-emerald-700"
                >
                  Simulate IRS Acceptance
                </button>
                <button
                  onClick={() => handleSimulateStatus('Rejected')}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold uppercase hover:bg-red-700"
                >
                  Simulate IRS Rejection
                </button>
                <button
                  onClick={() => handleSimulateStatus('Resubmitted')}
                  className="px-3 py-1.5 bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black rounded text-xs font-bold uppercase"
                >
                  Simulate Resubmission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
