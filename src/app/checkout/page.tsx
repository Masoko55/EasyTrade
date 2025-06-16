// /easytrade-ui/src/app/checkout/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Added useSearchParams
import Link from 'next/link';
import { montserrat, lusitana } from '@/app/ui/fonts';
import { ShieldCheckIcon, ExclamationTriangleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

// This component will contain the logic that depends on client-side hooks
function CheckoutPageContent() {
  const { cartItems, cartTotal, itemCount, clearCart } = useCart();
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const currentPath = usePathname();
  const searchParams = useSearchParams(); // To read callbackUrl if needed

  const [isClient, setIsClient] = useState(false); // To prevent hydration errors with localStorage access

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', addressLine1: '', addressLine2: '', city: '', postalCode: '', country: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });

  useEffect(() => {
    setIsClient(true); // Component has mounted on client
    document.title = "Secure Checkout - EasyTrade";
  }, []);

  useEffect(() => {
    if (!isClient || authIsLoading) { // Don't do anything until client has mounted and auth is resolved
      return;
    }

    if (!user) {
      console.log("Checkout: User not authenticated, redirecting to login.");
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath + (searchParams.toString() ? `?${searchParams.toString()}` : ''))}`);
    } else if (itemCount === 0) {
      console.log("Checkout: Cart is empty, redirecting to products.");
      alert("Your cart is empty. Let's find something great!");
      router.push('/products');
    }
  }, [user, authIsLoading, itemCount, router, currentPath, searchParams, isClient]);


  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!user) { /* This check is somewhat redundant due to useEffect but good for direct click */ }
    // TODO: Form validation for shipping/payment
    console.log("Placing order with shipping:", shippingInfo, "payment:", paymentInfo);
    alert(`Placeholder: Placing order for ${itemCount} items, total R${cartTotal.toFixed(2)}. Backend integration needed!`);
  };

  // Initial render before client-side effects or if redirecting
  if (!isClient || authIsLoading || (!user && !authIsLoading) || (user && itemCount === 0 && !authIsLoading) ) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-easytrade-blue"></div>
        <p className="mt-4 text-gray-600">Loading secure checkout...</p>
      </div>
    );
  }

  // At this point, user is logged in and cart has items
  return (
    <div className="max-w-4xl mx-auto"> {/* Constrain width */}
      <h1 className={`${montserrat.className} text-2xl md:text-3xl font-semibold mb-8 text-easytrade-black text-center`}>Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className={`${montserrat.className} text-xl font-medium mb-4 text-gray-800`}>Shipping Information</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                {/* Placeholder changed */}
                <input type="text" name="fullName" id="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="Enter full name" />
              </div>
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input type="text" name="addressLine1" id="addressLine1" value={shippingInfo.addressLine1} onChange={handleShippingChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="1234 Main St" />
              </div>
               <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                <input type="text" name="addressLine2" id="addressLine2" value={shippingInfo.addressLine2} onChange={handleShippingChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="Apartment, studio, or floor" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city" value={shippingInfo.city} onChange={handleShippingChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="Anytown" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" name="postalCode" id="postalCode" value={shippingInfo.postalCode} onChange={handleShippingChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="12345" />
                </div>
              </div>
               <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" name="country" id="country" value={shippingInfo.country} onChange={handleShippingChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="Your Country" />
              </div>
            </form>
          </div>

          {/* Payment Details Form Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className={`${montserrat.className} text-xl font-medium mb-4 text-gray-800`}>Payment Details</h2>
            <form className="space-y-4">
                <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Name on Card</label>
                     {/* Placeholder changed */}
                    <input type="text" name="cardName" id="cardName" value={paymentInfo.cardName} onChange={handlePaymentChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="Full name as on card" />
                </div>
                 <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input type="text" name="cardNumber" id="cardNumber" value={paymentInfo.cardNumber} onChange={handlePaymentChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="•••• •••• •••• ••••" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input type="text" name="expiryDate" id="expiryDate" value={paymentInfo.expiryDate} onChange={handlePaymentChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="MM/YY" />
                    </div>
                    <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                        <input type="text" name="cvv" id="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-easytrade-blue focus:border-easytrade-blue sm:text-sm p-2.5" placeholder="•••" />
                    </div>
                </div>
                 <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-1"/> Your payment information is secure.
                </div>
            </form>
          </div>
        </div>

        {/* Order Summary (Right Column) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
            {/* ... (Order summary JSX as before, it was good) ... */}
            <h2 className={`${montserrat.className} text-xl font-medium text-gray-800 mb-6 border-b border-gray-200 pb-3`}>Your Order</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
              {cartItems.map(item => ( <div key={item.id.toString()} className="flex justify-between items-center text-sm py-1"><div><p className="text-gray-800 font-medium line-clamp-1">{item.name}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div><span className="text-gray-700 font-medium">R{(item.price * item.quantity).toFixed(2)}</span></div> ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className='font-medium'>R{cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="text-green-600 font-medium">FREE</span></div>
              <div className="flex justify-between text-lg text-easytrade-black font-semibold mt-2 pt-2 border-t border-gray-300"><span>Total Amount</span><span>R{cartTotal.toFixed(2)}</span></div>
            </div>
            <button onClick={handlePlaceOrder} className="mt-6 w-full bg-easytrade-blue text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-easytrade-blue focus:ring-offset-2 transition duration-300 flex items-center justify-center shadow hover:shadow-md"><ShieldCheckIcon className="h-5 w-5 mr-2" /> Place Order Securely</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export wrapper for Suspense
export default function CheckoutPageWrapper() {
    return (
        <Suspense fallback={ // Fallback for useSearchParams/usePathname
            <div className="flex flex-col justify-center items-center h-80">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-easytrade-blue"></div>
                <p className="mt-4 text-gray-600">Loading checkout details...</p>
            </div>
        }>
            <CheckoutPageContent />
        </Suspense>
    );
}
