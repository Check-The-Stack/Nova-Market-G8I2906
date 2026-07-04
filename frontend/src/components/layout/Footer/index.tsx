export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} NovaMarket. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-400">Venta de productos tecnológicos</p>
        </div>
      </div>
    </footer>
  );
}
