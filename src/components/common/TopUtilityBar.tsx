import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Phone, 
  MapPin, 
  Clock, 
  LogOut, 
  ArrowRight
} from 'lucide-react';

export const TopUtilityBar: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    logout 
  } = useApp();

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

  const isAuthenticated = Boolean(currentUser && currentRole !== 'guest');

  return (
    <div 
      className="bg-[#050E1A] border-b border-[#0B2748] text-xs text-slate-300 py-1.5 sm:py-2 relative z-50 select-none min-h-[38px] flex items-center"
      role="region"
      aria-label="Firm Quick Links & Utility Bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 min-w-0 w-full">
        
        {/* LEFT: Verified Firm Information (Location, Phone, Business Hours) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 text-[11px] sm:text-xs">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-300 whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-[#C99A3D] flex-shrink-0" />
            <span className="text-slate-300 font-medium">Columbia, SC</span>
          </div>

          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">|</span>

          {/* Direct Phone */}
          <a 
            href="tel:678-205-9486" 
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#E2BD67] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] rounded px-1 py-0.5 whitespace-nowrap"
            aria-label="Direct Telephone: 678-205-9486"
          >
            <Phone className="w-3.5 h-3.5 text-[#C99A3D] flex-shrink-0" />
            <span className="font-mono">678-205-9486</span>
          </a>

          <span className="text-slate-600 hidden md:inline" aria-hidden="true">|</span>

          {/* Business Hours */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 whitespace-nowrap text-[11px]">
            <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
            <span>Mon–Fri 9:00 AM – 6:00 PM EST</span>
          </div>
        </div>

        {/* RIGHT: Strict Public Identity Separation */}
        {/* Public pages show ONLY neutral "Open Portal" or "Client Portal" / "Sign In". Never client name or notifications. */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 justify-end flex-shrink-0 text-[11px] sm:text-xs">
          {isAuthenticated ? (
            /* Neutral Authenticated Visitor Control (No client name, entity, notifications, or roles exposed on public page) */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePortalJump}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D2340] border border-[#C99A3D]/40 text-[#E2BD67] hover:text-white hover:border-[#E2BD67] font-semibold transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D]"
                aria-label="Open Secure Portal"
              >
                <Lock className="w-3 h-3 text-[#C99A3D]" />
                <span>Open Portal</span>
                <ArrowRight className="w-3 h-3 text-[#E2BD67]" />
              </button>

              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-rose-300 text-[11px] transition-colors rounded hover:bg-rose-500/10"
                aria-label="Sign Out"
              >
                <LogOut className="w-3 h-3 flex-shrink-0" />
                <span className="hidden xs:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            /* Public Guest Portal & Sign In Links */
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => { window.location.hash = '#/client/login'; }}
                className="text-slate-300 hover:text-[#E2BD67] font-medium transition-colors inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D]"
              >
                <Lock className="w-3 h-3 text-[#C99A3D]" />
                <span>Client Portal</span>
              </button>

              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">&bull;</span>

              <button
                type="button"
                onClick={() => { window.location.hash = '#/accountant/login'; }}
                className="text-slate-400 hover:text-slate-200 font-medium transition-colors hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D]"
              >
                <span>Staff Portal</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
