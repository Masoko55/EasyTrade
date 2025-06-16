// /easytrade-ui/src/app/register/page.tsx
import EasyTradeLogo from '@/app/ui/easytrade-logo';
import RegisterForm from '@/app/ui/register-form'; // We'll create this shortly
import { Metadata } from 'next';
import { montserrat } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Create Account - EasyTrade',
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-easytrade-lightgray p-6 py-12">
      <div className="relative mx-auto flex w-full max-w-md flex-col">
        {/* Changed banner background to easytrade-blue, and centered logo */}
        <div className="mb-6 flex h-24 w-full items-center justify-center rounded-lg bg-easytrade-blue p-4 md:h-28">
          <EasyTradeLogo size="text-4xl" className="[&>span:first-child]:text-white [&>span:last-child]:text-gray-200" />
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
