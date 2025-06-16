// /easytrade-ui/src/app/cart/page.tsx
'use client';

import React, { useEffect, useState } from 'react'; // <<< ADDED React and useEffect, useState to import
import { useCart, type CartItem } from '@/app/context/CartContext'; // type CartItem if needed
import Image from 'next/image';
import Link from 'next/link';
import { montserrat, lusitana } from '@/app/ui/fonts';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'; // Added ShoppingCartIcon

// Client components can't export metadata object directly.
// Setting document.title via useEffect is a common way for client pages.

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, itemCount, cartTotal, clearCart } = useCart();

  useEffect(() => {
    document.title = "Your Shopping Cart - EasyTrade";
  }, []); // Empty dependency array means this runs once on mount

  if (!cartItems || itemCount === 0) { // Check !cartItems as well for initial state before hydration
    return (
      <div className="container mx-auto px-4 py-12 text-center"> {/* Increased py */}
        <ShoppingCartIcon className="mx-auto h-20 w-20 text-gray-300 mb-6" /> {/* Larger Icon */}
        <h1 className={`${montserrat.className} text-2xl md:text-3xl font-semibold mb-4 text-easytrade-black`}>Your Shopping Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any amazing finds yet.</p>
        <Link
          href="/products"
          className="inline-block bg-easytrade-blue text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 text-lg shadow hover:shadow-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`${montserrat.className} text-2xl md:text-3xl font-semibold mb-8 text-easytrade-black`}>Your Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"> {/* items-start for alignment */}
        {/* Cart Items List */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-lg p-6 space-y-6"> {/* Enhanced shadow and padding */}
          {cartItems.map((item: CartItem) => (
            <div key={item.id.toString()} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-4 w-full sm:w-auto shrink-0"> {/* shrink-0 for image part */}
                <Link href={`/products/${item.id}`} className="block">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl.startsWith('http') ? item.imageUrl : '/placeholder-product.svg'} alt={item.name} width={80} height={80} className="rounded-md object-cover border" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs border">No Image</div>
                  )}
                </Link>
                <div className="flex-grow sm:hidden"> {/* Item details for mobile, next to image if space allows */}
                  <Link href={`/products/${item.id}`} className="hover:text-easytrade-blue">
                    <h2 className={`${montserrat.className} text-md font-medium text-easytrade-black line-clamp-2`}>{item.name}</h2>
                  </Link>
                  <p className="text-xs text-gray-500">Seller: {item.sellerUsername || 'N/A'}</p>
                </div>
              </div>

              <div className="hidden sm:block flex-grow min-w-0"> {/* Item details for desktop */}
                 <Link href={`/products/${item.id}`} className="hover:text-easytrade-blue">
                    <h2 className={`${montserrat.className} text-md sm:text-lg font-medium text-easytrade-black line-clamp-2`}>{item.name}</h2>
                  </Link>
                  <p className="text-xs text-gray-500">Seller: {item.sellerUsername || 'N/A'}</p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                 <p className={`${lusitana.className} text-md sm:text-lg font-semibold text-easytrade-black w-full sm:w-24 text-left sm:text-right mb-2 sm:mb-0`}>
                  R{(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="flex items-center border border-gray-300 rounded-md self-start sm:self-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1.5 text-gray-700 disabled:text-gray-300 hover:bg-gray-100 rounded-l-md focus:outline-none focus:ring-1 focus:ring-easytrade-blue"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <input
                    type="number" // Consider type="text" and inputMode="numeric" for better mobile UX
                    value={item.quantity}
                    onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) updateQuantity(item.id, Math.max(1, val)); // Ensure at least 1
                    }}
                    className="w-12 text-center border-l border-r border-gray-300 py-1.5 text-sm focus:outline-none focus:ring-0 appearance-none [-moz-appearance:textfield]" // Hide number spinners
                    min="1"
                    aria-label="Item quantity"
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-r-md focus:outline-none focus:ring-1 focus:ring-easytrade-blue"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center self-start sm:self-auto"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
           {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 hover:underline mt-4 self-start font-medium"
            >
              Clear Entire Cart
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-xl rounded-lg p-6 sticky top-24"> {/* Enhanced shadow and padding */}
            <h2 className={`${montserrat.className} text-xl font-semibold text-easytrade-black mb-6 border-b border-gray-200 pb-3`}>Order Summary</h2>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className='font-medium'>R{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span> {/* Placeholder */}
              </div>
            </div>
            <div className="flex justify-between text-easytrade-black font-bold text-lg border-t border-gray-200 pt-4">
              <span>Total Due</span>
              <span>R{cartTotal.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full bg-easytrade-blue text-white text-center font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow hover:shadow-md"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
