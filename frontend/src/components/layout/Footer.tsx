import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50/80 border-t border-slate-200 mt-auto text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: NovaMarket */}
          <div className="space-y-3">
            <img
              src="/images/novamarket-logo.png"
              alt="NovaMarket Logo"
              className="h-6 w-auto object-contain"
            />
            <p className="text-xs text-slate-500">Texto</p>
            <div className="flex items-center space-x-3 text-slate-500 pt-2">
              <span className="cursor-pointer hover:text-primary transition-colors">🌐</span>
              <span className="cursor-pointer hover:text-primary transition-colors">✉️</span>
              <span className="cursor-pointer hover:text-primary transition-colors">💬</span>
            </div>
          </div>

          {/* Columna 2: Shop */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Shop</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/products" className="hover:text-primary transition-colors">Electrónica</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Hardware</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Tech</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Ofertas destacadas</Link></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Soporte</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Centro de ayuda</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Seguir pedido</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Devoluciones</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Garantía</Link></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Legal</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Política de privacidad</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Términos del servicio</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookies</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};
