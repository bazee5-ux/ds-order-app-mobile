export const COLORS = {
  primary: 'hsl(174, 76%, 42%)',       // Teal primary color
  accent: '#808d9d',        // Slate gray accent color
  primaryGradient: ['rgb(13, 108, 100)', 'hsl(174, 76%, 42%)'], // Updated Gradient as requested
    secondaryGradient: ['#000000ff', 'hsl(174, 76%, 42%)'], // Updated Gradient as requested

  background: '#F8FAFC',    // Light Slate Background
  surface: '#FFFFFF',       // Card/Surface background
  text: '#0F172A',          // Deep Slate Text
  textMuted: '#64748B',     // Slate Muted Gray
  border: '#E2E8F0',        // Light Slate Border
  success: '#10B981',       // Alert Success Green
  error: '#EF4444',         // Alert Error Red
  warning: '#F59E0B',       // Alert Warning Orange
  cardShadow: 'rgba(15, 23, 42, 0.08)',
  
  // Dark mode mappings
  dark: {
    primary: 'hsl(174, 76%, 42%)',
    accent: '#808d9d',
    primaryGradient: ['#d0f1c6', 'hsl(174, 76%, 42%)'],
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#334155',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  }
};

export const FONTS = {
  regular: 'Urbanist_400Regular',
  medium: 'Urbanist_500Medium',
  semiBold: 'Urbanist_600SemiBold',
  bold: 'Urbanist_700Bold',
  extraBold: 'Urbanist_800ExtraBold',
};

export const SHADOWS = {
  soft: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  }
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};
