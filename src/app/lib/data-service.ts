// /easytrade-ui/src/app/lib/data-service.ts
import type { Product, User, UserDashboardSummary } from './definitions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Generic fetchAPI (keep as is, from your previous correct version)
export async function fetchAPI<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: any | null = null,
  token: string | null = null // For authenticated requests
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = { method, headers: { 'Content-Type': 'application/json', } };
  if (token && options.headers) { (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`; }
  if (body && (method === 'POST' || method === 'PUT')) { options.body = JSON.stringify(body); }
  console.log(`DataService: ${method} ${url}`);
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); }
      catch (e) { const errorText = await response.text(); throw new Error(errorText || `API request failed: ${response.status}`); }
      throw new Error(errorData.error || errorData.message || `API request failed: ${response.status}`);
    }
    if (response.status === 204) return null as T;
    return await response.json() as T;
  } catch (error) { console.error(`DataService Error: ${method} ${url}`, error); throw error; }
}

// --- Product Related Fetch Functions ---
export async function fetchAllProductsPaginated(query: string, currentPage: number, itemsPerPage: number = 6): Promise<{ products: Product[]; totalPages: number }> {
    const apiPage = currentPage - 1;
    const endpoint = `/api/products?search=${encodeURIComponent(query)}&page=${apiPage}&size=${itemsPerPage}&sort=createdAt,desc`;
    try {
        const pageData = await fetchAPI<{content: Product[], totalPages: number}>(endpoint);
        return { products: pageData.content || [], totalPages: pageData.totalPages || 0 };
    } catch (error) {
        console.error('Error in fetchAllProductsPaginated:', error);
        return { products: [], totalPages: 0 }; // Graceful degradation
    }
}

export async function fetchProductById(id: string | number): Promise<Product | null> {
    try { return await fetchAPI<Product>(`/api/products/${id}`); }
    catch (error: any) {
        if (error.message?.includes('404') || error.message?.toLowerCase().includes('not found')) return null;
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
}

// Fetches latest products globally (not user-specific yet without auth context here)
export async function fetchLatestProductsForDashboard(limit: number = 5): Promise<Product[]> {
  const endpoint = `/api/products?page=0&size=${limit}&sort=createdAt,desc`;
  try {
    const pageData = await fetchAPI<{content: Product[]}>(endpoint);
    return pageData.content || [];
  } catch (error) {
    console.error("Error fetching latest products for dashboard:", error);
    return [];
  }
}

// Example: Fetching LATEST listings for a SPECIFIC user (requires knowing the user)
// This would be called from a Server Component that has access to the user's session
export async function fetchUserLatestListings(username: string, limit: number = 5): Promise<Product[]> {
    // Your backend needs an endpoint like: /api/products?sellerUsername={username}&page=0&size={limit}&sort=createdAt,desc
    const endpoint = `/api/products?sellerUsername=${encodeURIComponent(username)}&page=0&size=${limit}&sort=createdAt,desc`;
    try {
        const pageData = await fetchAPI<{content: Product[]}>(endpoint);
        return pageData.content || [];
    } catch (error) {
        console.error(`Error fetching latest listings for user ${username}:`, error);
        return [];
    }
}


// --- User Related Fetch Functions ---
export async function fetchUserProfile(userId: string | number, token?: string): Promise<User | null> {
    try { return await fetchAPI<User>(`/api/users/${userId}`, 'GET', null, token); }
    catch (error: any) {
        if (error.message?.includes('404') || error.message?.toLowerCase().includes('not found')) return null;
        console.error(`Error fetching user profile for ${userId}:`, error);
        throw error;
    }
}

// Example function to get basic dashboard info for the LOGGED IN USER
// This would require server-side authentication context (e.g., from NextAuth.js)
export async function fetchUserDashboardSummary(
    // In a real app, this would take an auth token or use a server session
    // For now, let's assume we pass a username if known
    username?: string
): Promise<UserDashboardSummary> {
    if (!username) {
        // Fallback if no user context is available yet on the server
        return { username: "Guest", activeListingsCount: 0 };
    }
    // TODO: Call an API endpoint like /api/users/{username}/dashboard-summary
    // This endpoint would return the user's name and their active listing count
    console.log(`DataService: Fetching dashboard summary for ${username} (simulated)...`);
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
        username: username, // Use the provided username
        activeListingsCount: Math.floor(Math.random() * 10), // Replace with actual API data
    };
}
