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

  // --- TEMPORARY SELLER USERNAME ---
  let sellerUsername: string | undefined = "DefaultSeller"; // Assign a default for now

  // Placeholder for future NextAuth.js integration:
  // const session = await auth();
  // if (session?.user?.username) {
  //   sellerUsername = session.user.username;
  // }

  // If, even after trying to get from auth, it's still undefined, use the default
  if (!sellerUsername) {
    console.warn("createListingAction: sellerUsername could not be determined from auth, using default.");
    sellerUsername = "DefaultSeller_Fallback"; // Should ideally not be reached if above default is set
  }
  // --- END TEMPORARY SELLER USERNAME ---

  const payload: ProductApiPayload = {
    name: validationResult.data.name,
    description: validationResult.data.description,
    price: validationResult.data.price!,
    sellerUsername: sellerUsername, // Now uses the default or auth-derived username
  };

  try {
    const createdProduct: Product = await callProductApi('/api/products', 'POST', payload);
    console.log('Product created via API:', createdProduct);
    revalidatePath('/dashboard/listings');
    revalidatePath('/products');
    revalidatePath('/dashboard'); // Revalidate dashboard to update latest listings
    return { message: `Product "${createdProduct.name}" added successfully!`, success: true };
  } catch (e:any) {
    console.error('createListingAction API catch:', e.message);
    return { success: false, message: `API Error: ${e.message}`, errors: { api: [e.message] } };
  }
}

// updateListingAction (ensure sellerUsername is not overwritten if not intended)
export async function updateListingAction(
  productId: string | number,
  prevState: UpdateListingActionState,
  formData: FormData
): Promise<UpdateListingActionState> {
  const rawFormData = { name: formData.get('name'), description: formData.get('description'), price: formData.get('price'), };
  const validationResult = ListingFormSchema.safeParse(rawFormData);
  if (!validationResult.success) { return { errors: validationResult.error.flatten().fieldErrors, message: 'Validation Error.', success: false };}
  
  // For PUT, usually you only send fields that are allowed to be changed.
  // sellerUsername is typically NOT changed during a product update by a user.
  const payload: Partial<ProductApiPayload> = {
    name: validationResult.data.name,
    description: validationResult.data.description,
    ...(validationResult.data.price !== undefined && { price: validationResult.data.price }),
  };

  if (Object.values(payload).every(value => value === undefined || value === null || value === '')) {
    return { message: "No changes detected to update.", success: true };
  }
  // TODO: Add ownership check here using authenticated user session
  try {
    const updatedProduct: Product = await callProductApi(`/api/products/${productId}`, 'PUT', payload);
    revalidatePath('/dashboard/listings');
    revalidatePath(`/dashboard/listings/${productId}/edit`);
    revalidatePath(`/products/${productId}`);
    revalidatePath('/dashboard'); // Revalidate dashboard
    return { message: `Product "${updatedProduct.name}" updated successfully!`, success: true };
  } catch (e:any) { return { success: false, message: `API Error: ${e.message}`, errors: { api: [e.message] } }; }
}

// deleteListingAction
export async function deleteListingAction(id: string | number, prevState?: DeleteListingActionState): Promise<DeleteListingActionState> {
  // TODO: Add ownership check here
  try {
    await callProductApi(`/api/products/${id}`, 'DELETE');
    revalidatePath('/dashboard/listings');
    revalidatePath('/products');
    revalidatePath('/dashboard'); // Revalidate dashboard
    return { success: true, message: `Product ${id} deleted successfully.` };
  } catch (e:any) { return { success: false, message: `API Error: ${e.message}`, errors: { api: [e.message] } }; }
}
