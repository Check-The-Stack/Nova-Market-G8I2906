"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../common/Logo";
import { CartDrawer } from "../cart/CartDrawer";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  const { cartItemsCount, openCart } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Logo />
              {isAdminPage && (
                <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
                  Panel Admin
                </span>
              )}
            </div>

            {/* Search Bar (Only for store views) */}
            {!isAdminPage && (
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden sm:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar laptops, celulares, monitores..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-transparent rounded-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/30 transition-all"
                  />
                </div>
              </form>
            )}

            {/* Navigation & Action Links */}
            <div className="hidden md:flex items-center space-x-5 text-sm font-semibold text-slate-700">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <Link href="/products" className="hover:text-blue-600 transition-colors">
                Catálogo
              </Link>

              {/* Hide Favorites and Cart icons inside Admin pages */}
              {!isAdminPage && (
                <>
                  <Link
                    href="/favorites"
                    className="relative p-2 text-slate-700 hover:text-rose-600 transition-colors flex items-center justify-center rounded-full hover:bg-slate-100"
                    title="Ver Mis Favoritos"
                    aria-label="Mis Favoritos"
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.683a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-2xs">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={openCart}
                    className="relative p-2 text-slate-700 hover:text-blue-600 transition-colors flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
                    aria-label="Ver carrito"
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 000-4z" />
                    </svg>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full badge-pulse shadow-2xs">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* Auth / User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-sm font-bold text-slate-800 hover:text-blue-600 p-1.5 px-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
                  >
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">{user?.name.split(" ")[0]}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in duration-150"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Perfil
                      </Link>

                      <Link
                        href="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.683a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Mis Favoritos ({favoritesCount})
                      </Link>

                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Mis Pedidos y Tracking
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-100"
                        >
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Panel de Admin
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100 cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors px-3 py-2"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-xs hover:shadow-md transition-all"
                  >
                    Registrarse
                  </Link>
                </div>
              )}

            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden gap-1">
              {!isAdminPage && (
                <>
                  <Link href="/favorites" className="relative p-2 text-slate-700" aria-label="Favoritos">
                    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.683a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {favoritesCount > 0 && (
                      <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={openCart}
                    className="relative p-2 text-slate-700"
                    aria-label="Abrir carrito"
                  >
                    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 000-4z" />
                    </svg>
                    {cartItemsCount > 0 && (
                      <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-700 hover:text-blue-600 transition-colors"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-4 space-y-3">
            {!isAdminPage && (
              <form onSubmit={handleSearchSubmit} className="relative sm:hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none"
                />
              </form>
            )}
            <Link href="/" onClick={() => setIsOpen(false)} className="block text-sm font-semibold text-slate-700 py-1.5">
              Inicio
            </Link>
            <Link href="/products" onClick={() => setIsOpen(false)} className="block text-sm font-semibold text-slate-700 py-1.5">
              Catálogo
            </Link>
            {!isAdminPage && (
              <Link href="/favorites" onClick={() => setIsOpen(false)} className="block text-sm font-semibold text-slate-700 py-1.5">
                Mis Favoritos ({favoritesCount})
              </Link>
            )}
            {isAuthenticated ? (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{user?.name}</span>
                  <button onClick={logout} className="text-xs text-rose-600 font-bold">Cerrar sesión</button>
                </div>
                <Link href="/profile" onClick={() => setIsOpen(false)} className="block text-xs font-semibold text-slate-600 py-1">
                  Mi Perfil
                </Link>
                <Link href="/profile?tab=orders" onClick={() => setIsOpen(false)} className="block text-xs font-semibold text-slate-600 py-1">
                  Mis Pedidos y Tracking
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="block text-xs font-bold text-blue-600 py-1">
                    Panel de Administración
                  </Link>
                )}
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-1/2 text-center text-xs font-bold py-2 border border-slate-200 rounded-full text-slate-700">
                  Iniciar sesión
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-1/2 text-center text-xs font-bold py-2 bg-blue-600 text-white rounded-full">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Cart Drawer Component */}
      {!isAdminPage && <CartDrawer />}
    </>
  );
};
