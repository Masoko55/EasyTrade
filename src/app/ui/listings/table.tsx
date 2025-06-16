// /easytrade-ui/src/app/ui/listings/table.tsx
import type { Product } from '@/app/lib/definitions'; // Use definitions.ts for types
import { UpdateListingButton, DeleteListingButton } from './buttons';
import Image from 'next/image';
import Link from 'next/link';
import { montserrat } from '@/app/ui/fonts';

export default function ProductTable({
  products,
}: {
  products: Product[];
}) {
  if (!products || products.length === 0) {
    return null; // Parent component handles "No listings found"
  }

  const showSellerColumn = products.some(product => product.sellerUsername && product.sellerUsername.trim() !== '');

  const isExternalHttpUrl = (url?: string): boolean => {
    return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0 shadow">
          {/* Mobile view - Simplified Card List */}
          <div className="md:hidden">
            {products.map((product) => (
              <div
                key={product.id.toString()}
                className="mb-3 w-full rounded-md bg-white p-4 shadow"
              >
                <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                  <div>
                    <Link href={`/products/${product.id}`} className="block">
                      <h2 className={`${montserrat.className} text-lg font-semibold text-easytrade-blue hover:underline`}>{product.name}</h2>
                    </Link>
                    {/* Mobile Image Handling */}
                    <div className="mt-2 h-24 w-24 relative rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                      {product.imageUrl && !isExternalHttpUrl(product.imageUrl) ? (
                        <Image
                          src={product.imageUrl} // Assumed local path like /img.png
                          alt={product.name}
                          layout="fill" // Use fill if parent has defined dimensions and position:relative
                          objectFit="cover"
                          className="rounded"
                        />
                      ) : product.imageUrl && isExternalHttpUrl(product.imageUrl) ? (
                        <span title={product.imageUrl}>Ext. Img</span> // Placeholder for external
                      ) : (
                        <span>No Img</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <UpdateListingButton id={product.id.toString()} />
                    <DeleteListingButton id={product.id.toString()} listingName={product.name} />
                  </div>
                </div>
                <div className="pt-3">
                  <p className={`${montserrat.className} text-xl font-bold text-easytrade-black`}>
                    R{Number(product.price).toFixed(2)}
                  </p>
                  {showSellerColumn && product.sellerUsername && (
                       <p className="text-xs text-gray-500 mt-1">Seller: {product.sellerUsername}</p>
                  )}
                  {product.description && (
                      <p className="text-xs text-gray-600 mt-1 truncate">{product.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - Table */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-4 font-medium sm:pl-6">Image</th>
                <th scope="col" className="px-3 py-4 font-medium">Name</th>
                <th scope="col" className="px-3 py-4 font-medium">Price</th>
                {showSellerColumn && (
                  <th scope="col" className="px-3 py-4 font-medium">Seller</th>
                )}
                <th scope="col" className="px-3 py-4 font-medium">Created</th>
                <th scope="col" className="relative py-3 pl-6 pr-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id.toString()}
                  className="w-full hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap py-3 pl-4 pr-3 sm:pl-6">
                    {/* Desktop Image Handling */}
                    <div className="flex items-center justify-center h-10 w-10 rounded bg-gray-200 text-xs text-gray-400">
                       {product.imageUrl && !isExternalHttpUrl(product.imageUrl) ? (
                             <Image
                                src={product.imageUrl} // Assumed local, e.g., starts with /
                                className="rounded object-cover h-full w-full" // Ensure image fills the div
                                width={40} // Provide aspect ratio, layout="responsive" or "fill" will handle size
                                height={40}
                                alt={product.name}
                              />
                          ) : product.imageUrl && isExternalHttpUrl(product.imageUrl) ? (
                            <span title={product.imageUrl}>Ext.</span> // Placeholder for external
                          ) : (
                            <span>No Img</span>
                          )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                     <Link href={`/products/${product.id}`} className="font-medium text-easytrade-blue hover:underline">
                        {product.name}
                     </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">R{Number(product.price).toFixed(2)}</td>
                  {showSellerColumn && (
                    <td className="whitespace-nowrap px-3 py-4">{product.sellerUsername || 'N/A'}</td>
                  )}
                  <td className="whitespace-nowrap px-3 py-4">
                     {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end gap-2">
                      <UpdateListingButton id={product.id.toString()} />
                      <DeleteListingButton id={product.id.toString()} listingName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
