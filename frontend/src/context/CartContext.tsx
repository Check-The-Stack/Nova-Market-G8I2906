"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("novamarket_cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing stored cart:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("novamarket_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addItem = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const newQuantity = newItems[existingItemIndex].quantity + quantity;
        // Limitar la cantidad al stock disponible si corresponde
        newItems[existingItemIndex].quantity = Math.min(newQuantity, product.stock);
        return newItems;
      } else {
        return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  };

  const removeItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
