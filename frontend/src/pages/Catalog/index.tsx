import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { CATEGORIES } from '../../constants';
import { productService } from '../../services/productService';
import ProductGrid from '../../components/product/ProductGrid';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = category ? { category } : {};
        const { data } = await productService.getAll(params);
        setProducts(data.data ?? []);
      } catch { setProducts([]); }
      finally { setLoading(false); }
    })();
  }, [category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Catálogo</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${category === '' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setCategory('')}
        >Todos</button>
        {CATEGORIES.map(c => (
          <button key={c.key}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${category === c.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setCategory(c.key)}
          >{c.label}</button>
        ))}
      </div>
      {loading ? <p className="py-12 text-center text-gray-500">Cargando productos...</p> : <ProductGrid products={products} />}
    </div>
  );
}
