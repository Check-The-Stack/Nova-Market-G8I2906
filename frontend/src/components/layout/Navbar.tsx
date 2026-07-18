"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export const Navbar: React.FC = () => {
  const { cartItemsCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2 hover:opacity-95 transition-opacity">
              <span className="bg-[#095ce8] text-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
              <span className="text-[#0e1e38] font-bold">Nova</span>
              <span className="text-[#095ce8] font-semibold">Market</span>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-grow max-w-lg relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-[#f4f6fa] border-0 px-4 py-2 pl-9 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white border-transparent focus:border-border transition-all text-sm text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-semibold text-[#505f79] hover:text-[#0e1e38] transition-colors">
              Productos
            </Link>
            <Link href="#" className="text-sm font-semibold text-[#505f79] hover:text-[#0e1e38] transition-colors">
              Nosotros
            </Link>
            
            {/* User Session / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#505f79] font-medium">
                  Hola, <span className="text-[#0e1e38] font-semibold">{user?.name}</span>
                </span>
                {user?.role === "admin" && (
                  <Link href="/admin" className="text-sm font-semibold text-primary hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-xs font-semibold px-2.5 py-1.5 border border-border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive transition-all"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-[#505f79] hover:text-[#0e1e38] transition-colors">
                Iniciar sesión
              </Link>
            )}

            {/* Icons */}
            <div className="flex items-center space-x-4 border-l border-border pl-4">
              {/* Cart Button */}
              <Link href="/cart" className="relative p-2 text-[#0e1e38] hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[#095ce8] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* User Profile Profile Icon */}
              <Link href={isAuthenticated ? "/profile" : "/login"} className="p-2 text-[#0e1e38] hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center md:hidden gap-2">
            <Link href="/cart" className="relative p-2 text-[#0e1e38]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#0e1e38] focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-3">
          {/* Mobile Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-[#f4f6fa] border-0 px-4 py-2 pl-9 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-semibold text-[#505f79] hover:text-[#0e1e38] transition-colors"
            >
              Productos
            </Link>
            <Link
              href="#"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-semibold text-[#505f79] hover:text-[#0e1e38] transition-colors"
            >
              Nosotros
            </Link>
            {isAuthenticated ? (
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-sm text-[#505f79] mb-2">Conectado como <span className="font-semibold text-[#0e1e38]">{user?.name}</span></p>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center bg-destructive/10 text-destructive text-sm font-semibold py-2 rounded-lg hover:bg-destructive/20 transition-all"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm font-semibold text-[#505f79] hover:text-[#0e1e38]"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
