// /easytrade-ui/src/app/ui/listings/buttons.tsx
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteListingAction } from '@/app/lib/actions'; // Path to your actions.ts

export function CreateListingButton() {
  return (
    <Link
      href="/dashboard/listings/create" // Path for creating a new listing
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
      href={`/dashboard/listings/${id}/edit`} // Path to edit listing page
      className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 transition-colors"
      title="Edit listing"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteListingButton({ id, listingName }: { id: string | number; listingName?: string }) {
  // Bind the 'id' to the Server Action.
  const deleteListingWithId = deleteListingAction.bind(null, id);

  // Client-side confirmation before submitting the form
  const handleSubmitWithConfirmation = async (event: React.FormEvent<HTMLFormElement>) => {
    const message = listingName
      ? `Are you sure you want to delete listing "${listingName}"? This action cannot be undone.`
      : `Are you sure you want to delete this listing? This action cannot be undone.`;

    if (!window.confirm(message)) {
      event.preventDefault(); // Prevent form submission if not confirmed
    }
    // If confirmed, the form will proceed with its default action (submitting to the Server Action)
  };

  return (
    <form action={deleteListingWithId} onSubmit={handleSubmitWithConfirmation} className="inline">
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
