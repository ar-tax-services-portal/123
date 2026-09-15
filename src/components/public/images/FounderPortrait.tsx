import React from 'react';
import { BRAND_ASSETS } from '../../../utils/assets';
import { ShieldCheck, MapPin } from 'lucide-react';

interface FounderPortraitProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  variant?: 'portrait' | 'wide' | 'landscape' | 'square' | 'mobile';
  showBadge?: boolean;
  caption?: string;
  className?: string;
  priority?: boolean;
}

/**
 * FounderPortrait Component
 *
 * AUTHORITATIVE IDENTITY SAFEGUARD:
 * - Uses the verified photograph of Founder & CEO Desmond Hinds.
 * - Preserves authentic facial structure, natural warm skin tone, and executive composure.
 * - Features corporate advisory office background with authentic company signage (A/R TAX SERVICES, LLC).
 * - Full responsive picture element with WebP and high-resolution fallback.
 * - WCAG compliant accessible HTML typography and labels.
 */
export const FounderPortrait: React.FC<FounderPortraitProps> = ({
  size = 'lg',
  variant = 'portrait',
  showBadge = true,
  caption,
  className = '',
  priority = false,
}) => {
  // Determine variant-specific asset pair
  const isWide = variant === 'wide' || variant === 'landscape';
  const isSquare = variant === 'square';
  const isMobile = variant === 'mobile';

  const webpSrc = isWide
    ? BRAND_ASSETS.founderWideWebp
    : isSquare
    ? BRAND_ASSETS.founderSquareWebp
    : isMobile
    ? BRAND_ASSETS.founderMobileWebp
    : BRAND_ASSETS.founderPortraitWebp;

  const jpgSrc = isWide
    ? BRAND_ASSETS.founderWideJpg
    : isSquare
    ? BRAND_ASSETS.founderSquareJpg
    : isMobile
    ? BRAND_ASSETS.founderMobileJpg
    : BRAND_ASSETS.founderPortraitJpg;

  const width = isWide ? 1600 : isSquare ? 1000 : isMobile ? 800 : 896;
  const height = isWide ? 900 : isSquare ? 1000 : isMobile ? 1000 : 1200;

  // Height and aspect ratio restraints that gracefully adapt to container
  const heightClasses = {
    sm: 'max-h-[380px] h-[360px]',
    md: 'max-h-[480px] h-[460px]',
    lg: isWide ? 'h-[320px] sm:h-[400px] md:h-[460px]' : 'max-h-[580px] h-[520px] sm:h-[580px]',
    full: 'h-full min-h-[450px] max-h-[640px]',
  }[size];

  return (
    <figure
      className={`relative rounded-2xl sm:rounded-3xl border border-[#C99A3D]/40 bg-[#06172C] p-2 sm:p-3 shadow-2xl overflow-hidden flex flex-col items-center justify-center group ${className}`}
      id="founder-portrait-container"
    >
      {/* Background subtle architectural gradient to complement portrait */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0A1F38] via-[#06172C] to-[#040E1B] pointer-events-none"
        aria-hidden="true"
      />

      {/* Frame wrapper strictly containing full photograph */}
      <div
        className={`relative w-full ${heightClasses} flex items-center justify-center overflow-hidden rounded-xl bg-[#06172C]`}
      >
        <picture className="w-full h-full flex items-center justify-center">
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={jpgSrc}
            alt="Desmond Hinds, Founder and CEO of A/R Tax Services, LLC"
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
            style={{ maxHeight: '100%' }}
          />
        </picture>

        {/* Subtle executive vignette along corners to anchor frame without covering subject */}
        <div
          className="absolute inset-0 ring-1 ring-inset ring-[#C99A3D]/25 rounded-xl pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Executive Caption / Verification Badge */}
      {showBadge && (
        <figcaption className="w-full mt-3 px-2 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C99A3D]" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-wider text-[#E2BD67] uppercase">
              {caption || 'Desmond Hinds • Founder & CEO'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-300 font-medium">
            <MapPin className="w-3 h-3 text-[#C99A3D] flex-shrink-0" />
            <span>Columbia, SC Practice Office</span>
          </div>
        </figcaption>
      )}
    </figure>
  );
};
