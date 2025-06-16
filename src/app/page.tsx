// /easytrade-ui/src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { montserrat } from '@/app/ui/fonts';
import EasyTradeLogo from '@/app/ui/easytrade-logo';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section ... (as before) ... */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 text-center md:text-left">
          <h1 className={`${montserrat.className} text-4xl md:text-5xl font-extrabold text-easytrade-black dark:text-white mb-4`}>
            Welcome to <EasyTradeLogo size="text-4xl md:text-5xl inline-block" />!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Your one-stop marketplace to buy and sell amazing products within your community.
          </p>
          <Link
            href="/products" // Main browse products page
            className="inline-block bg-easytrade-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 text-base md:text-lg shadow hover:shadow-md"
          >
            Browse All Products
          </Link>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/ecommerce-hero-desktop.jpg"
            width={1000} height={600}
            className="rounded-lg shadow-xl object-cover"
            alt="Featured products for EasyTrade"
            priority
          />
        </div>
      </section>

      {/* Featured Products (Placeholder) ... (as before) ... */}
      <section className="mb-12">
        <h2 className={`${montserrat.className} text-3xl font-bold text-easytrade-black dark:text-white mb-8 text-center`}>
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 md:p-6 hover:shadow-xl transition-shadow flex flex-col">
              <div className="bg-gray-200 dark:bg-gray-600 h-48 w-full rounded-md mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-gray-400 dark:text-gray-500">Product Image {item}</span>
              </div>
              <h3 className={`${montserrat.className} text-lg md:text-xl font-semibold mb-2 text-easytrade-black dark:text-white truncate`}>Product Name {item}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Seller: SellerName</p>
              <p className={`${montserrat.className} text-xl md:text-2xl font-bold text-easytrade-black dark:text-white mb-4`}>$XX.XX</p>
              <Link href={`/products/placeholder-${item}`} className="block w-full text-center bg-easytrade-black text-white dark:bg-easytrade-blue dark:text-white py-2.5 px-4 rounded-lg hover:bg-gray-700 dark:hover:bg-blue-700 transition mt-auto text-sm font-medium">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-easytrade-blue text-white rounded-lg shadow-lg p-8 md:p-12 text-center">
        <h2 className={`${montserrat.className} text-3xl font-bold mb-4`}>
            Ready to Start Trading?
        </h2>
        <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Join our community of buyers and sellers today. It's easy, fast, and secure.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
                href="/register" // This is the generic registration, can be used by sellers
                className="inline-block bg-white text-easytrade-blue font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 text-base md:text-lg shadow hover:shadow-md"
            >
                Sign Up to Sell
            </Link>
            <Link
                href="/products" // <<< "START SHOPPING" NOW GOES TO /products
                className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-easytrade-blue transition duration-300 text-base md:text-lg"
            >
                Start Shopping
            </Link>
        </div>
      </section>
    </div>
  );
}
