import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div 
      className="w-full bg-white border-b border-neutral-300 py-1.5 px-4 text-center text-xs text-black font-semibold tracking-wide flex items-center justify-center gap-2"
      role="banner"
      aria-label="Demonstration Environment Notice"
    >
      <AlertCircle className="w-3.5 h-3.5 text-black flex-shrink-0" />
      <span>
        Demonstration Environment — No Real Data, Payment, Signature, Government Submission, or Filing
      </span>
    </div>
  );
};
