import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItemComponent from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/ui/Button';

export default function Cart() {
  const { items, clear } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Carrito de compras</h1>
        {items.length > 0 && <Button variant="ghost" size="sm" onClick={clear}>Vaciar carrito</Button>}
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-gray-500">
          <p className="text-lg">Tu carrito está vacío.</p>
          <Link to="/catalog"><Button>Ver catálogo</Button></Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">{items.map(i => <CartItemComponent key={i.product.id} item={i} />)}</div>
          <CartSummary />
        </div>
      )}
    </div>
  );
}
