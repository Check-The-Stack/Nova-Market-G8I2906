import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/40 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <span className="text-lg font-bold text-primary">NovaMarket</span>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              La plataforma de comercio electrónico de tecnología definitiva para la simulación laboral de diseño y programación.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Enlaces Útiles</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mi Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Equipo G8I2906</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Desarrollado en colaboración por especialistas de Frontend, Backend, UX/UI y QA.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NovaMarket. Todos los derechos reservados.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
              Práctica de Simulación
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
