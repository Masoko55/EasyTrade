// /easytrade-ui/src/app/login/page.tsx
import EasyTradeLogo from '@/app/ui/easytrade-logo';
import LoginForm from '@/app/ui/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - EasyTrade',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-easytrade-lightgray p-6 py-12">
      <div className="relative mx-auto flex w-full max-w-sm flex-col"> {/* max-w-sm for login form */}
        {/* Banner consistent with register page */}
        <div className="mb-6 flex h-24 w-full items-center justify-center rounded-lg bg-easytrade-blue p-4 md:h-28">
          <div className="w-auto text-white">
            {/* Apply same class to make logo colors white/light for contrast */}
            <EasyTradeLogo size="text-4xl" className="[&>span:first-child]:text-white [&>span:last-child]:text-gray-200" />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
