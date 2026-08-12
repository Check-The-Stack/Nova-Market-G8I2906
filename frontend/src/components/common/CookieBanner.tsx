"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("novamarket_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("novamarket_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("novamarket_cookie_consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white rounded-3xl p-6 shadow-2xl animate-in slide-in-from-left duration-500 space-y-4">
      
      <div className="flex items-start space-x-3 text-xs leading-relaxed">
        <span className="text-3xl shrink-0 mt-0.5">🍪</span>
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-white">Aviso sobre Cookies y Privacidad</h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación, personalizar contenido y analizar el tráfico. Puedes consultar nuestra{" "}
            <Link href="/legal?section=privacy" className="text-blue-400 font-bold hover:underline">
              Política de Privacidad
            </Link>{" "}
            y{" "}
            <Link href="/legal?section=terms" className="text-blue-400 font-bold hover:underline">
              Términos de Uso
            </Link>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleReject}
          className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors border border-slate-700 cursor-pointer text-center"
        >
          Solo necesarias
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-center"
        >
          Aceptar todas
        </button>
      </div>

    </div>
  );
};
