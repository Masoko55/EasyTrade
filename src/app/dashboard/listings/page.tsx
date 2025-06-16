// /easytrade-ui/src/app/dashboard/listings/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { lusitana, montserrat } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import ProductTable from '@/app/ui/listings/table';
import Pagination from '@/app/ui/listings/pagination';
import { CreateListingButton } from '@/app/ui/listings/buttons';
import { ProductTableSkeleton } from '@/app/ui/skeletons';
// CORRECTED IMPORT NAME: Use fetchAllProductsPaginated
import { fetchAllProductsPaginated } from '@/app/lib/data-service';
import type { Product } from '@/app/lib/definitions';

const ITEMS_PER_PAGE = 6;

function ListingsPageContent() {
  const searchParamsHook = useSearchParams();
  const query = searchParamsHook.get('query') || '';
  const currentPage = Number(searchParamsHook.get('page')) || 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Use the correctly imported function name
    fetchAllProductsPaginated(query, currentPage, ITEMS_PER_PAGE)
      .then(data => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setError(err.message || "Could not load products.");
        setProducts([]);
        setTotalPages(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, currentPage]);

  const displayProducts = products;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className={`${montserrat.className} text-2xl font-bold text-easytrade-black`}>My Product Listings</h1>
        <CreateListingButton />
      </div>

      <div className="mb-4 md:mb-8">
        <Search placeholder="Search your listings..." />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative my-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {isLoading ? (
        <ProductTableSkeleton />
      ) : displayProducts && displayProducts.length > 0 ? (
        <ProductTable products={displayProducts} />
      ) : (
        !error && <p className="mt-6 text-center text-gray-500 py-10">You haven't listed any products yet, or no listings match your search.</p>
      )}
      
      <div className="mt-5 flex w-full justify-center">
        {totalPages > 1 && <Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}

export default function Page() {
  // Metadata should be defined in a parent server component or layout for client components
  return (
    <Suspense fallback={<div className="w-full"><ProductTableSkeleton /><div className="h-12"></div></div>}>
      <ListingsPageContent />
    </Suspense>
  );
}
