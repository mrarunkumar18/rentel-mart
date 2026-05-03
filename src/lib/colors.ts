// ============================================================================
// Rentify — Color Tokens
// Reference: COLOR_THEME.md (LOCKED — No deviations allowed)
// Status: FINAL — matches COLOR_THEME.md exactly
// ============================================================================

/**
 * Primary color palette — Dark Vibrant Blue family
 * Usage: CTAs, primary buttons, navigation, links, active states, badges
 */
export const colors = {
  // === Primary Colors ===
  primary: '#1886FF',
  primaryLight: '#62D0FF',
  primaryAccent: '#E4F9FF',
  primaryDark: '#0D5BB8',

  // === Secondary Color ===
  secondary: '#62D0FF',

  // === Accent Color ===
  accent: '#E4F9FF',

  // === Text Colors ===
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textLink: '#1886FF',
  textLinkHover: '#62D0FF',
  textError: '#E24B4A',
  textSuccess: '#3B6D11',
  textWarning: '#BA7517',

  // === Background Colors ===
  bgPrimary: '#FFFFFF',
  bgSecondary: '#E4F9FF',
  bgTertiary: '#F5F5F5',
  bgCard: '#E4F9FF',
  bgModalOverlay: '#000000',
  bgSuccess: '#EAF3DE',
  bgError: '#FCEBEB',
  bgWarning: '#FAEEDA',
  bgInfo: '#E4F9FF',

  // === Border Colors ===
  borderPrimary: '#1886FF',
  borderSecondary: '#CCCCCC',
  borderTertiary: '#DDDDDD',
  borderDivider: '#CCCCCC',

  // === Button Colors ===
  buttonPrimaryBg: '#1886FF',
  buttonPrimaryHover: '#62D0FF',
  buttonPrimaryActive: '#0D5BB8',
  buttonPrimaryDisabled: '#CCCCCC',
  buttonSecondaryBg: '#E4F9FF',
  buttonSecondaryText: '#1886FF',
  buttonSecondaryHover: '#62D0FF',

  // === Form Element Colors ===
  inputBg: '#FFFFFF',
  inputBorder: '#1886FF',
  inputFocusBorder: '#1886FF',
  inputPlaceholder: '#999999',
  inputLabel: '#000000',
  checkboxChecked: '#1886FF',
  checkboxBg: '#E4F9FF',
  radioChecked: '#1886FF',

  // === Special Element Colors ===
  badgePrimary: '#1886FF',
  badgeText: '#FFFFFF',
  alertBorder: '#E24B4A',
  successCheck: '#3B6D11',
  loadingSpinner: '#1886FF',
  progressBar: '#1886FF',
  skeletonLoader: '#E4F9FF',

  // === Status Colors ===
  success: '#3B6D11',
  error: '#E24B4A',
  warning: '#BA7517',
  info: '#1886FF',
} as const;

/**
 * Opacity values — predefined, not arbitrary (per COLOR_THEME.md rules)
 */
export const opacity = {
  borderDefault: 0.2,
  borderFocus: 0.5,
  borderHover: 0.3,
  divider: 0.5,
  modalOverlay: 0.4,
  disabled: 0.6,
} as const;

/**
 * Dark mode color overrides
 */
export const darkModeColors = {
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
  bgPrimary: '#1A1A1A',
  bgCard: '#2A2A2A',
  inputBg: '#333333',
  inputBorder: '#62D0FF',
  divider: '#444444',
} as const;

/**
 * CSS custom properties for use in stylesheets
 * Reference: COLOR_THEME.md — CSS Variables section
 */
export const cssVariables = {
  '--color-primary': '#1886FF',
  '--color-primary-light': '#62D0FF',
  '--color-primary-accent': '#E4F9FF',
  '--color-primary-dark': '#0D5BB8',
  '--color-text-primary': '#000000',
  '--color-text-secondary': '#666666',
  '--color-text-tertiary': '#999999',
  '--color-bg-primary': '#FFFFFF',
  '--color-bg-secondary': '#E4F9FF',
  '--color-bg-tertiary': '#F5F5F5',
  '--color-border-primary': '#1886FF',
  '--color-border-secondary': '#CCCCCC',
  '--color-border-tertiary': '#DDDDDD',
  '--color-success': '#3B6D11',
  '--color-error': '#E24B4A',
  '--color-warning': '#BA7517',
  '--color-info': '#1886FF',
} as const;

// Type exports for consuming components
export type ColorKey = keyof typeof colors;
export type DarkModeColorKey = keyof typeof darkModeColors;
export type CssVariableKey = keyof typeof cssVariables;
