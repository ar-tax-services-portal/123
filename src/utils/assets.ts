/**
 * Utility for resolving asset URLs respecting Vite's base path
 * (critical for GitHub Pages and subpath deployments).
 */
export function getAssetUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${cleanPath}`;
}

export const BRAND_ASSETS = {
  logoPng: getAssetUrl('images/ar-tax-services-logo.png'),
  logoWebp: getAssetUrl('images/ar-tax-services-logo.webp'),
  logoMonochrome: getAssetUrl('images/ar-tax-logo-monochrome.png'),
  logoMonochromeHeader: getAssetUrl('images/ar-tax-logo-monochrome-header.png'),
  logo192: getAssetUrl('images/ar-logo-192.png'),
  founderWebp: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderJpg: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderPng: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderProfilePic: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderPortraitWebp: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderPortraitJpg: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderWideWebp: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderWideJpg: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderSquareWebp: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderSquareJpg: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderMobileWebp: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderMobileJpg: getAssetUrl('images/Desmond-CEO-PROFILE.png'),
  founderOriginalReference: getAssetUrl('images/desmond-hinds-original-reference.jpg'),
  corporateSignage: getAssetUrl('images/ar-tax-corporate-signage.png'),
  favicon: getAssetUrl('favicon.png'),

  // Master Corporate Editorial Assets
  heroExecutiveAdvisoryWebp: getAssetUrl('images/hero-executive-advisory.webp'),
  heroExecutiveAdvisoryJpg: getAssetUrl('images/hero-executive-advisory.jpg'),

  taxAdvisoryPlanningWebp: getAssetUrl('images/tax-advisory-planning.webp'),
  taxAdvisoryPlanningJpg: getAssetUrl('images/tax-advisory-planning.jpg'),

  corporateBusinessAdvisoryWebp: getAssetUrl('images/corporate-business-advisory.webp'),
  corporateBusinessAdvisoryJpg: getAssetUrl('images/corporate-business-advisory.jpg'),

  meticulousTaxPrepWebp: getAssetUrl('images/meticulous-tax-preparation.webp'),
  meticulousTaxPrepJpg: getAssetUrl('images/meticulous-tax-preparation.jpg'),

  estateLegacyPlanningWebp: getAssetUrl('images/estate-legacy-planning.webp'),
  estateLegacyPlanningJpg: getAssetUrl('images/estate-legacy-planning.jpg'),

  bookkeepingReportingWebp: getAssetUrl('images/bookkeeping-financial-reporting.webp'),
  bookkeepingReportingJpg: getAssetUrl('images/bookkeeping-financial-reporting.jpg'),

  privateConsultationExpWebp: getAssetUrl('images/private-consultation-experience.webp'),
  privateConsultationExpJpg: getAssetUrl('images/private-consultation-experience.jpg'),

  executiveConsultationSuiteWebp: getAssetUrl('images/executive-consultation-suite.webp'),
  executiveConsultationSuiteJpg: getAssetUrl('images/executive-consultation-suite.jpg'),

  founderOfficeJpg: getAssetUrl('images/desmond-hinds-office.jpg'),

  // Editorial Marketing & Service Photography
  taxConsultationWebp: getAssetUrl('images/tax-consultation-advisory.webp'),
  taxConsultationJpg: getAssetUrl('images/tax-consultation-advisory.jpg'),

  businessStrategyWebp: getAssetUrl('images/business-tax-strategy.webp'),
  businessStrategyJpg: getAssetUrl('images/business-tax-strategy.jpg'),

  familyTaxPlanningWebp: getAssetUrl('images/family-tax-planning.webp'),
  familyTaxPlanningJpg: getAssetUrl('images/family-tax-planning.jpg'),

  bookkeepingAccountingWebp: getAssetUrl('images/bookkeeping-accounting.webp'),
  bookkeepingAccountingJpg: getAssetUrl('images/bookkeeping-accounting.jpg'),

  payrollAdminWebp: getAssetUrl('images/payroll-administration.webp'),
  payrollAdminJpg: getAssetUrl('images/payroll-administration.jpg'),

  corporateTaxComplianceWebp: getAssetUrl('images/corporate-tax-compliance.webp'),
  corporateTaxComplianceJpg: getAssetUrl('images/corporate-tax-compliance.jpg'),

  auditRepresentationWebp: getAssetUrl('images/audit-representation.webp'),
  auditRepresentationJpg: getAssetUrl('images/audit-representation.jpg'),

  taxCreditResearchWebp: getAssetUrl('images/tax-credit-research.webp'),
  taxCreditResearchJpg: getAssetUrl('images/tax-credit-research.jpg'),

  digitalDocumentReviewWebp: getAssetUrl('images/digital-document-review.webp'),
  digitalDocumentReviewJpg: getAssetUrl('images/digital-document-review.jpg'),

  financialAdvisoryWebp: getAssetUrl('images/financial-advisory-planning.webp'),
  financialAdvisoryJpg: getAssetUrl('images/financial-advisory-planning.jpg'),

  smallBusinessGrowthWebp: getAssetUrl('images/small-business-growth.webp'),
  smallBusinessGrowthJpg: getAssetUrl('images/small-business-growth.jpg'),

  columbiaSkylineWebp: getAssetUrl('images/columbia-sc-skyline.webp'),
  columbiaSkylineJpg: getAssetUrl('images/columbia-sc-skyline.jpg'),
};
