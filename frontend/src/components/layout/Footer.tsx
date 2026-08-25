import React from "react";
import Link from "next/link";
import { Logo } from "../common/Logo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50/80 border-t border-slate-200 mt-auto text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info & Socials */}
          <div className="space-y-4">
            <Logo />
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Hardware de alta ingeniería y tecnología de vanguardia para potenciar tu vida digital.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <a href="#" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition-colors" title="Sitio Web">
                🌐
              </a>
              <a href="mailto:contacto@novamarket.com" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition-colors" title="Contacto">
                ✉️
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition-colors" title="Soporte">
                💬
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products?category=Electronics" className="hover:text-blue-600 transition-colors">Electronics</Link></li>
              <li><Link href="/products?category=Computación" className="hover:text-blue-600 transition-colors">Computación</Link></li>
              <li><Link href="/products?category=Home Hardware" className="hover:text-blue-600 transition-colors">Home Hardware</Link></li>
              <li><Link href="/products?category=Audio" className="hover:text-blue-600 transition-colors">Audio & Periféricos</Link></li>
              <li><Link href="/products?onSale=true" className="hover:text-rose-600 font-semibold transition-colors">Hot Deals (Ofertas)</Link></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/profile" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
              <li><a href="mailto:soporte@novamarket.com" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
              <li><Link href="/profile?tab=orders" className="hover:text-blue-600 transition-colors">Track Order</Link></li>
              <li><Link href="/legal?section=returns" className="hover:text-blue-600 transition-colors">Returns</Link></li>
              <li><Link href="/legal?section=warranty" className="hover:text-blue-600 transition-colors">Warranty</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/legal?section=privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal?section=terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal?section=cookies" className="hover:text-blue-600 transition-colors">Cookies</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom divider & copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>© 2026 NovaMarket. All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <span>Tecnología y Hardware de Vanguardia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
