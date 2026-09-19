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
  founderWebp: getAssetUrl('images/desmond-hinds-ceo-official.webp?v=2026_ceo_final'),
  founderJpg: getAssetUrl('images/desmond-hinds-ceo-official.jpg?v=2026_ceo_final'),
  founderPng: getAssetUrl('images/desmond-hinds-ceo-official.png?v=2026_ceo_final'),
  founderProfilePic: getAssetUrl('images/desmond-hinds-ceo-official.png?v=2026_ceo_final'),
  founderPortraitWebp: getAssetUrl('images/desmond-hinds-ceo-official.webp?v=2026_ceo_final'),
  founderPortraitJpg: getAssetUrl('images/desmond-hinds-ceo-official.jpg?v=2026_ceo_final'),
  founderWideWebp: getAssetUrl('images/desmond-hinds-ceo-official.webp?v=2026_ceo_final'),
  founderWideJpg: getAssetUrl('images/desmond-hinds-ceo-official.jpg?v=2026_ceo_final'),
  founderSquareWebp: getAssetUrl('images/desmond-hinds-ceo-official.webp?v=2026_ceo_final'),
  founderSquareJpg: getAssetUrl('images/desmond-hinds-ceo-official.jpg?v=2026_ceo_final'),
  founderMobileWebp: getAssetUrl('images/desmond-hinds-ceo-official.webp?v=2026_ceo_final'),
  founderMobileJpg: getAssetUrl('images/desmond-hinds-ceo-official.jpg?v=2026_ceo_final'),
  founderOriginalReference: getAssetUrl('images/desmond-hinds-ceo-official.png?v=2026_ceo_final'),
  corporateSignage: getAssetUrl('images/ar-tax-corporate-signage.png'),
  favicon: getAssetUrl('favicon.png'),

  // Master Corporate Editorial Assets
  heroCeoPortraitPng: getAssetUrl('images/desmond-hinds-ceo-ar-tax-services.png?v=2026_hero_ceo'),
  heroCeoPortraitWebp: getAssetUrl('images/desmond-hinds-ceo-ar-tax-services.webp?v=2026_hero_ceo'),
  heroCeoPortraitJpg: getAssetUrl('images/desmond-hinds-ceo-ar-tax-services.jpg?v=2026_hero_ceo'),
  heroExecutiveAdvisoryWebp: getAssetUrl('images/desmond-hinds-ceo-ar-tax-services.webp?v=2026_hero_ceo'),
  heroExecutiveAdvisoryJpg: getAssetUrl('images/desmond-hinds-ceo-ar-tax-services.png?v=2026_hero_ceo'),

  taxAdvisoryPlanningWebp: getAssetUrl('images/tax-advisory-planning.webp?v=2026_corp_v3'),
  taxAdvisoryPlanningJpg: getAssetUrl('images/tax-advisory-planning.jpg?v=2026_corp_v3'),

  corporateBusinessAdvisoryWebp: getAssetUrl('images/corporate-business-advisory.webp?v=2026_corp_v3'),
  corporateBusinessAdvisoryJpg: getAssetUrl('images/corporate-business-advisory.jpg?v=2026_corp_v3'),

  meticulousTaxPrepWebp: getAssetUrl('images/meticulous-tax-preparation.webp?v=2026_corp_v3'),
  meticulousTaxPrepJpg: getAssetUrl('images/meticulous-tax-preparation.jpg?v=2026_corp_v3'),

  estateLegacyPlanningWebp: getAssetUrl('images/estate-legacy-planning.webp?v=2026_corp_v3'),
  estateLegacyPlanningJpg: getAssetUrl('images/estate-legacy-planning.jpg?v=2026_corp_v3'),

  bookkeepingReportingWebp: getAssetUrl('images/bookkeeping-financial-reporting.webp?v=2026_corp_v3'),
  bookkeepingReportingJpg: getAssetUrl('images/bookkeeping-financial-reporting.jpg?v=2026_corp_v3'),

  privateConsultationExpWebp: getAssetUrl('images/private-consultation-experience.webp?v=2026_corp_v3'),
  privateConsultationExpJpg: getAssetUrl('images/private-consultation-experience.jpg?v=2026_corp_v3'),

  executiveConsultationSuiteWebp: getAssetUrl('images/executive-consultation-suite.webp?v=2026_corp_v3'),
  executiveConsultationSuiteJpg: getAssetUrl('images/executive-consultation-suite.jpg?v=2026_corp_v3'),

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
