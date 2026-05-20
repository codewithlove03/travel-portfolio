// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // ── Cinematic Color Palette ─────────────────────────────────────────────
    colors: {
      'void-900': '#0a0a0f',
      'void-800': '#0d0d18',
      'void-700': '#12121f',
      'void-600': '#1a1a2e',
      'void-500': '#2a2a3f',
      'amber':       '#d4a853',
      'amber-light': '#f0c97a',
      'amber-dark':  '#a07830',
      'ivory':       '#f5f0e8',
      'ivory-dark':  '#e8ddd0',
      'cream':       '#faf8f4',
      'cream-dark':  '#f0ece4',
      'stone':       '#e8e0d4',
    },
      // ── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        // Serif display font — cinematic headlines
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Clean body text
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        // Monospace for labels/stamps
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        // Large cinematic headings
        hero: ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        display: ['clamp(2rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        title: ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.1' }],
      },
      // ── Spacing ─────────────────────────────────────────────────────────────
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        section: '8rem',
      },
      // ── Animations ──────────────────────────────────────────────────────────
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-in': 'slideIn 0.6s ease forwards',
        'grain': 'grain 0.4s steps(2) infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        grain: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 100%' },
          '50%': { backgroundPosition: '100% 0%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      // ── Backdrop Blur ────────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
      // ── Box Shadow ───────────────────────────────────────────────────────────
      boxShadow: {
        'amber': '0 0 40px rgba(212, 168, 83, 0.2)',
        'amber-lg': '0 0 80px rgba(212, 168, 83, 0.3)',
        'inner-top': 'inset 0 4px 20px rgba(0,0,0,0.5)',
        'card': '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
      },
      // ── Aspect Ratios ────────────────────────────────────────────────────────
      aspectRatio: {
        'cinema': '21 / 9',
        'photo': '4 / 3',
      },
    },
  },
  plugins: [],
};
