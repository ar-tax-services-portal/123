import React from 'react';
import { Phone, ShieldAlert } from 'lucide-react';

interface DeveloperContactNoticeProps {
  reason?: string;
  className?: string;
}

export const DeveloperContactNotice: React.FC<DeveloperContactNoticeProps> = ({ reason, className = '' }) => {
  return (
    <div className={`border border-neutral-300 bg-white text-black p-4 rounded-none text-xs ${className}`}>
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
        <div className="space-y-1.5 leading-relaxed">
          {reason && (
            <p className="font-semibold text-black border-b border-neutral-200 pb-1 mb-1">
              Notice: {reason}
            </p>
          )}
          <div className="font-bold uppercase tracking-wider text-[11px] text-black">
            Contact the Developer
          </div>
          <div className="text-black">
            <span className="font-medium">Developed by:</span> Ophireum Multimedia Production
          </div>
          <div className="text-black flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-black" />
            <span className="font-medium">Mobile Phone:</span>
            <a 
              href="tel:+639179668814" 
              className="font-bold underline hover:bg-black hover:text-white px-1 py-0.5 transition-colors"
            >
              +63 917 966 8814
            </a>
          </div>
          <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-700 space-y-1">
            <p><strong>Compliance-supporting technology.</strong> Final legal, regulatory, accounting, and tax requirements must be validated by qualified U.S. professionals.</p>
            <p className="text-[10px] text-neutral-500 font-mono">Demonstration Environment – No Live Filing, Payment, Signature, Banking Connection, or Government Submission</p>
          </div>
        </div>
      </div>
    </div>
  );
};
