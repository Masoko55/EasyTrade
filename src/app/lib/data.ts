// /easytrade-ui/src/app/lib/data.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Type Definitions based on your API/DB ---

// For a single User (matches your example JSON from earlier)
export type User = {
  id: number;
  name: string;
  surname: string;
  username: string;
  // password will not be fetched/displayed from API for security
  email: string;
  verified: boolean;
  createdAt: string; // Assuming ISO date string format
};

// For a Product/Listing
export type Product = {
  id: string | number; // Use string if UUIDs, number if auto-increment integers
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  sellerUsername?: string; // Optional, as per your preference
  createdAt?: string; // Assuming ISO date string format
  // Add other fields from your 'products' table as needed (e.g., category, stock, condition)
};

// Stats for the dashboard cards
export type DashboardStats = {
  totalUsers: number;
  totalProducts: number;
  verifiedUsers?: number; // Optional if not always available/relevant
  // any other summary stats you might have
};

// For an activity chart (e.g., new users or products per month)
export type ActivityDataPoint = {
  month: string; // Or could be 'date', 'week', etc.
  count: number; // Represents the value for that period
};


// --- Fetching Functions ---

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('Fetching dashboard stats...');
    // MOCK DATA - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const mockStats: DashboardStats = {
      totalUsers: 1, // Based on your current data
      totalProducts: 0, // Assuming 0 for now, or fetch from /api/products
      verifiedUsers: 1, // Assuming your 1 user is verified
    };
    console.log('Dashboard stats fetched (mock).', mockStats);
    return mockStats;
  } catch (error) {
    console.error('API Error - fetchDashboardStats:', error);
    return { totalUsers: 0, totalProducts: 0, verifiedUsers: 0 };
  }
}

export async function fetchRecentActivity(): Promise<ActivityDataPoint[]> {
  try {
    console.log('Fetching recent activity data...');
    // MOCK DATA
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const mockActivity: ActivityDataPoint[] = [
      { month: 'Jan', count: 0 }, { month: 'Feb', count: 0 },
      { month: 'Mar', count: 0 }, { month: 'Apr', count: 1 },
      { month: 'May', count: 0 }, { month: 'Jun', count: 0 },
    ];
    console.log('Recent activity fetched (mock).', mockActivity);
    return mockActivity;
  } catch (error) {
    console.error('API Error - fetchRecentActivity:', error);
    return [];
  }
}

export async function fetchLatestProducts(limit: number = 5): Promise<Product[]> {
  try {
    console.log(`Fetching latest ${limit} products...`);
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const response = await fetch(`${API_BASE_URL}/api/products?limit=${limit}&sort=createdAt,desc`); // Ensure this endpoint exists in your Spring Boot app
    if (!response.ok) {
      if (response.status === 404) {
        console.log('API Info - fetchLatestProducts: No products found (404).');
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Latest products fetched from API.', data);
    // Adjust based on your API's response structure.
    // If it's paginated, it might be data.content. If it's a direct array, just data.
    return Array.isArray(data) ? data : data.content || [];
  } catch (error) {
    console.error('API Error/Network Issue - fetchLatestProducts:', error);
    return [];
  }
}

export async function fetchUserById(id: number): Promise<User | null> {
  try {
    console.log(`Fetching user by ID: ${id}...`);
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`); // Ensure this endpoint exists
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`API Info - fetchUserById: User ${id} not found (404).`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }
    const user: User = await response.json();
    console.log(`User ${id} fetched from API.`, user);
    return user;
  } catch (error) {
    console.error(`API Error/Network Issue - fetchUserById (${id}):`, error);
    return null;
  }
}

// You will also need these functions for the ProductTable on the listings page,
// either defined here and imported, or kept as local mock functions in listings/page.tsx for now.
// It's better to move them here eventually.

export async function fetchFilteredProductsAPI(query: string, currentPage: number, itemsPerPage: number = 6): Promise<{ products: Product[], totalPages: number }> {
  try {
    console.log(`API: Fetching products for query: "${query}", page: ${currentPage}`);
    // Construct your API URL with query parameters for search, pagination (page, size), and sorting
    // Example: /api/products?search=${query}&page=${currentPage - 1}&size=${itemsPerPage}&sort=name,asc
    // The page parameter is often 0-indexed in Spring Pageable, so currentPage - 1
    const response = await fetch(`${API_BASE_URL}/api/products?search=${encodeURIComponent(query)}&page=${currentPage - 1}&size=${itemsPerPage}`);
    if (!response.ok) {
      if (response.status === 404) return { products: [], totalPages: 0 };
      throw new Error(`Failed to fetch filtered products: ${response.statusText}`);
    }
    const pageData = await response.json(); // Assuming Spring Page<Product>
    return {
      products: pageData.content || [],
      totalPages: pageData.totalPages || 0,
    };
  } catch (error) {
    console.error('API Error - fetchFilteredProductsAPI:', error);
    return { products: [], totalPages: 0 };
  }
}
