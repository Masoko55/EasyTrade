// /easytrade-ui/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    // This path ensures Tailwind scans all relevant files in your src/app directory
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // If you have other top-level directories like src/components or src/ui (outside app)
    // that use Tailwind classes, add their paths here too. For example:
    // './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'easytrade-blue': '#3B82F6',     // Tailwind blue-500
        'easytrade-darkblue': '#1E3A8A', // Tailwind blue-800
        'easytrade-gray': '#6B7280',      // Tailwind gray-500
        'easytrade-lightgray': '#F3F4F6', // Tailwind gray-100
        'easytrade-black': '#111827',     // Tailwind gray-900
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // From src/app/ui/fonts.ts
        montserrat: ['var(--font-montserrat)', 'sans-serif'], // From src/app/ui/fonts.ts
        lusitana: ['var(--font-lusitana)', 'serif'], // From src/app/ui/fonts.ts
      },
    },
  },
  plugins: [
     require('@tailwindcss/forms'),
  ],
};
export default config;
