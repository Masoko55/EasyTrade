// /easytrade-ui/src/app/dashboard/layout.tsx
'use client';

import SideNav from '@/app/ui/dashboard/sidenav'; // Ensure this path and component are correct
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { montserrat } from '@/app/ui/fonts'; // For styling messages

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("DashboardLayout: Auth State Check:", { isLoading, user, pathname });
    if (!isLoading && !user) {
      console.log("DashboardLayout: User not authenticated, redirecting to login. Current path:", pathname);
      // Store the intended path to redirect back after login
      sessionStorage.setItem('easytrade_callbackUrl', pathname);
      router.push('/login');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className={`${montserrat.className} flex min-h-screen flex-col items-center justify-center bg-easytrade-lightgray text-xl text-easytrade-blue`}>
        <p>Loading Your Dashboard...</p>
        {/* Optional: Add a spinner component here */}
      </div>
    );
  }

  if (!user) {
    // This state should ideally be brief due to the redirect in useEffect.
    // If seen persistently, there might be an issue with the redirect or auth state update.
    return (
      <div className={`${montserrat.className} flex min-h-screen flex-col items-center justify-center bg-easytrade-lightgray text-xl text-red-500`}>
        <p>Access Denied. Redirecting to login...</p>
      </div>
    );
  }

  // User is authenticated, render the dashboard layout
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 bg-gray-800"> {/* Example background for sidenav container */}
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-easytrade-lightgray"> {/* Main content area background */}
        {children}
      </div>
    </div>
  );
}
