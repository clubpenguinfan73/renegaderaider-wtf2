// Theme system for the gaming profile website
export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    cardBg: string;
    linkHover: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: {
    glow: string;
    shadow: string;
    blur: string;
  };
  animations: {
    duration: string;
    easing: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'cyber-purple',
    name: 'Cyber Purple',
    description: 'Original purple cyberpunk theme with neon accents',
    preview: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
    colors: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      background: '#0F0F23',
      backgroundSecondary: '#1A1A2E',
      text: '#FFFFFF',
      textSecondary: '#94A3B8',
      border: '#374151',
      cardBg: 'rgba(26, 26, 46, 0.8)',
      linkHover: '#A855F7',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
      secondary: 'linear-gradient(90deg, #1A1A2E 0%, #16213E 100%)',
      accent: 'linear-gradient(45deg, #F59E0B 0%, #EF4444 100%)',
    },
    effects: {
      glow: '0 0 20px rgba(139, 92, 246, 0.5)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      blur: 'backdrop-blur-sm',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  {
    id: 'neon-green',
    name: 'Matrix Green',
    description: 'Green matrix-inspired theme with digital aesthetics',
    preview: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
    colors: {
      primary: '#22C55E',
      secondary: '#10B981',
      accent: '#84CC16',
      background: '#0A0A0A',
      backgroundSecondary: '#111111',
      text: '#00FF41',
      textSecondary: '#4ADE80',
      border: '#166534',
      cardBg: 'rgba(17, 17, 17, 0.9)',
      linkHover: '#16A34A',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
      secondary: 'linear-gradient(90deg, #111111 0%, #0F1F0F 100%)',
      accent: 'linear-gradient(45deg, #84CC16 0%, #22C55E 100%)',
    },
    effects: {
      glow: '0 0 20px rgba(34, 197, 94, 0.6)',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      blur: 'backdrop-blur-md',
    },
    animations: {
      duration: '0.2s',
      easing: 'ease-in-out',
    },
  },
  {
    id: 'fire-red',
    name: 'Fire Red',
    description: 'Intense red gaming theme with fiery accents',
    preview: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    colors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F97316',
      background: '#1A0B0B',
      backgroundSecondary: '#2A1515',
      text: '#FFFFFF',
      textSecondary: '#FCA5A5',
      border: '#7F1D1D',
      cardBg: 'rgba(42, 21, 21, 0.8)',
      linkHover: '#F87171',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      secondary: 'linear-gradient(90deg, #2A1515 0%, #1F1010 100%)',
      accent: 'linear-gradient(45deg, #F97316 0%, #EF4444 100%)',
    },
    effects: {
      glow: '0 0 20px rgba(239, 68, 68, 0.6)',
      shadow: '0 25px 50px -12px rgba(220, 38, 38, 0.3)',
      blur: 'backdrop-blur-sm',
    },
    animations: {
      duration: '0.25s',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },
  {
    id: 'ice-blue',
    name: 'Ice Blue',
    description: 'Cool blue theme with frozen aesthetics',
    preview: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#06B6D4',
      background: '#0B1426',
      backgroundSecondary: '#1E2A4A',
      text: '#FFFFFF',
      textSecondary: '#93C5FD',
      border: '#1E3A8A',
      cardBg: 'rgba(30, 42, 74, 0.8)',
      linkHover: '#60A5FA',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      secondary: 'linear-gradient(90deg, #1E2A4A 0%, #1A2541 100%)',
      accent: 'linear-gradient(45deg, #06B6D4 0%, #3B82F6 100%)',
    },
    effects: {
      glow: '0 0 20px rgba(59, 130, 246, 0.5)',
      shadow: '0 25px 50px -12px rgba(30, 64, 175, 0.3)',
      blur: 'backdrop-blur-md',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm orange theme with sunset vibes',
    preview: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FBBF24',
      background: '#1F1611',
      backgroundSecondary: '#2D1B0E',
      text: '#FFFFFF',
      textSecondary: '#FDBA74',
      border: '#9A3412',
      cardBg: 'rgba(45, 27, 14, 0.8)',
      linkHover: '#FB923C',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      secondary: 'linear-gradient(90deg, #2D1B0E 0%, #1F1611 100%)',
      accent: 'linear-gradient(45deg, #FBBF24 0%, #F97316 100%)',
    },
    effects: {
      glow: '0 0 20px rgba(249, 115, 22, 0.5)',
      shadow: '0 25px 50px -12px rgba(234, 88, 12, 0.3)',
      blur: 'backdrop-blur-sm',
    },
    animations: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  {
    id: 'toxic-green',
    name: 'Toxic Green',
    description: 'Radioactive green theme with toxic elements',
    preview: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
    colors: {
      primary: '#84CC16',
      secondary: '#65A30D',
      accent: '#FACC15',
      background: '#0F1A0A',
      backgroundSecondary: '#1A2B0F',
      text: '#FFFFFF',
      textSecondary: '#BEF264',
      border: '#365314',
      cardBg: 'rgba(26, 43, 15, 0.8)',
      linkHover: '#A3E635',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
      secondary: 'linear-gradient(90deg, #1A2B0F 0%, #0F1A0A 100%)',
      accent: 'linear-gradient(45deg, #FACC15 0%, #84CC16 100%)',
    },
    effects: {
      glow: '0 0 20px rgba(132, 204, 22, 0.6)',
      shadow: '0 25px 50px -12px rgba(101, 163, 13, 0.3)',
      blur: 'backdrop-blur-md',
    },
    animations: {
      duration: '0.25s',
      easing: 'ease-out',
    },
  },
];

export const getTheme = (id: string): Theme => {
  return themes.find(theme => theme.id === id) || themes[0];
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  Object.entries(theme.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value);
  });
  
  Object.entries(theme.effects).forEach(([key, value]) => {
    root.style.setProperty(`--effect-${key}`, value);
  });
  
  Object.entries(theme.animations).forEach(([key, value]) => {
    root.style.setProperty(`--animation-${key}`, value);
  });
  
  // Store selected theme
  localStorage.setItem('selected-theme', theme.id);
};

export const getStoredTheme = (): Theme => {
  const storedThemeId = localStorage.getItem('selected-theme');
  return getTheme(storedThemeId || 'cyber-purple');
};