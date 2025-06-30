// /easytrade-ui/src/app/lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import {
  ListingFormSchema,
  type CreateListingActionState,
  type UpdateListingActionState,
  type DeleteListingActionState,
  type Product,
  type ProductApiPayload,
} from './definitions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// This is a helper function, not exported, to keep API calls consistent.
async function callProductApi(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', body?: any) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
  if (body && (method === 'POST' || method === 'PUT')) { options.body = JSON.stringify(body); }
  console.log(`Server Action API Call: ${method} ${url}`);
  const response = await fetch(url, options);
  if (!response.ok) {
    let errorMsg = `API Server Error (${response.status})`;
    try { const data = await response.json(); errorMsg = data.message || data.error || response.statusText || errorMsg; }
    catch { /* ignore */ }
    console.error("callProductApi error:", errorMsg); throw new Error(errorMsg);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function createListingAction(
  prevState: CreateListingActionState,
  formData: FormData
): Promise<CreateListingActionState> {
  // ... (This function's code remains the same as it's used with useFormState)
  console.log('Server Action: createListingAction invoked.');
  const rawFormData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
  };
  const validationResult = ListingFormSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    console.error('Validation failed (create):', validationResult.error.flatten().fieldErrors);
    return { errors: validationResult.error.flatten().fieldErrors, message: 'Validation Error: Please check input fields.', success: false };
  }
  if (validationResult.data.price === undefined || validationResult.data.price === null) {
     return { errors: { price: ['Price is required.'] }, message: 'Validation Error: Price is missing.', success: false };
  }

  let sellerUsername: string = "DefaultSeller"; // Fallback
  // TODO: Replace with actual session logic
  // const session = await auth();
  // if (session?.user?.username) { sellerUsername = session.user.username; }

  const payload: ProductApiPayload = {
    name: validationResult.data.name,
    description: validationResult.data.description,
    price: validationResult.data.price!,
    sellerUsername: sellerUsername,
  };

  try {
    const createdProduct: Product = await callProductApi('/api/products', 'POST', payload);
    revalidatePath('/dashboard/listings');
    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { message: `Product "${createdProduct.name}" added successfully!`, success: true };
  } catch (e:any) {
    return { success: false, message: `API Error: ${e.message}`, errors: { api: [e.message] } };
  }
}

export async function updateListingAction(
  productId: string | number,
  prevState: UpdateListingActionState,
  formData: FormData
): Promise<UpdateListingActionState> {
  // ... (This function's code remains the same as it's used with useFormState)
  const rawFormData = { name: formData.get('name'), description: formData.get('description'), price: formData.get('price'), };
  const validationResult = ListingFormSchema.safeParse(rawFormData);
  if (!validationResult.success) { return { errors: validationResult.error.flatten().fieldErrors, message: 'Validation Error.', success: false };}
  
  const payload: Partial<ProductApiPayload> = {
    name: validationResult.data.name,
    description: validationResult.data.description,
    ...(validationResult.data.price !== undefined && { price: validationResult.data.price }),
  };

  if (Object.values(payload).every(value => value === undefined || value === null || value === '')) {
    return { message: "No changes detected to update.", success: true };
  }
  
  try {
    const updatedProduct: Product = await callProductApi(`/api/products/${productId}`, 'PUT', payload);
    revalidatePath('/dashboard/listings');
    revalidatePath(`/dashboard/listings/${productId}/edit`);
    revalidatePath(`/products/${productId}`);
    revalidatePath('/dashboard');
    return { message: `Product "${updatedProduct.name}" updated successfully!`, success: true };
  } catch (e:any) { return { success: false, message: `API Error: ${e.message}`, errors: { api: [e.message] } }; }
}


// --- THIS IS THE CORRECTED FUNCTION ---
// The signature is changed to be compatible with a standard form action when using .bind().
// The `formData` parameter comes after any bound arguments.
export async function deleteListingAction(
  id: string | number,
  formData: FormData // This parameter makes the signature compatible with the <form> action prop.
): Promise<DeleteListingActionState> { // We can still return a state object, though we aren't using useFormState here.
  
  // TODO: Add authentication/authorization checks here.
  // For example: get user session, check if user owns product with this 'id'.
  
  console.log(`Server Action: Attempting to delete listing with id: ${id}`);
  // The formData parameter is present to match the expected signature, but we don't need to use its contents.
  console.log('Received form data (unused for delete action):', formData);

  try {
    // The callProductApi helper already handles the fetch logic.
    // The response might be null for a 204 No Content, or a JSON object for other success statuses.
    const result = await callProductApi(`/api/products/${id}`, 'DELETE');
    
    // Revalidate paths to ensure the UI updates and removes the deleted item.
    revalidatePath('/dashboard/listings');
    revalidatePath('/products');
    revalidatePath('/dashboard'); // Revalidate dashboard if it shows latest listings.
    
    console.log(`Server Action: Successfully initiated delete for listing ${id}. Paths revalidated.`);
    // Returning a success state. A client component could potentially handle this, but for now, revalidatePath is key.
    return { success: true, message: (result as any)?.message || `Product ${id} deleted successfully.` };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Server Action Error - deleteListingAction:', errorMessage);
    // Return a state object with the error message.
    return { success: false, message: `API Error: ${errorMessage}`, errors: { api: [errorMessage] } };
  }
}
