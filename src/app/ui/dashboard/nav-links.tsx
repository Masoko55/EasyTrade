// /easytrade-ui/src/app/ui/dashboard/nav-links.tsx
'use client';

import {
  HomeIcon, // For Dashboard Home/Overview
  BuildingStorefrontIcon, // For Listings
  UserCircleIcon, // For Profile
  Cog6ToothIcon, // For Settings
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx'; // Ensure you have run: pnpm add clsx

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon }, // Link to the overview page
  { name: 'My Listings', href: '/dashboard/listings', icon: BuildingStorefrontIcon },
  { name: 'My Profile', href: '/dashboard/customers', icon: UserCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] items-center justify-start gap-3 rounded-md p-3 text-sm font-medium transition-colors md:p-2 md:px-3',
              {
                'bg-sky-500 text-white': pathname === link.href, // Active link style
                'text-gray-200 hover:bg-sky-600 hover:text-white': pathname !== link.href, // Inactive link style
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
