// /easytrade-ui/src/app/products/[id]/page.tsx

import { fetchProductById } from '@/app/lib/data-service';
import type { Product } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { montserrat, lusitana } from '@/app/ui/fonts';
import AddToCartButton from '@/app/ui/products/add-to-cart-button'; // Import the button component
import { Metadata, ResolvingMetadata } from 'next';

// This is a Page Component. It receives `params` as a prop.
interface ProductDetailsPageProps {
  params: {
    id: string; // The 'id' from the folder name [id] will be a string
  };
}

// Optional but recommended: Generate dynamic metadata for the page title and description
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
      images: [product.imageUrl || '/default-og-image.png'], // Add a default OG image to your /public folder
    },
  };
}


// This is the main Page component. It's a Server Component by default.
export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const id = parseInt(params.id, 10);

  // Validate that the ID from the URL is a valid number
  if (isNaN(id)) {
    notFound(); // Triggers the not-found.tsx page
  }

  // Fetch the product data on the server using the ID
  const product = await fetchProductById(id);

  // If the API returns null (e.g., for a 404), show the not-found page
  if (!product) {
    notFound();
  }

  // If we reach here, the product was found. Render the page UI.
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Image Column */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="relative aspect-square w-full">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl.startsWith('http') ? product.imageUrl : '/placeholder-product.svg'}
                alt={product.name}
                fill // Use fill to cover the parent container
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-md">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Column */}
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
          
          {/* RENDER THE BUTTON COMPONENT HERE */}
          {/* We pass the fetched 'product' object as a prop to our client component */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <AddToCartButton product={product} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
