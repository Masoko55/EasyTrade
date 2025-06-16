// /easytrade-ui/src/app/ui/listings/edit-form.tsx
'use client';

import { useEffect, useState, FormEvent, useTransition } from 'react'; // Added useTransition
import { useFormState } from 'react-dom'; // CHANGED: useFormState from react-dom
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CurrencyDollarIcon, ClipboardDocumentListIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { updateListingAction } from '@/app/lib/actions';
import { type Product, type UpdateListingActionState } from '@/app/lib/definitions';

interface EditListingFormProps {
  product: Product;
}

const initialFormState: UpdateListingActionState = { message: null, errors: {}, success: false };

export default function EditListingForm({ product }: EditListingFormProps) {
  const router = useRouter();
  
  // Prepare the action with the product ID pre-bound
  const updateListingActionWithId = updateListingAction.bind(null, product.id);

  // useFormState for managing form submission state with Server Actions
  const [formState, formAction] = useFormState(updateListingActionWithId, initialFormState);
  
  // useTransition for pending state if not provided by useFormState (it isn't)
  const [isPending, startTransition] = useTransition();

  // Local state for controlled inputs, initialized from `product` prop
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price.toString()); // Input type="number" still takes string

  // Effect to reset form fields if the product prop changes (e.g., navigating between edit pages)
  useEffect(() => {
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price.toString());
  }, [product]);

  // Effect to handle successful submission or display API errors from formState
  useEffect(() => {
    if (formState?.success && formState.message) {
      // Optionally show a success message before redirecting
      alert(formState.message); // Or use a toast notification
      router.push('/dashboard/listings'); // Redirect to listings page
      router.refresh(); // Force a refresh to get new data
    }
    // Errors are displayed directly from formState.errors in the JSX
  }, [formState, router]);


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default browser submission
    const formData = new FormData(event.currentTarget); // Get form data
    startTransition(() => {
      formAction(formData); // Call the Server Action wrapped in startTransition
    });
  };

  return (
    // We don't use action={formAction} directly on the form when using startTransition
    // Instead, we call formAction(formData) inside our onSubmit handler.
    // However, for progressive enhancement, it's good to keep it.
    // For this client-side focused form with startTransition, we'll manage submission manually.
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 shadow">
        {/* ID is part of the bound action, not needed as hidden input with this pattern, but harmless */}
        {/* <input type="hidden" name="id" value={product.id.toString()} /> */}
        
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">Product Name / Title</label>
          <div className="relative">
            <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus:border-easytrade-blue focus:ring-easytrade-blue"
              aria-describedby="name-error-edit" />
            <ClipboardDocumentListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
          </div>
          {formState?.errors?.name && <div id="name-error-edit" aria-live="polite" className="mt-2 text-sm text-red-500">{formState.errors.name.join(', ')}</div>}
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900">Description (Optional)</label>
          <div className="relative">
            <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus:border-easytrade-blue focus:ring-easytrade-blue"
              aria-describedby="description-error-edit" />
            <InformationCircleIcon className="pointer-events-none absolute left-3 top-[18px] h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
          </div>
          {formState?.errors?.description && <div id="description-error-edit" aria-live="polite" className="mt-2 text-sm text-red-500">{formState.errors.description.join(', ')}</div>}
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-900">Price (ZAR)</label>
          <div className="relative">
            <input id="price" name="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 focus:border-easytrade-blue focus:ring-easytrade-blue"
              aria-describedby="price-error-edit" />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-easytrade-blue" />
          </div>
          {formState?.errors?.price && <div id="price-error-edit" aria-live="polite" className="mt-2 text-sm text-red-500">{formState.errors.price.join(', ')}</div>}
        </div>

        {/* Display general API errors or server messages */}
        {formState?.errors?.api && (
          <div aria-live="polite" className="my-2 text-sm text-red-500">
            {formState.errors.api.map((error: string) => (<p key={error}>{error}</p>))}
          </div>
        )}
        {/* Display success message ONLY if no API errors and success is true */}
        {formState?.success && formState?.message && !formState?.errors?.api && (
          <div aria-live="polite" className="my-2 text-sm text-green-600">
            {formState.message}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/listings" className="flex h-10 items-center rounded-lg bg-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300">Cancel</Link>
        <button type="submit" disabled={isPending} className="flex h-10 items-center rounded-lg bg-easytrade-blue px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline disabled:opacity-50">
          {isPending ? 'Updating...' : 'Update Listing'}
        </button>
      </div>
    </form>
  );
}
