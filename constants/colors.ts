// Sophisticated pastel color palette inspired by premium apps
export const colors = {
  // Primary brand colors - Soft indigo with depth
  primary: "#6366F1", // Indigo-500 - sophisticated, trustworthy
  primaryLight: "#A5B4FC", // Indigo-300 - soft accent
  primaryDark: "#4F46E5", // Indigo-600 - deeper primary
  primaryUltraLight: "#EEF2FF", // Indigo-50 - very light background
  
  // Secondary accent - Warm coral/pink
  secondary: "#F472B6", // Pink-400 - vibrant yet soft
  secondaryLight: "#FBCFE8", // Pink-200 - light accent
  secondaryDark: "#EC4899", // Pink-500 - deeper secondary
  
  // Neutral palette - Sophisticated grays with warmth
  background: "#FAFBFC", // Custom light gray with slight blue tint
  surface: "#FFFFFF", // Pure white for cards
  surfaceElevated: "#FFFFFF", // White with shadow for elevated cards
  card: "#F8FAFC", // Slate-50 - subtle card background
  cardHover: "#F1F5F9", // Slate-100 - hover state
  
  // Border colors with subtle variations
  border: "#E2E8F0", // Slate-200 - main border
  borderLight: "#F1F5F9", // Slate-100 - light border
  borderDark: "#CBD5E1", // Slate-300 - darker border
  
  // Text hierarchy - Refined and accessible
  text: "#0F172A", // Slate-900 - primary text (high contrast)
  textSecondary: "#475569", // Slate-600 - secondary text
  textTertiary: "#64748B", // Slate-500 - tertiary text
  textQuaternary: "#94A3B8", // Slate-400 - subtle text
  textDisabled: "#CBD5E1", // Slate-300 - disabled text
  
  // Status colors - Soft and accessible
  success: "#10B981", // Emerald-500 - success green
  successLight: "#D1FAE5", // Emerald-100 - light success bg
  successDark: "#059669", // Emerald-600 - dark success
  
  error: "#EF4444", // Red-500 - error red
  errorLight: "#FEE2E2", // Red-100 - light error bg
  errorDark: "#DC2626", // Red-600 - dark error
  
  warning: "#F59E0B", // Amber-500 - warning amber
  warningLight: "#FEF3C7", // Amber-100 - light warning bg
  warningDark: "#D97706", // Amber-600 - dark warning
  
  info: "#3B82F6", // Blue-500 - info blue
  infoLight: "#DBEAFE", // Blue-100 - light info bg
  infoDark: "#2563EB", // Blue-600 - dark info
  
  // Utility colors
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  
  // Overlay colors for modals and backgrounds
  overlay: "rgba(15, 23, 42, 0.6)", // Slate-900 with opacity
  overlayLight: "rgba(15, 23, 42, 0.3)", // Lighter overlay
  overlayDark: "rgba(15, 23, 42, 0.8)", // Darker overlay
  
  // Interactive states
  inactive: "#94A3B8", // Slate-400 - inactive elements
  disabled: "#CBD5E1", // Slate-300 - disabled elements
  hover: "#F1F5F9", // Slate-100 - hover background
  pressed: "#E2E8F0", // Slate-200 - pressed state
  
  // Gradient colors for premium effects
  gradientStart: "#6366F1", // Primary
  gradientMiddle: "#8B5CF6", // Purple-500
  gradientEnd: "#F472B6", // Secondary
  
  // Social media inspired colors
  like: "#EF4444", // Red for likes
  share: "#3B82F6", // Blue for sharing
  bookmark: "#F59E0B", // Amber for bookmarks
  
  // Event category colors (soft pastels)
  categoryMusic: "#A78BFA", // Purple-300
  categoryTech: "#60A5FA", // Blue-300
  categoryFood: "#FB7185", // Rose-300
  categoryArt: "#FBBF24", // Amber-300
  categorySports: "#34D399", // Emerald-300
  categoryEducation: "#A5B4FC", // Indigo-300
  categoryNetworking: "#F472B6", // Pink-400
  categoryFree: "#10B981", // Emerald-500
  categoryOther: "#94A3B8", // Slate-400
};

// Typography scale for consistent text sizing
export const typography = {
  // Display text (hero sections)
  displayLarge: {
    fontSize: 36,
    fontWeight: "800" as const,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 32,
    fontWeight: "800" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  
  // Headings
  h1: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 20,
    fontWeight: "700" as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  h4: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: "500" as const,
    lineHeight: 28,
    letterSpacing: 0.1,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  
  // Labels and captions
  labelLarge: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: "600" as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: "600" as const,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
};

// Spacing scale for consistent layouts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 48,
  xxxxxxl: 64,
};

// Border radius scale
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  full: 9999,
};

// Shadow presets for elevation
export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xlarge: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};