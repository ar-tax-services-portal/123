import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, ShieldCheck, Scale, FileText } from 'lucide-react';

export const ProfessionalDisclaimersPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-slate-100">
      <div className="border-b border-[#1E3A5F] pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2340] border border-[#C6A15B]/40 text-[#C6A15B] text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Statutory Compliance Notices</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          Professional Disclaimers
        </h1>
        <p className="text-xs text-slate-400">
          Statutory Regulatory Disclosures • A/R Tax Services, LLC (Columbia, SC)
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Core Notice */}
        <section className="p-6 rounded-2xl bg-[#0D2340] border border-[#C6A15B]/50 space-y-3">
          <div className="flex items-center gap-2 text-[#C6A15B] font-bold text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Primary Professional Practice Disclosure</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong>A/R Tax Services, LLC</strong> provides professional tax preparation, business bookkeeping, and strategic financial consulting services. The Firm, its owner, agents, and staff do not provide legal counsel, formal judicial representation, or registered securities broker-dealer services. 
          </p>
        </section>

        {/* Section 1: Legal Services Disclaimer */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">1. Estate Planning & Legal Services Coordination</h2>
          <p>
            Any discussions, worksheets, or guidance concerning estate planning, wills, trusts, and powers of attorney provided by A/R Tax Services, LLC are strictly educational, organizational, and tax-evaluative in nature. 
          </p>
          <p>
            We do not draft formal legal instruments nor practice law. All estate planning implementations, living wills, testamentary trusts, and asset protection covenants are executed in direct referral and coordination with independent, properly licensed legal practitioners in South Carolina or the client’s state of legal residence.
          </p>
        </section>

        {/* Section 2: No Guaranteed Outcomes */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">2. No Guaranteed Refund or Savings Amount</h2>
          <p>
            No statement, communication, or marketing material from A/R Tax Services, LLC shall be construed as a guarantee of a specific tax refund or elimination of tax liability. Federal and state tax obligations are determined strictly by the statutory provisions of the Internal Revenue Code, state revenue regulations, and the factual, verifiable financial records supplied by the taxpayer.
          </p>
        </section>

        {/* Section 3: IRS Circular 230 Disclosure */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">3. IRS Circular 230 Notice</h2>
          <p>
            In accordance with IRS requirements, any tax advice contained on this website, in emails, or promotional resources is not intended or written to be used, and cannot be used, for the purpose of (i) avoiding tax-related penalties under the Internal Revenue Code, or (ii) promoting, marketing, or recommending to another party any tax-related transaction or matter.
          </p>
        </section>

        {/* Section 4: External Links */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">4. Third-Party Tools & Banking Integrations</h2>
          <p>
            Links, integrations, or references to third-party platforms (e.g., Intuit QuickBooks, Xero, Stripe, banking APIs) do not constitute endorsements. The Firm is not responsible for the independent terms, uptime, or privacy policies of outside software vendors.
          </p>
        </section>

        {/* Section 5: IRS Non-Affiliation & Professional Credentials */}
        <section className="space-y-3 border-t border-[#1E3A5F] pt-6">
          <h2 className="font-serif text-xl font-bold text-white">5. IRS Non-Affiliation & Regulatory Credentials</h2>
          <p>
            A/R Tax Services, LLC is not affiliated with, endorsed by, or sponsored by the Internal Revenue Service or any state department of revenue.
          </p>
          <div className="p-4 rounded-xl bg-[#07172B] border border-[#1E3A5F] space-y-1.5 text-xs text-slate-300">
            <p>
              <strong className="text-white">Professional Credential / License:</strong> [INSERT CPA LICENSE NUMBER, ENROLLED AGENT REGISTRATION, OR PTIN AS APPLICABLE]
            </p>
            <p>
              <strong className="text-white">Firm Location:</strong> Columbia, South Carolina, USA • <a href="tel:678-205-9486" className="text-[#C6A15B]">678-205-9486</a>
            </p>
            <p>
              <strong className="text-white">Client Financial Privacy:</strong> Review our{' '}
              <button onClick={() => setCurrentPage('privacy')} className="text-[#C6A15B] underline hover:text-white">
                GLBA-Compliant Privacy Policy
              </button>{' '}
              and{' '}
              <button onClick={() => setCurrentPage('terms')} className="text-[#C6A15B] underline hover:text-white">
                Terms of Service
              </button>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
