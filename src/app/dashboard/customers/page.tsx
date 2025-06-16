// /easytrade-ui/src/app/dashboard/customers/page.tsx (User Profile Page)
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { fetchUserProfile } from '@/app/lib/data-service'; // CORRECTED IMPORT
import { User } from '@/app/lib/definitions';
import { montserrat, lusitana } from '@/app/ui/fonts';
import Image from 'next/image'; // Keep if you plan to add a real profile image
import Link from 'next/link'; // For the "Edit Profile" button
import { UserCircleIcon, EnvelopeIcon, CalendarDaysIcon, CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function UserProfilePage() {
  const { user: authUser, token, isLoading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if auth is not loading and user object (with userId) is available
    if (!authLoading && authUser && authUser.userId) {
      setIsLoadingPage(true);
      setError(null);

      console.log(`Fetching profile for user ID: ${authUser.userId} with token: ${token ? 'present' : 'absent'}`);
      fetchUserProfile(authUser.userId, token || undefined) // Use the specific function
        .then((data) => { // data is User | null from fetchUserProfile
          if (data) {
            setProfileData(data);
          } else {
            // This means API returned null (e.g., 404 or other handled error)
            setError("Profile information not found.");
            setProfileData(null); // Ensure profileData is null if no data
          }
        })
        .catch(err => {
          console.error("Failed to fetch profile data from UserProfilePage:", err);
          setError(err.message || "Could not load your profile information.");
          setProfileData(null);
        })
        .finally(() => {
          setIsLoadingPage(false);
        });
    } else if (!authLoading && !authUser) {
      // User is not logged in, dashboard layout should ideally redirect.
      // If not, this page can show an appropriate message or also trigger a redirect.
      setIsLoadingPage(false);
      setError("You need to be logged in to view this page.");
      // router.push('/login'); // Example redirect
    } else if (authLoading) {
        // Still waiting for authentication state to resolve
        setIsLoadingPage(true);
    }
  }, [authUser, authLoading, token]); // Dependencies for useEffect

  if (isLoadingPage || authLoading) {
    return (
        <div className="flex flex-col justify-center items-center h-80"> {/* Increased height */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-easytrade-blue"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-lg mx-auto my-8 shadow" role="alert">
            <strong className="font-bold block sm:inline">Error!</strong>
            <span className="block sm:inline"> {error}</span>
        </div>
    );
  }

  if (!profileData) {
    return (
        <div className="text-center text-gray-500 p-10">
            <p>Could not load profile information. Please try again later or ensure you are logged in.</p>
            <Link href="/login" className="text-easytrade-blue hover:underline mt-2 inline-block">
                Go to Login
            </Link>
        </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-3xl mx-auto"> {/* Adjusted max-width */}
      <div className="flex flex-col items-center md:flex-row md:items-start mb-8 pb-6 border-b border-gray-200">
        <div className="w-28 h-28 md:w-36 md:h-36 bg-gray-200 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8 shrink-0 shadow">
          <UserCircleIcon className="w-20 h-20 md:w-24 md:h-24 text-gray-400" />
          {/* TODO: Add actual image upload/display: 
          {profileData.imageUrl ? 
            <Image src={profileData.imageUrl} alt="Profile" width={144} height={144} className="rounded-full object-cover" /> :
            <UserCircleIcon className="w-20 h-20 md:w-24 md:h-24 text-gray-400" />
          } 
          */}
        </div>
        <div className="text-center md:text-left">
            <h1 className={`${montserrat.className} text-2xl md:text-3xl font-bold text-easytrade-black`}>
                {profileData.name} {profileData.surname}
            </h1>
            <p className={`${lusitana.className} text-md text-easytrade-gray mt-1`}>@{profileData.username}</p>
             <Link href={`/dashboard/customers/edit`} className="mt-3 inline-block text-xs text-easytrade-blue hover:underline">
                Edit Profile Details
            </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className={`${montserrat.className} text-lg font-semibold text-gray-700 mb-2 border-b pb-1`}>Contact Information</h2>
          <div className="mt-2 space-y-2 text-sm text-gray-600">
             <p className="flex items-center">
                <EnvelopeIcon className="inline h-4 w-4 mr-2.5 text-gray-400 shrink-0" /> 
                <span className="font-medium text-gray-800 mr-2">Email:</span>
                {profileData.email}
            </p>
          </div>
        </div>

        <div>
          <h2 className={`${montserrat.className} text-lg font-semibold text-gray-700 mb-2 border-b pb-1`}>Account Details</h2>
          <div className="mt-2 space-y-2 text-sm text-gray-600">
            <p className="flex items-center">
              <span className="font-medium text-gray-800 mr-2 w-24 inline-block">Status:</span>
              {profileData.verified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckBadgeIcon className="h-4 w-4 mr-1" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <XCircleIcon className="h-4 w-4 mr-1" /> Not Verified
                </span>
              )}
            </p>
            <p className="flex items-center">
              <CalendarDaysIcon className="inline h-4 w-4 mr-2.5 text-gray-400 shrink-0" />
              <span className="font-medium text-gray-800 mr-2">Joined:</span> 
              {new Date(profileData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
