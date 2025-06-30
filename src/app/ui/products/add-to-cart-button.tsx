// /easytrade-ui/src/app/ui/products/add-to-cart-button.tsx
'use client';

import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import type { Product } from '@/app/lib/definitions';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { useState } from 'react'; // Added missing import for useState
import { useRouter, usePathname } from 'next/navigation';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, cartItems } = useCart();
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const currentPath = usePathname();

  const [added, setAdded] = useState(false);

  const itemInCart = cartItems.find(item => item.id === product.id);

  const handleAddToCart = () => {
    if (authIsLoading) return;

    if (!user) {
      // Redirect to login, passing current product page as callback
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    addToCart(product, 1); // Add 1 quantity by default
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset 'Added!' text after 2 seconds
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={authIsLoading || (!!itemInCart && itemInCart.quantity > 0)}
      className={`w-full flex items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white shadow-sm transition-colors duration-150
                  ${(!!itemInCart && itemInCart.quantity > 0)
                    ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed'
                    : 'bg-easytrade-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-easytrade-blue focus:ring-offset-2'}`}
    >
      <ShoppingBagIcon className="h-5 w-5 mr-2"/>
      {authIsLoading ? 'Loading...' : ((!!itemInCart && itemInCart.quantity > 0) ? 'In Cart' : (added ? 'Added!' : 'Add to Cart'))}
    </button>
  );
}
