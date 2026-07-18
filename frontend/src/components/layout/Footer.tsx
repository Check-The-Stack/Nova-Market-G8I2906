import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-border mt-auto pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="bg-[#095ce8] text-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
              <span className="text-[#0e1e38] font-bold">Nova</span>
              <span className="text-[#095ce8] font-semibold">Market</span>
            </Link>
            <p className="text-sm text-[#505f79]">
              Texto descriptivo de hardware de ingeniería premium.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-[#505f79] hover:text-[#095ce8] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
              <a href="#" className="text-[#505f79] hover:text-[#095ce8] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="#" className="text-[#505f79] hover:text-[#095ce8] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold text-[#0e1e38] tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Electronics</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Fashion</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Home Hardware</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Beauty Tech</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Hot Deals</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-[#0e1e38] tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Track Order</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Returns</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Warranty</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-[#0e1e38] tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-[#505f79] hover:text-[#095ce8] transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#505f79]">
            &copy; 2024 NovaMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
