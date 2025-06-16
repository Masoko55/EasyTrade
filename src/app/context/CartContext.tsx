// /easytrade-ui/src/app/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/app/lib/definitions'; // Assuming Product type is in definitions

export interface CartItem extends Product { // Extends Product, adds quantity
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('easytrade_cart');
    try {
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  }
  return [];
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  useEffect(() => {
    // Persist cart to localStorage whenever it changes
    if (typeof window !== 'undefined') {
        localStorage.setItem('easytrade_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    console.log(`Added to cart: ${product.name}, Quantity: ${quantity}`);
  };

  const removeFromCart = (productId: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    console.log(`Removed from cart, ID: ${productId}`);
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item // Ensure quantity isn't negative
      ).filter(item => item.quantity > 0) // Remove if quantity becomes 0
    );
    console.log(`Updated quantity for ID: ${productId} to ${quantity}`);
  };

  const clearCart = () => {
    setCartItems([]);
    console.log('Cart cleared');
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
