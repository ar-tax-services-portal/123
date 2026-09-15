/**
 * A/R Tax Services, LLC - Unified Demonstration Dashboard Shell
 * Strict black-and-white minimalist architecture.
 * Shared across all 12 protected practice roles.
 */

import React, { useState } from 'react';
import { DemoRole, DEMO_ROLES, DemoRoleConfig, WorkCycleStage } from '../types';
import { DemoAuthService } from '../services/DemoAuthService';
import { DemoBanner } from './DemoBanner';
import { DeveloperContactNotice } from './DeveloperContactNotice';
import { WorkCycleProgress } from './WorkCycleProgress';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardShellProps {
  role: DemoRole;
  activeNavId: string;
  onSelectNav: (id: string) => void;
  navItems: NavItem[];
  title: string;
  breadcrumbs?: string[];
  children: React.ReactNode;
  onOpenAiAssistant?: () => void;
  onOpenIntegrations?: () => void;
  rightDrawerContent?: React.ReactNode;
  isRightDrawerOpen?: boolean;
  onCloseRightDrawer?: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  role,
  activeNavId,
  onSelectNav,
  navItems,
  title,
  breadcrumbs = ['Demonstration Workspace'],
  children,
  onOpenAiAssistant,
  onOpenIntegrations,
  rightDrawerContent,
  isRightDrawerOpen = false,
  onCloseRightDrawer
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [showCycleProgress, setShowCycleProgress] = useState(true);

  const getStageForRole = (r: DemoRole): WorkCycleStage => {
    switch (r) {
      case 'reception': return 'Onboard';
      case 'intake': return 'Onboard';
      case 'engagement-manager': return 'Onboard';
      case 'documents': return 'Collect';
      case 'verification': return 'Validate';
      case 'data-entry': return 'Record';
      case 'accounts-payable': return 'Record';
      case 'accounts-receivable': return 'Record';
      case 'bookkeeper': return 'Reconcile';
      case 'payroll': return 'Record';
      case 'accountant': return 'Prepare Taxes';
      case 'reviewer': return 'Review';
      case 'quality-control': return 'Approve';
      case 'client': return 'Sign';
      case 'filing': return 'File';
      case 'acknowledgements': return 'Government Feedback';
      case 'correspondence': return 'Resolve';
      case 'resolution': return 'Resolve';
      case 'audit': return 'Resolve';
      case 'amendments': return 'Resolve';
      case 'advisor': return 'Plan';
      case 'billing': return 'Report';
      case 'compliance': return 'Monitor';
      case 'operations': return 'Monitor';
      case 'support': return 'Monitor';
      case 'records': return 'Archive';
      case 'client-success': return 'Renew';
      case 'executive': return 'Report';
      case 'admin': return 'Repeat';
      default: return 'Onboard';
    }
  };

  const roleConfig: DemoRoleConfig = DEMO_ROLES[role];
  const session = DemoAuthService.getSession(role);
  const currentUser = session?.user || roleConfig.sampleUser;

  const handleSignOut = () => {
    DemoAuthService.logout(role);
    window.location.hash = roleConfig.loginPath;
  };

  const handleReturnHome = () => {
    window.location.hash = '#/';
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] text-[#1A2028] flex flex-col font-sans antialiased selection:bg-[#061A2F] selection:text-[#F7F4ED]">
      {/* 1. Discreet Persistent Demo Banner */}
      <DemoBanner />

      {/* Main App Flex Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* 2. Left Sidebar (Desktop) - Deep Navy Architecture */}
        <aside
          className={`hidden md:flex flex-col border-r border-[#1A365D] bg-[#061A2F] text-white transition-all duration-200 z-30 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Brand & Role Header */}
          <div className="p-4 border-b border-[#1A365D] flex items-center justify-between bg-[#031323]">
            {!sidebarCollapsed ? (
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#D7AC4A] font-semibold">
                  A/R Tax Services, LLC
                </div>
                <div className="text-sm font-bold text-[#F7F4ED] truncate">
                  {roleConfig.title}
                </div>
              </div>
            ) : (
              <div className="text-xs font-black text-[#D7AC4A] mx-auto">A/R</div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 border border-[#1A365D] hover:bg-[#0A2544] text-[#D8DCE2] rounded"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto" aria-label="Dashboard Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-left transition-colors rounded-sm ${
                    isActive
                      ? 'bg-[#0A2544] text-[#E8C66A] border-l-4 border-l-[#C99A32] font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#0A2544]/60 border-l-4 border-l-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#D7AC4A]' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Secondary Action Anchors (AI & Integrations) */}
          <div className="p-2 border-t border-[#1A365D] space-y-1 bg-[#031323]">
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                title={sidebarCollapsed ? 'AI Advisory Assistant' : undefined}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold border border-[#C99A32]/40 text-[#E8C66A] bg-[#0A2544]/40 hover:bg-[#0A2544] hover:border-[#C99A32] transition-colors rounded-sm"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0 text-[#D7AC4A]" />
                {!sidebarCollapsed && <span>AI Advisory Assistant</span>}
              </button>
            )}

            {onOpenIntegrations && (
              <button
                onClick={onOpenIntegrations}
                title={sidebarCollapsed ? 'Integrations Registry' : undefined}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-medium text-slate-400 border border-dashed border-[#1A365D] hover:text-white hover:border-slate-400 transition-colors rounded-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Integrations (22 Unconfigured)</span>}
              </button>
            )}
          </div>

          {/* User Signout Footer */}
          <div className="p-3 border-t border-[#1A365D] bg-[#020D18] flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div className="min-w-0 mr-2">
                <div className="text-xs font-bold text-[#F7F4ED] truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
              </div>
            ) : null}
            <button
              onClick={handleSignOut}
              className="p-1.5 border border-[#1A365D] hover:bg-[#0A2544] text-slate-300 hover:text-white transition-colors rounded"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* 3. Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setMobileDrawerOpen(false)} 
            />
            <div className="relative w-4/5 max-w-xs bg-[#061A2F] text-white border-r border-[#1A365D] flex flex-col h-full z-10 shadow-2xl">
              <div className="p-4 border-b border-[#1A365D] flex items-center justify-between bg-[#031323]">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#D7AC4A]">A/R Tax Services, LLC</div>
                  <div className="text-xs font-bold text-white">{roleConfig.title}</div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 border border-[#1A365D] text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectNav(item.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs text-left rounded-sm ${
                        isActive
                          ? 'bg-[#0A2544] text-[#E8C66A] border-l-4 border-l-[#C99A32] font-bold'
                          : 'text-slate-300 hover:bg-[#0A2544]/60 hover:text-white border-l-4 border-l-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#D7AC4A]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#1A365D] bg-[#031323] space-y-2">
                {onOpenAiAssistant && (
                  <button
                    onClick={() => {
                      onOpenAiAssistant();
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 border border-[#C99A32]/50 text-[#E8C66A] bg-[#0A2544]/50 text-xs font-bold rounded-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#D7AC4A]" />
                    <span>AI Advisory Assistant</span>
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 p-2 border border-[#1A365D] hover:bg-[#0A2544] text-slate-200 text-xs font-bold rounded-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Center Content & Top Utility Bar */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#FBFAF7]">
          {/* Top Utility Bar */}
          <header className="border-b border-[#D8DCE2] bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
            {/* Left: Mobile trigger & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-2 border border-[#D8DCE2] text-[#1A2028] hover:bg-neutral-100 rounded"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-[#667085] font-mono">
                  {breadcrumbs.map((b, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span>/</span>}
                      <span className="truncate">{b}</span>
                    </React.Fragment>
                  ))}
                </div>
                <h1 className="text-base font-bold text-[#1A2028] truncate tracking-tight">
                  {title}
                </h1>
              </div>
            </div>

            {/* Right: Search, Notifications, Help, Profile, Signout */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Quick Search */}
              <div className="hidden lg:flex items-center relative">
                <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-[#D8DCE2] bg-[#FBFAF7] text-[#1A2028] placeholder:text-[#667085] focus:outline-none focus:border-[#C99A32] rounded w-48 xl:w-64"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 border border-[#D8DCE2] hover:bg-[#F7F4ED] text-[#1A2028] relative rounded"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-[#C99A32] absolute top-1.5 right-1.5 ring-2 ring-white" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-[#D8DCE2] shadow-xl rounded-md p-3 z-50 text-xs">
                    <div className="font-bold border-b border-[#D8DCE2] pb-1 mb-2 flex items-center justify-between text-[#1A2028]">
                      <span>Firm Alerts</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#F7F4ED] text-[#C99A32] border border-[#D8DCE2] rounded font-semibold">Protected</span>
                    </div>
                    <ul className="space-y-2 text-[#1A2028]">
                      <li className="p-2 border border-[#D8DCE2] bg-[#FBFAF7] rounded">
                        <div className="font-semibold text-[#061A2F]">Quality Review Certified</div>
                        <div className="text-[11px] text-[#667085]">Tax engagement certified for electronic client signature.</div>
                      </li>
                      <li className="p-2 border border-[#D8DCE2] bg-[#FBFAF7] rounded">
                        <div className="font-semibold text-[#061A2F]">Statutory Deadlines Approaching</div>
                        <div className="text-[11px] text-[#667085]">March 15 corporate / partnership reporting deadline in 12 days.</div>
                      </li>
                    </ul>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="mt-2.5 w-full py-1.5 bg-[#061A2F] text-white hover:bg-[#031323] text-center font-bold text-[11px] rounded transition-colors"
                    >
                      Close Alerts
                    </button>
                  </div>
                )}
              </div>

              {/* Help & Support Dialog */}
              <button
                onClick={() => setHelpModalOpen(true)}
                className="p-2 border border-[#D8DCE2] hover:bg-[#F7F4ED] text-[#1A2028] rounded"
                title="Practice Support"
                aria-label="Practice Support"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* User Profile */}
              <button
                onClick={() => setProfileModalOpen(true)}
                className="p-1.5 sm:px-3 sm:py-1.5 border border-[#D8DCE2] hover:bg-[#F7F4ED] flex items-center gap-1.5 text-xs font-semibold text-[#1A2028] rounded"
                title="User Profile"
              >
                <User className="w-4 h-4 text-[#C99A32]" />
                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-[#D8DCE2] hover:bg-[#061A2F] hover:text-white text-xs font-medium text-[#1A2028] transition-colors rounded"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </header>

          {/* Main Dashboard Screen Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FBFAF7] max-w-7xl w-full mx-auto space-y-6">
            {/* 18-Stage Unified Operating Cycle Indicator */}
            <div className="border border-[#D8DCE2] bg-white p-3 rounded-lg shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D8DCE2]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#667085] font-bold">
                    18-Stage Tax Operating Lifecycle
                  </span>
                  <span className="text-[10px] font-mono bg-[#061A2F] text-[#E8C66A] border border-[#C99A32]/40 px-2 py-0.5 font-bold uppercase rounded">
                    Stage: {getStageForRole(role)}
                  </span>
                </div>
                <button
                  onClick={() => setShowCycleProgress(!showCycleProgress)}
                  className="text-[10px] font-mono text-[#667085] hover:text-[#1A2028] underline font-medium"
                >
                  {showCycleProgress ? '▲ Compact View' : '▼ Expand Full 18-Stage Map'}
                </button>
              </div>
              {showCycleProgress ? (
                <WorkCycleProgress currentStage={getStageForRole(role)} />
              ) : (
                <WorkCycleProgress currentStage={getStageForRole(role)} compact />
              )}
            </div>

            {children}
          </main>
        </div>

        {/* 5. Right-Side Contextual Drawer (for AI Assistant or Integration Registry) */}
        {isRightDrawerOpen && (
          <aside className="w-80 lg:w-96 border-l border-neutral-300 bg-white flex flex-col z-30 overflow-y-auto">
            <div className="p-4 border-b border-neutral-300 flex items-center justify-between sticky top-0 bg-white">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                Contextual Demonstration Panel
              </div>
              <button
                onClick={onCloseRightDrawer}
                className="p-1 border border-neutral-300 hover:bg-neutral-100"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1">
              {rightDrawerContent}
            </div>
          </aside>
        )}
      </div>

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                Practice Assistance & Developer Support
              </h3>
              <button onClick={() => setHelpModalOpen(false)} className="p-1 border border-neutral-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-neutral-700 leading-relaxed">
              This dashboard is running in a controlled demonstration sandbox. All workflows, returns, reconciliations, calculations, and approvals reflect synthetic test operations designed for practice review and demonstration.
            </p>

            {/* Mandatory Developer Support Notice */}
            <DeveloperContactNotice reason="Demonstration Support & Systems Architecture" />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                Active Demonstration Profile
              </h3>
              <button onClick={() => setProfileModalOpen(false)} className="p-1 border border-neutral-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 border border-neutral-200">
                <span className="font-mono text-neutral-500">Name:</span> <strong>{currentUser.name}</strong>
              </div>
              <div className="p-2 border border-neutral-200">
                <span className="font-mono text-neutral-500">Assigned Role:</span> <strong>{roleConfig.title}</strong>
              </div>
              <div className="p-2 border border-neutral-200">
                <span className="font-mono text-neutral-500">Title:</span> {currentUser.title}
              </div>
              <div className="p-2 border border-neutral-200">
                <span className="font-mono text-neutral-500">Email:</span> {currentUser.email}
              </div>
              <div className="p-2 border border-neutral-200">
                <span className="font-mono text-neutral-500">Department:</span> {roleConfig.department}
              </div>
              <div className="p-2 border border-neutral-200">
                <span className="font-mono text-neutral-500">Session Mode:</span> <strong>Demo Isolation (4-hr token)</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleReturnHome}
                className="px-3 py-1.5 border border-neutral-300 text-xs font-medium hover:bg-neutral-100"
              >
                Return to Public Website
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
