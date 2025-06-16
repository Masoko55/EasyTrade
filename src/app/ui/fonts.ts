// /easytrade-ui/src/app/ui/fonts.ts
import { Inter, Lusitana, Montserrat } from 'next/font/google'; // Added Montserrat

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // Optional: for CSS variable usage
});

export const lusitana = Lusitana({ // Used in dashboard/page.tsx, so keep it
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lusitana', // Optional
});

export const montserrat = Montserrat({ // Added Montserrat export
  subsets: ['latin'],
  weight: ['400', '700', '800'], // Regular, Bold, ExtraBold
  display: 'swap',
  variable: '--font-montserrat', // Optional
});
