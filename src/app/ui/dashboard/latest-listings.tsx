// /easytrade-ui/src/app/ui/dashboard/latest-listings.tsx
import { montserrat, lusitana } from '@/app/ui/fonts';
import type { Product } from '@/app/lib/definitions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowPathIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function LatestListings({
  latestProducts,
}: {
  latestProducts: Product[];
}) {
  if (!latestProducts || latestProducts.length === 0) {
    return (
      <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-lg md:col-span-4">
        <h2 className={`${montserrat.className} mb-4 text-xl font-semibold md:text-2xl text-easytrade-black`}>
          Your Latest Listings
        </h2>
        <div className="flex grow items-center justify-center rounded-xl bg-gray-50 p-6">
          <div className="text-center">
            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">
              You haven't listed any products yet.
            </p>
            <Link href="/dashboard/listings/create" className="mt-2 inline-block text-easytrade-blue hover:underline font-medium">
              Create your first listing!
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-lg md:col-span-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`${montserrat.className} text-xl font-semibold md:text-2xl text-easytrade-black`}>
          Your Latest Listings
        </h2>
        <Link href="/dashboard/listings" className="text-sm text-easytrade-blue hover:underline flex items-center">
            View All <ArrowPathIcon className="ml-1 h-4 w-4"/>
        </Link>
      </div>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-2 space-y-2.5">
        {latestProducts.map((product) => (
            <div
              key={product.id.toString()}
              className='flex flex-row items-center justify-between rounded-md bg-white p-3 shadow-sm hover:shadow-md transition-shadow'
            >
              <div className="flex items-center flex-1 min-w-0">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl.startsWith('http') ? product.imageUrl : '/placeholder-product.svg'}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="mr-3 rounded-md object-cover shrink-0"
                    />
                ) : (
                    <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 shrink-0">
                        <BuildingStorefrontIcon className="h-6 w-6 text-gray-400" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${product.id}`} className="block hover:text-easytrade-blue">
                    <p className={`${montserrat.className} truncate text-sm font-semibold text-easytrade-black`}>
                      {product.name}
                    </p>
                  </Link>
                  <p className="text-xs text-gray-500">
                    Listed: {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
              </div>
              <p className={`${lusitana.className} truncate text-sm font-medium md:text-base text-easytrade-black ml-2 shrink-0`}>
                R{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

