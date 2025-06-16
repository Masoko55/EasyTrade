// /easytrade-ui/src/app/ui/header.tsx
'use client';

import Link from 'next/link';
import EasyTradeLogo from './easytrade-logo';
import { ShoppingCartIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext'; // <<< IMPORT useCart

export default function Header() {
  const { user, isLoading: authIsLoading } = useAuth();
  const { itemCount } = useCart(); // <<< GET itemCount from CartContext

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <Link href="/">
          <EasyTradeLogo size="text-2xl md:text-3xl" />
        </Link>
        <div className="flex items-center space-x-3 sm:space-x-6">
          <Link href="/products" className="text-sm sm:text-base text-gray-700 hover:text-easytrade-blue font-medium transition-colors">
            Browse Products
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/cart" className="relative text-gray-700 hover:text-easytrade-blue" title="View Cart">
              <ShoppingCartIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              {itemCount > 0 && ( // Show badge if items in cart
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {authIsLoading ? (
              <div className="h-7 w-7 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <Link href="/dashboard" className="text-gray-700 hover:text-easytrade-blue" title="My Dashboard">
                 <UserCircleIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-block bg-easytrade-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-sm">Login</Link>
                <Link href="/register" className="hidden sm:inline-block text-easytrade-blue border border-easytrade-blue px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors text-xs sm:text-sm">Sign Up</Link>
                <Link href="/login" className="sm:hidden text-gray-700 hover:text-easytrade-blue" title="Login"><ArrowRightOnRectangleIcon className="h-6 w-6" /></Link>
                <Link href="/register" className="sm:hidden text-gray-700 hover:text-easytrade-blue" title="Sign Up"><UserPlusIcon className="h-6 w-6" /></Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
