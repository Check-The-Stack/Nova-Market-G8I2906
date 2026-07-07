import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '../components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'NovaMarket - Tu Tienda de Tecnología',
  description: 'NovaMarket — Plataforma e-commerce premium de productos tecnológicos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

