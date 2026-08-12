"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";
import { FavoritesProvider } from "../../context/FavoritesContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SupportBubble } from "../support/SupportBubble";
import { CookieBanner } from "../common/CookieBanner";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="flex-grow flex flex-col">{children}</main>
            {!isAdminPage && <Footer />}
            {!isAdminPage && <SupportBubble />}
            {!isAdminPage && <CookieBanner />}
          </div>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};
