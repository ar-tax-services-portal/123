/**
 * A/R Tax Services, LLC - Pre-Filing Quality Control & Mandatory Hard-Stop Engine
 * Sections 26, 27, 28, 29:
 * 22-item checklist, 17-stage QC workflow, and 11-gate readiness gate engine.
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  CheckSquare, 
  Square, 
  AlertOctagon, 
  AlertTriangle, 
  Globe2, 
  ArrowRight,
  Lock,
  Unlock,
  Layers,
  FileCheck
} from 'lucide-react';
import { accountantCenterService } from '../../services/AccountantCenterService';

interface PreFilingQcViewProps {
  isDark: boolean;
  onNavigateToFiling?: () => void;
}

export const PreFilingQcView: React.FC<PreFilingQcViewProps> = ({ isDark, onNavigateToFiling }) => {
  const [activeTab, setActiveTab] = useState<'hard_stops' | 'checklist' | 'qc_stages'>('hard_stops');
  const [reviewChecklist, setReviewChecklist] = useState(() => accountantCenterService.getReviewChecklist());
  const [qcStages, setQcStages] = useState(() => accountantCenterService.getQcStages());

  const client = accountantCenterService.getSelectedClient();
  const taxYear = accountantCenterService.getSelectedTaxYear();
  const { gates, canApproveForFiling, blockingReasons } = accountantCenterService.evaluateHardStopGates();

  const handleToggleChecklist = (id: string, currentCompleted: boolean) => {
    accountantCenterService.toggleChecklistItem(id, !currentCompleted);
    setReviewChecklist(accountantCenterService.getReviewChecklist());
  };

  const handleToggleQcStage = (id: string, currentCompleted: boolean) => {
    accountantCenterService.toggleQcStage(id, !currentCompleted);
    setQcStages(accountantCenterService.getQcStages());
  };

  const cardBg = isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-300';
  const textPrimary = isDark ? 'text-white' : 'text-neutral-900';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-neutral-600';

  return (
    <div className="space-y-6">
      {/* SECTION 29: FOREIGN INFORMATION MANDATORY HARD-STOP BANNER */}
      {client.hasForeignInfo && (
        <div className="p-4 border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-100 rounded-lg flex items-start gap-3 shadow-sm">
          <Globe2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="text-sm font-bold uppercase tracking-wider text-red-900 dark:text-red-300 flex items-center gap-2">
              <span>SECTION 29 &bull; FOREIGN INFORMATION — ACCOUNTANT REVIEW REQUIRED</span>
              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono rounded">
                GATE 5 ACTIVE
              </span>
            </div>
            <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
              Foreign financial accounts identified (ZKB Switzerland &gt; $10,000 aggregate max balance). FinCEN Form 114 (FBAR) and IRS Form 8938 reporting determinations must be explicitly finalized and verified by the accountant before sign-off is permitted.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`p-5 border rounded-lg shadow-sm ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <div className="text-[10px] font-mono uppercase bg-neutral-200/80 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-0.5 rounded inline-block font-bold mb-1">
            Sections 26, 27, 28 &bull; Quality Control &amp; Hard-Stop Verification
          </div>
          <h2 className={`text-lg font-bold uppercase tracking-tight ${textPrimary}`}>
            Pre-Filing Quality Assurance &amp; Gate Evaluation
          </h2>
          <p className={`text-xs ${textSecondary} mt-0.5`}>
            Rigorous compliance checks for <strong>{client.name}</strong> &bull; Tax Cycle: <strong className="font-mono">CY{taxYear}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('hard_stops')}
            className={`px-3 py-1.5 rounded font-bold border transition-colors ${
              activeTab === 'hard_stops' 
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' 
                : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            28. 11 Mandatory Gates
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded font-bold border transition-colors ${
              activeTab === 'checklist' 
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' 
                : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            26. 22-Item Review Checklist
          </button>
          <button
            onClick={() => setActiveTab('qc_stages')}
            className={`px-3 py-1.5 rounded font-bold border transition-colors ${
              activeTab === 'qc_stages' 
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' 
                : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            27. 17-Stage QC Stages
          </button>
        </div>
      </div>

      {/* TAB 28: 11 MANDATORY HARD-STOP GATES (Section 28) */}
      {activeTab === 'hard_stops' && (
        <div className={`p-5 border rounded-lg shadow-sm ${cardBg} space-y-5`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-neutral-200 dark:border-neutral-800">
            <div>
              <h3 className={`text-base font-bold uppercase tracking-tight ${textPrimary} flex items-center gap-2`}>
                <ShieldCheck className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                <span>Section 28 &bull; Mandatory Hard-Stop Readiness Gates</span>
              </h3>
              <p className={`text-xs ${textSecondary}`}>
                All 11 gates must achieve cleared status before final accountant approval and simulated e-filing can unlock.
              </p>
            </div>

            <div className={`px-4 py-2 rounded-lg border font-mono text-xs font-bold flex items-center gap-2 ${
              canApproveForFiling
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-red-100 text-red-900 border-red-400 dark:bg-red-950 dark:text-red-200'
            }`}>
              {canApproveForFiling ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-red-600" />}
              <span>{canApproveForFiling ? 'CLEARED FOR FINAL APPROVAL' : `BLOCKED (${blockingReasons.length} GATES PENDING)`}</span>
            </div>
          </div>

          {/* 11 Gates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gates.map((gate) => (
              <div 
                key={gate.id}
                className={`p-3.5 border rounded-lg transition-all ${
                  gate.isCleared 
                    ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800' 
                    : 'border-red-300 bg-red-50/40 dark:bg-red-950/20 dark:border-red-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">
                        GATE #{gate.gateNumber}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${
                        gate.isCleared 
                          ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200' 
                          : 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {gate.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {gate.name}
                    </h4>

                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      {gate.description}
                    </p>

                    {gate.blockingReason && (
                      <div className="text-[10px] font-mono text-red-700 dark:text-red-400 font-bold mt-1">
                        Blocker: {gate.blockingReason}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 mt-1">
                    {gate.isCleared ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertOctagon className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canApproveForFiling && onNavigateToFiling && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={onNavigateToFiling}
                className="px-5 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded font-bold uppercase text-xs flex items-center gap-2 shadow hover:opacity-90"
              >
                <span>Proceed to Final Return Approval &amp; Filing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 26: 22-ITEM ACCOUNTANT REVIEW CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className={`p-5 border rounded-lg shadow-sm ${cardBg} space-y-4`}>
          <div>
            <h3 className={`text-base font-bold uppercase tracking-tight ${textPrimary}`}>
              26. Accountant Review Checklist (22 Items)
            </h3>
            <p className={`text-xs ${textSecondary}`}>
              Comprehensive verification checklist required by firm quality control procedures.
            </p>
          </div>

          <div className="space-y-2">
            {reviewChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id, item.completed)}
                className={`p-3 border rounded cursor-pointer transition-all flex items-start gap-3 ${
                  item.completed 
                    ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30' 
                    : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-black'
                }`}
              >
                <div className="mt-0.5">
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-400" />
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                  {item.completed && item.verifiedBy && (
                    <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      Verified by {item.verifiedBy} &bull; {new Date(item.verifiedTimestamp!).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 27: 17-STAGE QUALITY CONTROL WORKFLOW */}
      {activeTab === 'qc_stages' && (
        <div className={`p-5 border rounded-lg shadow-sm ${cardBg} space-y-4`}>
          <div>
            <h3 className={`text-base font-bold uppercase tracking-tight ${textPrimary}`}>
              27. Pre-Filing Quality Control (17 Stages)
            </h3>
            <p className={`text-xs ${textSecondary}`}>
              Multi-tiered review stages from preliminary OCR intake to final partner attestation.
            </p>
          </div>

          <div className="space-y-2">
            {qcStages.map((stage) => (
              <div
                key={stage.id}
                onClick={() => handleToggleQcStage(stage.id, stage.status === 'Completed')}
                className={`p-3 border rounded cursor-pointer transition-all flex items-center justify-between ${
                  stage.status === 'Completed' 
                    ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30' 
                    : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 font-bold">
                    #{stage.stageNumber.toString().padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      {stage.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {stage.description}
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  stage.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {stage.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
