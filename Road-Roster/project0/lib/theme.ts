export const colors = {
  primary: {
    50: '#FFF8EB',
    100: '#FEEFC7',
    200: '#FDDC8A',
    500: '#F59E0B',
    700: '#B45309',
  },
  secondary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    500: '#0F766E',
    700: '#115E59',
  },
  accent: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    500: '#0284C7',
    700: '#075985',
  },
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#16A34A',
    700: '#15803D',
  },
  warning: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    500: '#EA580C',
    700: '#C2410C',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#DC2626',
    700: '#B91C1C',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    700: '#334155',
    900: '#0F172A',
  },
} as const;

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fonts = {
  regular: 'Inter-Regular',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;
