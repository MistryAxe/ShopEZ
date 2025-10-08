// src/theme.js

const colors = {
  primary: '#4F46E5', // Indigo 600
  secondary: '#10B981', // Emerald 500
  background: '#F9FAFB', // Gray 50
  surface: '#FFFFFF', // White
  text: '#1F2937', // Gray 800
  textSecondary: '#6B7280', // Gray 500
  border: '#E5E7EB', // Gray 200
  error: '#EF4444', // Red 500
  success: '#10B981',
  warning: '#F59E0B',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

const typography = {
  fontFamily: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 30,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export { colors, spacing, typography };
