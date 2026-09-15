import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  Lock, 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink, 
  LogOut, 
  UserCheck, 
  Sliders,
  ChevronDown
} from 'lucide-react';

export const TopUtilityBar: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    currentPage, 
    setCurrentPage, 
    logout 
  } = useApp();

  // Development environment check
  const isDevEnvironment = Boolean(import.meta.env.DEV);
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  return (
    <div 
      className="bg-[#050E1A] border-b border-[#0B2748] text-xs text-slate-300 py-1.5 sm:py-2 relative z-50 select-none"
      role="region"
      aria-label="Firm Quick Links & Utility Bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        
        {/* Left Utility Information (Secure Portal, Location, Phone, Hours) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 text-[11px] sm:text-xs">
          {/* Secure Portal Link */}
          <button
            type="button"
            onClick={() => {
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
            }}
            className="inline-flex items-center gap-1.5 text-[#E2BD67] hover:text-white font-medium transition-colors cursor-pointer group whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] rounded px-1.5 py-1 min-h-[36px] sm:min-h-0"
            aria-label="Access Secure Client Portal"
          >
            <Lock className="w-3.5 h-3.5 text-[#C99A3D] group-hover:scale-105 transition-transform flex-shrink-0" />
            <span className="tracking-wide">Secure Client Portal</span>
          </button>

          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>

          {/* Progressive 2: Location (Hidden below lg: 1024px) */}
          <div className="hidden lg:flex items-center gap-1 text-slate-300 whitespace-nowrap">
            <MapPin className="w-3 h-3 text-[#C99A3D] flex-shrink-0" />
            <span className="text-slate-400">Columbia, SC</span>
          </div>

          <span className="text-slate-600 hidden lg:inline" aria-hidden="true">|</span>

          {/* Direct Phone (Progressive 3: icon always visible, full number text on sm+) */}
          <a 
            href="tel:678-205-9486" 
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#E2BD67] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] rounded px-1.5 py-1 min-h-[36px] sm:min-h-0 whitespace-nowrap"
            aria-label="Direct Telephone: 678-205-9486"
          >
            <Phone className="w-3.5 h-3.5 text-[#C99A3D] flex-shrink-0" />
            <span className="hidden sm:inline font-mono">678-205-9486</span>
          </a>

          {/* Progressive 1: Hours (Hidden below xl: 1280px) */}
          <div className="hidden xl:flex items-center gap-1.5 text-slate-400 whitespace-nowrap text-[11px]">
            <span className="text-slate-600" aria-hidden="true">|</span>
            <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
            <span>Mon–Sat 9:00 AM – 6:00 PM EST</span>
          </div>
        </div>

        {/* Right Utility Group: Authenticated Status or Quick Auth Links */}
        <div className="flex items-center gap-2 min-w-0 justify-end flex-shrink-0 text-[11px] sm:text-xs">
          {currentUser && currentRole !== 'guest' ? (
            // Logged in User Bar
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="hidden md:inline text-slate-400">Signed in as</span>
                <span className="font-semibold text-white truncate max-w-[100px] sm:max-w-[140px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#C99A3D] bg-[#0B2748] px-1.5 py-0.5 rounded uppercase font-semibold hidden md:inline">
                  {currentRole.replace('_', ' ')}
                </span>
              </div>

              {/* Portal Jump */}
              {currentRole === 'client' && (
                <button
                  onClick={() => { window.location.hash = '#/client/dashboard'; }}
                  className="bg-[#C99A3D]/20 text-[#E2BD67] hover:bg-[#C99A3D]/30 px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 whitespace-nowrap border border-[#C99A3D]/30"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
              {currentRole === 'accountant' && (
                <button
                  onClick={() => { window.location.hash = '#/accountant/dashboard'; }}
                  className="bg-[#C99A3D]/20 text-[#E2BD67] hover:bg-[#C99A3D]/30 px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 whitespace-nowrap border border-[#C99A3D]/30"
                >
                  <span>Workspace</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
              {currentRole === 'senior_reviewer' && (
                <button
                  onClick={() => { window.location.hash = '#/reviewer/dashboard'; }}
                  className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 whitespace-nowrap border border-purple-500/30"
                >
                  <span>Senior Review</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}

              {/* Sign Out Button */}
              <button
                onClick={() => logout()}
                className="text-slate-400 hover:text-rose-300 p-1.5 rounded transition-colors flex items-center gap-1"
                title="Sign out of confidential session"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Sign Out</span>
              </button>
            </div>
          ) : (
            // Public / Guest Quick Auth Links
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { window.location.hash = '#/accountant/login'; }}
                className="text-slate-400 hover:text-[#E2BD67] text-[11px] font-medium transition-colors hidden sm:inline-flex items-center gap-1 px-1.5 py-1"
              >
                <span>Staff Practice Portal</span>
              </button>
            </div>
          )}

          {/* ISOLATED DEV PERSONA SELECTOR: ONLY IN DEV ENVIRONMENT */}
          {isDevEnvironment && (
            <div className="relative ml-1">
              <button
                onClick={() => setDevToolsOpen(!devToolsOpen)}
                className="px-2 py-1 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
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
