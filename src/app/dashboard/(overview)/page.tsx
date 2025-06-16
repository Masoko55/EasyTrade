// /easytrade-ui/src/app/dashboard/(overview)/page.tsx
import { Suspense } from 'react';
import LatestListings from '@/app/ui/dashboard/latest-listings';
import { montserrat } from '@/app/ui/fonts';
import {
  fetchLatestProductsForDashboard,
  fetchUserDashboardSummary
} from '@/app/lib/data-service';
import type { Product, UserDashboardSummary } from '@/app/lib/definitions';
import { LatestListingsSkeleton } from '@/app/ui/skeletons';
import Link from 'next/link';
import { Metadata } from 'next';

// This placeholder function simulates getting an authenticated user's name.
// In a real app, this would involve checking a server-side session (e.g., via NextAuth.js).
async function getAuthenticatedUsername(): Promise<string> { // Changed return to string, will always return a name
  // const session = await auth(); // Example with NextAuth.js
  // if (session?.user?.name) {
  //   return session.user.name; // Prefer real name if available
  // }
  // if (session?.user?.username) {
  //   return session.user.username;
  // }
  console.warn("getAuthenticatedUsername: Using placeholder. Implement actual server-side auth session retrieval.");
  return "Trader"; // <<< CHANGED DEFAULT/PLACEHOLDER USERNAME HERE
}

export const metadata: Metadata = {
  title: 'My Dashboard - EasyTrade',
};

export default async function DashboardOverviewPage() {
  const username = await getAuthenticatedUsername(); // This will now default to "Trader"

  // Fetch data. UserSummary might use the username if your API supports it.
  let latestProducts: Product[] = [];
  let userSummary: UserDashboardSummary | null = null;

  // If you have an API endpoint that takes the username to fetch user-specific summary
  if (username && username !== "Trader") { // Example: only fetch specific summary if not the default placeholder
      [latestProducts, userSummary] = await Promise.all([
        fetchLatestProductsForDashboard(5), // This could also be fetchUserLatestListings(username, 5)
        fetchUserDashboardSummary(username),
    ]);
  } else {
    // For guests or if auth isn't fully set up / using placeholder
    latestProducts = await fetchLatestProductsForDashboard(5);
    // Initialize userSummary with the (potentially placeholder) username
    userSummary = { username: username, activeListingsCount: 0 };
  }

  return (
    <main>
      <h1 className={`${montserrat.className} mb-8 text-2xl md:text-3xl font-bold text-easytrade-black`}>
        {/* Display the username from userSummary or the direct username variable */}
        Welcome back, {userSummary?.username || username}! {/* <<< TEXT DISPLAYED HERE */}
      </h1>

      <section className="mb-10">
        <h2 className={`${montserrat.className} text-xl font-semibold text-gray-700 mb-4`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/dashboard/listings/create" className="block p-6 bg-easytrade-blue text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-center">
            <h3 className={`${montserrat.className} font-semibold text-lg`}>List a New Product</h3>
            <p className="text-sm opacity-90 mt-1">Share your items with the community.</p>
          </Link>
          <Link href="/dashboard/listings" className="block p-6 bg-white text-easytrade-black rounded-lg shadow hover:bg-gray-50 transition-colors text-center border border-gray-200">
            <h3 className={`${montserrat.className} font-semibold text-lg`}>Manage My Listings</h3>
            <p className="text-sm text-gray-600 mt-1">View, edit, or remove your active listings.</p>
            {userSummary && userSummary.activeListingsCount > 0 && (
                <p className="text-xs text-easytrade-blue mt-1">({userSummary.activeListingsCount} active)</p>
            )}
          </Link>
          <Link href="/products" className="block p-6 bg-white text-easytrade-black rounded-lg shadow hover:bg-gray-50 transition-colors text-center border border-gray-200">
            <h3 className={`${montserrat.className} font-semibold text-lg`}>Browse All Products</h3>
            <p className="text-sm text-gray-600 mt-1">Discover items from other sellers.</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className={`${montserrat.className} text-xl font-semibold text-gray-700 mb-4 mt-8`}>
          Latest Listings on EasyTrade
        </h2>
        <Suspense fallback={<LatestListingsSkeleton />}>
          <LatestListings latestProducts={latestProducts} />
        </Suspense>
      </section>
    </main>
  );
}
