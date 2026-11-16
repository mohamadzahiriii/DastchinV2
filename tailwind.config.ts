import type { Config } from 'tailwindcss';

const ramp = (hsvVar: string) => `hsl(var(${hsvVar}) / <alpha-value>)`;

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: ramp('--background'),
        foreground: ramp('--foreground'),
        card: {
          DEFAULT: ramp('--card'),
          foreground: ramp('--card-foreground'),
        },
        popover: {
          DEFAULT: ramp('--popover'),
          foreground: ramp('--popover-foreground'),
        },
        primary: {
          DEFAULT: ramp('--primary'),
          foreground: ramp('--primary-foreground'),
        },
        secondary: {
          DEFAULT: ramp('--secondary'),
          foreground: ramp('--secondary-foreground'),
        },
        muted: {
          DEFAULT: ramp('--muted'),
          foreground: ramp('--muted-foreground'),
        },
        accent: {
          DEFAULT: ramp('--accent'),
          foreground: ramp('--accent-foreground'),
        },
        destructive: {
          DEFAULT: ramp('--destructive'),
          foreground: ramp('--destructive-foreground'),
        },
        border: ramp('--border'),
        input: ramp('--input'),
        ring: ramp('--ring'),
        saffron: {
          50: '#FDF8EC',
          100: '#FAEFCF',
          200: '#F5DE9F',
          300: '#EFCD78',
          400: '#E8B95A',
          500: '#DFA63F',
          600: '#C4862A',
          700: '#9E6524',
          800: '#7A4D21',
          900: '#5E3B20',
          950: '#36200F',
        },
        teal: {
          50: '#EEF9F7',
          300: '#7FD3C6',
          400: '#4FB8A8',
          500: '#2F9C8E',
          600: '#237F74',
          900: '#0F3B37',
        },
        sage: {
          50: '#F2F8F1',
          300: '#A8D3A6',
          400: '#7FB77E',
          500: '#5E9F5D',
          900: '#1D3A1C',
        },
        ember: {
          50: '#FEF5EC',
          300: '#F8C27E',
          400: '#F0A052',
          500: '#E07F2C',
          900: '#4A2A10',
        },
        rose: {
          50: '#FDF1F3',
          300: '#F4909E',
          400: '#EE7083',
          500: '#E5566B',
          900: '#4D1A23',
        },
        coral: {
          50: '#FEF3F0',
          300: '#F9A893',
          400: '#F38B70',
          500: '#EC6E50',
          900: '#4C2119',
        },
        ink: {
          50: '#F4F1EB',
          200: '#D9D5CD',
          300: '#B9B5AD',
          400: '#94918A',
          500: '#75736D',
          600: '#5A5853',
          700: '#3D3C39',
          800: '#26262B',
          850: '#1C1C20',
          900: '#141416',
          950: '#0B0B0C',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
