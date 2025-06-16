// /easytrade-ui/src/app/dashboard/listings/[id]/edit/page.tsx
'use client';

import EditListingForm from '@/app/ui/listings/edit-form';
import { lusitana, montserrat } from '@/app/ui/fonts';
import { fetchProductById } from '@/app/lib/data-service'; // CORRECTED IMPORT
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Product } from '@/app/lib/definitions'; // CORRECTED IMPORT
import Link from 'next/link';

export default function Page() {
  const params = useParams();
  const id = params.id as string; // id will be string from URL

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      // Convert string ID from URL to number if your fetchProductById expects number
      const productIdNumber = parseInt(id, 10);
      if (isNaN(productIdNumber)) {
          setError("Invalid product ID format.");
          setIsLoading(false);
          setProduct(null);
          return;
      }

      fetchProductById(productIdNumber) // Use the function from data-service
        .then(data => {
          if (data) {
            setProduct(data);
          } else {
            setError(`Product with ID ${id} not found.`);
            setProduct(null);
          }
        })
        .catch(err => {
          console.error("Error fetching product for edit:", err);
          setError(err.message || "Failed to load product data.");
          setProduct(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError("No product ID provided.");
      setIsLoading(false);
      setProduct(null);
    }
  }, [id]);

  if (isLoading) {
    return <div className={`${montserrat.className} p-6 text-center`}>Loading product details...</div>;
  }

  if (error) {
    return <div className={`${montserrat.className} p-6 text-center text-red-600`}>Error: {error}</div>;
  }
  
  if (!product) {
    return (
      <div className={`${montserrat.className} p-6 text-center`}>
        Product not found. <Link href="/dashboard/listings" className="text-easytrade-blue hover:underline">Go back to listings.</Link>
      </div>
     );
  }

  return (
    <main className="p-4 md:p-6">
      <h1 className={`${lusitana.className} mb-6 text-xl font-semibold md:text-2xl text-easytrade-black`}>
        Edit Product Listing: <span className="text-easytrade-blue">{product.name}</span>
      </h1>
      <EditListingForm product={product} />
    </main>
  );
}
