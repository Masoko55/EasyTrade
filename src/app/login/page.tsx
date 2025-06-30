// /easytrade-ui/src/app/login/page.tsx

import EasyTradeLogo from '@/app/ui/easytrade-logo';
import LoginForm from '@/app/ui/login-form';
import { Metadata } from 'next';
import { Suspense } from 'react'; // <<< 1. IMPORT Suspense from React

export const metadata: Metadata = {
  title: 'Login - EasyTrade',
};

// 2. CREATE A LOADING SKELETON COMPONENT FOR THE FORM
// This will be shown while the LoginForm (which uses dynamic hooks) is loading.
const LoginFormSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="flex-1 rounded-b-lg bg-white px-6 pb-6 pt-8 shadow-xl">
      <div className="h-7 w-3/4 bg-gray-200 rounded-md mb-6 mx-auto"></div>
      <div className="w-full space-y-4">
        <div>
          <div className="h-4 w-1/4 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-md"></div>
        </div>
        <div>
          <div className="h-4 w-1/4 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-md"></div>
        </div>
      </div>
      <div className="mt-8 h-11 w-full bg-easytrade-blue opacity-50 rounded-lg"></div>
      <div className="mt-6 h-5 w-1/2 bg-gray-200 rounded-md mx-auto"></div>
    </div>
  </div>
);


// 3. UPDATE THE DEFAULT EXPORT FOR THE PAGE
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-easytrade-lightgray p-6 py-12">
      <div className="relative mx-auto flex w-full max-w-sm flex-col">
        <div className="mb-6 flex h-24 w-full items-center justify-center rounded-lg bg-easytrade-blue p-4 md:h-28">
          <div className="w-auto text-white">
            <EasyTradeLogo size="text-4xl" className="[&>span:first-child]:text-white [&>span:last-child]:text-gray-200" />
          </div>
        </div>

        {/* --- THIS IS THE FIX --- */}
        {/* Wrap the component that uses the dynamic hook in a Suspense boundary */}
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
        {/* --- END OF FIX --- */}

      </div>
    </main>
  );
}
