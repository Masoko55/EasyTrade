// /easytrade-ui/src/app/ui/dashboard/cards.tsx
import {
  UsersIcon,
  ShoppingCartIcon, // For active listings in EasyTrade context
  CurrencyDollarIcon,
  // BriefcaseIcon, // Example for total products, or adjust as needed
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const iconMap = {
  users: UsersIcon,
  listings: ShoppingCartIcon, // Changed from 'products' to 'listings' for clarity
  sales: CurrencyDollarIcon, // For a sales metric if you have one
  // If you had 'verifiedUsers' as a type, you'd add UsersIcon here too,
  // or choose a different icon like ShieldCheckIcon
};

// This is the named export that dashboard/page.tsx is looking for
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'users' | 'listings' | 'sales'; // Add other types as you define them
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm"> {/* Basic Tailwind */}
      <div className="flex p-4 items-center"> {/* Added items-center */}
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
