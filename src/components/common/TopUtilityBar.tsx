import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { NotificationBell } from './NotificationBell';
import { 
  Lock, 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink, 
  LogOut, 
  User as UserIcon, 
  Sliders,
  ChevronDown,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const TopUtilityBar: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    logout 
  } = useApp();

  // Development environment check
  const isDevEnvironment = Boolean(import.meta.env.DEV);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const devToolsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (devToolsRef.current && !devToolsRef.current.contains(e.target as Node)) {
        setDevToolsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAccountDropdownOpen(false);
        setDevToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePortalJump = () => {
    if (currentRole === 'client') {
      window.location.hash = '#/client/dashboard';
    } else if (currentRole === 'accountant') {
      window.location.hash = '#/accountant/dashboard';
    } else if (currentRole === 'senior_reviewer') {
      window.location.hash = '#/reviewer/dashboard';
    } else if (currentRole === 'admin' || currentRole === 'super_admin') {
      window.location.hash = '#/admin/dashboard';
    } else {
      window.location.hash = '#/client/login';
    }
  };

  const getWorkspaceTitle = () => {
    if (currentRole === 'client') return 'Client Portal & Vault';
    if (currentRole === 'accountant') return 'Accountant Workspace';
    if (currentRole === 'senior_reviewer') return 'Senior Reviewer Workspace';
    if (currentRole === 'admin' || currentRole === 'super_admin') return 'Admin Dashboard';
    return 'Client Portal';
  };

  return (
    <div 
      className="bg-[#050E1A] border-b border-[#0B2748] text-xs text-slate-300 py-1.5 sm:py-2 relative z-50 select-none min-h-[38px] flex items-center"
      role="region"
      aria-label="Firm Quick Links & Utility Bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 min-w-0 w-full">
        
        {/* LEFT: Utility Information (Secure Client Portal, Location, Phone, Business Hours) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 text-[11px] sm:text-xs">
          {/* Secure Client Portal Link */}
          <button
            type="button"
            onClick={handlePortalJump}
            className="inline-flex items-center gap-1.5 text-[#E2BD67] hover:text-white font-medium transition-colors cursor-pointer group whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] rounded px-1.5 py-0.5"
            aria-label="Access Secure Client Portal"
          >
            <Lock className="w-3.5 h-3.5 text-[#C99A3D] group-hover:scale-105 transition-transform flex-shrink-0" />
            <span className="tracking-wide">Secure Client Portal</span>
          </button>

          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>

          {/* Location (Hidden below sm) */}
          <div className="hidden sm:flex items-center gap-1 text-slate-300 whitespace-nowrap">
            <MapPin className="w-3 h-3 text-[#C99A3D] flex-shrink-0" />
            <span className="text-slate-400">Columbia, SC</span>
          </div>

          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>

          {/* Direct Phone */}
          <a 
            href="tel:678-205-9486" 
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#E2BD67] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] rounded px-1.5 py-0.5 whitespace-nowrap"
            aria-label="Direct Telephone: 678-205-9486"
          >
            <Phone className="w-3.5 h-3.5 text-[#C99A3D] flex-shrink-0" />
            <span className="font-mono">678-205-9486</span>
          </a>

          {/* Business Hours (Hidden below xl) */}
          <div className="hidden xl:flex items-center gap-1.5 text-slate-400 whitespace-nowrap text-[11px]">
            <span className="text-slate-600" aria-hidden="true">|</span>
            <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
            <span>Mon–Sat 9:00 AM – 6:00 PM EST</span>
          </div>
        </div>

        {/* RIGHT: Notifications & Authenticated Account / Guest Links */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 justify-end flex-shrink-0 text-[11px] sm:text-xs">
          
          {/* Dedicated Notification Bell Icon */}
          <NotificationBell size="sm" />

          <span className="text-slate-700 hidden xs:inline" aria-hidden="true">|</span>

          {currentUser && currentRole !== 'guest' ? (
            /* Signed-In State: Simplified to "Signed in as [Name]" + [Account ▼] */
            <div className="relative flex items-center gap-2" ref={accountDropdownRef}>
              <div className="hidden md:flex items-center gap-1.5 text-slate-300 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Signed in as</span>
                <span className="font-semibold text-white truncate max-w-[120px]">
                  {currentUser.name}
                </span>
              </div>

              {/* Account Menu Trigger */}
              <button
                type="button"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                aria-expanded={accountDropdownOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D2340] border border-[#1E3A5F] hover:border-[#C99A3D]/60 text-slate-100 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D]"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C99A3D] flex-shrink-0" />
                <span className="font-semibold">Account</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180 text-[#E2BD67]' : 'text-slate-400'}`} />
              </button>

              {/* Account Dropdown Menu */}
              {accountDropdownOpen && (
                <div 
                  role="menu"
                  className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-[#0B2748] border border-[#1E3A5F] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 text-slate-100"
                >
                  {/* Account Header */}
                  <div className="p-2.5 bg-[#06172C] rounded-lg border border-[#1E3A5F]/70 mb-1.5">
                    <div className="font-semibold text-xs text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email || 'Confidential Session'}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#C99A3D]/20 text-[#E2BD67] border border-[#C99A3D]/30">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>{currentRole.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Primary Workspace Jump */}
                  <button
                    role="menuitem"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      handlePortalJump();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#132E52] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#C99A3D]" />
                      <span className="text-xs font-semibold text-slate-100 group-hover:text-[#E2BD67] transition-colors">
                        {getWorkspaceTitle()}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
                  </button>

                  {/* Practice Portals Directory */}
                  <button
                    role="menuitem"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      window.location.hash = '#/portals';
                      window.history.pushState(null, '', '/portals');
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#132E52] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#C99A3D]" />
                      <span className="text-xs text-slate-200 group-hover:text-white transition-colors">
                        Practice Portals (29 Roles)
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
                  </button>

                  <div className="h-px bg-[#1E3A5F]/60 my-1" />

                  {/* Sign Out */}
                  <button
                    role="menuitem"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-rose-500/10 text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-2 group text-xs font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest Quick Auth Links */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { window.location.hash = '#/accountant/login'; }}
                className="text-slate-400 hover:text-[#E2BD67] text-[11px] font-medium transition-colors hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5"
              >
                <span>Staff Practice Portal</span>
              </button>

              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">&bull;</span>

              <button
                type="button"
                onClick={() => { window.location.hash = '#/client/login'; }}
                className="text-[#E2BD67] hover:text-white text-[11px] font-medium transition-colors inline-flex items-center gap-1 px-1.5 py-0.5"
              >
                <span>Client Sign In</span>
              </button>
            </div>
          )}

          {/* ISOLATED DEV PERSONA SELECTOR: ONLY IN DEV ENVIRONMENT */}
          {isDevEnvironment && (
            <div className="relative ml-1" ref={devToolsRef}>
              <button
                onClick={() => setDevToolsOpen(!devToolsOpen)}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                title="Local Development Role Simulator (Omitted in Production)"
                aria-expanded={devToolsOpen}
              >
                <Sliders className="w-2.5 h-2.5" />
                <span className="hidden 2xl:inline">Dev Role:</span>
                <span className="capitalize">{currentRole}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>

              {devToolsOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-[#0A1A2E] border border-amber-500/40 rounded-xl shadow-2xl p-3 z-50 text-slate-200 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E3A5F]">
                    <span className="text-[11px] font-bold text-amber-300">
                      Local Dev Persona Simulator
                    </span>
                    <button 
                      onClick={() => setDevToolsOpen(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2">
                    Verified for local test scenarios. Completely stripped in production builds.
                  </p>
                  <div className="space-y-1">
                    {[
                      { role: 'guest', label: 'Guest / Public Visitor' },
                      { role: 'client', label: 'Client: Michael Perotti (1040)' },
                      { role: 'accountant', label: 'Staff: Desmond Hinds (Founder)' },
                      { role: 'senior_reviewer', label: 'Reviewer: Elena Rostova, CPA' },
                      { role: 'admin', label: 'Operations Administrator' },
                      { role: 'super_admin', label: 'Super Administrator' },
                    ].map(opt => (
                      <button
                        key={opt.role}
                        onClick={() => {
                          setCurrentRole(opt.role as UserRole | 'guest');
                          setDevToolsOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                          currentRole === opt.role 
                            ? 'bg-amber-500/20 text-amber-200 font-semibold' 
                            : 'hover:bg-[#132E52] text-slate-300'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {currentRole === opt.role && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
