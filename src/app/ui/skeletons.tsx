// /easytrade-ui/src/app/ui/skeletons.tsx

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent relative overflow-hidden';

export function LatestListingsSkeleton() {
  return (
    <div
      className="relative flex w-full flex-col overflow-hidden rounded-xl bg-white p-4 shadow-lg md:col-span-4"
    >
      <div className={`${shimmer} mb-4 h-7 w-48 rounded-md bg-gray-200`} />
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-3 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`${shimmer} flex flex-row items-center justify-between rounded-md bg-white p-3 shadow-sm`}>
            <div className="flex items-center flex-1 min-w-0">
              <div className="mr-3 h-12 w-12 rounded-md bg-gray-200 shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-5 w-3/4 rounded-md bg-gray-200" />
                <div className="h-4 w-1/2 rounded-md bg-gray-200" />
              </div>
            </div>
            <div className="h-5 w-16 rounded-md bg-gray-200 ml-2 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div className={`${shimmer} mb-8 h-9 w-64 rounded-md bg-gray-200`} />
      <div className="mb-10">
        <div className={`${shimmer} mb-4 h-7 w-40 rounded-md bg-gray-200`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${shimmer} h-28 rounded-lg bg-gray-200 p-6`}>
                <div className="h-5 w-3/5 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-4/5 bg-gray-300 rounded"></div>
            </div>
        ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <LatestListingsSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-200 last-of-type:border-none">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className={`${shimmer} flex items-center gap-3`}>
          <div className="h-10 w-10 rounded-md bg-gray-200"></div>
          <div className="h-5 w-32 rounded-md bg-gray-200"></div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4">
        <div className={`${shimmer} h-5 w-16 rounded-md bg-gray-200`}></div>
      </td>
      <td className="whitespace-nowrap px-3 py-4">
        <div className={`${shimmer} h-5 w-24 rounded-md bg-gray-200`}></div>
      </td>
      <td className="whitespace-nowrap px-3 py-4">
        <div className={`${shimmer} h-5 w-20 rounded-md bg-gray-200`}></div>
      </td>
      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex justify-end gap-2">
          <div className={`${shimmer} h-8 w-8 rounded-md bg-gray-200`}></div>
          <div className={`${shimmer} h-8 w-8 rounded-md bg-gray-200`}></div>
        </div>
      </td>
    </tr>
  );
}

export function ProductTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 pt-0 shadow">
          <div className="md:hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`${shimmer} mb-3 w-full rounded-md bg-white p-4 shadow`}>
                <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                    <div>
                        <div className="h-10 w-10 rounded-md bg-gray-200 mb-2"></div>
                        <div className="h-5 w-3/5 rounded-md bg-gray-200"></div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="h-7 w-7 rounded-md bg-gray-200"></div>
                        <div className="h-7 w-7 rounded-md bg-gray-200"></div>
                    </div>
                </div>
                <div className="pt-3 space-y-1.5">
                    <div className="h-6 w-20 rounded-md bg-gray-200"></div>
                    <div className="h-4 w-24 rounded-md bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Image & Name</th>
                <th scope="col" className="px-3 py-5 font-medium">Price</th>
                <th scope="col" className="px-3 py-5 font-medium">Seller</th>
                <th scope="col" className="px-3 py-5 font-medium">Date Listed</th>
                <th scope="col" className="relative py-3 pl-6 pr-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
