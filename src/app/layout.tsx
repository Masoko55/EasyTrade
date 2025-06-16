// /easytrade-ui/src/app/layout.tsx
import type { Metadata } from "next";
import { inter, montserrat, lusitana } from "@/app/ui/fonts";
import "./globals.css";
import FloatingCubes from "@/app/ui/floating-cubes";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext"; // <<< IMPORT CartProvider
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | EasyTrade',
    default: 'EasyTrade - Your Trusted Marketplace',
  },
  description: 'Buy and sell easily on EasyTrade, your community marketplace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${lusitana.variable} antialiased h-full`}>
      <body className="flex flex-col h-full">
        <AuthProvider>
          <CartProvider> {/* <<< WRAP WITH CartProvider */}
            <FloatingCubes />
            <div className="relative z-10 flex flex-col flex-grow w-full min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                  {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
