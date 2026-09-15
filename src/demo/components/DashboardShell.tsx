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
    <div className="min-h-screen bg-white text-black flex flex-col font-sans antialiased selection:bg-black selection:text-white">
      {/* 1. Discreet Persistent Demo Banner */}
      <DemoBanner />

      {/* Main App Flex Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* 2. Left Sidebar (Desktop) */}
        <aside
          className={`hidden md:flex flex-col border-r border-neutral-300 bg-white transition-all duration-200 z-30 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Brand & Role Header */}
          <div className="p-4 border-b border-neutral-300 flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div className="min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                  A/R Tax Services, LLC
                </div>
                <div className="text-sm font-bold text-black truncate">
                  {roleConfig.title}
                </div>
              </div>
            ) : (
              <div className="text-xs font-black text-black mx-auto">A/R</div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 border border-neutral-300 hover:bg-neutral-100 text-black rounded-none"
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
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium border text-left transition-colors ${
                    isActive
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white text-black border-transparent hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Secondary Action Anchors (AI & Integrations) */}
          <div className="p-2 border-t border-neutral-300 space-y-1">
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                title={sidebarCollapsed ? 'AI Assistant' : undefined}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold border border-neutral-300 hover:bg-black hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>AI Demonstration Assistant</span>}
              </button>
            )}

            {onOpenIntegrations && (
              <button
                onClick={onOpenIntegrations}
                title={sidebarCollapsed ? 'Integrations Registry' : undefined}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-medium text-neutral-600 border border-dashed border-neutral-300 hover:text-black hover:border-black transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Integrations (22 Unconfigured)</span>}
              </button>
            )}
          </div>

          {/* User Signout Footer */}
          <div className="p-3 border-t border-neutral-300 bg-neutral-50 flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div className="min-w-0 mr-2">
                <div className="text-xs font-bold text-black truncate">{currentUser.name}</div>
                <div className="text-[10px] text-neutral-500 truncate">{currentUser.email}</div>
              </div>
            ) : null}
            <button
              onClick={handleSignOut}
              className="p-1.5 border border-neutral-300 hover:bg-black hover:text-white transition-colors"
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
              className="fixed inset-0 bg-black/50" 
              onClick={() => setMobileDrawerOpen(false)} 
            />
            <div className="relative w-4/5 max-w-xs bg-white border-r border-neutral-300 flex flex-col h-full z-10">
              <div className="p-4 border-b border-neutral-300 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase text-neutral-500">A/R Tax Services, LLC</div>
                  <div className="text-xs font-bold text-black">{roleConfig.title}</div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 border border-neutral-300"
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs border text-left ${
                        isActive
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-white text-black border-transparent hover:border-neutral-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-neutral-300 space-y-2">
                {onOpenAiAssistant && (
                  <button
                    onClick={() => {
                      onOpenAiAssistant();
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 border border-black text-xs font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Demonstration Assistant</span>
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 p-2 border border-neutral-300 hover:bg-black hover:text-white text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Center Content & Top Utility Bar */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Utility Bar */}
          <header className="border-b border-neutral-300 bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-20">
            {/* Left: Mobile trigger & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-2 border border-neutral-300 text-black hover:bg-neutral-100"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
                  {breadcrumbs.map((b, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span>/</span>}
                      <span className="truncate">{b}</span>
                    </React.Fragment>
                  ))}
                </div>
                <h1 className="text-base font-bold text-black truncate tracking-tight">
                  {title}
                </h1>
              </div>
            </div>

            {/* Right: Search, Notifications, Help, Profile, Signout */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Quick Search */}
              <div className="hidden lg:flex items-center relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5" />
                <input
                  type="text"
                  placeholder="Filter demonstration records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-neutral-300 bg-white text-black placeholder:text-neutral-400 focus:outline-none focus:border-black w-48 xl:w-64"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 border border-neutral-300 hover:bg-neutral-100 relative"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-black" />
                  <span className="w-1.5 h-1.5 rounded-full bg-black absolute top-1.5 right-1.5" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-300 shadow-lg p-3 z-50 text-xs">
                    <div className="font-bold border-b border-neutral-200 pb-1 mb-2 flex items-center justify-between">
                      <span>Demonstration Alerts</span>
                      <span className="text-[10px] font-mono text-neutral-500">Demo Mode</span>
                    </div>
                    <ul className="space-y-2 text-neutral-800">
                      <li className="p-1.5 border border-neutral-200 bg-neutral-50">
                        <div className="font-semibold text-black">CPA Quality Review Certified</div>
                        <div className="text-[11px] text-neutral-600">Perotti Capital Holdings return certified for client signature.</div>
                      </li>
                      <li className="p-1.5 border border-neutral-200 bg-neutral-50">
                        <div className="font-semibold text-black">March 15 Statutory Filing Approaching</div>
                        <div className="text-[11px] text-neutral-600">S-Corp and Partnership deadline in 12 days.</div>
                      </li>
                    </ul>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="mt-2.5 w-full py-1 border border-neutral-300 text-center font-bold text-[11px] hover:bg-black hover:text-white"
                    >
                      Close Alerts
                    </button>
                  </div>
                )}
              </div>

              {/* Help & Support Dialog */}
              <button
                onClick={() => setHelpModalOpen(true)}
                className="p-2 border border-neutral-300 hover:bg-neutral-100"
                title="Help & Developer Support"
                aria-label="Help & Developer Support"
              >
                <HelpCircle className="w-4 h-4 text-black" />
              </button>

              {/* User Profile */}
              <button
                onClick={() => setProfileModalOpen(true)}
                className="p-2 border border-neutral-300 hover:bg-neutral-100 flex items-center gap-1.5 text-xs font-bold"
                title="User Profile"
              >
                <User className="w-4 h-4 text-black" />
                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 border border-neutral-300 hover:bg-black hover:text-white text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </header>

          {/* Main Dashboard Screen Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-white max-w-7xl w-full mx-auto space-y-6">
            {/* 18-Stage Unified Operating Cycle Indicator */}
            <div className="border border-neutral-300 bg-neutral-50 p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-bold">
                    18-Stage Operating Cycle
                  </span>
                  <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 font-bold uppercase">
                    Stage: {getStageForRole(role)}
                  </span>
                </div>
                <button
                  onClick={() => setShowCycleProgress(!showCycleProgress)}
                  className="text-[10px] font-mono text-neutral-600 hover:text-black underline font-medium"
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
