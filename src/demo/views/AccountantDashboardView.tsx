/**
 * A/R Tax Services, LLC - Accountant & Tax Preparer Demonstration Workspace
 * Workpapers, Trial Balance Mapping, Schedule M-1 adjustments, and submission to senior review.
 */

import React, { useState, useEffect } from 'react';
import { DemoEngagement, DemoTaxWorkpaper } from '../types';
import { demoDataStore } from '../services/DemoDataService';
import { WorkCycleProgress } from '../components/WorkCycleProgress';
import { 
  FileSpreadsheet, 
  Send, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  DollarSign,
  Layers,
  BookOpen,
  FileCheck,
  Search,
  ShieldAlert
} from 'lucide-react';
import { 
  SmartFormWorkspace,
  WorkpaperEditor,
  MissingItemsPanel,
  DiscrepancyPanel,
  AIResearchAssistant
} from '../../taxguard';

interface AccountantDashboardViewProps {
  onOpenAiAssistant: () => void;
}

export const AccountantDashboardView: React.FC<AccountantDashboardViewProps> = ({ onOpenAiAssistant }) => {
  const [engagements, setEngagements] = useState<DemoEngagement[]>([]);
  const [workpapers, setWorkpapers] = useState<DemoTaxWorkpaper[]>([]);
  const [selectedEngId, setSelectedEngId] = useState<string>('eng_2025_summit');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'workpapers' | 'smart_forms' | 'lead_dossier' | 'missing_items' | 'diagnostics' | 'research'>('workpapers');

  // New adjustment inputs
  const [newTitle, setNewTitle] = useState('');
  const [newSection, setNewSection] = useState('Schedule M-1, Line 5');
  const [newBookAmount, setNewBookAmount] = useState('');
  const [newAdjustment, setNewAdjustment] = useState('');

  const refresh = () => {
    setEngagements(demoDataStore.getEngagements());
    setWorkpapers(demoDataStore.getWorkpapers());
  };

  useEffect(() => {
    refresh();
    return demoDataStore.subscribe(refresh);
  }, []);

  const currentEngagement = engagements.find(e => e.id === selectedEngId) || engagements[0];
  const activeWorkpapers = workpapers.filter(w => w.engagementId === currentEngagement?.id);

  // Submit return for senior review
  const handleSubmitForReview = () => {
    if (!currentEngagement) return;
    demoDataStore.updateEngagementStage(
      currentEngagement.id,
      'Review',
      'Senior Review',
      'Marcus Vance, EA',
      'accountant',
      'Preparer finalized workpapers, trial balance mapping, and Schedule M-1 book-to-tax adjustments.'
    );

    setStatusMessage(`Submitted ${currentEngagement.clientName} (${currentEngagement.formType}) to Senior CPA Review queue.`);
    refresh();
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div className="border border-black p-3 bg-neutral-50 text-xs font-bold text-black">
          {statusMessage}
        </div>
      )}

      {/* Header */}
      <div className="border border-neutral-300 p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase text-neutral-500">
            A/R Tax Services, LLC • Senior Tax Preparer Practice
          </div>
          <h2 className="text-base font-bold text-black uppercase">
            Tax Preparation &amp; Workpaper Mapping Workspace
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiAssistant}
            className="px-3 py-1.5 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tax Prep Assistant</span>
          </button>
        </div>
      </div>

      {/* Engagement Selector Tabs */}
      <div className="border-b border-neutral-300 flex flex-wrap gap-1 text-xs">
        {engagements.map((eng) => (
          <button
            key={eng.id}
            onClick={() => setSelectedEngId(eng.id)}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              selectedEngId === eng.id
                ? 'border-black text-black font-bold'
                : 'border-transparent text-neutral-600 hover:text-black'
            }`}
          >
            {eng.formType} — {eng.clientName}
          </button>
        ))}
      </div>

      {/* Active Engagement Card */}
      {currentEngagement && (
        <div className="border border-neutral-300 p-5 space-y-5 bg-white">
          <div className="border-b border-neutral-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase bg-neutral-100 px-1.5 py-0.5 border border-neutral-300 mr-2">
                Active Workpaper Dossier
              </span>
              <h3 className="text-sm font-bold uppercase text-black inline">
                {currentEngagement.clientName} • {currentEngagement.formType} (TY{currentEngagement.taxYear})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-black px-2 py-0.5 text-xs font-bold uppercase">
                {currentEngagement.currentStatus}
              </span>
              <span className="border border-neutral-300 px-2 py-0.5 text-xs font-mono text-neutral-600">
                Statutory Due: {currentEngagement.statutoryDeadline}
              </span>
            </div>
          </div>

          <WorkCycleProgress currentStage={currentEngagement.currentStage} compact />

          {/* Preparer Actions Bar */}
          <div className="p-3 border border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-black uppercase">Assigned Preparer:</span> Marcus Vance, EA &bull;{' '}
              <span className="font-bold text-black uppercase">Reviewer:</span> Elena Rostova, CPA
            </div>
            <button
              onClick={handleSubmitForReview}
              className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Return for Senior Review</span>
            </button>
          </div>

          {/* Preparer Sub-Navigation Tabs */}
          <div className="border-b border-neutral-200 flex flex-wrap gap-1 text-xs">
            {[
              { id: 'workpapers', label: 'Book-to-Tax (M-1)', icon: FileSpreadsheet },
              { id: 'smart_forms', label: 'Smart Forms & Field Mapping', icon: Layers },
              { id: 'lead_dossier', label: 'Lead Workpaper Dossier', icon: FileCheck },
              { id: 'missing_items', label: 'Missing Item Tracking', icon: AlertCircle },
              { id: 'diagnostics', label: 'Discrepancy Diagnostics', icon: ShieldAlert },
              { id: 'research', label: 'IRC / Statutory Research', icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id as any)}
                  className={`px-3 py-1.5 font-medium transition-colors flex items-center gap-1.5 border-b-2 -mb-[1px] ${
                    subTab === tab.id
                      ? 'border-black text-black font-bold bg-neutral-50'
                      : 'border-transparent text-neutral-600 hover:text-black'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Tab 1: Workpapers & Adjustments Table */}
          {subTab === 'workpapers' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                Book-to-Tax Workpapers &amp; Section 179 Depreciation Schedules
              </h4>
              <div className="border border-neutral-300 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-mono uppercase text-neutral-600">
                      <th className="p-2.5">Workpaper Title</th>
                      <th className="p-2.5">Section / Form Line</th>
                      <th className="p-2.5 text-right">Book Value</th>
                      <th className="p-2.5 text-right">Tax Adjustment</th>
                      <th className="p-2.5 text-right">Tax Value</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {activeWorkpapers.map((wp) => (
                      <tr key={wp.id} className="hover:bg-neutral-50">
                        <td className="p-2.5">
                          <div className="font-bold text-black">{wp.title}</div>
                          <div className="text-[11px] text-neutral-500 font-mono">{wp.notes}</div>
                        </td>
                        <td className="p-2.5 font-mono text-neutral-600">{wp.formLine}</td>
                        <td className="p-2.5 font-mono text-right">${wp.bookAmount.toFixed(2)}</td>
                        <td className="p-2.5 font-mono text-right text-neutral-700">
                          {wp.taxAdjustment !== 0 ? (wp.taxAdjustment > 0 ? `+${wp.taxAdjustment.toFixed(2)}` : wp.taxAdjustment.toFixed(2)) : '$0.00'}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-right text-black">${wp.taxAmount.toFixed(2)}</td>
                        <td className="p-2.5">
                          <span className="border border-neutral-300 px-1.5 py-0.5 text-[10px] font-mono">
                            {wp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {activeWorkpapers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-neutral-500 text-xs font-mono">
                          No customized book-to-tax adjustments currently registered for this filing.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Smart Forms & Field Mapping */}
          {subTab === 'smart_forms' && (
            <div className="pt-1">
              <SmartFormWorkspace userRole="accountant" />
            </div>
          )}

          {/* Sub-Tab 3: Lead Workpaper Dossier */}
          {subTab === 'lead_dossier' && (
            <div className="pt-1">
              <WorkpaperEditor userRole="accountant" />
            </div>
          )}

          {/* Sub-Tab 4: Missing Item Tracking */}
          {subTab === 'missing_items' && (
            <div className="pt-1">
              <MissingItemsPanel userRole="accountant" />
            </div>
          )}

          {/* Sub-Tab 5: Discrepancy Diagnostics */}
          {subTab === 'diagnostics' && (
            <div className="pt-1">
              <DiscrepancyPanel userRole="accountant" />
            </div>
          )}

          {/* Sub-Tab 6: IRC / Statutory Research */}
          {subTab === 'research' && (
            <div className="pt-1">
              <AIResearchAssistant userRole="accountant" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
