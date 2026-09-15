import React from 'react';
import { TopUtilityBar } from '../common/TopUtilityBar';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { CookiePreferencesModal } from '../common/CookiePreferencesModal';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#06172C] text-[#F8F6F1] font-sans selection:bg-[#C99A3D] selection:text-[#06172C]">
      {/* Unified Responsive Public Header */}
      <header className="sticky top-0 z-40 w-full bg-[#06172C] shadow-md">
        <TopUtilityBar />
        <Navbar />
      </header>

      {/* Main Marketing Viewport */}
      <main className="flex-1 min-w-0" id="main-content">
        {children}
      </main>

      {/* Comprehensive Public Marketing Footer */}
      <Footer />

      {/* Cookie & Data Privacy Customizer */}
      <CookiePreferencesModal />
    </div>
  );
};
