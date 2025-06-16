// /easytrade-ui/src/app/dashboard/listings/create/page.tsx
import CreateListingForm from '@/app/ui/listings/create-form';
import { montserrat } from '@/app/ui/fonts'; // Using Montserrat for consistency
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Product - EasyTrade', // Title already good
};

export default async function CreateListingPage() { // Renamed function for clarity, 'Page' is also fine
  return (
    <main>
      <h1 className={`${montserrat.className} text-2xl md:text-3xl font-semibold mb-6 text-easytrade-black`}>
        Add New Product {/* <<< TEXT UPDATED HERE */}
      </h1>
      <CreateListingForm />
    </main>
  );
}
