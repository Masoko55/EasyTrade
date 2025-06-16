// /easytrade-ui/src/app/ui/listings/pagination.tsx
'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
// import clsx from 'clsx'; // We'll use this later if Tailwind styling is fixed

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate array of page numbers to display
  const getPagesToDisplay = () => {
    if (totalPages <= 1) return [];
    if (totalPages <= 7) { // Show all if 7 or less
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // More complex logic for showing '...' if many pages
    let pages: (number | string)[] = [];
    pages.push(1); // Always show the first page

    let showLeftEllipsis = false;
    let showRightEllipsis = false;

    if (currentPage > 3) {
      showLeftEllipsis = true;
    }
    if (currentPage < totalPages - 2) {
      showRightEllipsis = true;
    }

    if (showLeftEllipsis) {
      pages.push('...');
    }

    // Pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) { // Avoid duplicating 1 and totalPages
        pages.push(i);
      }
    }
    
    if (showRightEllipsis) {
      pages.push('...');
    }
    
    if (totalPages > 1) { // Ensure last page is added if it's not already there
        if (!pages.includes(totalPages)) {
            pages.push(totalPages);
        }
    }
    
    // Remove consecutive '...'
    pages = pages.filter((page, index, self) => {
        return page !== '...' || (page === '...' && self[index -1] !== '...');
    });

    return pages;
  };

  const allPages = getPagesToDisplay();

  if (totalPages <= 1) {
    return null; // Don't render pagination if only one page or less
  }

  return (
    <div className="inline-flex"> {/* Basic styling for container */}
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px"> {/* Basic styling for numbers */}
        {allPages.map((page, index) => {
          return (
            <PaginationNumber
              key={`${page.toString()}-${index}`} // Use toString for key as page can be '...'
              href={createPageURL(page.toString())}
              page={page}
              isActive={currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

// Helper component for individual page numbers
function PaginationNumber({
  page,
  href,
  isActive,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
}) {
  // Basic styling, will look better with Tailwind
  const className = `flex h-10 w-10 items-center justify-center text-sm border ${
    isActive ? 'z-10 bg-blue-500 border-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
  } ${page === '...' ? 'pointer-events-none' : ''}`; // Non-interactive ellipsis

  // Using clsx for conditional classes would be:
  // const className = clsx(
  //   'flex h-10 w-10 items-center justify-center text-sm border',
  //   {
  //     'z-10 bg-blue-600 border-blue-600 text-white': isActive,
  //     'hover:bg-gray-100': !isActive && page !== '...',
  //     'text-gray-300 pointer-events-none': page === '...',
  //   },
  // );

  if (page === '...') {
    return <div className={className}>...</div>;
  }

  return isActive ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

// Helper component for previous/next arrows
function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  // Basic styling
  const className = `flex h-10 w-10 items-center justify-center rounded-md border ${
    isDisabled ? 'pointer-events-none text-gray-300 bg-gray-100' : 'hover:bg-gray-100'
  } ${direction === 'left' ? 'mr-2 md:mr-4' : 'ml-2 md:ml-4'}`;
  
  // const className = clsx(
  //   'flex h-10 w-10 items-center justify-center rounded-md border',
  //   {
  //     'pointer-events-none text-gray-300': isDisabled,
  //     'hover:bg-gray-100': !isDisabled,
  //     'mr-2 md:mr-4': direction === 'left',
  //     'ml-2 md:ml-4': direction === 'right',
  //   },
  // );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
