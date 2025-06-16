// /easytrade-ui/src/app/ui/register-form.tsx
'use client';

import { lusitana, montserrat } from '@/app/ui/fonts';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function RegisterForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!name || !surname || !username || !email || !password || !confirmPassword) {
        setErrorMessage('All fields are required.');
        setIsSubmitting(false);
        return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || data.message || `Registration failed: ${response.statusText}`);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2500);

    } catch (error) {
      console.error('Registration submission error:', error);
      let msg = 'An error occurred during registration. Please try again.';
      if (error instanceof Error) {
        msg = error.message;
      }
      setErrorMessage(msg);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-b-lg bg-white px-6 pb-6 pt-8 shadow-xl">
        <h1 className={`${montserrat.className} mb-6 text-center text-xl font-semibold text-easytrade-black`}>
          Create Your EasyTrade Account
        </h1>
        <div className="w-full space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-1.5 block text-xs font-medium text-gray-700" htmlFor="name">First Name</label>
              <div className="relative">
                {/* Corrected placeholder */}
                <input className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400" id="name" type="text" name="name" placeholder="Enter first name" required />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <label className="mb-1.5 block text-xs font-medium text-gray-700" htmlFor="surname">Last Name</label>
              <div className="relative">
                {/* Corrected placeholder */}
                <input className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400" id="surname" type="text" name="surname" placeholder="Enter last name" required />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700" htmlFor="username">Username</label>
            <div className="relative">
              {/* Corrected placeholder */}
              <input className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400" id="username" type="text" name="username" placeholder="Choose a username" required />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700" htmlFor="email">Email</label>
            <div className="relative">
              {/* Corrected placeholder */}
              <input className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400" id="email" type="email" name="email" placeholder="you@example.com" required />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700" htmlFor="password">Password</label>
            <div className="relative">
              <input className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400" id="password" type="password" name="password" placeholder="Create a password" required minLength={6} />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <input className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400" id="confirmPassword" type="password" name="confirmPassword" placeholder="Confirm your password" required minLength={6} />
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
          {successMessage && (
             <div className="flex items-center space-x-1 rounded-md bg-green-50 p-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700">{successMessage}</p>
             </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full flex h-11 items-center justify-center rounded-lg bg-easytrade-blue px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-easytrade-blue disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-easytrade-blue hover:underline hover:text-blue-700">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
