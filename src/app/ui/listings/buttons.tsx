// /easytrade-ui/src/app/ui/listings/buttons.tsx
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteListingAction } from '@/app/lib/actions';

export function CreateListingButton() {
  return (
    <Link
      href="/dashboard/listings/create"
      className="flex h-10 items-center rounded-lg bg-easytrade-blue px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-easytrade-blue"
    >
      <span className="hidden md:block">Create Listing</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateListingButton({ id }: { id: string | number }) {
  return (
    <Link
      href={`/dashboard/listings/${id}/edit`}
      className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 transition-colors"
      title="Edit listing"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


// --- THIS IS THE CORRECTED DELETE BUTTON ---
export function DeleteListingButton({ id, listingName }: { id: string | number; listingName?: string }) {
  // We still bind the ID to the original server action
  const deleteListingWithId = deleteListingAction.bind(null, id);

  // This is our new wrapper action that will be passed to the form.
  // It calls the server action but doesn't return its state, satisfying TypeScript.
  const clientAction = async (formData: FormData) => {
    const confirmed = window.confirm(
      listingName
        ? `Are you sure you want to delete "${listingName}"? This action cannot be undone.`
        : `Are you sure you want to delete this listing? This action cannot be undone.`
    );

    if (!confirmed) {
      return; // Stop if the user cancels
    }

    // Call the server action. We can check the result if we want to show an alert.
    const result = await deleteListingWithId(formData);

    if (!result.success) {
      // If the server action returned an error, show it to the user.
      alert(`Error: ${result.message}`);
    }
    // If successful, the `revalidatePath` in the server action will handle refreshing the UI.
    // No need to do anything else here on success.
  };

  return (
    // The form's action is now our new client-side wrapper function.
    <form action={clientAction}>
      <button
        type="submit"
        className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-red-100 hover:text-red-700 transition-colors"
        title={listingName ? `Delete ${listingName}` : 'Delete listing'}
      >
        <span className="sr-only">Delete {listingName || 'listing'}</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
