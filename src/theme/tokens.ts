/**
 * A/R TAX SERVICES, LLC - Centralized Brand Design System Tokens
 * Reference specifications:
 * - Primary Midnight Navy: #06172C
 * - Deep Navy: #081E36
 * - Elevated Navy: #0D2746
 * - Navy Hover: #14375D
 * - Refined Gold: #C99A3D
 * - Bright Gold: #E2B957
 * - Soft Champagne: #EAD7A3
 * - Warm Ivory: #F7F1E5
 * - Soft Ivory Surface: #FBF8F1
 * - Muted Gold Surface: #F4E7C3
 * - Primary Dark Text: #10233D
 * - Secondary Text: #52657B
 * - Muted Text: #718096
 * - Navy Border: #244567
 * - Gold Border: #B98B32
 * - Light Border: #D8C9A5
 * - Success: #138A67
 * - Warning: #B87319
 * - Error: #B42318
 * - Error Background: #FFF1F0
 * - Information: #2563A6
 */

export const BRAND_COLORS = {
  // Navy scale
  primaryMidnightNavy: '#06172C',
  deepNavy: '#081E36',
  elevatedNavy: '#0D2746',
  navyHover: '#14375D',

  // Gold scale
  refinedGold: '#C99A3D',
  brightGold: '#E2B957',
  softChampagne: '#EAD7A3',
  mutedGoldSurface: '#F4E7C3',

  // Ivory & Light scale
  warmIvory: '#F7F1E5',
  softIvorySurface: '#FBF8F1',

  // Typography colors
  primaryDarkText: '#10233D',
  secondaryText: '#52657B',
  mutedText: '#718096',
  textOnDark: '#F7F1E5',

  // Borders
  navyBorder: '#244567',
  goldBorder: '#B98B32',
  lightBorder: '#D8C9A5',

  // Status indicators
  success: '#138A67',
  warning: '#B87319',
  error: '#B42318',
  errorBackground: '#FFF1F0',
  information: '#2563A6',
} as const;

export const SEMANTIC_THEME = {
  pageBackground: BRAND_COLORS.primaryMidnightNavy,
  surfaceDark: BRAND_COLORS.deepNavy,
  surfaceElevated: BRAND_COLORS.elevatedNavy,
  surfaceLight: BRAND_COLORS.softIvorySurface,
  surfaceHighlight: BRAND_COLORS.warmIvory,
  surfaceMutedGold: BRAND_COLORS.mutedGoldSurface,

  brandPrimary: BRAND_COLORS.refinedGold,
  brandHover: BRAND_COLORS.brightGold,
  brandBorder: BRAND_COLORS.goldBorder,

  textOnDark: BRAND_COLORS.textOnDark,
  textPrimary: BRAND_COLORS.primaryDarkText,
  textSecondary: BRAND_COLORS.secondaryText,
  textMuted: BRAND_COLORS.mutedText,

  borderDark: BRAND_COLORS.navyBorder,
  borderLight: BRAND_COLORS.lightBorder,
  borderGold: BRAND_COLORS.goldBorder,
  focusRing: BRAND_COLORS.refinedGold,

  statusSuccess: BRAND_COLORS.success,
  statusWarning: BRAND_COLORS.warning,
  statusError: BRAND_COLORS.error,
  statusErrorBg: BRAND_COLORS.errorBackground,
  statusInfo: BRAND_COLORS.information,
} as const;
