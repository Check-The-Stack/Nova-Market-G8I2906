"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../common/Logo";

export const Navbar: React.FC = () => {
  const { cartItemsCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Original de Figma */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>

          {/* Search Bar - Figma Pill Shape */}
          <div className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar"
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border-0 rounded-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Navigation & Action Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-700">
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Productos
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Nosotros
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                  {user?.name}
                </span>
                {user?.role === "admin" && (
                  <Link href="/admin" className="text-xs text-blue-600 hover:underline font-semibold">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-red-600 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-blue-600 transition-colors">
                Inicias sesion
              </Link>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-1.5 text-slate-700 hover:text-blue-600 transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 shrink-0" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Icon */}
            <Link href="/login" className="p-1.5 text-slate-700 hover:text-blue-600 transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 shrink-0" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <Link href="/cart" className="relative p-1.5 text-slate-700">
              <svg className="w-6 h-6 shrink-0" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6 shrink-0" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Mobile Search & Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-4 space-y-3">
          <div className="relative sm:hidden">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none"
            />
          </div>
          <Link href="/products" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-700 py-1.5">
            Productos
          </Link>
          <Link href="#" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-700 py-1.5">
            Nosotros
          </Link>
          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{user?.name}</span>
              <button onClick={logout} className="text-xs text-red-600 font-semibold">Cerrar sesión</button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-blue-600 py-1.5">
              Inicias sesion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
