import type { Product } from '../../../types';
import ProductCard from '../ProductCard';

interface Props { products: Product[]; }

export default function ProductGrid({ products }: Props) {
  if (!products.length) {
    return <div className="flex flex-col items-center justify-center py-16 text-gray-500"><p className="text-lg">No se encontraron productos.</p></div>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
