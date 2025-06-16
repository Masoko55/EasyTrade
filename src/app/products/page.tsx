// /easytrade-ui/src/app/products/page.tsx
'use client'; // This directive MUST be the very first line of the file

import React, { useState, useEffect, Suspense } from 'react'; // Explicitly import React if using JSX spread etc.
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { montserrat, lusitana } from '@/app/ui/fonts'; // Ensure Lusitana is exported from fonts.ts if used
import type { Product } from '@/app/lib/definitions';
import { fetchAllProductsPaginated } from '@/app/lib/data-service';
import AddToCartButton from '@/app/ui/products/add-to-cart-button'; // Verify this path
import { ShoppingCartIcon } from '@heroicons/react/24/outline'; // Used as placeholder icon

// --- Product Card Skeleton ---
const ProductCardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
    <div className="bg-gray-300 dark:bg-gray-600 aspect-square w-full rounded-md mb-3"></div> {/* Used aspect-square */}
    <div className="h-5 bg-gray-300 dark:bg-gray-500 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-1/2 mb-3"></div>
    <div className="h-10 bg-gray-300 dark:bg-gray-500 rounded w-full"></div> {/* Button placeholder */}
  </div>
);
// --- End Product Card Skeleton ---

const ITEMS_PER_PAGE = 12; // Number of products to display per page

function ProductsPageContent() {
    const searchParams = useSearchParams(); // Renamed for clarity
    const query = searchParams.get('query') || '';
    const currentPage = Number(searchParams.get('page')) || 1;

    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Browse All Products - EasyTrade"; // Set page title
        
        const loadProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchAllProductsPaginated(query, currentPage, ITEMS_PER_PAGE);
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (err: any) { // Catch 'any' and then check instanceof Error
                console.error("Failed to fetch products for /products page:", err);
                setError(err.message || "Could not load products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        loadProducts();
    }, [query, currentPage]); // Re-fetch when query or currentPage changes

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10"><p className="text-red-600 bg-red-100 p-4 rounded-md">Error loading products: {error}</p></div>;
    }
    if (products.length === 0) {
        return <div className="text-center py-10"><p className="text-gray-600 dark:text-gray-400">No products found matching your criteria. Try adjusting your search or check back soon!</p></div>;
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((product) => (
                <div key={product.id.toString()} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden group">
                    <Link href={`/products/${product.id}`} className="block relative aspect-square w-full overflow-hidden">
                        {product.imageUrl ? (
                            <Image 
                                src={product.imageUrl.startsWith('http') ? product.imageUrl : '/placeholder-product.svg'} 
                                alt={product.name} 
                                layout="fill"
                                objectFit="cover" 
                                className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <ShoppingCartIcon className="h-20 w-20 text-gray-300 dark:text-gray-500"/>
                            </div>
                        )}
                    </Link>
                    <div className="p-5 flex flex-col flex-grow"> {/* Increased padding */}
                        <h3 className={`${montserrat.className} text-lg font-semibold mb-1 text-easytrade-black dark:text-white truncate group-hover:text-easytrade-blue transition-colors`}>
                            <Link href={`/products/${product.id}`}>{product.name}</Link>
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Sold by: <span className="font-medium text-gray-700 dark:text-gray-300">{product.sellerUsername || 'EasyTrade Seller'}</span>
                        </p>
                        <p className={`${lusitana.className} text-xl font-bold text-easytrade-black dark:text-white mb-4`}>
                            R{typeof product.price === 'number' ? product.price.toFixed(2) : 'Price not available'}
                        </p>
                        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700"> {/* Pushes button to bottom */}
                            <AddToCartButton product={product} />
                        </div>
                    </div>
                </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                    {/* TODO: Implement actual Pagination component */}
                    {/* <Pagination totalPages={totalPages} /> */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}. (Full Pagination Coming Soon)
                    </p>
                </div>
            )}
        </>
    );
}

// This is the default export which makes this file a Page for the /products route
export default function ProductsPageWrapper() {
    return (
        // The main layout (src/app/layout.tsx) already provides a container mx-auto.
        // So, we might not need another one here unless for specific centering.
        <div>
             <h1 className={`${montserrat.className} text-3xl md:text-4xl font-extrabold text-easytrade-black dark:text-white mb-8 text-center md:text-left`}>
                Discover Our Products
            </h1>
            {/* Suspense is required because ProductsPageContent uses useSearchParams hook */}
            <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {[...Array(ITEMS_PER_PAGE)].map((_, i) => ( <ProductCardSkeleton key={i} /> ))}
                </div>
            }>
                <ProductsPageContent />
            </Suspense>
        </div>
    );
}
