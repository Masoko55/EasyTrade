// /easytrade-ui/src/app/products/[id]/page.tsx

import { fetchProductById } from '@/app/lib/data-service';
import type { Product } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { montserrat, lusitana } from '@/app/ui/fonts';
import AddToCartButton from '@/app/ui/products/add-to-cart-button';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link'; // <--- THIS IS THE FIX

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: ProductDetailsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return { title: 'Invalid Product | EasyTrade' };
  }
  const product = await fetchProductById(id);

  if (!product) {
    return { title: 'Product Not Found | EasyTrade' };
  }

  return {
    title: `${product.name} | EasyTrade`,
    description: product.description || `Buy ${product.name} on EasyTrade.`,
    openGraph: {
      images: [product.imageUrl || '/default-og-image.png'],
    },
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="relative aspect-square w-full">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl.startsWith('http') ? product.imageUrl : '/placeholder-product.svg'}
                alt={product.name}
                fill
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-md">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className={`${montserrat.className} text-3xl md:text-4xl font-extrabold text-easytrade-black mb-2`}>
            {product.name}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Sold by: <Link href={`/sellers/${product.sellerUsername}`} className="font-medium text-easytrade-blue hover:underline">{product.sellerUsername || 'EasyTrade Seller'}</Link>
          </p>
          <p className={`${lusitana.className} text-4xl font-bold text-easytrade-black mb-6`}>
            R{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
          </p>
          <div className="prose prose-sm max-w-none text-gray-700 mb-6">
            <h2 className={`${montserrat.className} text-lg font-semibold mb-2`}>Description</h2>
            <p>{product.description || 'No description provided for this item.'}</p>
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-200">
            <AddToCartButton product={product} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
