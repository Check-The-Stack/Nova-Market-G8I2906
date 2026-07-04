import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import Button from '../../ui/Button';

export default function CartSummary() {
  const { total, totalItems } = useCart();

  return (
    <div className="rounded-lg border bg-gray-50 p-6">
      <h3 className="text-lg font-semibold text-gray-900">Resumen del pedido</h3>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600"><span>Productos ({totalItems})</span><span>${total.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm text-gray-600"><span>Envío</span><span>A calcular</span></div>
        <hr className="my-2" />
        <div className="flex justify-between text-lg font-bold text-gray-900"><span>Total</span><span>${total.toLocaleString()}</span></div>
      </div>
      <Link to="/checkout" className="mt-6 block"><Button className="w-full">Ir al checkout</Button></Link>
    </div>
  );
}
