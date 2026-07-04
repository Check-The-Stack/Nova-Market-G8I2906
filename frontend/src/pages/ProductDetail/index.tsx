import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../types';
import { productService } from '../../services/productService';
import Button from '../../components/ui/Button';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data } = await productService.getBySlug(slug);
        setProduct(data.data);
      } catch { setProduct(null); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <p className="py-16 text-center text-gray-500">Cargando...</p>;
  if (!product) return <p className="py-16 text-center text-gray-500">Producto no encontrado.</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg object-cover" />
        <div className="flex flex-col gap-4">
          <span className="text-sm uppercase tracking-wide text-gray-500">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-bold text-primary-600">${product.price.toLocaleString()}</p>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Stock: {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}</span>
          </div>
          <Button size="lg" onClick={() => addItem(product)} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </Button>
        </div>
      </div>
    </div>
  );
}
