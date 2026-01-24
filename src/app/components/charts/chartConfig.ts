export const CHART_COLORS = {
  primary: '#2563EB', // Blue 600
  secondary: '#4F46E5', // Indigo 600
  success: '#10B981', // Emerald 500
  warning: '#F59E0B', // Amber 500
  danger: '#EF4444', // Red 500
  info: '#3B82F6', // Blue 500
  grey: '#9CA3AF', // Gray 400
  text: '#1F2937', // Gray 800
  textLight: '#6B7280', // Gray 500
  grid: '#E5E7EB', // Gray 200
  background: '#FFFFFF',
};

export const PIE_CHART_COLORS = [
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
];

export const COMMON_TEXT_STYLE = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 12,
  color: CHART_COLORS.textLight,
};
