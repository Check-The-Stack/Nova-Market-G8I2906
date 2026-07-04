import { Link } from 'react-router-dom';
import type { Product } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useCart } from '../../../context/CartContext';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link to={`/products/${product.slug}`}>
        <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs uppercase tracking-wide text-gray-500">{product.category}</span>
        <Link to={`/products/${product.slug}`} className="font-medium text-gray-900 hover:text-primary-600">{product.name}</Link>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary-600">${product.price.toLocaleString()}</span>
          <Button size="sm" onClick={() => addItem(product)} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Sin stock' : 'Agregar'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
