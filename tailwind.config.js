/** @type {import('tailwindcss').Config} */
const withOpacityValue = (variable) => {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
};

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--bg-page)',
        card: {
          DEFAULT: 'var(--bg-card)',
          hover: 'var(--bg-card-hover)',
        },
        nav: 'var(--bg-nav)',
        footer: 'var(--bg-footer)',
        muted: {
          bg: 'var(--bg-muted)',
          border: 'var(--border-muted)',
          text: 'var(--text-muted)',
        },
        main: {
          text: 'var(--text-main)',
          border: 'var(--border-main)',
        },
        dim: 'var(--text-dim)',
        inverse: 'var(--text-inverse)',
        brand: {
          primary: withOpacityValue('--brand-primary'),
          secondary: withOpacityValue('--brand-secondary'),
          accent: withOpacityValue('--brand-accent'),
        },
        status: {
          success: withOpacityValue('--status-success'),
          error: withOpacityValue('--status-error'),
          warning: withOpacityValue('--status-warning'),
          info: withOpacityValue('--status-info'),
        },
      },
      backgroundImage: {
        'gradient-page': 'var(--gradient-page)',
        'gradient-brand': 'var(--gradient-brand)',
        'gradient-brand-hover': 'var(--gradient-brand-hover)',
        'gradient-surface': 'var(--gradient-surface)',
      },
    },
  },
  plugins: [],
};
