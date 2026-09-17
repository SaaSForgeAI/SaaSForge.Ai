import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0f1118',
        canvas: '#090b10',
        border: 'rgba(255,255,255,0.08)',
        accent: '#7c5cff',
        accent2: '#33a8ff'
      },
      boxShadow: {
        panel: '0 10px 35px rgba(0, 0, 0, 0.35)',
        glow: '0 0 0 1px rgba(124, 92, 255, 0.2), 0 20px 80px rgba(51, 168, 255, 0.12)'
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at top, rgba(124,92,255,0.12), transparent 35%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))'
      },
      animation: {
        float: 'float 10s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.6s ease-in-out infinite',
        marquee: 'marquee 18s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
