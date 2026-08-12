import React from "react";
import Link from "next/link";
import { Logo } from "../common/Logo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Columna 1: Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="brightness-150 contrast-125">
              <Logo />
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              NovaMarket es tu tienda e-commerce de confianza para tecnología de vanguardia, laptops, periféricos y accesorios con envío a todo el país.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-sm">
              <p className="text-xs font-bold text-slate-200 mb-2">Suscríbete a ofertas exclusivas</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Unirme
                </button>
              </form>
            </div>
          </div>

          {/* Columna 2: Shop */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wide uppercase">Categorías</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/products?category=Laptops" className="hover:text-blue-400 transition-colors">Laptops y Notebooks</Link></li>
              <li><Link href="/products?category=Celulares" className="hover:text-blue-400 transition-colors">Celulares y Smartphones</Link></li>
              <li><Link href="/products?category=Monitores" className="hover:text-blue-400 transition-colors">Monitores & Displays</Link></li>
              <li><Link href="/products?category=Audio" className="hover:text-blue-400 transition-colors">Auriculares y Audio</Link></li>
              <li><Link href="/products?category=Perifericos" className="hover:text-blue-400 transition-colors">Teclados y Mouses</Link></li>
            </ul>
          </div>

          {/* Columna 3: Información Legal y Ayuda */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wide uppercase">Atención y Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/legal?section=faq" className="hover:text-blue-400 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/legal?section=returns" className="hover:text-blue-400 transition-colors">Políticas de Devolución</Link></li>
              <li><Link href="/legal?section=warranty" className="hover:text-blue-400 transition-colors">Garantía Oficial</Link></li>
              <li><Link href="/legal?section=privacy" className="hover:text-blue-400 transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/legal?section=terms" className="hover:text-blue-400 transition-colors">Términos de Uso</Link></li>
            </ul>
          </div>

          {/* Columna 4: Seguridad & Confianza */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs tracking-wide uppercase">Seguridad</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center text-emerald-400 font-semibold">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Pagos SSL 256-bit Encriptados
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Aceptamos MercadoPago, Visa, Mastercard, AMEX y Transferencia Bancaria.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NovaMarket E-Commerce. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-4">
            <Link href="/legal?section=privacy" className="hover:text-slate-400 transition-colors">Política de Privacidad</Link>
            <Link href="/legal?section=terms" className="hover:text-slate-400 transition-colors">Términos de Uso</Link>
            <Link href="/legal?section=privacy" className="hover:text-slate-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
