"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";

interface FavoritesContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("novamarket_favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing stored favorites:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("novamarket_favorites", JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId);
  };

  const addFavorite = (product: Product) => {
    if (!isFavorite(product.id)) {
      setFavorites((prev) => [...prev, product]);
    }
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
