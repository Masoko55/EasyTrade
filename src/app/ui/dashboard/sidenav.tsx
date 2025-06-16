// /easytrade-ui/src/app/ui/dashboard/sidenav.tsx
'use client';

import Link from 'next/link';
import NavLinks from './nav-links'; // This component provides the actual navigation items
import EasyTradeLogo from '@/app/ui/easytrade-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/context/AuthContext';

export default function SideNav() {
  const { user, logout, isLoading } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-800 text-white">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-easytrade-blue p-4 md:h-32"
        href="/dashboard"
      >
        <div className="w-auto">
          <EasyTradeLogo size="text-3xl" className="[&>span:last-child]:text-gray-200 [&>span:first-child]:text-white" />
        </div>
      </Link>
      <div className="flex grow flex-col justify-between space-y-2">
        <NavLinks /> {/* NavLinks component is rendered here */}
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>

        {!isLoading && user && (
          <button
            onClick={handleSignOut}
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-700 p-3 text-sm font-medium text-white hover:bg-red-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 transition-colors"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out ({user.username})</div>
          </button>
        )}
        {!isLoading && !user && (
          <Link
            href="/login"
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-green-600 p-3 text-sm font-medium text-white hover:bg-green-500 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors"
          >
            <PowerIcon className="w-6 rotate-90" />
            <div className="hidden md:block">Log In</div>
          </Link>
        )}
      </div>
    </div>
  );
}
