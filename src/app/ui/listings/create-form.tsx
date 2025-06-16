// /easytrade-ui/src/app/ui/listings/create-form.tsx
'use client';

import { useState, FormEvent, useTransition, useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { createListingAction } from '@/app/lib/actions';
import { ListingFormSchema, type CreateListingActionState } from '@/app/lib/definitions';

const initialFormState: CreateListingActionState = { message: null, errors: {}, success: false };

export default function CreateListingForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(createListingAction, initialFormState);
  const [isPending, startTransition] = useTransition();
  const [clientErrors, setClientErrors] = useState<Partial<Record<keyof typeof ListingFormSchema._input, string[]>>>({});

  useEffect(() => {
    if (state?.success && state.message) {
      // Success message is now more generic as the specific name comes from the action
      alert(state.message); // e.g., "Product 'Bucket Hat' added successfully!"
      router.push('/dashboard/listings');
      router.refresh();
    }
    if (!state?.success && state?.message && state.errors?.api && state.errors.api.length > 0) {
        // This alert will show the "User authentication is required..." message.
        alert(`Error: ${state.errors.api.join(', ')}`);
    } else if (!state?.success && state?.message) {
        alert(`Notice: ${state.message}`);
    }
  }, [state, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawFormData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
    };
    const validationResult = ListingFormSchema.safeParse(rawFormData);

    if (!validationResult.success) {
        setClientErrors(validationResult.error.flatten().fieldErrors);
        // alert("Please correct the errors in the form."); // Optionally keep this client-side alert
        return;
    }
    setClientErrors({});
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-white shadow-lg p-4 md:p-8">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
            Product Name / Title
          </label>
          <div className="relative">
            <input id="name" name="name" type="text" placeholder="e.g., Vintage Leather Jacket"
              className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400"
              aria-describedby="name-error-create" required />
            <ClipboardDocumentListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
          </div>
          {(clientErrors.name || state?.errors?.name) && ( <div id="name-error-create" aria-live="polite" className="mt-2 text-sm text-red-600">{clientErrors.name?.join(', ') || state?.errors?.name?.join(', ')}</div> )}
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">Description (Optional)</label>
          <div className="relative">
            <textarea id="description" name="description" placeholder="Provide details about your product..." rows={4}
              className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400"
              aria-describedby="description-error-create" />
            <InformationCircleIcon className="pointer-events-none absolute left-3 top-[20px] transform -translate-y-1/2 h-[18px] w-[18px] text-gray-400 peer-focus:text-easytrade-blue" />
          </div>
          {(clientErrors.description || state?.errors?.description) && ( <div id="description-error-create" aria-live="polite" className="mt-2 text-sm text-red-600">{clientErrors.description?.join(', ') || state?.errors?.description?.join(', ')}</div> )}
        </div>

        {/* Product Price */}
        <div className="mb-6">
          <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700">Price (ZAR)</label>
          <div className="relative">
            <input id="price" name="price" type="number" step="0.01" placeholder="e.g., 150.99"
              className="peer block w-full rounded-md border-gray-300 py-2.5 pl-10 text-sm shadow-sm focus:border-easytrade-blue focus:ring-1 focus:ring-easytrade-blue placeholder:text-gray-400"
              aria-describedby="price-error-create" /> {/* Consider adding 'required' if price is mandatory from form */}
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
          </div>
           {(clientErrors.price || state?.errors?.price) && ( <div id="price-error-create" aria-live="polite" className="mt-2 text-sm text-red-600">{clientErrors.price?.join(', ') || state?.errors?.price?.join(', ')}</div> )}
        </div>
        
        {/* Display general API errors or messages from Server Action */}
        {state?.message && !state.success && state.errors?.api && ( // Show API specific errors
          <div aria-live="polite" className="my-3 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            <p className="font-medium">Could not add product:</p>
            <ul className="list-disc list-inside ml-4">
              {state.errors.api.map((error: string) => (<li key={error}>{error}</li>))}
            </ul>
          </div>
        )}
        {/* More general non-field errors from server action */}
        {state?.message && !state.success && !state.errors && (
            <div aria-live="polite" className="my-3 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {state.message}
            </div>
        )}
        {/* Success message */}
        {state?.success && state?.message && (
          <div aria-live="polite" className="my-3 p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {state.message}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Link href="/dashboard/listings" className="flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</Link>
        <button type="submit" disabled={isPending} className="flex h-10 items-center rounded-lg bg-easytrade-blue px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline disabled:opacity-50">
          {isPending ? 'Adding Product...' : 'Add Product'} {/* <<< TEXT UPDATED HERE */}
        </button>
      </div>
    </form>
  );
}
