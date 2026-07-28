export const AVEX_THEME = {
  colors: {
    bgDark: '#0A0A0F',
    bgSurface: '#151520',
    bgSurfaceHover: '#1c1c2b',
    borderSubtle: 'rgba(255, 255, 255, 0.06)',
    accentBlue: '#3B82F6',
    accentPurple: '#9333EA',
    accentPink: '#EC4899',
    
    // Status colors (desaturated for dark background)
    status: {
      positive: {
        text: '#34D399', // Emerald 400
        bg: 'rgba(52, 211, 153, 0.12)',
        border: 'rgba(52, 211, 153, 0.25)',
      },
      negative: {
        text: '#F87171', // Red 400
        bg: 'rgba(248, 113, 113, 0.12)',
        border: 'rgba(248, 113, 113, 0.25)',
      },
      warning: {
        text: '#FBBF24', // Amber 400
        bg: 'rgba(251, 191, 36, 0.12)',
        border: 'rgba(251, 191, 36, 0.25)',
      },
      info: {
        text: '#60A5FA', // Blue 400
        bg: 'rgba(96, 165, 250, 0.12)',
        border: 'rgba(96, 165, 250, 0.25)',
      },
    },

    // Chart Palette (Recharts)
    chart: {
      primaryGradientStart: '#3B82F6',
      primaryGradientEnd: '#9333EA',
      stroke: '#8B5CF6',
      fillGradient: 'url(#salesOverviewGradient)',
      stages: {
        lead: '#3B82F6',       // Electric Blue
        contacted: '#8B5CF6',  // Purple
        qualified: '#EC4899',  // Pink
        proposal: '#F59E0B',   // Amber
        won: '#10B981',        // Emerald
        lost: '#EF4444',       // Red
      },
      donut: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
    },
  },
  gradients: {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500',
    primaryHover: 'hover:from-blue-600 hover:to-purple-600',
    brandBadge: 'bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500',
    aiCard: 'from-purple-900/30 via-[#151520] to-[#151520]',
  },
} as const;
