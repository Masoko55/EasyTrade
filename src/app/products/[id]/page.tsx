// Conceptual button for a product detail page (e.g., src/app/products/[id]/page.tsx)
'use client';
import { useCart } from '@/app/context/CartContext';
import { Product } from '@/app/lib/definitions';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';

interface AddToCartButtonProps {
  product: Product; // The product to add
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1); // For quantity selector if needed

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${product.name} (x${quantity}) added to cart!`);
  };

  return (
    <div className="mt-6">
      {/* Optional: Quantity Selector 
      <div className="flex items-center mb-4">
        <label htmlFor="quantity" className="mr-2 font-medium text-gray-700">Quantity:</label>
        <input 
          type="number" 
          id="quantity" 
          name="quantity" 
          min="1" 
          value={quantity} 
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          className="w-16 p-2 border border-gray-300 rounded-md text-center"
        />
      </div>
      */}
      <button
        onClick={handleAddToCart}
        className="w-full flex items-center justify-center rounded-md border border-transparent bg-easytrade-blue px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-easytrade-blue focus:ring-offset-2 transition-colors"
      >
        <ShoppingBagIcon className="h-5 w-5 mr-2"/> Add to Cart
      </button>
    </div>
  );
}
