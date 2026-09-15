import React from 'react';
import { useApp, PageRoute } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  FileText, 
  HelpCircle, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setCookieModalOpen } = useApp();

  const handleNav = (page: PageRoute) => {
    setCurrentPage(page);
  };

  return (
    <footer className="bg-[#050E1A] text-slate-300 border-t border-[#0B2748] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#0B2748]">
          
          {/* Column 1: Brand & Firm Identity */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-md pt-2">
              Preserving Wealth. Building Legacies. Delivering boutique, client-first tax preparation, 
              strategic business accounting, and wealth coordination for individuals, entrepreneurs, and families.
            </p>

            <div className="space-y-2.5 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#C99A3D] flex-shrink-0" />
                <span>Columbia, South Carolina, USA</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C99A3D] flex-shrink-0" />
                <a href="tel:678-205-9486" className="hover:text-[#E2BD67] transition-colors font-medium">
                  678-205-9486
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C99A3D] flex-shrink-0" />
                <a href="mailto:info@artaxservices.com" className="hover:text-[#E2BD67] transition-colors">
                  info@artaxservices.com
                </a>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-2 text-xs text-[#E2BD67]">
              <ShieldCheck className="w-4 h-4 text-[#C99A3D]" />
              <span>Bank-Grade 256-bit AES Encryption Vault</span>
            </div>
          </div>

          {/* Column 2: Core Services */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#C99A3D] uppercase mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  Individual Tax Preparation (1040)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  Prior-Year & Amended Returns (1040X)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  LLC, S-Corp & Partnership Returns
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  Monthly & Quarterly Bookkeeping
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  Estate Planning Coordination
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  Credit Restoration & Consulting
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-white transition-colors text-left">
                  IRS Transcript Review & Analysis
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate & Portals */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#C6A15B] uppercase mb-4">
              Navigation & Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About A/R Tax Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('founder')} className="hover:text-white transition-colors">
                  Meet Desmond Hinds, Founder
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('industries')} className="hover:text-white transition-colors text-[#C6A15B]">
                  Specialized Industries (8 Sectors)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tax_strategies')} className="hover:text-white transition-colors text-[#C6A15B]">
                  Tax Strategies Catalog (16 Domains)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-white transition-colors">
                  Pricing & Service Plans
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('book_consultation')} className="hover:text-white transition-colors">
                  Book a Consultation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('careers')} className="hover:text-white transition-colors">
                  Careers & Recruitment
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors">
                  Tax Resources & FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { 
                    window.location.hash = '#/portals'; 
                    window.history.pushState(null, '', '/portals');
                  }} 
                  className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-[#C6A15B]"
                >
                  Staff &amp; Client Portals (29 Roles) <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.location.hash = '#/client/login'; }} 
                  className="hover:text-white transition-colors flex items-center gap-1 text-slate-300"
                >
                  Client Portal Login <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { window.location.hash = '#/accountant/login'; }} 
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  Staff Workspace Login
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Legal */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#C6A15B] uppercase mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy (GDPR / CCPA)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('security')} className="hover:text-white transition-colors">
                  Security & Data Handling
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('disclaimers')} className="hover:text-white transition-colors">
                  Professional Disclaimers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('accessibility')} className="hover:text-white transition-colors">
                  Accessibility Statement
                </button>
              </li>
              <li>
                <button onClick={() => setCookieModalOpen(true)} className="hover:text-[#C6A15B] transition-colors text-left">
                  Cookie Preferences
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('not_found')} className="hover:text-white transition-colors text-slate-500">
                  System Diagnostics (404 View)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Professional Disclaimers Notice */}
        <div className="py-6 text-xs text-slate-500 leading-relaxed border-b border-[#1E3A5F]/60">
          <p>
            <strong className="text-slate-400">Professional Notice:</strong> A/R Tax Services, LLC provides professional tax preparation, bookkeeping, and business consulting services. 
            Accounting personnel do not provide legal counsel, court representation, or securities brokerage services. Estate planning coordination, living wills, and trust structures 
            are facilitated in direct coordination with independent, properly licensed legal professionals. No specific tax savings, deductions, or refund amounts are guaranteed, 
            as individual outcomes depend strictly on client-provided records and applicable federal and state tax statutes.
          </p>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} A/R Tax Services, LLC. All rights reserved. Columbia, South Carolina.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[#E2BD67] font-medium">Founder: Desmond Hinds</span>
            <span>•</span>
            <span>Tagline: “Preserving Wealth. Building Legacies.”</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
