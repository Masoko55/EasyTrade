// /easytrade-ui/src/app/ui/login-form.tsx
'use client';

import { lusitana, montserrat } from '@/app/ui/fonts'; // Assuming montserrat for headings
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function LoginForm() {
  const { login, user } = useAuth(); // Get user to check if already logged in
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  useEffect(() => {
    const cbUrl = searchParams.get('callbackUrl');
    if (cbUrl) {
      setCallbackUrl(decodeURIComponent(cbUrl)); // Decode the URL
    }
  }, [searchParams]);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push('/dashboard'); // Default redirect for already logged-in users
      }
    }
  }, [user, callbackUrl, router]);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission (which might be GET)
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      setErrorMessage('Username and password are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      // THIS FETCH CALL IS CRITICAL
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST', // <<< ENSURE THIS IS 'POST'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || data.message || `Login failed: ${response.statusText}`);
        setIsSubmitting(false);
        return;
      }

      console.log('Login API call successful:', data);
      if (data.userId && data.username) {
        // The login function from AuthContext will handle storing user/token and redirecting
        login({ userId: data.userId, username: data.username }, data.token /* pass token if API returns it */);
        
        // The redirect logic is now primarily handled by AuthContext's login or the useEffect above.
        // If AuthContext's login doesn't redirect immediately, this could be a fallback:
        // if (callbackUrl) {
        //   router.push(callbackUrl);
        // } else {
        //   router.push('/dashboard'); 
        // }
      } else {
        setErrorMessage("Login response from server was incomplete.");
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Login submission error:', error);
      let msg = 'An error occurred during login. Please try again.';
      if (error instanceof Error) { msg = error.message; }
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
    // No finally { setIsSubmitting(false) } here, as it's set in error/success paths
  };

  // If user is already logged in and redirection via useEffect is pending, show loading.
  // This prevents the form from briefly showing if the user is already authenticated.
  if (user) {
    return (
        <div className="flex flex-col justify-center items-center h-80">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-easytrade-blue"></div>
            <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-b-lg bg-white px-6 pb-6 pt-8 shadow-xl">
        <h1 className={`${montserrat.className} mb-4 text-center text-xl font-semibold text-easytrade-black`}>
          Please log in to continue.
        </h1>
        <div className="w-full space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700" htmlFor="username">Username</label>
            <div className="relative">
              <input className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400" id="username" type="text" name="username" placeholder="Enter your username" required autoComplete="username"/>
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
            </div>
          </div>
          <div className="mt-4"> {/* Inconsistent spacing, should be handled by parent space-y-4 */}
            <label className="mb-1.5 block text-xs font-medium text-gray-700" htmlFor="password">Password</label>
            <div className="relative">
              <input className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400" id="password" type="password" name="password" placeholder="Enter password" required minLength={6} autoComplete="current-password"/>
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
            </div>
          </div>
        </div>
        <div className="mt-4 h-8">
          {errorMessage && (
            <div className="flex items-center space-x-1 rounded-md bg-red-50 p-2">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}
        </div>
        <button type="submit" disabled={isSubmitting} className="mt-4 w-full flex h-11 items-center justify-center rounded-lg bg-easytrade-blue px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline disabled:opacity-60 disabled:cursor-not-allowed">
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register"} className="font-medium text-easytrade-blue hover:underline hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
