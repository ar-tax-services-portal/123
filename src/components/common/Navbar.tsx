import React, { useState, useEffect, useRef } from 'react';
import { useApp, PageRoute } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { NotificationBell } from './NotificationBell';
import { 
  Phone, 
  Calendar, 
  Menu, 
  X, 
  ChevronDown, 
  Lock, 
  LayoutDashboard, 
  Briefcase, 
  ShieldAlert,
  User as UserIcon,
  HelpCircle,
  Sparkles,
  FileSpreadsheet,
  Building2,
  Scale,
  CreditCard,
  Bell,
  ArrowRight,
  DollarSign,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, currentRole, currentUser, notifications } = useApp();
  
  // Dropdown states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  // Refs for click outside & focus trapping
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const servicesBtnRef = useRef<HTMLButtonElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesDropdownRef.current && 
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setServicesDropdownOpen(false);
      }
      if (
        moreDropdownRef.current && 
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns and drawer on Escape key with focus restoration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (servicesDropdownOpen) {
          setServicesDropdownOpen(false);
          servicesBtnRef.current?.focus();
        }
        if (moreDropdownOpen) {
          setMoreDropdownOpen(false);
          moreBtnRef.current?.focus();
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          hamburgerBtnRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [servicesDropdownOpen, moreDropdownOpen, mobileMenuOpen]);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: PageRoute) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setMoreDropdownOpen(false);
  };

  // Primary action button (changes based on active authenticated role)
  const getPortalButton = (isMobile: boolean = false) => {
    if (currentRole === 'guest') {
      return (
        <button
          onClick={() => {
            window.location.hash = '#/client/login';
            setMobileMenuOpen(false);
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border border-[#1E3A5F] bg-[#0B2748]/90 hover:bg-[#132E52] text-slate-100 hover:text-white hover:border-[#C99A3D]/50 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] ${
            isMobile ? 'w-full py-3 min-h-[44px]' : 'h-10 px-3.5 sm:px-4'
          }`}
          aria-label="Client Sign In"
        >
          <Lock className="w-3.5 h-3.5 text-[#C99A3D] flex-shrink-0" />
          <span>Client Sign In</span>
        </button>
      );
    }

    if (currentRole === 'client') {
      return (
        <button
          onClick={() => {
            window.location.hash = '#/client/dashboard';
            setMobileMenuOpen(false);
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all bg-gradient-to-r from-[#C99A3D] to-[#E2BD67] hover:brightness-105 text-[#06172C] shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] ${
            isMobile ? 'w-full py-3 min-h-[44px]' : 'h-10 px-3.5 sm:px-4'
          }`}
          aria-label="Client Portal"
        >
          <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Client Portal</span>
        </button>
      );
    }

    if (currentRole === 'accountant') {
      return (
        <button
          onClick={() => {
            window.location.hash = '#/accountant/dashboard';
            setMobileMenuOpen(false);
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all bg-gradient-to-r from-[#C99A3D] to-[#E2BD67] hover:brightness-105 text-[#06172C] shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] ${
            isMobile ? 'w-full py-3 min-h-[44px]' : 'h-10 px-3.5 sm:px-4'
          }`}
          aria-label="Accountant Workspace"
        >
          <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Accountant Workspace</span>
        </button>
      );
    }

    if (currentRole === 'senior_reviewer') {
      return (
        <button
          onClick={() => {
            window.location.hash = '#/reviewer/dashboard';
            setMobileMenuOpen(false);
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all bg-gradient-to-r from-[#C99A3D] to-[#E2BD67] hover:brightness-105 text-[#06172C] shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] ${
            isMobile ? 'w-full py-3 min-h-[44px]' : 'h-10 px-3.5 sm:px-4'
          }`}
          aria-label="Senior Reviewer / CPA Workspace"
        >
          <Scale className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Reviewer / CPA Workspace</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => {
          window.location.hash = '#/admin/dashboard';
          setMobileMenuOpen(false);
        }}
        className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all bg-gradient-to-r from-[#C99A3D] to-[#E2BD67] hover:brightness-105 text-[#06172C] shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] ${
          isMobile ? 'w-full py-3 min-h-[44px]' : 'h-10 px-3.5 sm:px-4'
        }`}
        aria-label="Administrator Dashboard"
      >
        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Admin Dashboard</span>
      </button>
    );
  };

  const unreadCount = (notifications || []).filter(n => !n.isRead).length;

  // Check if current page is inside More dropdown
  const isMorePageActive = ['pricing', 'resources', 'careers', 'contact', 'founder'].includes(currentPage);

  return (
    <div className="w-full bg-[#06172C]/95 backdrop-blur-md border-b border-[#0B2748] relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 xl:gap-4 min-w-0">
          
          {/* GROUP 1: BRAND GROUP (Logo, Name, Tagline) */}
          <div className="flex-shrink-0 min-w-0 py-2">
            <BrandLogo 
              size="md" 
              hideTaglineOnCompact={true}
              onClick={() => handleNavClick('home')} 
            />
          </div>

          {/* GROUP 2: PRIMARY NAVIGATION GROUP (Desktop 1024px+) */}
          {/* STRICTLY LIMITED TO TOP 5 LINKS + ACCESSIBLE MORE DROPDOWN */}
          <nav 
            className="hidden lg:flex items-center gap-1 xl:gap-2 min-w-0 flex-shrink"
            aria-label="Primary Navigation"
          >
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap px-2.5 py-2 rounded-md hover:bg-[#0B2748]/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] ${
                currentPage === 'home' 
                  ? 'text-[#E2BD67] font-semibold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </button>

            {/* 2. About */}
            <button
              onClick={() => handleNavClick('about')}
              className={`text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap px-2.5 py-2 rounded-md hover:bg-[#0B2748]/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] ${
                currentPage === 'about' 
                  ? 'text-[#E2BD67] font-semibold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              About
            </button>

            {/* 3. Services with Accessible Dropdown */}
            <div className="relative" ref={servicesDropdownRef}>
              <button
                ref={servicesBtnRef}
                onClick={() => {
                  setServicesDropdownOpen(!servicesDropdownOpen);
                  setMoreDropdownOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setServicesDropdownOpen(true);
                  }
                }}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
                aria-controls="services-menu-dropdown"
                aria-label="Services Menu"
                className={`text-xs font-medium tracking-wider uppercase flex items-center gap-1 transition-colors whitespace-nowrap px-2.5 py-2 rounded-md hover:bg-[#0B2748]/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] ${
                  currentPage === 'services' 
                    ? 'text-[#E2BD67] font-semibold' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#E2BD67]' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div 
                  id="services-menu-dropdown"
                  role="menu"
                  className="absolute left-0 mt-2 w-72 rounded-xl bg-[#0B2748] border border-[#1E3A5F] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('services')}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-[#132E52] transition-colors group flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-md bg-[#06172C] text-[#C99A3D] border border-[#0B2748] group-hover:border-[#C99A3D]/50 transition-colors mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-[#E2BD67] transition-colors">
                        All Comprehensive Services
                      </div>
                      <div className="text-[11px] text-slate-400">Overview of personal, business &amp; advisory</div>
                    </div>
                  </button>

                  <div className="h-px bg-[#06172C] my-1" />

                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('services')}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#132E52] transition-colors group flex items-start gap-2.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-[#E2BD67] transition-colors">
                        Individual Tax Filings
                      </div>
                      <div className="text-[10px] text-slate-400">Form 1040, W-2, 1099, Itemized Deductions</div>
                    </div>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('services')}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#132E52] transition-colors group flex items-start gap-2.5"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-[#E2BD67] transition-colors">
                        Business Tax &amp; Bookkeeping
                      </div>
                      <div className="text-[10px] text-slate-400">LLC, S-Corp, 1120-S, QBO Reconciliations</div>
                    </div>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('services')}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#132E52] transition-colors group flex items-start gap-2.5"
                  >
                    <Scale className="w-3.5 h-3.5 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-[#E2BD67] transition-colors">
                        Financial Protection &amp; Estates
                      </div>
                      <div className="text-[10px] text-slate-400">Trust &amp; Will Coordination Support</div>
                    </div>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('services')}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#132E52] transition-colors group flex items-start gap-2.5"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-[#E2BD67] transition-colors">
                        Credit &amp; Financial Solutions
                      </div>
                      <div className="text-[10px] text-slate-400">Restoration, Identity Shield &amp; Consulting</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Industries (Visible on xl+, accessible via More menu on lg) */}
            <button
              onClick={() => handleNavClick('industries')}
              className={`hidden xl:inline-flex text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap px-2.5 py-2 rounded-md hover:bg-[#0B2748]/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] ${
                currentPage === 'industries' 
                  ? 'text-[#E2BD67] font-semibold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Industries
            </button>

            {/* 5. Tax Strategies (Visible on xl+, accessible via More menu on lg - CLEAN LINK WITHOUT BADGE) */}
            <button
              onClick={() => handleNavClick('tax_strategies')}
              className={`hidden xl:inline-flex text-xs font-medium tracking-wider uppercase transition-colors whitespace-nowrap px-2.5 py-2 rounded-md hover:bg-[#0B2748]/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] ${
                currentPage === 'tax_strategies' 
                  ? 'text-[#E2BD67] font-semibold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Tax Strategies
            </button>

            {/* 6. More Dropdown (Contains Industries & Tax Strategies on lg, plus Pricing, Resources, Careers, Contact, Founder, Phone) */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                ref={moreBtnRef}
                onClick={() => {
                  setMoreDropdownOpen(!moreDropdownOpen);
                  setServicesDropdownOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setMoreDropdownOpen(true);
                  }
                }}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
                aria-controls="more-menu-dropdown"
                aria-label="More navigation options"
                className={`text-xs font-medium tracking-wider uppercase flex items-center gap-1 transition-colors whitespace-nowrap px-2.5 py-2 rounded-md hover:bg-[#0B2748]/70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C99A3D] ${
                  isMorePageActive || (currentPage === 'tax_strategies' || currentPage === 'industries')
                    ? 'text-[#E2BD67] font-semibold' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#E2BD67]' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div 
                  id="more-menu-dropdown"
                  role="menu"
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0B2748] border border-[#1E3A5F] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  {/* Dynamic links shown on narrower desktop widths (1024px to 1279px) */}
                  <div className="xl:hidden pb-1 mb-1 border-b border-[#1E3A5F] space-y-1">
                    <button
                      role="menuitem"
                      onClick={() => handleNavClick('tax_strategies')}
                      className={`w-full text-left p-2.5 rounded-lg hover:bg-[#132E52] transition-colors flex items-start gap-2.5 ${
                        currentPage === 'tax_strategies' ? 'bg-[#132E52]' : ''
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-100">Tax Strategies</div>
                        <div className="text-[11px] text-slate-400">Advanced deduction and liability strategies</div>
                      </div>
                    </button>

                    <button
                      role="menuitem"
                      onClick={() => handleNavClick('industries')}
                      className={`w-full text-left p-2.5 rounded-lg hover:bg-[#132E52] transition-colors flex items-start gap-2.5 ${
                        currentPage === 'industries' ? 'bg-[#132E52]' : ''
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-100">Specialized Industries</div>
                        <div className="text-[11px] text-slate-400">Healthcare, real estate, tech &amp; logistics</div>
                      </div>
                    </button>
                  </div>

                  {/* Pricing inside More */}
                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('pricing')}
                    className={`w-full text-left p-2.5 rounded-lg hover:bg-[#132E52] transition-colors flex items-start gap-2.5 ${
                      currentPage === 'pricing' ? 'bg-[#132E52]' : ''
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100 flex items-center justify-between">
                        <span>Pricing &amp; Engagements</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Transparent pricing for personal &amp; corporate filing</div>
                    </div>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('resources')}
                    className={`w-full text-left p-2.5 rounded-lg hover:bg-[#132E52] transition-colors flex items-start gap-2.5 ${
                      currentPage === 'resources' ? 'bg-[#132E52]' : ''
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100">Resources &amp; FAQ</div>
                      <div className="text-[11px] text-slate-400">IRS Tax Calendar, Checklists &amp; Guides</div>
                    </div>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('careers')}
                    className={`w-full text-left p-2.5 rounded-lg hover:bg-[#132E52] transition-colors flex items-start gap-2.5 ${
                      currentPage === 'careers' ? 'bg-[#132E52]' : ''
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100">Careers</div>
                      <div className="text-[11px] text-slate-400">Open Accounting, Preparer &amp; Staff Roles</div>
                    </div>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('contact')}
                    className={`w-full text-left p-2.5 rounded-lg hover:bg-[#132E52] transition-colors flex items-start gap-2.5 ${
                      currentPage === 'contact' ? 'bg-[#132E52]' : ''
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100">Contact Us</div>
                      <div className="text-[11px] text-slate-400">Columbia, SC Office &amp; Secure Direct Inquiries</div>
                    </div>
                  </button>

                  <div className="h-px bg-[#06172C] my-1" />

                  <button
                    role="menuitem"
                    onClick={() => handleNavClick('founder')}
                    className={`w-full text-left p-2.5 rounded-lg hover:bg-[#132E52] transition-colors flex items-start gap-2.5 ${
                      currentPage === 'founder' ? 'bg-[#132E52]' : ''
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-[#C99A3D] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100">Meet Desmond Hinds</div>
                      <div className="text-[11px] text-slate-400">Founder &amp; Senior Managing Accountant</div>
                    </div>
                  </button>

                  <div className="h-px bg-[#06172C] my-1" />

                  {/* Telephone Direct Call */}
                  <a
                    role="menuitem"
                    href="tel:678-205-9486"
                    className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-[#132E52] transition-colors text-xs text-slate-200 group"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C99A3D] flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-100 group-hover:text-[#E2BD67] transition-colors">
                        Call: 678-205-9486
                      </span>
                      <span className="text-[10px] text-slate-400">Mon–Sat &bull; Tax Season Direct Support</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* GROUP 3: ACTION GROUP (Client Sign In, Portals & Book Consultation) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            <NotificationBell />

            {/* Subtle vertical separator to anchor visual boundary */}
            <div className="h-6 w-px bg-[#1E3A5F]" aria-hidden="true" />

            {/* Direct Link to Staff & Client Portals Directory (29 Roles) */}
            <button
              onClick={() => {
                window.location.hash = '#/portals';
                window.history.pushState(null, '', '/portals');
              }}
              className="h-10 px-3 rounded-lg text-xs font-semibold text-slate-300 hover:text-white border border-[#1E3A5F] hover:border-[#C99A3D]/50 hover:bg-[#0B2748]/70 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              aria-label="Staff and Client Portals Directory (29 Roles)"
              title="View all 29 Staff & Client Portals"
            >
              <Layers className="w-3.5 h-3.5 text-[#C99A3D]" />
              <span>Portals</span>
            </button>

            {/* Main Portal Action Button */}
            {getPortalButton(false)}

            {/* Book Consultation Button */}
            <button
              onClick={() => handleNavClick('book_consultation')}
              className="h-10 px-3.5 xl:px-4 rounded-lg text-xs font-bold text-[#06172C] bg-gradient-to-r from-[#C99A3D] to-[#E2BD67] hover:brightness-105 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#C99A3D]"
              aria-label="Book Consultation"
            >
              <Calendar className="w-3.5 h-3.5 text-[#06172C] flex-shrink-0" />
              <span>Book Consultation</span>
            </button>
          </div>

          {/* Tablet Quick Action Area (visible on md to lg: 768px - 1023px) */}
          <div className="hidden md:flex lg:hidden items-center gap-2 flex-shrink-0">
            <NotificationBell />
            <button
              onClick={() => handleNavClick('book_consultation')}
              className="h-10 px-3.5 rounded-lg text-xs font-bold text-[#06172C] bg-gradient-to-r from-[#C99A3D] to-[#E2BD67] hover:brightness-105 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              aria-label="Book Consultation"
            >
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Consultation</span>
            </button>
            <button
              ref={hamburgerBtnRef}
              onClick={() => setMobileMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-200 hover:text-white hover:bg-[#0B2748] border border-[#0B2748] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C99A3D]"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Quick Action Area (< 768px down to 320px) */}
          <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
            <div className="hidden xs:block">
              <NotificationBell />
            </div>

            {/* Accessible Hamburger button (minimum 44x44px touch target) */}
            <button
              ref={hamburgerBtnRef}
              onClick={() => setMobileMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-200 hover:text-white hover:bg-[#0B2748] border border-[#0B2748] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C99A3D]"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Accessible Mobile Menu Side Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div 
            ref={mobileDrawerRef}
            className="relative w-full max-w-sm bg-[#06172C] border-l border-[#0B2748] shadow-2xl flex flex-col justify-between z-50 h-full overflow-y-auto animate-in slide-in-from-right duration-200"
          >
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-[#0B2748] flex items-center justify-between bg-[#050E1A]">
              <BrandLogo 
                size="sm" 
                variant="compact"
                onClick={() => handleNavClick('home')} 
              />
              
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-[#0B2748] border border-[#0B2748] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C99A3D]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Links */}
            <div className="flex-1 px-4 py-4 space-y-1 divide-y divide-[#0B2748]">
              
              {/* Primary Navigation Links */}
              <div className="space-y-1 pb-3">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                    currentPage === 'home' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold border-l-4 border-[#C99A3D]' 
                      : 'text-slate-200 hover:bg-[#0B2748]/60 hover:text-white'
                  }`}
                >
                  <span>Home</span>
                  {currentPage === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3D]" />}
                </button>

                <button
                  onClick={() => handleNavClick('about')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                    currentPage === 'about' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold border-l-4 border-[#C99A3D]' 
                      : 'text-slate-200 hover:bg-[#0B2748]/60 hover:text-white'
                  }`}
                >
                  <span>About Us</span>
                  {currentPage === 'about' && <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3D]" />}
                </button>

                {/* Collapsible Services in Drawer */}
                <div>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-[#0B2748]/60 hover:text-white transition-colors flex items-center justify-between min-h-[44px]"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span className={currentPage === 'services' ? 'text-[#E2BD67] font-semibold' : ''}>
                      Services
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-[#E2BD67]' : 'text-slate-400'}`} />
                  </button>

                  {mobileServicesOpen && (
                    <div className="pl-4 pr-1 py-1 space-y-1 bg-[#050E1A]/60 rounded-xl my-1 border border-[#0B2748]">
                      <button
                        onClick={() => handleNavClick('services')}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-[#E2BD67] hover:underline"
                      >
                        All Comprehensive Services &rarr;
                      </button>
                      <button
                        onClick={() => handleNavClick('services')}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
                      >
                        &bull; Individual Tax Filings (1040, W-2)
                      </button>
                      <button
                        onClick={() => handleNavClick('services')}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
                      >
                        &bull; Business Tax &amp; Bookkeeping (LLC, S-Corp)
                      </button>
                      <button
                        onClick={() => handleNavClick('services')}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
                      >
                        &bull; Financial Protection &amp; Estates
                      </button>
                      <button
                        onClick={() => handleNavClick('services')}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
                      >
                        &bull; Credit &amp; Financial Solutions
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleNavClick('industries')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                    currentPage === 'industries' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold border-l-4 border-[#C99A3D]' 
                      : 'text-slate-200 hover:bg-[#0B2748]/60 hover:text-white'
                  }`}
                >
                  <span>Specialized Industries</span>
                  {currentPage === 'industries' && <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3D]" />}
                </button>

                <button
                  onClick={() => handleNavClick('tax_strategies')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                    currentPage === 'tax_strategies' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold border-l-4 border-[#C99A3D]' 
                      : 'text-slate-200 hover:bg-[#0B2748]/60 hover:text-white'
                  }`}
                >
                  <span>Tax Strategies</span>
                  {currentPage === 'tax_strategies' && <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3D]" />}
                </button>

                <button
                  onClick={() => handleNavClick('pricing')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                    currentPage === 'pricing' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold border-l-4 border-[#C99A3D]' 
                      : 'text-slate-200 hover:bg-[#0B2748]/60 hover:text-white'
                  }`}
                >
                  <span>Pricing &amp; Engagements</span>
                  {currentPage === 'pricing' && <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3D]" />}
                </button>

                <button
                  onClick={() => handleNavClick('contact')}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                    currentPage === 'contact' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold border-l-4 border-[#C99A3D]' 
                      : 'text-slate-200 hover:bg-[#0B2748]/60 hover:text-white'
                  }`}
                >
                  <span>Contact</span>
                  {currentPage === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3D]" />}
                </button>
              </div>

              {/* Secondary Navigation Links */}
              <div className="space-y-1 pt-3 pb-3">
                <button
                  onClick={() => handleNavClick('founder')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between min-h-[40px] ${
                    currentPage === 'founder' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold' 
                      : 'text-slate-300 hover:bg-[#0B2748]/40 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-[#C99A3D]" />
                    Meet Desmond Hinds
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('resources')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between min-h-[40px] ${
                    currentPage === 'resources' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold' 
                      : 'text-slate-300 hover:bg-[#0B2748]/40 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-[#C99A3D]" />
                    Resources &amp; FAQ
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('careers')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between min-h-[40px] ${
                    currentPage === 'careers' 
                      ? 'bg-[#0B2748] text-[#E2BD67] font-semibold' 
                      : 'text-slate-300 hover:bg-[#0B2748]/40 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#C99A3D]" />
                    Careers
                  </span>
                </button>
              </div>

              {/* Mobile Notification Shortcut */}
              <div className="pt-3">
                <div className="p-3 rounded-xl bg-[#050E1A] border border-[#0B2748] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Bell className="w-4 h-4 text-[#C99A3D]" />
                    <span>System Alerts</span>
                  </div>
                  {unreadCount > 0 ? (
                    <span className="bg-[#C99A3D] text-[#06172C] font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">Up to date</span>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-[#0B2748] bg-[#050E1A] space-y-2.5">
              {/* Telephone Direct Line */}
              <a 
                href="tel:678-205-9486" 
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-[#0B2748] border border-[#0B2748] hover:border-[#C99A3D]/50 transition-colors min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[#C99A3D]" />
                <span>Call Directly: 678-205-9486</span>
              </a>

              {/* Staff & Client Portals (29 Roles) Button */}
              <button
                onClick={() => {
                  window.location.hash = '#/portals';
                  window.history.pushState(null, '', '/portals');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-[#0B2748] border border-[#1E3A5F] hover:border-[#C99A3D]/50 transition-colors min-h-[44px]"
              >
                <Layers className="w-4 h-4 text-[#C99A3D]" />
                <span>Staff &amp; Client Portals (29 Roles)</span>
              </button>

              {/* Portal Button */}
              {getPortalButton(true)}

              {/* Book Consultation Button */}
              <button
                onClick={() => handleNavClick('book_consultation')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-[#06172C] bg-gradient-to-r from-[#C99A3D] to-[#E2BD67] hover:brightness-105 shadow-md active:scale-95 transition-all min-h-[44px]"
              >
                <Calendar className="w-4 h-4 text-[#06172C]" />
                <span>Book a Consultation</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-[10px] text-slate-500">
                  Columbia, SC &bull; Preserving Wealth. Building Legacies.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
