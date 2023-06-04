const colors = require('tailwindcss/colors');
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  content: [
    // app content
    'app/**/*.{js,ts,jsx,tsx}',
    'src/**/*.{js,ts,jsx,tsx}',
    // include packages if not transpiling
    // "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // company colors
        brand: {
          white: '#FFFFFF',
          gray: '#EDEBE9',
          blue: '#085280',
          navy: '#05314D',
          teal: '#238196',
          magenta: '#911A5B',
          black: '#121212',
        },
        // Brand Base Value 9
        'brand-blue': {
          50: '#ECF7FE',
          100: '#D8EBF7',
          200: '#ABD7F2',
          300: '#7EC1ED',
          400: '#5AAEE9',
          500: '#48A2E7',
          600: '#3D9CE8',
          700: '#3088CE',
          800: '#2579B9',
          900: '#0A69A3',
        },
        // Brand Base Value 9
        'brand-teal': {
          50: '#EEF9FB',
          100: '#E0F0F3',
          200: '#BADFE7',
          300: '#92CEDC',
          400: '#73C0D2',
          500: '#61B7CC',
          600: '#55B3CA',
          700: '#459CB3',
          800: '#388BA0',
          900: '#21798D',
        },
        // Brand Base Value 7
        'brand-orange': {
          50: '#FFF0E8',
          100: '#FBE0D5',
          200: '#F0C0AA',
          300: '#E79D7C',
          400: '#DF8055',
          500: '#DC6D3C',
          600: '#DA642E',
          700: '#C25321',
          800: '#AD481C',
          900: '#983C13',
        },
        // Brand Base Value 7
        'brand-yellow': {
          50: '#FFF9E1',
          100: '#FFF1CC',
          200: '#FFE29B',
          300: '#FFD264',
          400: '#FFC438',
          500: '#FFBB1C',
          600: '#FFB709',
          700: '#E3A000',
          800: '#CA8E00',
          900: '#AF7900',
        },
        // Brand Base Value 9
        'brand-green': {
          50: '#F1F9F2',
          100: '#E2F0E4',
          200: '#BFE0C4',
          300: '#9ACFA3',
          400: '#7BC286',
          500: '#67B973',
          600: '#5CB56A',
          700: '#4C9F59',
          800: '#418D4D',
          900: '#337A40',
        },
        // Brand Base Value 9
        'brand-magenta': {
          50: '#FCEEF5',
          100: '#F4D9E7',
          200: '#EAAECE',
          300: '#E181B5',
          400: '#D95B9F',
          500: '#D54591',
          600: '#D43A8B',
          700: '#BB2D78',
          800: '#A8266A',
          900: '#931A5C',
        },

        // shadcnUI config
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
